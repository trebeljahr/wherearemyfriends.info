import User from "../models/User";

// Define a type for location response
type LocationResponse = {
  coordinates?: [number, number];
  city?: string;
  country?: string;
  lastUpdated: Date;
} | null;

// Function to get a user's location based on privacy settings
export async function getLocationForFriend(
  userId: string,
  friendId: string
): Promise<LocationResponse> {
  const user = await User.findById(userId).populate("privacySettings.friendId");

  if (!user) {
    throw new Error("User not found");
  }

  const privacySetting = user.privacySettings.find(
    (setting) => setting.friendId.toString() === friendId.toString()
  );

  if (!privacySetting || privacySetting.visibility === "none") {
    return null; // No location sharing
  }

  switch (privacySetting.visibility) {
    case "exact":
      return {
        coordinates: user.location.coordinates,
        lastUpdated: user.location.lastUpdated,
      };

    case "nearby":
      return {
        coordinates: randomizeNearby(user.location.coordinates),
        lastUpdated: user.location.lastUpdated,
      };

    case "city":
      return {
        city: user.location.city,
        lastUpdated: user.location.lastUpdated,
      };

    case "country":
      return {
        country: user.location.country,
        lastUpdated: user.location.lastUpdated,
      };

    default:
      return null;
  }
}

// Utility function to randomize location within 1 km radius
function randomizeNearby([longitude, latitude]: [number, number]): [
  number,
  number
] {
  const randomOffset = () => (Math.random() - 0.5) * 0.018; // 1km ~ 0.018 degrees
  return [longitude + randomOffset(), latitude + randomOffset()];
}
