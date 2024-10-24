import 'package:wamf/types/friend.dart';
import 'package:wamf/types/location.dart';

class LoggedInUser {
  final String email;
  final String username;
  final String profilePicture;
  final Location location;
  final List<PrivacySetting> privacySettings;
  final List<OtherUser> friends;
  final List<OtherUser> receivedFriendRequests;
  final List<OtherUser> sentFriendRequests;
  final String defaultPrivacy;
  final String id;

  const LoggedInUser({
    required this.email,
    required this.username,
    required this.profilePicture,
    required this.location,
    required this.privacySettings,
    required this.friends,
    required this.receivedFriendRequests,
    required this.sentFriendRequests,
    required this.defaultPrivacy,
    required this.id,
  });

  factory LoggedInUser.fromJson(Map<String, dynamic> json) {
    return LoggedInUser(
      email: json['email'] ?? '',
      username: json['username'] ?? '',
      profilePicture: json['profilePicture'] ?? '',
      location: Location.fromJson(json['location'] ?? {}),
      privacySettings: (json['privacySettings'] as List?)
              ?.map((e) => PrivacySetting.fromJson(e))
              .toList() ??
          [],
      friends: (json['friends'] as List?)
              ?.map((e) => OtherUser.fromJson(e))
              .toList() ??
          [],
      receivedFriendRequests: (json['receivedFriendRequests'] as List?)
              ?.map((e) => OtherUser.fromJson(e))
              .toList() ??
          [],
      sentFriendRequests: (json['sentFriendRequests'] as List?)
              ?.map((e) => OtherUser.fromJson(e))
              .toList() ??
          [],
      defaultPrivacy: json['defaultPrivacy'] ?? '',
      id: json['_id'] ?? '',
    );
  }
}

class PrivacySetting {
  final String friendId;
  final String visibility;

  PrivacySetting({required this.friendId, required this.visibility});

  factory PrivacySetting.fromJson(Map<String, dynamic> json) {
    return PrivacySetting(
      friendId: json['friendId'] ?? '',
      visibility: json['visibility'] ?? '',
    );
  }
}
