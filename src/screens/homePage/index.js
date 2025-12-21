// src/screens/homePage/index.js
import React, { useEffect, useCallback, useState, useMemo, useRef } from "react";
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Button,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Components
import MainLessonCard from "../../component/HomeDashboardScreen/MainLessonCard";
import ConnectorLine from "../../component/HomeDashboardScreen/ConnectorLine";
import PracticeMiniCardRight from "../../component/HomeDashboardScreen/PracticeMiniCardRight";
import PracticeMiniCardLeft from "../../component/HomeDashboardScreen/PracticeMiniCardLeft";
import GreetingHeader from "../../component/HomeDashboardScreen/GreetingHeader";

// Static Data (50 gün)
import { days } from "../../data/home";

// Context
import { useUser } from "../../contexts/UserContext";

// API
import { getProgress as getProgressApi } from "../../api/bac/statusservice";

// -------------------- Normalize --------------------
/**
 * Backend örneği:
 * {
 *   "current_day": 2,
 *   "current_step": "speaking",
 *   "days": {
 *     "2": { "status":"locked", "steps": { "feedback":"locked","grammar":"locked","speaking":"in_progress" } }
 *   }
 * }
 */
const normalizeProgress = (raw) => {
  if (!raw || typeof raw !== "object") {
    return { current_day: null, current_step: null, days: {} };
  }

  const current_day = Number.isFinite(raw?.current_day)
    ? Number(raw.current_day)
    : null;

  // step string: "speaking" | "grammar" | "feedback"
  const step = raw?.current_step;
  const current_step =
    step === "speaking" || step === "grammar" || step === "feedback"
      ? step
      : null;

  const dstDays = {};
  const srcDays = raw?.days ?? [];

  if (Array.isArray(srcDays)) {
    srcDays.forEach((item) => {
      const dayId = Number(item?.day_number);
      if (!Number.isFinite(dayId)) return;
      const d = item?.data || {};
      const steps = d?.steps || {};
      const speakingStatus =
        steps?.speaking?.status ?? steps?.speaking ?? "locked";
      const grammarStatus =
        steps?.grammar?.status ?? steps?.grammar ?? "locked";
      const feedbackStatus =
        steps?.feedback?.status ?? steps?.feedback ?? "locked";
      dstDays[dayId] = {
        status: d?.status ?? "locked",
        steps: {
          speaking: speakingStatus,
          grammar: grammarStatus,
          feedback: feedbackStatus,
        },
        speaking_started: !!steps?.speaking?.started,
      };
    });
  } else {
    Object.keys(srcDays).forEach((k) => {
      const dayId = Number(k);
      const d = srcDays[k] || {};
      dstDays[dayId] = {
        status: d?.status ?? "locked",
        steps: {
          speaking: d?.steps?.speaking ?? "locked",
          grammar: d?.steps?.grammar ?? "locked",
          feedback: d?.steps?.feedback ?? "locked",
        },
        speaking_started: !!d?.steps?.speaking?.started,
      };
    });
  }

  return { current_day, current_step, days: dstDays };
};

const CACHE_KEY = "progress_cache_v1";

