import 'package:wamf/types/location.dart';

class Friend {
  final String id;
  final String username;
  final String profilePicture;
  final String sharingState;
  final SingleLocation location;

  Friend({
    required this.id,
    required this.username,
    required this.profilePicture,
    required this.sharingState,
    required this.location,
  });

  factory Friend.fromJson(Map<String, dynamic> json) {
    return Friend(
      id: json['_id'] ?? '',
      username: json['username'] ?? '',
      profilePicture: json['profilePicture'] ?? '',
      sharingState: json['sharingState'] ?? '',
      location: SingleLocation.fromJson(json['location'] ?? {}),
    );
  }
}

class OtherUser {
  final String id;
  final String username;
  final String profilePicture;
  final String defaultPrivacy;

  OtherUser({
    required this.id,
    required this.username,
    required this.profilePicture,
    required this.defaultPrivacy,
  });

  factory OtherUser.fromJson(Map<String, dynamic> json) {
    return OtherUser(
      id: json['_id'] ?? '',
      username: json['username'] ?? '',
      profilePicture: json['profilePicture'] ?? '',
      defaultPrivacy: json['defaultPrivacy'] ?? '',
    );
  }
}
