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
import { useMutation } from "@tanstack/react-query";

import Header from "../../component/GrammarScreen/Header";
import ProgressBar from "../../component/GrammarScreen/ProgressBar";
import QuestionCard from "../../component/GrammarScreen/QuestionCard";
import OptionButton from "../../component/GrammarScreen/OptionButton";
import CheckAnswerButton from "../../component/GrammarScreen/CheckAnswerButton";

import { grammarQuestions } from "../../data/grammarQuestions";
import { useUser } from "../../contexts/UserContext";

export default function GrammarScreen({ navigation, route }) {
  // Home’dan: navigation.navigate("GrammarScreen", { dayId, step: "grammar" })
  const { dayId, day: dayFromAltParam } = route?.params || {};
  const activeDay = dayId ?? dayFromAltParam ?? 1;
  const total = 5;

  const { authToken } = useUser();

  // ---- Quiz state ----
  const [current, setCurrent] = useState(0);        // 0..4
  const [selected, setSelected] = useState(null);   // string | null
  const [mode, setMode] = useState("idle");         // 'idle' | 'feedback' | 'completed'
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Günün 5 sorusu (lokal statik)
  const questions = useMemo(() => {
    const list = grammarQuestions[activeDay] || [];
    return Array.isArray(list) ? list.slice(0, total) : [];
  }, [activeDay]);

  // Yardımcılar
  const progressIndex = Math.min(current + 1, total); // 1..5
  const progressPct = (progressIndex / total) * 100;

  const getCorrectOption = (q) => q?.answer ?? null;
  const isAnswerCorrect = () => {
    const q = questions[current];
    return selected != null && getCorrectOption(q) === selected;
  };

  // ---- Backend: /progress/update (sadece completed’ta) ----
  const completionSentRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);

  const completeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("https://www.campusnext.app/progress/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          day_number: Number(activeDay),
          step: "grammar",
          outcome: "completed",
        }),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(`progress/update failed ${res.status} ${t}`);
      }
      return res.json().catch(() => ({}));
    },
    onSettled: () => {
      completionSentRef.current = true;
      navigation.navigate("ProfileScreen"); // Home’a dön
    },
  });

  const sendCompleteOnce = () => {
    if (completionSentRef.current) return;
    completionSentRef.current = true;
    setSubmitting(true);
    completeMutation.mutate();
  };

  // ---- Leave (geri) uyarısı: kısmi ilerleme kaydedilmez ----
  useEffect(() => {
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
  }, [navigation, mode, current, selected, progressIndex]);

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

  // ---- Guard: data yoksa ----
  if (!questions.length) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title={`Grammar Day ${activeDay}`} onBack={() => navigation.navigate("ProfileScreen")} />
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
          <Header title={`Grammar Day ${activeDay}`} onBack={() => navigation.navigate("ProfileScreen")} />

          <View style={{ marginTop: 24, alignItems: "center" }}>
            <Text style={styles.summaryTitle}>🎯 Grammar Day {activeDay} Completed</Text>
            <Text style={styles.summaryLine}>✅ Correct: {correctCount}</Text>
            <Text style={styles.summaryLine}>❌ Wrong: {wrongCount}</Text>
          </View>

          <View style={{ marginTop: 24 }}>
            <CheckAnswerButton
              title="✔️ Back to Home"
              intent="primary"
              onPress={sendCompleteOnce}
              disabled={submitting}
            />
            {submitting && <ActivityIndicator style={{ marginTop: 12 }} />}
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
        <Header title={`Grammar Day ${activeDay}`} onBack={() => navigation.navigate("ProfileScreen")} />

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
              disabled={submitting || inFeedback} // feedback sırasında kilit
            />
          );
        })}

        {/* Alt buton */}
        {!inFeedback ? (
          <CheckAnswerButton
            title={selected ? "Check Answer" : "Select an Answer"}
            intent={selected ? "primary" : "neutral"}
            onPress={onCheckAnswer}
            disabled={!selected || submitting}
          />
        ) : (
          <CheckAnswerButton
            title="Next"
            intent={isCorrectSel ? "success" : "danger"}
            onPress={onNext}
            disabled={submitting}
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
});
