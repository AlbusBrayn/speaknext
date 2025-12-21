import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Platform,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VideoView, useVideoPlayer } from 'expo-video';
import {
  useAudioRecorder,
  useAudioRecorderState,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
} from 'expo-audio';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../../utils/Theme';
import Service from '../../api/bac';
// Shared components
import SpeakingHeader from '../../component/speakingScreen/Header';
import SpeakingProgress from '../../component/speakingScreen/Progress';

const TOTAL_QUESTIONS = 3;

/**
 * Upload speaking answer audio file to the provided upload URL
 * Uses React Native compatible binary upload with base64 → Uint8Array conversion.
 *
 * NOTE: This helper is intentionally self-contained so it can be reused or
 * moved to a shared utility later without pulling extra dependencies.
 */
async function uploadSpeakingAnswer(uploadUrl, localFileUri) {
  try {
    console.log('[SpeakingStart] uploadSpeakingAnswer called', {
      hasUrl: !!uploadUrl,
      hasUri: !!localFileUri,
    });

    if (!uploadUrl || !localFileUri) {
      console.warn('[SpeakingStart] uploadSpeakingAnswer: missing uploadUrl or localFileUri');
      return false;
    }

    const fileInfo = await FileSystem.getInfoAsync(localFileUri);
    console.log('[SpeakingStart] uploadSpeakingAnswer fileInfo', fileInfo);

    if (!fileInfo.exists) {
      console.warn('[SpeakingStart] uploadSpeakingAnswer: file does not exist at', localFileUri);
      return false;
    }

    // Read file as base64 from local URI
    const base64 = await FileSystem.readAsStringAsync(localFileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log('[SpeakingStart] uploadSpeakingAnswer base64 length', base64?.length || 0);

    // Minimal manual base64 → Uint8Array decoder (React Native friendly)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    const lookup = new Uint8Array(256);
    for (let i = 0; i < chars.length; i += 1) {
      lookup[chars.charCodeAt(i)] = i;
    }

    let bufferLength = base64.length * 0.75;
    if (base64[base64.length - 1] === '=') {
      bufferLength -= 1;
      if (base64[base64.length - 2] === '=') {
        bufferLength -= 1;
      }
    }

    const bytes = new Uint8Array(bufferLength);
    let p = 0;

    for (let i = 0; i < base64.length; i += 4) {
      const encoded1 = lookup[base64.charCodeAt(i)];
      const encoded2 = lookup[base64.charCodeAt(i + 1)];
      const encoded3 = lookup[base64.charCodeAt(i + 2)];
      const encoded4 = lookup[base64.charCodeAt(i + 3)];

      bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
      bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }

    console.log('[SpeakingStart] uploadSpeakingAnswer binary length', bytes.length);

    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'audio/mpeg',
      },
      body: bytes,
    });

    console.log('[SpeakingStart] uploadSpeakingAnswer response', response.status);

    if (!response.ok) {
      console.error(
        '[SpeakingStart] uploadSpeakingAnswer failed',
        response.status,
        response.statusText
      );
      return false;
    }

    console.log('[SpeakingStart] uploadSpeakingAnswer success');
    return true;
  } catch (error) {
    console.error('[SpeakingStart] uploadSpeakingAnswer error', error);
    return false;
  }
}

