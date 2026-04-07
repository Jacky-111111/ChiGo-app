import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { copy } from "@/constants/copy";
import { colors, spacing } from "@/constants/theme";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import {
  resetSessionState,
  setDishes,
  setManualSearchInput,
  setSelectedDish,
} from "@/store/mvpSession";
import type { DishCandidate } from "@/types/dish";

export default function Index() {
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantConfirmed, setRestaurantConfirmed] = useState(false);
  const [dishInput, setDishInput] = useState("");
  const [dishNames, setDishNames] = useState<string[]>([]);

  const goToUpload = () => {
    resetSessionState();
    router.push("/upload");
  };

  const canSearch = useMemo(
    () => dishNames.length > 0 || dishInput.trim().length > 0,
    [dishInput, dishNames.length]
  );

  const addDish = () => {
    const clean = dishInput.trim();
    if (!clean) return;
    setDishNames((prev) => {
      if (prev.some((item) => item.toLowerCase() === clean.toLowerCase())) {
        return prev;
      }
      return [...prev, clean];
    });
    setDishInput("");
  };

  const removeDish = (name: string) => {
    setDishNames((prev) => prev.filter((item) => item !== name));
  };

  const handleSearchThisDish = () => {
    if (!canSearch) return;

    const pendingInput = dishInput.trim();
    const finalDishNames = [...dishNames];
    if (pendingInput.length > 0) {
      const duplicated = finalDishNames.some(
        (item) => item.toLowerCase() === pendingInput.toLowerCase()
      );
      if (!duplicated) finalDishNames.push(pendingInput);
    }
    if (finalDishNames.length === 0) return;

    const cleanRestaurantName = restaurantName.trim();
    const manualDishes: DishCandidate[] = finalDishNames.map((dishName, index) => ({
      id: `manual-${Date.now()}-${index}`,
      name: dishName,
      originalText: dishName,
      parseConfidence: 0.99,
      restaurantName: cleanRestaurantName || undefined,
      restaurantConfirmed: cleanRestaurantName ? restaurantConfirmed : false,
    }));
    const firstDish = manualDishes[0];

    resetSessionState();
    setDishes(manualDishes);
    setManualSearchInput({
      restaurantName: cleanRestaurantName,
      restaurantConfirmed: cleanRestaurantName ? restaurantConfirmed : false,
      dishName: firstDish.name,
      dishNames: finalDishNames,
    });
    setSelectedDish(firstDish);

    router.push({
      pathname: "/dish-result",
      params: { dishId: firstDish.id, batch: "1" },
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
            onChangeText={(value) => {
              setRestaurantName(value);
              setRestaurantConfirmed(false);
            }}
            style={styles.input}
            autoCapitalize="words"
          />
          <PrimaryButton
            label={restaurantConfirmed ? "Restaurant Confirmed" : "Confirm Restaurant Name"}
            onPress={() => setRestaurantConfirmed((prev) => !prev)}
            variant="secondary"
            disabled={restaurantName.trim().length === 0}
          />
          <Text style={styles.confirmHint}>
            Confirmed restaurant names are searched first for venue-specific dish photos.
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dish Name (add multiple)</Text>
          <TextInput
            placeholder="e.g. Mapo Tofu"
            value={dishInput}
            onChangeText={setDishInput}
            style={styles.input}
            autoCapitalize="words"
            onSubmitEditing={addDish}
          />
          <PrimaryButton label="Add Dish" onPress={addDish} variant="secondary" />
          {dishNames.length > 0 ? (
            <View style={styles.tagsWrap}>
              {dishNames.map((dish) => (
                <Pressable
                  key={dish}
                  onPress={() => removeDish(dish)}
                  style={styles.tag}
                  accessibilityLabel={`Remove ${dish}`}
                >
                  <Text style={styles.tagText}>{dish} x</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>

        <PrimaryButton
          label="Search Added Dishes"
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
  confirmHint: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
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
  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  tag: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fff8f5",
  },
  tagText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
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
