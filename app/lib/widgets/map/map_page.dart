import 'dart:math';

import 'package:flutter/material.dart';
import 'package:maplibre_gl/maplibre_gl.dart';
import 'package:wamf/consts.dart';
import 'package:wamf/types/location.dart';
import 'package:wamf/widgets/map/marker.dart';
import 'package:wamf/widgets/map/marker_list.dart';

class MapPageWithCustomWidget extends StatefulWidget {
  const MapPageWithCustomWidget({super.key});

  @override
  State<MapPageWithCustomWidget> createState() =>
      _MapPageWithCustomWidgetState();
}

class _MapPageWithCustomWidgetState extends State<MapPageWithCustomWidget> {
  late MapLibreMapController _mapController;
  final markerList = <Marker>{};

  Future<void> addMarker(SingleLocation location) async {
    final geoCoordinate = LatLng(location.latitude, location.longitude);
    final screenCoordinate =
        await _mapController.toScreenLocation(geoCoordinate);

    final Point<double> position = Point<double>(
        screenCoordinate.x.toDouble(), screenCoordinate.y.toDouble());

    final marker = Marker(
      position: position,
      geoCoordinate: geoCoordinate,
      id: "1",
      child: Image.asset(
        "assets/random-woman.jpg",
        height: 32,
        width: 32,
      ),
    );

    markerList.add(marker);
    setState(() {});
  }

  Future<void> _updateMarkerPosition() async {
    if (markerList.isNotEmpty) {
      for (var m in markerList) {
        final screenCoordinate =
            await _mapController.toScreenLocation(m.geoCoordinate);

        final Point<double> position = Point<double>(
            screenCoordinate.y.toDouble(), screenCoordinate.x.toDouble());

        m.screenPosition.value = position;
        setState(() {});
      }
    }
  }

  void _onMapCreated(MapLibreMapController controller) {
    _mapController = controller;

    controller.addListener(() {
      if (controller.isCameraMoving) {
        _updateMarkerPosition();
      }
    });
  }

  void _onStyleLoaded() async {}

  void _onCameraIdle() {
    _updateMarkerPosition();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final randomLocation = SingleLocation(
              name: "test",
              latitude: Random().nextDouble() * 180 - 90,
              longitude: Random().nextDouble() * 360 - 180);

          await addMarker(randomLocation);
        },
        child: const Icon(Icons.location_history),
      ),
      body: Stack(
        children: [
          MapLibreMap(
              styleString: mapStyle,
              myLocationEnabled: true,
              initialCameraPosition:
                  const CameraPosition(target: LatLng(0.0, 0.0), zoom: 3),
              trackCameraPosition: true,
              onStyleLoadedCallback: _onStyleLoaded,
              onCameraIdle: _onCameraIdle,
              onMapCreated: _onMapCreated),
          MapMarkers(
            markers: markerList.toList(),
          )
        ],
      ),
    );
  }
}
