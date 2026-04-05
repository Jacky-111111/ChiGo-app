import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { DishListItem } from "@/components/DishListItem";
import { EmptyState } from "@/components/EmptyState";
import { PhotoPreview } from "@/components/PhotoPreview";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ScreenContainer } from "@/components/ScreenContainer";
import { colors, spacing } from "@/constants/theme";
import { getSessionState, setSelectedDish } from "@/store/mvpSession";
import type { DishCandidate } from "@/types/dish";

const EMPTY_LINES: string[] = [];

export default function ParseResultsScreen() {
  const [showRaw, setShowRaw] = useState(false);
  const session = getSessionState();
  const dishes = session.dishes;
  const ocrLines = session.ocrResult?.lines ?? EMPTY_LINES;

  const fallbackRawDishes = useMemo(
    () =>
      ocrLines.map((line, index) => ({
        id: `raw-${index}`,
        name: line,
        originalText: line,
      })),
    [ocrLines]
  );

  const dishList = dishes.length > 0 ? dishes : fallbackRawDishes;

  const handleSelectDish = (dish: DishCandidate) => {
    setSelectedDish(dish);
    router.push({ pathname: "/dish-result", params: { dishId: dish.id } });
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>Select a Dish</Text>
      <Text style={styles.subtitle}>
        Tap an item to search for likely visual matches.
      </Text>

      <PhotoPreview image={session.selectedImage} compact />

      <View style={styles.rowActions}>
        <PrimaryButton
          label={showRaw ? "Hide Raw Text" : "Show Raw Text"}
          onPress={() => setShowRaw((prev) => !prev)}
          variant="secondary"
        />
      </View>

      {dishList.length === 0 ? (
        <EmptyState
          title="No dish entries found"
          description="We found text, but couldn't confidently identify menu items. Try another photo."
        />
      ) : (
        <FlatList
          data={dishList}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <DishListItem dish={item} onPress={handleSelectDish} />
          )}
        />
      )}

      {showRaw ? (
        <View style={styles.rawContainer}>
          <Text style={styles.rawTitle}>Raw OCR Text</Text>
          {ocrLines.map((line, index) => (
            <Pressable
              key={`${line}-${index}`}
              onPress={() =>
                handleSelectDish({
                  id: `raw-tap-${index}`,
                  name: line,
                  originalText: line,
                })
              }
            >
              <Text style={styles.rawLine}>• {line}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <PrimaryButton
        label="Try Another Photo"
        onPress={() => router.replace("/upload")}
        variant="secondary"
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.textPrimary,
    fontWeight: "800",
    fontSize: 28,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  rowActions: {
    gap: spacing.sm,
  },
  listContent: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  rawContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.xs,
    backgroundColor: "#fffdf9",
  },
  rawTitle: {
    color: colors.textPrimary,
    fontWeight: "700",
  },
  rawLine: {
    color: colors.textSecondary,
    lineHeight: 19,
  },
});
