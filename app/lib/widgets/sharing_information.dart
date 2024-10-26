import 'package:flutter/material.dart';
import 'package:wamf/types/friend.dart';
import 'package:wamf/types/location.dart';

class SharingInformation extends StatelessWidget {
  final Friend friend;

  const SharingInformation({super.key, required this.friend});

  @override
  Widget build(BuildContext context) {
    final sharingState = friend.sharingState;

    final shareCountry = sharingState != 'none';
    final shareCity = sharingState != 'country' && shareCountry;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '${friend.username} is sharing their $sharingState location with you.',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        if (shareCountry)
          Text('Country: ${friend.location.name.toUpperCase()}'),
        if (shareCity) Text('City: ${friend.location.name.toUpperCase()}'),
        if (sharingState == 'exact')
          DisplayExactLocation(location: friend.location),
      ],
    );
  }
}

class DisplayExactLocation extends StatelessWidget {
  final SingleLocation location;

  const DisplayExactLocation({super.key, required this.location});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Text('Lat: ${location.latitude.toStringAsFixed(4)}'),
        const SizedBox(width: 8),
        Text('Lon: ${location.longitude.toStringAsFixed(4)}'),
      ],
    );
  }
}
