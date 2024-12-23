import 'package:flutter/material.dart';
import 'package:wamf/widgets/map/marker.dart';

class MapMarkers extends StatelessWidget {
  final List<Marker> markers;
  const MapMarkers({super.key, required this.markers});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: markers,
    );
  }
}
