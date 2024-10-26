import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_typeahead/flutter_typeahead.dart';
import 'package:http/http.dart' as http;
import 'package:wamf/services/auth_service.dart';
import 'package:wamf/services/user_service.dart';
import 'package:wamf/types/friend.dart';
import 'package:wamf/types/geodata.dart';
import 'package:wamf/utils/utils.dart';
import 'package:wamf/widgets/sharing_information.dart';

class FriendSearch extends StatefulWidget {
  const FriendSearch({super.key});

  @override
  FriendSearchState createState() => FriendSearchState();
}

class OptionType {
  final String value;
  final String label;
  final String type;

  OptionType({required this.value, required this.label, required this.type});
}

Future<Map<String, dynamic>> loadAsset(String path) async {
  http.Response response = await http.get(Uri.parse('$backendBaseUrl$path'));
  return jsonDecode(response.body);
}

Future<CityData> loadCityData() async {
  final jsonData = await loadAsset('/data/cityData.json');
  return CityData.fromJson(jsonData);
}

Future<CountryData> loadCountryData() async {
  final jsonData = await loadAsset('/data/countryData.json');
  return CountryData.fromJson(jsonData);
}

class FriendSearchState extends State<FriendSearch> {
  final TextEditingController _typeAheadController = TextEditingController();
  List<Friend> _friends = [];
  List<Friend> _filteredFriends = [];
  CityData? _cityData;
  CountryData? _countryData;
  String? _selectedOption;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    _friends = await userService.fetchFriends();
    _cityData = await loadCityData();
    _countryData = await loadCountryData();

    setState(() {});
  }

  Future<List<String>> _getSuggestions(String pattern) async {
    if (pattern.isEmpty || _cityData == null || _countryData == null) {
      return [];
    }

    final inputLower = pattern.toLowerCase();

    List<String> options = [];

    options.addAll(_countryData!.countries.values
        .where((country) => country.name.toLowerCase().contains(inputLower))
        .map((country) => country.name));

    options.addAll(_cityData!.features
        .where((feature) =>
            feature.properties.name.toLowerCase().contains(inputLower) ||
            feature.properties.country.name.toLowerCase().contains(inputLower))
        .take(50)
        .map((feature) =>
            '${feature.properties.name}, ${feature.properties.country.name}'));

    return options;
  }

  void _handleSelect(String? option) {
    setState(() {
      _selectedOption = option;
    });

    if (option == null || _cityData == null || _countryData == null) {
      _filteredFriends = [];
      return;
    }

    final optionValueLower = normalizeName(option);

    _filteredFriends = _friends.where((friend) {
      final names = getCountryAndCityNameFromFriend(
          CityAndCountryData(cityData: _cityData!, countryData: _countryData!),
          friend);
      if (option.contains(', ')) {
        return names['cityName'] == optionValueLower;
      } else {
        return names['countryName'] == optionValueLower;
      }
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    if (_cityData == null || _countryData == null) {
      return const Center(child: CircularProgressIndicator());
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Search Friends by Location',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        TypeAheadField(
          controller: _typeAheadController,
          direction: VerticalDirection.down, // Adjust as needed
          builder: (context, controller, focusNode) {
            return TextField(
              controller: controller,
              focusNode: focusNode,
              decoration: const InputDecoration(
                hintText: 'Type a city or country name',
                border: OutlineInputBorder(),
              ),
            );
          },
          decorationBuilder: (context, child) {
            return Material(
              type: MaterialType.card,
              elevation: 4,
              borderRadius: BorderRadius.circular(8.0),
              child: child,
            );
          },
          suggestionsCallback: _getSuggestions,
          itemBuilder: (context, suggestion) {
            return ListTile(
              title: Text(suggestion),
            );
          },
          onSelected: (suggestion) {
            _typeAheadController.text = suggestion;
            _handleSelect(suggestion);
          },
          loadingBuilder: (context) => const Center(
            child: CircularProgressIndicator(),
          ),
          debounceDuration: const Duration(milliseconds: 300),
          hideOnSelect: true,
          hideOnUnfocus: true,
          hideWithKeyboard: true,
          retainOnLoading: false,
          itemSeparatorBuilder: (context, index) => const Divider(),
        ),
        const SizedBox(height: 16),
        if (_selectedOption != null)
          Text(
            'Users in $_selectedOption:',
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
          ),
        const SizedBox(height: 16),
        if (_filteredFriends.isNotEmpty)
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _filteredFriends.length,
            itemBuilder: (context, index) {
              final friend = _filteredFriends[index];
              return ListTile(
                leading: CircleAvatar(
                  backgroundImage: NetworkImage(friend.profilePicture),
                ),
                title: SharingInformation(friend: friend),
              );
            },
          )
        else if (_selectedOption != null)
          const Text('No users found in this location.'),
      ],
    );
  }
}
