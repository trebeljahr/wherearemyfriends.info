import 'dart:math';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:maplibre_gl/maplibre_gl.dart';
import 'package:wamf/consts.dart';
import 'package:wamf/services/user_service.dart';
import 'package:wamf/types/friend.dart';

class MapWithFriendsPage extends StatelessWidget {
  const MapWithFriendsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const MapWithFriends();
  }
}

class MapWithFriends extends StatefulWidget {
  const MapWithFriends({super.key});

  @override
  State createState() => MapWithFriendsState();
}

class MapWithFriendsState extends State<MapWithFriends> {
  late Future<List<Friend>> _friendsFuture;
  late MapLibreMapController _controller;

  @override
  void initState() {
    super.initState();
    _friendsFuture = _fetchFriends();
  }

  Future<List<Friend>> _fetchFriends() async {
    try {
      return await userService.fetchFriends();
    } catch (e) {
      return [];
    }
  }

  void _onMapCreated(MapLibreMapController controller) {
    _controller = controller;
  }

  Future<void> _addImageToMap() async {
    final ByteData bytes = await rootBundle.load('assets/random-woman.jpg');
    final Uint8List list = bytes.buffer.asUint8List();
    _controller.addImage('assetImage', list);
  }

  void _onMapClick(Point<double> point, LatLng latLng) {
    print("Map clicked!");

    for (final symbol in _controller.symbols) {
      print(symbol.options.geometry);
    }
  }

  void _onStyleLoaded() async {
    try {
      final friends = await _friendsFuture;

      await _addImageToMap();

      _controller.addSymbolLayer("myFriends", "myFriendsLayerId",
          const SymbolLayerProperties(iconColor: "blue"));

      for (var friend in friends) {
        await _controller.addSymbol(SymbolOptions(
          geometry: LatLng(
            friend.location.latitude,
            friend.location.longitude,
          ),
          // iconImage: friend.profilePicture,

          iconSize: 1.0,
          iconImage: "assetImage", // 'assets/random-woman.jpg',

          // textField: friend.username,
          // textOffset: const Offset(0, 1.5),
        ));
      }
    } catch (e) {
      print('Error adding markers: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder<List<Friend>>(
        future: _friendsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(
                child: Text('Error fetching friends: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No friends found.'));
          }

          return MapLibreMap(
              styleString: mapStyle,
              myLocationEnabled: true,
              initialCameraPosition:
                  const CameraPosition(target: LatLng(0.0, 0.0), zoom: 3),
              trackCameraPosition: true,
              onStyleLoadedCallback: _onStyleLoaded,
              onMapClick: _onMapClick,
              onMapLongClick: _onMapClick,
              onMapCreated: _onMapCreated);
        },
      ),
    );
  }
}
