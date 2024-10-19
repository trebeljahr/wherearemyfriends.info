import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import 'dart:typed_data';
import 'package:wamf/services/authservice.dart';

class UserService {
  Future<List<dynamic>> fetchFriends() async {
    final response =
        await authService.authenticatedRequest('/api/friends', 'GET');
    if (response.statusCode == 200) {
      return json.decode(response.body) as List<dynamic>;
    } else {
      throw Exception('Failed to load friends');
    }
  }

  Future<void> makeFriendRequest(String friendId) async {
    await authService.authenticatedRequest('/api/friends/requests', 'POST',
        body: {'friendId': friendId});
  }

  Future<void> acceptFriendRequest(String requesterId) async {
    await authService.authenticatedRequest(
        '/api/friends/requests/accept', 'POST',
        body: {'requesterId': requesterId});
  }

  Future<void> declineFriendRequest(String requesterId) async {
    await authService.authenticatedRequest(
        '/api/friends/requests/decline', 'POST',
        body: {'requesterId': requesterId});
  }

  Future<void> revokeFriendRequest(String friendId) async {
    await authService.authenticatedRequest(
        '/api/friends/requests/revoke', 'POST',
        body: {'friendId': friendId});
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

  Future<Map<String, dynamic>> searchForUser(String username) async {
    final response = await authService.authenticatedRequest(
        '/api/users/search?username=$username', 'GET');
    if (response.statusCode == 200) {
      return json.decode(response.body) as Map<String, dynamic>;
    } else {
      throw Exception('Failed to search for user');
    }
  }

  Future<Map<String, dynamic>> getUserProfile(String username) async {
    final response = await authService.authenticatedRequest(
        '/api/profiles/$username', 'GET');
    if (response.statusCode == 200) {
      return json.decode(response.body) as Map<String, dynamic>;
    } else {
      throw Exception('Failed to load user profile');
    }
  }

  Future<void> updateUserLocation(Map<String, dynamic> userLocation) async {
    await authService.authenticatedRequest('/api/users/location', 'PUT',
        body: userLocation);
  }

  Future<void> updateFriendPrivacy(
      String friendId, String newVisibility) async {
    await authService.authenticatedRequest('/api/friends/privacy', 'PUT',
        body: {'friendId': friendId, 'newVisibility': newVisibility});
  }

  Future<void> removeFriend(String friendId) async {
    await authService.authenticatedRequest('/api/friends', 'DELETE',
        body: {'friendId': friendId});
  }

  Future<void> updateDefaultPrivacy(String defaultPrivacy) async {
    await authService.authenticatedRequest('/api/users/default-privacy', 'PUT',
        body: {'defaultPrivacy': defaultPrivacy});
  }

  Future<void> uploadProfilePicture(Uint8List fileBytes) async {
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
    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Failed to upload profile picture');
    }
  }
}

final userService = UserService();