const SpeakingStartScreen = ({ navigation, route }) => {
  // Params from SpeakingIntroScreen: navigation.navigate('SpeakingStartScreen', { sessionInit, dayNumber, resume })
  const { sessionInit, dayNumber, resume } = route?.params || {};

  const apiQuestions = sessionInit?.questions || [];
  const audioUrls = sessionInit?.audio_urls || [];
  const sessionId = sessionInit?.session_id;

  console.log('[SpeakingStart] route params', {
    hasSessionInit: !!sessionInit,
    dayNumber,
    questionsFromApi: apiQuestions.length,
    audioUrls: audioUrls.length,
    sessionId,
    resume,
  });

  // ---- NEW MERGE LOGIC (REAL BACKEND DATA) ----
  // Merge questions[] with audio_urls[] using question_order (single question per session)
  const questionsToUse = Array.from({ length: TOTAL_QUESTIONS }, () => null);
  apiQuestions.forEach((q) => {
    const questionOrder = Number(q?.question_order);
    const globalStep = Number(sessionInit?.current_step) || 1;
    const audio =
      audioUrls.find((a) => Number(a.question_order) === questionOrder) ||
      audioUrls.find((a) => Number(a.question_order) === globalStep);
    const effectiveOrder =
      Number(audio?.question_order) ||
      questionOrder ||
      globalStep ||
      1;
    const orderIndex = Math.max(0, effectiveOrder - 1);

    const merged = {
      question_id: q.question_id,
      title: q.question_text,
      instruction: q.instruction || "",
      video_url: q.video_url,
      part: q.part,
      question_order: q.question_order,
      upload_url: audio?.upload_url || null,
      file_path: audio?.file_path || null,
    };

    questionsToUse[orderIndex] = merged;
    console.log("[SpeakingStart] merged question", { index: orderIndex, ...merged });
  });

  // ---- STATES ----
  const initialQuestionIndex =
    Math.max(0, (sessionInit?.current_step || 1) - 1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialQuestionIndex);
  const [phase, setPhase] = useState('video'); // video | recording | completed
  const [isRecording, setIsRecording] = useState(false);
  const [hasAudioPermission, setHasAudioPermission] = useState(false);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(false);
  const [allRecordings, setAllRecordings] = useState([]);
  const [videoThumbnail, setVideoThumbnail] = useState(null);

  const videoRef = useRef(null);

  // Initialize audio recorder with expo-audio
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  // Get current merged question
  const totalQuestions = TOTAL_QUESTIONS;
  const currentQuestion = questionsToUse[currentQuestionIndex] || {};
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  // ---- CREATE VIDEO PLAYERS ----
  // Each question will load its own video_url
  const player1 = questionsToUse[0]?.video_url
    ? useVideoPlayer(questionsToUse[0].video_url, (player) => (player.loop = false))
    : null;

  const player2 = questionsToUse[1]?.video_url
    ? useVideoPlayer(questionsToUse[1].video_url, (player) => (player.loop = false))
    : null;

  const player3 = questionsToUse[2]?.video_url
    ? useVideoPlayer(questionsToUse[2].video_url, (player) => (player.loop = false))
    : null;

  // Map correct player to current question
  const player =
    currentQuestionIndex === 0
      ? player1
      : currentQuestionIndex === 1
      ? player2
      : player3 || null;

  const thumbnailPlayer = player; // For circular preview video

  useEffect(() => {
    [player1, player2, player3].forEach((p, index) => {
      if (!p || index === currentQuestionIndex) {
        return;
      }
      try {
        p.pause();
      } catch (error) {
        // Ignore pause errors for inactive players
      }
    });
  }, [currentQuestionIndex, player1, player2, player3]);


  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // Request audio recording permission
        const audioStatus = await AudioModule.requestRecordingPermissionsAsync();
        if (audioStatus.granted) {
          setHasAudioPermission(true);
        } else {
          Alert.alert('Permission Required', 'This app needs microphone access to record your speech.');
        }
        
        // Request media library permission for saving recordings
        const mediaStatus = await MediaLibrary.requestPermissionsAsync();
        if (mediaStatus.granted) {
          setHasMediaLibraryPermission(true);
        }
        
        // Set audio mode for recording
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: true,
        });
      } catch (error) {
        // Silently handle permission errors
      }
    };
    
    checkPermissions();
  }, []);

  // Handle video playback events
  useEffect(() => {
    if (player && phase === 'video') {
      let hasEnded = false; // Prevent multiple calls
      
      // Set up video completion detection
      const statusSubscription = player.addListener('playbackStatusUpdate', (status) => {
        if (hasEnded) return; // Prevent multiple triggers
        
        // Check for completion in multiple ways
        if (status.isLoaded && status.durationMillis && status.positionMillis) {
          const progress = status.positionMillis / status.durationMillis;
          const videoDurationSeconds = status.durationMillis / 1000;
          
          // Auto-advance when video is 98% complete or finished
          if (progress >= 1 || status.didJustFinish || status.hasJustFinished) {
            hasEnded = true;
            handleVideoEnd();
          }
        }
        
        // Also check for explicit finish events
        if (status.didJustFinish || status.hasJustFinished) {
          if (!hasEnded) {
            hasEnded = true;
            handleVideoEnd();
          }
        }
      });

      // Dynamic fallback timer based on video duration
      let fallbackTimer;
      let durationCheckInterval;
      
      const setupFallbackTimer = (durationMs) => {
        if (durationMs && durationMs > 0) {
          // Set fallback timer to 110% of video duration + 2 seconds
          const fallbackTime = (durationMs * 1.1) + 2000;
          console.log(`🎬 Video duration: ${durationMs/1000}s, fallback set for: ${fallbackTime/1000}s`);
          
          fallbackTimer = setTimeout(() => {
            if (phase === 'video' && !hasEnded) {
              console.log('⏰ Fallback timer triggered for video completion');
              hasEnded = true;
              handleVideoEnd();
            }
          }, fallbackTime);
        }
      };

      // Check for video duration periodically until we get it
      const checkDuration = () => {
        const statusSubscriptionForDuration = player.addListener('playbackStatusUpdate', (status) => {
          if (status.isLoaded && status.durationMillis && !fallbackTimer) {
            setupFallbackTimer(status.durationMillis);
            statusSubscriptionForDuration?.remove();
          }
        });
        
        // Also try to get duration directly
        setTimeout(() => {
          if (player && player.duration && !fallbackTimer) {
            setupFallbackTimer(player.duration * 1000);
          }
        }, 2000);
      };

      // Auto-play the video and start duration checking
      setTimeout(() => {
        player.play();
        checkDuration();
      }, 500);

      return () => {
        statusSubscription?.remove();
        if (fallbackTimer) {
          clearTimeout(fallbackTimer);
        }
      };
    }
  }, [player, phase, currentQuestionIndex]);

  // Cleanup
  useEffect(() => {
    return () => {
      // audioRecorder cleanup is handled automatically by the hook
      [player1, player2, player3].forEach(p => {
        if (p) {
          try {
            p.pause();
          } catch (error) {
            // Ignore pause errors
          }
        }
      });
    };
  }, []);


  // Video event handlers
  const handleVideoEnd = () => {
    // Prevent multiple calls
    if (phase !== 'video') {
      return;
    }
    
    // Video finished, switch directly to recording phase
    setPhase('recording');
    // Pause the main player to save resources
    if (player) {
      try {
        player.pause();
      } catch (error) {
        // Ignore pause errors
      }
    }
  };

  // Audio recording with expo-audio
  const startAudioRecording = async () => {
    try {
      if (!hasAudioPermission) {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (!status.granted) {
          Alert.alert('Permission Required', 'This app needs microphone access to record your speech.');
          return false;
        }
        setHasAudioPermission(true);
      }

      // Start recording using expo-audio
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      
      setIsRecording(true);
      return true;
    } catch (err) {
      
      // Check if it's a permission error
      if (err.message && err.message.includes('permission')) {
        Alert.alert(
          'Microphone Permission Required',
          'Please allow microphone access to record your voice. You can enable this in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {
              // On iOS/Android, user needs to manually go to settings
              Alert.alert('Please enable microphone permission in your device settings and try again.');
            }}
          ]
        );
      } else {
        Alert.alert(
          'Recording Error',
          'Failed to start recording. Please try again.',
          [{ text: 'OK' }]
        );
      }
      return false;
    }
  };

  const stopAudioRecording = async () => {
    try {
      if (recorderState.isRecording) {
        // Stop recording using expo-audio
        await audioRecorder.stop();
        
        // Get the recording URI from the audioRecorder
        const recordingUri = audioRecorder.uri;
        
        setIsRecording(false);
        return recordingUri;
      }
    } catch (error) {
      // Silently handle recording stop errors
    }
    return null;
  };

  // Save recording to device storage
  const saveRecordingToDevice = async (recordingUri) => {
    try {
      if (!recordingUri) {
        return null;
      }

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `speakify_recording_${timestamp}.m4a`;

      // Save to app's document directory (more accessible)
      const documentsDir = FileSystem.documentDirectory;
      const speakifyDir = `${documentsDir}Speakify_Recordings/`;
      
      // Create directory if it doesn't exist
      const dirInfo = await FileSystem.getInfoAsync(speakifyDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(speakifyDir, { intermediates: true });
      }

      // Copy file to our app directory
      const finalPath = `${speakifyDir}${filename}`;
      await FileSystem.copyAsync({
        from: recordingUri,
        to: finalPath
      });

      console.log('📁 Recording saved to:', finalPath);

      // Also try to save to media library for backup (if permission granted)
      let mediaAsset = null;
      if (hasMediaLibraryPermission) {
        try {
          mediaAsset = await MediaLibrary.createAssetAsync(recordingUri);
        } catch (error) {
          // Silently handle gallery save errors
        }
      }
      
      return {
        localPath: finalPath,
        filename: filename,
        directory: speakifyDir,
        mediaAsset: mediaAsset
      };
    } catch (error) {
      return null;
    }
  };


  // Microphone button handler
  const handleMicrophonePress = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  const startRecording = async () => {
    if (isRecording) return;
    
    const recordingStarted = await startAudioRecording();
    
    if (!recordingStarted) {
      return;
    }

    setIsRecording(true);
  };

  const stopRecording = async () => {
  if (!isRecording) return;
  
  setIsRecording(false);
  const uri = await stopAudioRecording();
  
  // Save recording to device
  let saveResult = null;
  if (uri) {
    saveResult = await saveRecordingToDevice(uri);
  }

  // Upload to presigned URL for this question (if available)
  const audioMeta = questionsToUse[currentQuestionIndex]; // UPDATED → backend merged data
  if (audioMeta && audioMeta.upload_url && uri) {
    console.log('[SpeakingStart] starting upload for question', {
      index: currentQuestionIndex,
      uploadUrl: audioMeta.upload_url,
      uri,
    });

    let success = false;

    try {
      success = await uploadSpeakingAnswer(audioMeta.upload_url, uri);
      console.log('[SpeakingStart] upload result', {
        index: currentQuestionIndex,
        success,
      });
    } catch (error) {
      console.error('[SpeakingStart] upload error', error);
    }

    // ---- NEW: BACKEND CONFIRM CALL ----
    if (success) {
      try {
        console.log("[SpeakingStart] confirming upload to backend");

        const confirmRes = await fetch(
          "https://www.campusnext.app/speaking/confirm/upload",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              exam_session_id: sessionInit.session_id,
              question_id: audioMeta.question_id,
              file_path: audioMeta.file_path,
            }),
          }
        );

        const confirmJson = await confirmRes.json();
        console.log("[SpeakingStart] confirm response", confirmJson);

      } catch (err) {
        console.error("[SpeakingStart] confirm upload failed", err);
      }
    }

  } else {
    console.log('[SpeakingStart] no upload URL for question', {
      index: currentQuestionIndex,
      hasAudioMeta: !!audioMeta,
      hasUploadUrl: !!audioMeta?.upload_url,
      hasUri: !!uri,
    });
  }
  
  // Store recording info
  const recordingInfo = {
    questionId: audioMeta?.question_id,
    questionTitle: audioMeta?.title,
    uri: uri,
    saveResult: saveResult,
    timestamp: new Date().toISOString()
  };
  setAllRecordings(prev => [...prev, recordingInfo]);
  
  setPhase('completed');

  // Auto-advance to next question after a brief delay
  setTimeout(() => {
    handleQuestionComplete();
  }, 1500);
};

