import 'package:flutter/material.dart';
import 'package:wamf/widgets/privacy_options.dart';

class DefaultPrivacySetting extends StatelessWidget {
  final String defaultPrivacy;
  final ValueChanged<String?> onPrivacyChanged;

  // ignore: use_super_parameters
  const DefaultPrivacySetting({
    Key? key,
    required this.defaultPrivacy,
    required this.onPrivacyChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            const Text('You are '),
            Expanded(
              child: PrivacyOptionsComponent(
                value: defaultPrivacy,
                onChanged: onPrivacyChanged,
              ),
            ),
            const Text(' per default with new friends.'),
          ],
        ),
      ),
    );
  }
}
