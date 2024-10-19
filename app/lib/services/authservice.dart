import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

import 'package:wamf/providers/userprovider.dart';

const String backendBaseUrl = 'https://wherearemyfriends.info';
const String authTokenKey = 'authToken';

class AuthService {
  Future<void> setAuthToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(authTokenKey, token);
  }

  Future<String?> getAuthToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(authTokenKey);
  }

  Future<void> clearAuthToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(authTokenKey);
  }

  Future<LoggedInUser?> getLoggedInUser() async {
    final token = await getAuthToken();
    if (token == null) return null;

    final url = Uri.parse('$backendBaseUrl/auth/verify');
    final response = await http.get(
      url,
      headers: {'Authorization': 'Bearer $token'},
    );

    if (response.statusCode == 200) {
      final decoded = json.decode(response.body);
      final loggedInUser = LoggedInUser.fromJson(decoded);
      return loggedInUser;
    }
    return null;
  }

  Future<http.Response> authenticatedRequest(String endpoint, String method,
      {Map<String, dynamic>? body}) async {
    final token = await getAuthToken();
    if (token == null) {
      throw Exception('No auth token available');
    }

    final url = Uri.parse('$backendBaseUrl$endpoint');
    final headers = {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    };

    switch (method.toUpperCase()) {
      case 'GET':
        return await http.get(url, headers: headers);
      case 'POST':
        return await http.post(url, headers: headers, body: json.encode(body));
      case 'PUT':
        return await http.put(url, headers: headers, body: json.encode(body));
      case 'DELETE':
        return await http.delete(url,
            headers: headers, body: json.encode(body));
      default:
        throw UnsupportedError('Unsupported HTTP method: $method');
    }
  }
}

final authService = AuthService();
