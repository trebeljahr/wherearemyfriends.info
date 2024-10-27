// change_password_page.dart

import 'package:flutter/material.dart';
import 'package:wamf/services/auth_service.dart';
import 'package:wamf/widgets/password_field.dart';

class ChangePasswordWidget extends StatefulWidget {
  const ChangePasswordWidget({super.key});

  @override
  ChangePasswordWidgetState createState() => ChangePasswordWidgetState();
}

class ChangePasswordWidgetState extends State<ChangePasswordWidget> {
  final TextEditingController _oldPasswordController = TextEditingController();
  final TextEditingController _newPasswordController = TextEditingController();

  bool _isNewPasswordValid = false;
  String? _errorMessage;
  String? _successMessage;
  bool _isLoading = false;

  void _onPasswordValidChanged(bool isValid) {
    setState(() {
      _isNewPasswordValid = isValid;
    });
  }

  Future<void> _handleChangePassword() async {
    final oldPassword = _oldPasswordController.text;
    final newPassword = _newPasswordController.text;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _successMessage = null;
    });

    try {
      await authService.changePassword(oldPassword, newPassword);
      setState(() {
        _successMessage = 'Password changed successfully';
        _oldPasswordController.clear();
        _newPasswordController.clear();
      });
    } catch (error) {
      setState(() {
        _errorMessage = error.toString();
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _oldPasswordController.dispose();
    _newPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return _successMessage != null
        ? Text(
            _successMessage!,
            style: const TextStyle(color: Colors.green, fontSize: 18),
          )
        : Column(
            children: [
              if (_errorMessage != null)
                Text(
                  _errorMessage!,
                  style: const TextStyle(color: Colors.red),
                ),
              const SizedBox(height: 16),
              TextField(
                controller: _oldPasswordController,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'Old Password',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              PasswordFieldWidget(
                passwordController: _newPasswordController,
                label: 'New Password',
                onPasswordValid: _onPasswordValidChanged,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _isNewPasswordValid && !_isLoading
                    ? _handleChangePassword
                    : null,
                child: _isLoading
                    ? const CircularProgressIndicator()
                    : const Text('Change Password'),
              ),
            ],
          );
  }
}
