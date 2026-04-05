import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "ChiGo" }} />
      <Stack.Screen name="upload" options={{ title: "Scan Menu" }} />
      <Stack.Screen name="parse-results" options={{ title: "Select a Dish" }} />
      <Stack.Screen name="dish-result" options={{ title: "Dish Preview" }} />
    </Stack>
  );
}
