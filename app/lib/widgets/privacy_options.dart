import 'package:flutter/material.dart';

class PrivacyOption {
  final String value;
  final String label;
  final Icon icon;

  PrivacyOption({
    required this.value,
    required this.label,
    required this.icon,
  });
}

List<PrivacyOption> generatePrivacyOptions([String pronoun = 'your']) {
  return [
    PrivacyOption(
      value: 'exact',
      label: 'Sharing $pronoun exact location',
      icon: Icon(Icons.location_pin, color: Colors.red[400]),
    ),
    PrivacyOption(
      value: 'city',
      label: 'Sharing $pronoun city location',
      icon: Icon(Icons.location_city, color: Colors.cyan[600]),
    ),
    PrivacyOption(
      value: 'country',
      label: 'Sharing $pronoun country location',
      icon: Icon(Icons.map, color: Colors.green[500]),
    ),
    PrivacyOption(
      value: 'none',
      label: 'Sharing absolutely no location',
      icon: Icon(Icons.warning, color: Colors.yellow[500]),
    ),
  ];
}

PrivacyOption getPrivacyOption(String value, [String pronoun = 'your']) {
  final options = generatePrivacyOptions(pronoun);
  return options.firstWhere((option) => option.value == value,
      orElse: () => options[0]);
}

class PrivacyOptionsComponent extends StatelessWidget {
  final String value;
  final ValueChanged<String?> onChanged;

  // ignore: use_super_parameters
  const PrivacyOptionsComponent({
    Key? key,
    required this.value,
    required this.onChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final options = generatePrivacyOptions();

    return DropdownButton<String>(
      value: value,
      onChanged: onChanged,
      items: options.map((option) {
        return DropdownMenuItem<String>(
          value: option.value,
          child: Row(
            children: [
              option.icon,
              const SizedBox(width: 8),
              Text(option.label),
            ],
          ),
        );
      }).toList(),
    );
  }
}
