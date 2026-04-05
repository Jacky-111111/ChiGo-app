import { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { copy } from "@/constants/copy";
import { colors, spacing } from "@/constants/theme";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import {
  resetSessionState,
  setManualSearchInput,
  setSelectedDish,
} from "@/store/mvpSession";
import type { DishCandidate } from "@/types/dish";

export default function Index() {
  const [restaurantName, setRestaurantName] = useState("");
  const [dishName, setDishName] = useState("");

  const goToUpload = () => {
    resetSessionState();
    router.push("/upload");
  };

  const canSearch = useMemo(() => dishName.trim().length > 0, [dishName]);

  const handleSearchThisDish = () => {
    if (!canSearch) return;

    const cleanDishName = dishName.trim();
    const cleanRestaurantName = restaurantName.trim();

    const manualDish: DishCandidate = {
      id: `manual-${Date.now()}`,
      name: cleanDishName,
      originalText: cleanDishName,
      parseConfidence: 0.99,
      restaurantName: cleanRestaurantName || undefined,
    };

    resetSessionState();
    setManualSearchInput({
      restaurantName: cleanRestaurantName,
      dishName: cleanDishName,
    });
    setSelectedDish(manualDish);

    router.push({
      pathname: "/dish-result",
      params: { dishId: manualDish.id },
    });
  };

  return (
    <ScreenContainer scroll>
      <View style={styles.header}>
        <Text style={styles.brand}>{copy.appName}</Text>
        <Text style={styles.title}>{copy.homeTitle}</Text>
        <Text style={styles.subtitle}>{copy.homeSubtitle}</Text>
      </View>

      <View style={styles.actions}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Restaurant Name (optional)</Text>
          <TextInput
            placeholder="e.g. Sichuan Garden"
            value={restaurantName}
            onChangeText={setRestaurantName}
            style={styles.input}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dish Name</Text>
          <TextInput
            placeholder="e.g. Mapo Tofu"
            value={dishName}
            onChangeText={setDishName}
            style={styles.input}
            autoCapitalize="words"
          />
        </View>

        <PrimaryButton
          label="Search This Dish"
          onPress={handleSearchThisDish}
          disabled={!canSearch}
        />

        <Text style={styles.sectionNote}>Or scan a full menu instead</Text>
        <PrimaryButton label="Scan a Menu" onPress={goToUpload} variant="secondary" />
        <PrimaryButton label="Choose Photo" onPress={goToUpload} variant="secondary" />
      </View>

      <Text style={styles.helper}>{copy.helperText}</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  brand: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 20,
    letterSpacing: 0.4,
  },
  title: {
    color: colors.textPrimary,
    fontWeight: "800",
    fontSize: 34,
    lineHeight: 40,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    gap: spacing.sm,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 15,
  },
  sectionNote: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  helper: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.sm,
  },
});
