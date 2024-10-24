import 'package:flutter/material.dart';
import 'package:maplibre_gl/maplibre_gl.dart';
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

          final friends = snapshot.data!;
          return MapLibreMap(
            styleString: "https://tiles.openfreemap.org/styles/liberty",
            myLocationEnabled: true,
            initialCameraPosition:
                const CameraPosition(target: LatLng(0.0, 0.0), zoom: 3),
            trackCameraPosition: true,
            onMapCreated: (controller) {
              for (var friend in friends) {
                controller.addSymbol(SymbolOptions(
                  geometry: LatLng(
                    friend.location.latitude,
                    friend.location.longitude,
                  ),
                  iconImage: friend.profilePicture,
                  textField: friend.username,
                  textOffset: const Offset(0, 1.5),
                ));
              }
            },
          );
        },
      ),
    );
  }
}