// -------------------- Screen --------------------
const HomeDashboardScreen = ({ navigation }) => {
  const { user, accessToken } = useUser();

  // Yerel cache (ilk boyama için)
  const [cachedProgress, setCachedProgress] = useState(null);
  const listRef = useRef(null);

  // İlk açılışta cache’i oku
  useEffect(() => {
    (async () => {
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) setCachedProgress(JSON.parse(cached));
      } catch {
        // sessiz geç
      }
    })();
  }, []);

  // Network sorgusu
  const {
    data: progressData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["progress"],
    queryFn: async () => normalizeProgress(await getProgressApi()),
    enabled: !!accessToken, // auth yoksa sorgulama
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1,
  });

  // Odaklanınca refetch
  useFocusEffect(
    useCallback(() => {
      if (accessToken) refetch();
    }, [accessToken, refetch])
  );

  // Query başarılı olunca cache’e yaz
  useEffect(() => {
    if (progressData) {
      AsyncStorage.setItem(CACHE_KEY, JSON.stringify(progressData)).catch(() => {});
    }
  }, [progressData]);

  // Gösterilecek progress: network > cache > boş
  const progress =
    progressData || cachedProgress || { current_day: null, current_step: null, days: {} };

  // ---- Helpers (HOOKS ÜSTTE) ----
  const getDayStatus = useCallback(
    (dayId) => progress?.days?.[dayId]?.status ?? "locked",
    [progress]
  );

  const getStepStatus = useCallback(
    (dayId, step) => progress?.days?.[dayId]?.steps?.[step] ?? "locked",
    [progress]
  );

  const getSpeakingStarted = useCallback(
    (dayId) => !!progress?.days?.[dayId]?.speaking_started,
    [progress]
  );

  const buttonTextForDay = useCallback(
    (dayId, step = "speaking") => {
      const stepStatus = getStepStatus(dayId, step);
      if (stepStatus === "completed") return "Completed ✅";
      if (stepStatus === "locked") return "Locked 🔒";
      if (step === "speaking") {
        return getSpeakingStarted(dayId) ? "Continue" : "Start";
      }
      return "Continue Learning";
    },
    [getSpeakingStarted, getStepStatus]
  );

  const handlePress = useCallback(
    (dayId, step) => {
      const status = getStepStatus(dayId, step);
      const speakingStarted = getSpeakingStarted(dayId);
      
      // Allow navigation if:
      // 1. Step is in_progress, OR
      // 2. This is the current day and step (even if status is locked)
      const isCurrentDayAndStep = 
        progress?.current_day === dayId && 
        progress?.current_step === step;
      
      if (status !== 'in_progress' && !isCurrentDayAndStep) {
        return;
      }

      console.log('[Home] navigate to step', step, 'for day', dayId);

      // Route to appropriate screen based on step type
      let target;
      if (step === 'speaking') {
        target = 'SpeakingIntroScreen';
      } else if (step === 'grammar') {
        target = 'GrammarScreen';
      } else if (step === 'feedback') {
        target = 'SpeakingFeedback';
      } else {
        // Default fallback
        target = 'GrammarScreen';
      }

      if (target) {
        if (step === "speaking" && speakingStarted && status !== "completed") {
          Alert.alert(
            "You already started this speaking exam.",
            "",
            [
              {
                text: "Continue from where you left off",
                onPress: () =>
                  navigation.navigate(target, {
                    dayId,
                    dayNumber: dayId, // day_id için de kullanılacak
                    step,
                    resume: true,
                  }),
              },
              {
                text: "Start from the beginning",
                style: "destructive",
                onPress: () =>
                  navigation.navigate(target, {
                    dayId,
                    dayNumber: dayId, // day_id için de kullanılacak
                    step,
                    resume: false,
                  }),
              },
            ],
            { cancelable: true }
          );
          return;
        }

        navigation.navigate(target, {
          dayId,
          dayNumber: dayId, // day_id için de kullanılacak
          step,
        });
      }
    },
    [getSpeakingStarted, getStepStatus, navigation, progress]
  );

  // renderItem (hook: koşullu returnlardan ÖNCE tanımlı)
  const renderDay = useCallback(
    ({ item }) => {
      const step = "speaking";
      const stepStatus = getStepStatus(item.id, step);
      const isCurrentDayAndStep = 
        progress?.current_day === item.id && 
        progress?.current_step === step;
      
      // Enable button if step is in_progress OR if it's the current day/step
      const isDisabled = stepStatus !== "in_progress" && !isCurrentDayAndStep;
      
      return (
      <>
        <MainLessonCard
          image={item.image}
          title={item.title}
          description={item.description}
          unit={item.unit}
          buttonText={buttonTextForDay(item.id, step)}
          onPress={() => handlePress(item.id, step)}
          disabled={isDisabled}
        />
        <ConnectorLine height={36} />
        <PracticeMiniCardRight
          title="Grammar Practice"
          status={getStepStatus(item.id, "grammar")}
          icon={require("../../../assets/grammar.png")}
          onPress={() => handlePress(item.id, "grammar")}
        />
        <ConnectorLine height={32} />
        <PracticeMiniCardLeft
          title="Feedback Review"
          status={getStepStatus(item.id, "feedback")}
          icon={require("../../../assets/pronunciation.png")}
          onPress={() => handlePress(item.id, "feedback")}
        />
        <ConnectorLine height={36} />
      </>
      );
    },
    [buttonTextForDay, getStepStatus, handlePress, progress]
  );

  // ----- Normal render -----
  const stepPretty =
    progress.current_step === "speaking"
      ? "Speaking"
      : progress.current_step === "grammar"
      ? "Grammar"
      : progress.current_step === "feedback"
      ? "Feedback"
      : "-";

  // Current day'e otomatik kaydır
  useEffect(() => {
    const dayId = progress?.current_day;
    if (!dayId || !Array.isArray(days)) return;
    const index = days.findIndex((d) => d.id === dayId);
    if (index < 0) return;
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0 });
    });
  }, [progress?.current_day]);

  // ----- Loading/Error/Empty -----
  const hasDays = useMemo(() => Array.isArray(days) && days.length > 0, []);
  const showSpinner = (isLoading || isFetching) && !cachedProgress;

  if (showSpinner) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator />
        <Text style={styles.helperText}>Loading progress...</Text>
      </SafeAreaView>
    );
  }

  if (isError && !cachedProgress) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.helperText}>Failed to load progress.</Text>
        <Button title="Retry" onPress={() => refetch()} />
        {__DEV__ && (
          <Text style={styles.helperTextSmall}>{String(error?.message || "")}</Text>
        )}
      </SafeAreaView>
    );
  }

  if (!hasDays) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <Text style={styles.helperText}>No content defined.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={listRef}
        data={days}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderDay}
        contentContainerStyle={styles.scroll}
        onScrollToIndexFailed={({ index }) => {
          listRef.current?.scrollToIndex({ index, animated: true });
        }}
        ListHeaderComponent={
          <GreetingHeader userName={user?.name || "Student"} />
        }
      />
{/*       {progress?.current_day && progress?.current_step && (
        <View style={styles.pointerHint}>
          <Text style={styles.pointerText}>
            Current: Day {progress.current_day} • Step {stepPretty}
          </Text>
        </View>
      )} */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E1E2E" },
  scroll: { paddingBottom: 40 },
  center: { alignItems: "center", justifyContent: "center" },
  helperText: { marginTop: 12, color: "#FFFFFF" },
  helperTextSmall: {
    marginTop: 6,
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
  pointerHint: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pointerText: { color: "#FFFFFF" },
});

export default HomeDashboardScreen;
