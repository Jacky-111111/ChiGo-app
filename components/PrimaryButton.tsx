import { Pressable, StyleSheet, Text } from "react-native";
import { colors, spacing } from "@/constants/theme";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  variant = "primary",
}: Props) {
  const secondary = variant === "secondary";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        secondary ? styles.secondary : styles.primary,
        disabled && styles.disabled,
        pressed && !disabled && (secondary ? styles.secondaryPressed : styles.pressed),
      ]}
    >
      <Text style={[styles.label, secondary && styles.secondaryLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    width: "100%",
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryLabel: {
    color: colors.textPrimary,
  },
  pressed: {
    backgroundColor: colors.primaryPressed,
    borderColor: colors.primaryPressed,
  },
  secondaryPressed: {
    backgroundColor: "#f2ede3",
  },
  disabled: {
    opacity: 0.5,
  },
});
