import { StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { colors, spacing } from "@/constants/theme";

type Props = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function ErrorState({ message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? (
        <PrimaryButton label={actionLabel} onPress={onAction} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    borderRadius: 12,
    backgroundColor: "#fff3f2",
    borderWidth: 1,
    borderColor: "#f8d2cf",
    gap: spacing.sm,
  },
  title: {
    color: colors.error,
    fontWeight: "700",
    fontSize: 16,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
