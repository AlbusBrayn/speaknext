// src/screens/GrammarScreen/index.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  View,
  Text,
} from "react-native";

import Header from "../../component/GrammarScreen/Header";
import ProgressBar from "../../component/GrammarScreen/ProgressBar";
import QuestionCard from "../../component/GrammarScreen/QuestionCard";
import OptionButton from "../../component/GrammarScreen/OptionButton";
import CheckAnswerButton from "../../component/GrammarScreen/CheckAnswerButton";

import { grammarQuestions } from "../../data/grammarQuestions";
import { useCompleteStep } from "../../hooks/updateStep";

export default function GrammarScreen({ navigation, route }) {
  // Home'dan: navigation.navigate("GrammarScreen", { dayId, dayNumber, step: "grammar" | "speaking" | "feedback" })
  const { dayId, dayNumber, day: dayFromAltParam, step } = route?.params || {};
  const activeDay = dayId ?? dayNumber ?? dayFromAltParam ?? 1;
  const currentStep = step || "grammar"; // default: grammar
  const total = 5;

  // ---- React Query Mutation ----
  const completeStepMutation = useCompleteStep();

  // ---- Quiz state (sadece grammar için) ----
  const [current, setCurrent] = useState(0);        // 0..4
  const [selected, setSelected] = useState(null);   // string | null
  const [mode, setMode] = useState("idle");         // 'idle' | 'feedback' | 'completed'
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Günün 5 sorusu (lokal statik) - sadece grammar için
  const questions = useMemo(() => {
    if (currentStep !== "grammar") return [];
    const list = grammarQuestions[activeDay] || [];
    return Array.isArray(list) ? list.slice(0, total) : [];
  }, [activeDay, currentStep]);

  // Yardımcılar
  const progressIndex = Math.min(current + 1, total); // 1..5
  const progressPct = (progressIndex / total) * 100;

  const getCorrectOption = (q) => q?.answer ?? null;
  const isAnswerCorrect = () => {
    const q = questions[current];
    return selected != null && getCorrectOption(q) === selected;
  };

  // ---- Backend: /progress/update için mutation handler ----
  const completionSentRef = useRef(false);

  const handleCompleteStep = (stepName) => {
    if (completionSentRef.current) return;
    completionSentRef.current = true;

    console.log('[GrammarScreen] Completing step', stepName, 'for day', activeDay);

    completeStepMutation.mutate(
      {
        day_number: activeDay,
        step: stepName,
      },
      {
        onSuccess: (data) => {
          console.log('[GrammarScreen] Step completed successfully', data);
          navigation.goBack(); // Home'a geri dön
        },
        onError: (error) => {
          console.log('[GrammarScreen] Step completion error', error);
          completionSentRef.current = false; // Retry için
          Alert.alert("Error", "Failed to complete step. Please try again.");
        },
      }
    );
  };

  // ---- Speaking Step: Geçici Complete Speaking UI ----
  if (currentStep === "speaking") {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Header 
            title={`Speaking Day ${activeDay}`} 
            onBack={() => navigation.goBack()} 
          />
          
          <View style={{ marginTop: 48, alignItems: "center", paddingHorizontal: 24 }}>
            <Text style={styles.tempTitle}>🎤 Speaking Practice</Text>
            <Text style={styles.tempDescription}>
              This screen will be implemented soon. For now, you can complete the speaking step.
            </Text>
          </View>

          <View style={{ marginTop: 48, paddingHorizontal: 24 }}>
            <CheckAnswerButton
              title="✅ Complete Speaking"
              intent="primary"
              onPress={() => handleCompleteStep("speaking")}
              disabled={completeStepMutation.isPending}
            />
            {completeStepMutation.isPending && (
              <ActivityIndicator style={{ marginTop: 12 }} />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ---- Feedback Step: Placeholder UI ----
  if (currentStep === "feedback") {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Header 
            title={`Feedback Day ${activeDay}`} 
            onBack={() => navigation.goBack()} 
          />
          
          <View style={{ marginTop: 48, alignItems: "center", paddingHorizontal: 24 }}>
            <Text style={styles.tempTitle}>📝 Feedback Review</Text>
            <Text style={styles.tempDescription}>
              Feedback screen coming soon
            </Text>
          </View>

          <View style={{ marginTop: 48, paddingHorizontal: 24 }}>
            <CheckAnswerButton
              title="✅ Finish Day"
              intent="primary"
              onPress={() => {
                console.log('[Feedback] Completing feedback step for day', activeDay);
                
                completeStepMutation.mutate(
                  {
                    day_number: activeDay,
                    step: "feedback",
                  },
                  {
                    onSuccess: (data) => {
                      console.log('[Feedback] day completed', data);
                      // Navigation will happen after query invalidation completes
                      navigation.navigate('MainTabs', { screen: 'Home' });
                    },
                    onError: (error) => {
                      console.log('[Feedback] completion error', error);
                      Alert.alert("Error", "Failed to complete feedback. Please try again.");
                    },
                  }
                );
              }}
              disabled={completeStepMutation.isPending}
            />
            {completeStepMutation.isPending && (
              <ActivityIndicator style={{ marginTop: 12 }} />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ---- Leave (geri) uyarısı: kısmi ilerleme kaydedilmez (sadece grammar için) ----
  useEffect(() => {
    if (currentStep !== "grammar") return;
    
    const unsub = navigation.addListener("beforeRemove", (e) => {
      // Quiz bitti & API atılıyorsa engelleme
      if (mode === "completed" || completionSentRef.current) return;

      const hasProgress = current > 0 || !!selected;
      if (!hasProgress) return; // hiç ilerleme yoksa sorma

      e.preventDefault();
      Alert.alert(
        "Leave?",
        `Your progress (${progressIndex}/${total}) will be lost.`,
        [
          { text: "Continue", style: "cancel" },
          { text: "Leave", style: "destructive", onPress: () => navigation.dispatch(e.data.action) },
        ]
      );
    });
    return unsub;
  }, [navigation, mode, current, selected, progressIndex, currentStep]);

  // ---- Buton aksiyonları ----
  const onCheckAnswer = () => {
    const correct = isAnswerCorrect();
    if (correct) setCorrectCount((c) => c + 1);
    else setWrongCount((w) => w + 1);
    setMode("feedback");
  };

  const onNext = () => {
    const last = current === total - 1;
    if (last) {
      setMode("completed");
    } else {
      setCurrent((i) => i + 1);
      setSelected(null);
      setMode("idle");
    }
  };

  // ---- Guard: data yoksa (sadece grammar için) ----
  if (currentStep === "grammar" && !questions.length) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title={`Grammar Day ${activeDay}`} onBack={() => navigation.navigate("MainTabs", { screen: "Profile" })} />
        <ScrollView contentContainerStyle={styles.scroll}>
          <QuestionCard question="No questions found for this day." />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ---- Summary (completed) ----
  if (mode === "completed") {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Header title={`Grammar Day ${activeDay}`} onBack={() => navigation.navigate("MainTabs", { screen: "Profile" })} />

          <View style={{ marginTop: 24, alignItems: "center" }}>
            <Text style={styles.summaryTitle}>🎯 Grammar Day {activeDay} Completed</Text>
            <Text style={styles.summaryLine}>✅ Correct: {correctCount}</Text>
            <Text style={styles.summaryLine}>❌ Wrong: {wrongCount}</Text>
          </View>

          <View style={{ marginTop: 24 }}>
            <CheckAnswerButton
              title="✔️ Back to Home"
              intent="primary"
              onPress={() => handleCompleteStep("grammar")}
              disabled={completeStepMutation.isPending}
            />
            {completeStepMutation.isPending && (
              <ActivityIndicator style={{ marginTop: 12 }} />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ---- Aktif soru & feedback ----
  const q = questions[current];
  const correctOpt = getCorrectOption(q);
  const inFeedback = mode === "feedback";
  const isCorrectSel = inFeedback && selected === correctOpt;


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header (goBack => beforeRemove tetiklenir) */}
        <Header title={`Grammar Day ${activeDay}`} onBack={() => navigation.goBack()} />

        {/* Progress (1/5 + bar) */}
        <Text style={styles.progressText}>{progressIndex}/{total}</Text>
        <ProgressBar progress={progressPct} />

        {/* Soru */}
        <QuestionCard question={q.question} />

        {/* Options */}
        {q.options.map((opt, idx) => {
          let intent = "neutral";
          if (inFeedback) {
            if (opt === correctOpt) intent = "correct";
            else if (opt === selected) intent = "wrong";
          } else if (selected === opt) {
            intent = "selected";
          }
          return (
            <OptionButton
              key={`${current}-${idx}`}
              text={opt}
              selected={selected === opt}
              intent={intent}
              onPress={() => !inFeedback && setSelected(opt)}
              disabled={completeStepMutation.isPending || inFeedback} // feedback sırasında kilit
            />
          );
        })}

        {/* Alt buton */}
        {!inFeedback ? (
          <CheckAnswerButton
            title={selected ? "Check Answer" : "Select an Answer"}
            intent={selected ? "primary" : "neutral"}
            onPress={onCheckAnswer}
            disabled={!selected || completeStepMutation.isPending}
          />
        ) : (
          <CheckAnswerButton
            title="Next"
            intent={isCorrectSel ? "success" : "danger"}
            onPress={onNext}
            disabled={completeStepMutation.isPending}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E1E2E" },
  scroll: { paddingVertical: 20, paddingHorizontal: 0 },
  progressText: { color: "#C7C9D1", marginTop: 4, marginLeft: 16, marginBottom: 6, fontSize: 13 },
  summaryTitle: { color: "white", fontSize: 20, fontWeight: "700" },
  summaryLine: { color: "white", fontSize: 16, marginTop: 8 },
  tempTitle: { color: "white", fontSize: 24, fontWeight: "700", marginBottom: 12, textAlign: "center" },
  tempDescription: { color: "#C7C9D1", fontSize: 16, textAlign: "center", lineHeight: 24 },
});
