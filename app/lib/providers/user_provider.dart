import 'package:flutter/material.dart';
import 'package:wamf/services/auth_service.dart';
import 'package:wamf/types/user.dart';

class AuthState extends ChangeNotifier {
  LoggedInUser? _user;
  bool _isLoading = false;

  LoggedInUser? get user => _user;
  bool get isLoading => _isLoading;

  void setUser(LoggedInUser user) {
    _user = user;
    notifyListeners();
  }

  Future<void> reset() async {
    await authService.clearAuthToken();
    _user = null;
    _isLoading = false;
    notifyListeners();
  }

  Future<void> logout() async {
    reset();
  }

  bool get isAuthorized {
    return _user != null;
  }

  Future<void> loadUser() async {
    final authToken = await authService.getAuthToken();

    if (authToken == null) {
      return;
    }

    if (!_isLoading) {
      _isLoading = true;

      try {
        final fetchedUser = await authService.getLoggedInUser();

        if (fetchedUser != null) {
          setUser(fetchedUser);
        } else {
          await reset();
        }
      } catch (err) {
        await reset();
      } finally {
        _isLoading = false;
      }
    }
  }
}
