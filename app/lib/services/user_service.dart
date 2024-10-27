import 'dart:convert';
import 'dart:typed_data';

import 'package:mime/mime.dart';
import 'package:http_parser/http_parser.dart';
import 'package:http/http.dart' as http;
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

  Future<List<OtherUser>> fetchReceivedRequests() async {
    final response =
        await authService.authenticatedRequest('/api/friends/requests', 'GET');
    if (response.statusCode == 200) {
      return json.decode(response.body).map<OtherUser>((jsonPayload) {
        return OtherUser.fromJson(jsonPayload);
      }).toList();
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

  Future<SuccessResponse> uploadProfilePicture(
      Uint8List fileByteData, String filename) async {
    final url = Uri.parse('$backendBaseUrl/api/users/profile-picture');
    final request = http.MultipartRequest('POST', url);

    String? mimeType = lookupMimeType(filename, headerBytes: fileByteData);

    if (mimeType == null) {
      throw Exception('Could not determine MIME type of the file');
    }

    final fileToUpload = http.MultipartFile.fromBytes(
      'profilePicture',
      fileByteData,
      filename: 'profilePic.jpg',
      contentType: MediaType.parse(mimeType),
    );

    request.files.add(fileToUpload);

    final token = await authService.getAuthToken();

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
