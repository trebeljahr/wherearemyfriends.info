import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:maplibre_gl/maplibre_gl.dart';
import 'package:screenshot/screenshot.dart';
import 'package:wamf/consts.dart';
import 'package:wamf/services/user_service.dart';
import 'package:wamf/types/friend.dart';
import 'package:wamf/widgets/avatar_pin_marker.dart';

ScreenshotController screenshotController = ScreenshotController();

// Reading bytes from a network image
Future<Uint8List> getImageForUserMarker(String username, String imgSrc) async {
  Uint8List imageBytes = await screenshotController.captureFromWidget(
    AvatarPinMarker(
      userName: username,
      imgSrc: imgSrc,
    ),
    // pixelRatio: 3.0,
    // targetSize: const Size(30, 30)
  );
  return imageBytes;
}

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

  Future<void> addCustomImageMarker(Friend friend) async {
    try {
      final profilePic =
          await getImageForUserMarker(friend.username, friend.profilePicture);
      await _controller.addImage(friend.username, profilePic);

      await _controller.addSymbol(SymbolOptions(
        geometry: LatLng(friend.location.latitude, friend.location.longitude),
        iconImage: friend.username,
        iconSize: 1.0,
      ));
    } catch (e) {
      debugPrint('Error adding SVG marker: $e');
    }
  }

  void _onMapCreated(MapLibreMapController controller) {
    _controller = controller;
  }

  void _onStyleLoaded() async {
    try {
      final friends = await _friendsFuture;

      for (var friend in friends) {
        await addCustomImageMarker(friend);
      }
    } catch (e) {
      // Handle error
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

          return Stack(children: [
            MapLibreMap(
                styleString: mapStyle,
                myLocationEnabled: true,
                initialCameraPosition:
                    const CameraPosition(target: LatLng(0.0, 0.0), zoom: 3),
                trackCameraPosition: true,
                onStyleLoadedCallback: _onStyleLoaded,
                onMapCreated: _onMapCreated),
          ]);
        },
      ),
    );
  }
}
