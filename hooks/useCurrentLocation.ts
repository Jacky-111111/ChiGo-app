import { useCallback, useMemo, useState } from "react";
import type { DeviceLocation } from "@/types/menu";

export function useCurrentLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<DeviceLocation | undefined>();

  const fetchCurrentLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let Location: typeof import("expo-location");
      try {
        Location = await import("expo-location");
      } catch {
        setError(
          "Location module is not available in the current app build. Rebuild and reinstall the app, then try again."
        );
        return undefined;
      }

      const permission = await Location.requestForegroundPermissionsAsync();

      if (!permission.granted) {
        setError("Location permission is required to continue.");
        return undefined;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      let formatted: string | undefined;
      let city: string | undefined;
      let region: string | undefined;
      let country: string | undefined;

      try {
        const reverse = await Location.reverseGeocodeAsync({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        const first = reverse[0];
        city = first?.city ?? undefined;
        region = first?.region ?? undefined;
        country = first?.country ?? undefined;
        formatted = [city, region, country].filter(Boolean).join(", ") || undefined;
      } catch {
        formatted = undefined;
      }

      const nextLocation: DeviceLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        city,
        region,
        country,
        formatted,
        fetchedAt: new Date().toISOString(),
      };

      setLocation(nextLocation);
      return nextLocation;
    } catch {
      setError("Unable to access your current location. Please try again.");
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  const locationLabel = useMemo(() => {
    if (!location) return "";
    if (location.formatted) return location.formatted;
    return `${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}`;
  }, [location]);

  return {
    loading,
    error,
    location,
    locationLabel,
    fetchCurrentLocation,
  };
}
