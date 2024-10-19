import 'package:flutter/material.dart';
import 'package:wamf/services/authservice.dart';

class User {
  final String id;
  final String username;
  final String email;

  User({
    required this.id,
    required this.username,
    required this.email,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      username: json['username'],
      email: json['email'],
    );
  }
}

class UserProvider with ChangeNotifier {
  User? _user;

  User? get user => _user;

  bool get isAuthenticated => _user != null;

  Future<void> loadUser() async {
    final authService = AuthService();
    final userData = await authService.getLoggedInUser();
    if (userData != null) {
      _user = User.fromJson(userData);
      notifyListeners();
    }
  }

  void setUser(User user) {
    _user = user;
    notifyListeners();
  }

  void clearUser() {
    _user = null;
    notifyListeners();
  }
}
