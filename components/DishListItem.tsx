import { Pressable, StyleSheet, Text, View } from "react-native";
import type { DishCandidate } from "@/types/dish";
import { colors, spacing } from "@/constants/theme";

type Props = {
  dish: DishCandidate;
  onPress: (dish: DishCandidate) => void;
};

export function DishListItem({ dish, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Dish ${dish.name}`}
      onPress={() => onPress(dish)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.row}>
        <Text style={styles.name}>{dish.name}</Text>
        {dish.parseConfidence ? (
          <Text style={styles.confidence}>
            {Math.round(dish.parseConfidence * 100)}%
          </Text>
        ) : null}
      </View>
      {dish.description ? <Text style={styles.description}>{dish.description}</Text> : null}
      <Text style={styles.subtle}>Tap to preview likely dish images</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  cardPressed: {
    backgroundColor: "#fbf6ed",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    flex: 1,
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 16,
  },
  confidence: {
    color: colors.success,
    fontWeight: "700",
    marginLeft: spacing.sm,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  subtle: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
