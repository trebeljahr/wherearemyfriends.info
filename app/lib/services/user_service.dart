import 'dart:convert';
import 'dart:typed_data';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:wamf/services/auth_service.dart';
import 'package:wamf/types/friend.dart';

class SuccessResponse {
  final String message;

  SuccessResponse({required this.message});

  factory SuccessResponse.fromJson(Map<String, dynamic> json) {
    return SuccessResponse(message: json['message']);
  }
}

class UserService {
  Future<List<Friend>> fetchFriends() async {
    final response =
        await authService.authenticatedRequest('/api/friends', 'GET');
    if (response.statusCode == 200) {
      final List<dynamic> friendsJson = json.decode(response.body);
      final List<Friend> friendsArray = friendsJson
          .map((friend) => Friend.fromJson(friend))
          .toList(growable: false);
      return friendsArray;
    } else {
      throw Exception('Failed to load friends');
    }
  }

  Future<SuccessResponse?> makeFriendRequest(String friendId) async {
    final response = await authService.authenticatedRequest(
        '/api/friends/requests', 'POST',
        body: {'friendId': friendId});
    return SuccessResponse.fromJson(json.decode(response.body));
  }

  Future<SuccessResponse?> acceptFriendRequest(String requesterId) async {
    final response = await authService.authenticatedRequest(
        '/api/friends/requests/accept', 'POST',
        body: {'requesterId': requesterId});
    return SuccessResponse.fromJson(json.decode(response.body));
  }

  Future<SuccessResponse?> declineFriendRequest(String requesterId) async {
    final response = await authService.authenticatedRequest(
        '/api/friends/requests/decline', 'POST',
        body: {'requesterId': requesterId});
    return SuccessResponse.fromJson(json.decode(response.body));
  }

  Future<SuccessResponse?> revokeFriendRequest(String friendId) async {
    final response = await authService.authenticatedRequest(
        '/api/friends/requests/revoke', 'POST',
        body: {'friendId': friendId});
    return SuccessResponse.fromJson(json.decode(response.body));
  }

  Future<List<dynamic>> fetchReceivedRequests() async {
    final response =
        await authService.authenticatedRequest('/api/friends/requests', 'GET');
    if (response.statusCode == 200) {
      return json.decode(response.body) as List<dynamic>;
    } else {
      throw Exception('Failed to load received requests');
    }
  }

  Future<OtherUser?> searchForUser(String username) async {
    final response = await authService.authenticatedRequest(
        '/api/users/search?username=$username', 'GET');
    if (response.statusCode == 200) {
      final jsonPayload = json.decode(response.body);
      return OtherUser.fromJson(jsonPayload);
    } else {
      return null;
    }
  }

  Future<OtherUser?> getUserProfile(String username) async {
    final response = await authService.authenticatedRequest(
        '/api/profiles/$username', 'GET');
    if (response.statusCode == 200) {
      return OtherUser.fromJson(json.decode(response.body));
    } else {
      return null;
    }
  }

  Future<SuccessResponse> updateUserLocation(
      Map<String, dynamic> userLocation) async {
    final response = await authService
        .authenticatedRequest('/api/users/location', 'PUT', body: userLocation);

    return SuccessResponse.fromJson(json.decode(response.body));
  }

  Future<SuccessResponse> updateFriendPrivacy(
      String friendId, String newVisibility) async {
    final response = await authService.authenticatedRequest(
        '/api/friends/privacy', 'PUT',
        body: {'friendId': friendId, 'newVisibility': newVisibility});

    return SuccessResponse.fromJson(json.decode(response.body));
  }

  Future<SuccessResponse> removeFriend(String friendId) async {
    final response = await authService.authenticatedRequest(
        '/api/friends', 'DELETE',
        body: {'friendId': friendId});

    return SuccessResponse.fromJson(json.decode(response.body));
  }

  Future<SuccessResponse> updateDefaultPrivacy(String defaultPrivacy) async {
    final response = await authService.authenticatedRequest(
        '/api/users/default-privacy', 'PUT',
        body: {'defaultPrivacy': defaultPrivacy});
    return SuccessResponse.fromJson(json.decode(response.body));
  }

  Future<SuccessResponse> uploadProfilePicture(Uint8List fileBytes) async {
    final request = http.MultipartRequest(
        'POST', Uri.parse('$backendBaseUrl/api/users/profile-picture'));
    request.files.add(http.MultipartFile.fromBytes('profilePicture', fileBytes,
        filename: 'profile_picture.png'));
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(authTokenKey);
    if (token != null) {
      request.headers['Authorization'] = 'Bearer $token';
    }

    final response = await request.send();

    if (response.statusCode != 200) {
      throw Exception('Failed to upload profile picture');
    }

    return SuccessResponse.fromJson(json.decode(response.stream.toString()));
  }
}

final userService = UserService();
