import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

export const colors = {
  bg: "#0B0B0F",
  card: "#151521",
  text: "#F5F5F7",
  muted: "#B8B8C2",
  primary: "#6D5EF3",
  danger: "#FF4D4D",
};

export function Screen({ children }: { children: React.ReactNode }) {
  return <View style={styles.screen}>{children}</View>;
}

export function Title({ children }: { children: React.ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function Subtitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.subtitle}>{children}</Text>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        (disabled || loading) && { opacity: 0.6 },
        pressed && { transform: [{ scale: 0.99 }] },
      ]}
    >
      {loading ? <ActivityIndicator color={colors.text} /> : <Text style={styles.btnText}>{title}</Text>}
    </Pressable>
  );
}

export function DangerText({ children }: { children: React.ReactNode }) {
  return <Text style={{ color: colors.danger, marginTop: 8 }}>{children}</Text>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 18, backgroundColor: colors.bg },
  title: { fontSize: 28, fontWeight: "700", color: colors.text, marginTop: 10 },
  subtitle: { fontSize: 14, color: colors.muted, marginTop: 8, lineHeight: 20 },
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 14, marginTop: 14 },
  btn: {
    marginTop: 14,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { color: colors.text, fontSize: 16, fontWeight: "600" },
});