const handleQuestionComplete = async () => {
  if (sessionInit?.status !== 'in_progress') {
    console.warn(
      '[SpeakingStart] session not in progress, skipping completed call',
      { sessionId: sessionInit?.session_id, status: sessionInit?.status }
    );
    return;
  }

  console.log('[SpeakingStart] question completed, finishing session...', {
    session_id: sessionInit?.session_id,
    part: sessionInit?.part,
  });

  try {
    // 1) Bu part / session için "completed" çağrısı
    const completedRes = await Service.post('/speaking/completed', {
      session_id: sessionInit.session_id,
    });

    const completedData = completedRes?.data;
    console.log('[SpeakingStart] /speaking/completed response', completedData);

    const nextPart = completedData?.next_part;

    if (nextPart === 'exam_finished') {
      console.log('[SpeakingStart] exam finished, navigating to result');
      navigation.navigate('SpeakingResult', { dayNumber });
      return;
    }

    console.log('[SpeakingStart] next_part detected, starting new session for same day', {
      dayNumber,
      nextPart,
    });

    const nextSessionRes = await Service.post('/speaking/session/init', {
      day_number: dayNumber,
    });

    const nextSession = nextSessionRes?.data;
    console.log('[SpeakingStart] new /speaking/session/init response', nextSession);

    if (nextSession) {
      // 3) Aynı ekranda yeni session ile devam et
      navigation.replace('SpeakingStartScreen', {
        sessionInit: nextSession,
        dayNumber,
      });
    } else {
      console.warn('[SpeakingStart] next session init response empty, falling back to result');
      navigation.navigate('SpeakingResult', { dayNumber });
    }
  } catch (err) {
    console.error('[SpeakingStart] error in handleQuestionComplete', err);
    // Hata olsa bile kullanıcı takılmasın
    navigation.navigate('SpeakingResult', { dayNumber });
  }
};
  // Effect to reset video player when question changes
  useEffect(() => {
    if (phase === 'video' && player) {
      // Reset player to beginning when starting a new question
      try {
        player.currentTime = 0;
      } catch (error) {
        // Ignore timing errors
      }
    }
  }, [currentQuestionIndex, phase, player]);

  // Calculate overall progress across all questions
  const totalSteps = totalQuestions * 2; // 2 phases per question (video, record)
  const currentStep = (currentQuestionIndex * 2) + (
    phase === 'video' ? 1 : 
    phase === 'recording' ? 2 : 
    phase === 'completed' ? 2 : 1
  );
  const overallProgress = Math.round((currentStep / totalSteps) * 100);
  
  const stepNumber = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
  const phaseLabel = 
    phase === 'video' ? 'Watch Question' :
    phase === 'recording' ? 'Record Your Answer' :
    'Question Complete';

  return (
    <SafeAreaView style={styles.container}>
      {/* Full Screen Video Phase */}
      {phase === 'video' && (
        <View style={styles.fullScreenVideoContainer}>
          <VideoView
            key={`video-${currentQuestionIndex}`}
            style={styles.fullScreenVideo}
            player={player}
            contentFit="cover"
            showsTimecodes={false}
          />
          
          {/* Optional overlay with question info */}
          <View style={styles.videoOverlay}>
            <View style={styles.videoHeader}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.videoHeaderText}>Question {currentQuestionIndex + 1} of {totalQuestions}</Text>
            </View>
            
            {/* Skip button for testing/fallback */}
            <View style={styles.videoFooter}>
              <TouchableOpacity 
                style={styles.skipButton}
                onPress={handleVideoEnd}
              >
                <Text style={styles.skipButtonText}>Skip to Recording</Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Recording Phase - Circular Thumbnail + Microphone */}
      {phase === 'recording' && (
        <View style={styles.recordingContainer}>
          {/* Header */}
          <SpeakingHeader 
            title={`Speaking Day ${dayNumber || 1}`} 
            subtitle={phaseLabel}
            onBack={() => navigation.goBack()}
          />

          {/* Progress */}
          <SpeakingProgress 
            progress={overallProgress} 
            step={stepNumber} 
          />

          {/* Circular Video Thumbnail */}
          <View style={styles.thumbnailContainer}>
            <View style={styles.circularThumbnail}>
              <VideoView
                key={`thumbnail-${currentQuestionIndex}`}
                style={styles.thumbnailVideo}
                player={thumbnailPlayer}
                contentFit="cover"
                showsTimecodes={false}
              />
            </View>
          </View>

          {/* Question Text */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionTitle}>{currentQuestion.title}</Text>
            <Text style={styles.questionInstruction}>{currentQuestion.instruction}</Text>
          </View>

          {/* Large Microphone Button */}
          <View style={styles.microphoneContainer}>
            <TouchableOpacity 
              style={[
                styles.microphoneButton,
                isRecording && styles.microphoneButtonRecording
              ]}
              onPress={handleMicrophonePress}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={isRecording ? "stop" : "mic"} 
                size={48} 
                color="white" 
              />
            </TouchableOpacity>
            <Text style={styles.microphoneButtonText}>
              {isRecording ? "Tap to Stop Recording" : "Tap to Start Recording"}
            </Text>
          </View>
        </View>
      )}

      {/* Completed Phase - Brief transition screen */}
      {phase === 'completed' && (
        <View style={styles.completedContainer}>
          <View style={styles.completedContent}>
            <Ionicons name="checkmark-circle" size={60} color={colors.success} />
            <Text style={styles.completedTitle}>
              {isLastQuestion ? "All Complete!" : "Moving to Next Question..."}
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  
  // Full Screen Video Styles
  fullScreenVideoContainer: {
    flex: 1,
    position: 'relative',
  },
  fullScreenVideo: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  videoHeaderText: {
    ...typography.headline,
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  videoFooter: {
    position: 'absolute',
    bottom: 40,
    right: spacing.xl,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  skipButtonText: {
    ...typography.body,
    color: 'white',
    fontWeight: '600',
  },
  
  // Recording Phase Styles
  recordingContainer: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  thumbnailContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  circularThumbnail: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: colors.primary,
    backgroundColor: colors.cardBackground,
  },
  thumbnailVideo: {
    width: '100%',
    height: '100%',
  },
  questionContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  questionTitle: {
    ...typography.headline,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  questionInstruction: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  microphoneContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacing.xxxl,
  },
  microphoneButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  microphoneButtonRecording: {
    backgroundColor: colors.error,
    shadowColor: colors.error,
  },
  microphoneButtonText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  
  // Completed Phase Styles
  completedContainer: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  completedContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: spacing.xxxl,
  },
  completedTitle: {
    ...typography.largeTitle,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  completedText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xxxl,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  continueButtonText: {
    ...typography.headline,
    color: 'white',
  },
});

export default SpeakingStartScreen;
