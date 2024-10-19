import 'package:flutter/material.dart';
import 'package:wamf/services/auth_service.dart';

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

// Similarly, add fromJson methods for Location, PrivacySetting, and OtherUser

class Location {
  final SingleLocation? exact;
  final SingleLocation? city;
  final SingleLocation? country;

  Location({this.exact, this.city, this.country});

  factory Location.fromJson(Map<String, dynamic> json) {
    return Location(
      exact:
          json['exact'] != null ? SingleLocation.fromJson(json['exact']) : null,
      city: json['city'] != null ? SingleLocation.fromJson(json['city']) : null,
      country: json['country'] != null
          ? SingleLocation.fromJson(json['country'])
          : null,
    );
  }
}

class SingleLocation {
  final String name;
  final double latitude;
  final double longitude;

  SingleLocation(
      {required this.name, required this.latitude, required this.longitude});

  factory SingleLocation.fromJson(Map<String, dynamic> json) {
    return SingleLocation(
      name: json['name'] ?? '',
      latitude: (json['latitude'] ?? 0).toDouble(),
      longitude: (json['longitude'] ?? 0).toDouble(),
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

class AuthState extends ChangeNotifier {
  LoggedInUser? _user;
  bool _isLoading = false;

  LoggedInUser? get user => _user;
  bool get isLoading => _isLoading;

  void setUser(LoggedInUser user) {
    _user = user;
    notifyListeners();
  }

  Future<void> logout() async {
    await authService.clearAuthToken();
    _user = null; // api token is empty
    notifyListeners();
  }

  bool get isAuthorized {
    return _user != null;
  }

  Future<void> loadUser() async {
    final authToken = await authService.getAuthToken();

    if (authToken == null) {
      return;
    }

    if (_user == null && !_isLoading) {
      _isLoading = true;

      try {
        final fetchedUser = await authService.getLoggedInUser();

        if (fetchedUser != null) {
          setUser(fetchedUser);
        }
      } finally {
        _isLoading = false;
      }
    }
  }
}
