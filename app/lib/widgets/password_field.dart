import 'package:flutter/material.dart';

class PasswordFieldWidget extends StatefulWidget {
  final TextEditingController passwordController;
  final String label;
  final bool showStrengthMeter;
  final bool showCriteria;

  // Optional callback to notify parent of password validity
  final ValueChanged<bool>? onPasswordValid;

  // Optional callback to notify parent of password strength
  final ValueChanged<int>? onPasswordStrengthChanged;

  const PasswordFieldWidget({
    super.key,
    required this.passwordController,
    this.label = 'Password',
    this.showStrengthMeter = true,
    this.showCriteria = true,
    this.onPasswordValid,
    this.onPasswordStrengthChanged,
  });

  @override
  PasswordFieldWidgetState createState() => PasswordFieldWidgetState();
}

class PasswordFieldWidgetState extends State<PasswordFieldWidget> {
  bool _isPasswordVisible = false;
  bool _isPasswordValid = false;
  int _passwordStrength = 0;

  @override
  void initState() {
    super.initState();
    widget.passwordController.addListener(_onPasswordChanged);
  }

  @override
  void dispose() {
    widget.passwordController.removeListener(_onPasswordChanged);
    super.dispose();
  }

  void _onPasswordChanged() {
    final password = widget.passwordController.text;
    final isValid = _validatePassword(password);
    final strength = _calculatePasswordStrength(password);

    setState(() {
      _isPasswordValid = isValid;
      _passwordStrength = strength;
    });

    if (widget.onPasswordValid != null) {
      widget.onPasswordValid!(_isPasswordValid);
    }

    if (widget.onPasswordStrengthChanged != null) {
      widget.onPasswordStrengthChanged!(_passwordStrength);
    }
  }

  bool _validatePassword(String password) {
    final uppercase = RegExp(r'[A-Z]');
    final lowercase = RegExp(r'[a-z]');
    final number = RegExp(r'[0-9]');
    final specialChar = RegExp(r'[!@#\$&*~]');
    return password.length >= 12 &&
        uppercase.hasMatch(password) &&
        lowercase.hasMatch(password) &&
        number.hasMatch(password) &&
        specialChar.hasMatch(password);
  }

  int _calculatePasswordStrength(String password) {
    int strength = 0;
    if (RegExp(r'[A-Z]').hasMatch(password)) strength++;
    if (RegExp(r'[a-z]').hasMatch(password)) strength++;
    if (RegExp(r'[0-9]').hasMatch(password)) strength++;
    if (RegExp(r'[!@#\$&*~]').hasMatch(password)) strength++;
    if (password.length >= 12) strength++;

    return strength;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: widget.passwordController,
          obscureText: !_isPasswordVisible,
          decoration: InputDecoration(
            labelText: widget.label,
            border: const OutlineInputBorder(),
            suffixIcon: IconButton(
              icon: Icon(
                _isPasswordVisible ? Icons.visibility : Icons.visibility_off,
              ),
              onPressed: () {
                setState(() {
                  _isPasswordVisible = !_isPasswordVisible;
                });
              },
            ),
          ),
        ),
        if (widget.showStrengthMeter) ...[
          const SizedBox(height: 8),
          _buildPasswordStrengthMeter(),
        ],
        if (widget.showCriteria) ...[
          const SizedBox(height: 8),
          _buildPasswordCriteria(),
        ],
      ],
    );
  }

  Widget _buildPasswordStrengthMeter() {
    final strengthColors = [
      Colors.grey[300],
      Colors.red,
      Colors.orange,
      Colors.yellow,
      Colors.lightGreen,
      Colors.green,
    ];

    final strengthColor = strengthColors[_passwordStrength];
    final strengthPercentage = _passwordStrength / 5.0;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Password Strength:'),
        const SizedBox(height: 4),
        LinearProgressIndicator(
          value: strengthPercentage,
          backgroundColor: Colors.grey[300],
          valueColor: AlwaysStoppedAnimation<Color?>(strengthColor),
        ),
      ],
    );
  }

  Widget _buildPasswordCriteria() {
    final password = widget.passwordController.text;
    final atLeastOneUppercase = RegExp(r'[A-Z]').hasMatch(password);
    final atLeastOneLowercase = RegExp(r'[a-z]').hasMatch(password);
    final atLeastOneNumber = RegExp(r'[0-9]').hasMatch(password);
    final atLeastOneSpecialChar = RegExp(r'[!@#\$&*~]').hasMatch(password);
    final atLeastTwelveCharacters = password.length >= 12;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildCriteriaRow('At least 12 characters', atLeastTwelveCharacters),
        _buildCriteriaRow('At least one uppercase letter', atLeastOneUppercase),
        _buildCriteriaRow('At least one lowercase letter', atLeastOneLowercase),
        _buildCriteriaRow('At least one number', atLeastOneNumber),
        _buildCriteriaRow(
            'At least one special character', atLeastOneSpecialChar),
      ],
    );
  }

  Widget _buildCriteriaRow(String text, bool isMet) {
    return Row(
      children: [
        Icon(
          isMet ? Icons.check_circle : Icons.cancel,
          color: isMet ? Colors.green : Colors.red,
          size: 20,
        ),
        const SizedBox(width: 8),
        Text(text),
      ],
    );
  }
}
