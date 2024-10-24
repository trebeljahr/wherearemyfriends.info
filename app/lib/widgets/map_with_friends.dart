import 'dart:math';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:http/http.dart' as http;
import 'package:maplibre_gl/maplibre_gl.dart';
import 'package:wamf/consts.dart';
import 'package:wamf/services/user_service.dart';
import 'package:wamf/types/friend.dart';
import 'package:wamf/types/location.dart';
import 'package:wamf/widgets/map/marker.dart';
import 'package:wamf/widgets/map/marker_list.dart';

class MapWithFriendsPage extends StatelessWidget {
  const MapWithFriendsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const MapWithFriends();
  }
}

Future<Uint8List> svgToPngBytes(String data) async {
  final SvgStringLoader svgStringLoader = SvgStringLoader(data);
  final PictureInfo pictureInfo = await vg.loadPicture(svgStringLoader, null);

  final ui.Image image = await pictureInfo.picture.toImage(256, 256);
  final ByteData? byteData =
      await image.toByteData(format: ui.ImageByteFormat.png);
  final Uint8List uint8List = byteData!.buffer.asUint8List();

  return uint8List;
}

Future<void> addSvgMarker(
    Friend friend, MapLibreMapController controller) async {
  try {
    final Uint8List profilePic = friend.profilePicture.startsWith("https://")
        ? await http
            .get(Uri.parse(friend.profilePicture))
            .then((response) => response.bodyBytes)
        : await rootBundle
            .load('assets/no-user.webp')
            .then((data) => data.buffer.asUint8List());

//     print('Path: ${friend.profilePicture}');
//     print('Profile pic: $profilePic');
//     final String base64Image = base64Encode(profilePic);

//     print('Profile pic (base64 encoded): $base64Image');

//     const String data =
//         '''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="256" height="256" viewBox="0 0 256 256" xml:space="preserve">
//   <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
//     <path d="M 45 90 c -1.415 0 -2.725 -0.748 -3.444 -1.966 l -4.385 -7.417 C 28.167 65.396 19.664 51.02 16.759 45.189 c -2.112 -4.331 -3.175 -8.955 -3.175 -13.773 C 13.584 14.093 27.677 0 45 0 c 17.323 0 31.416 14.093 31.416 31.416 c 0 4.815 -1.063 9.438 -3.157 13.741 c -0.025 0.052 -0.053 0.104 -0.08 0.155 c -2.961 5.909 -11.41 20.193 -20.353 35.309 l -4.382 7.413 C 47.725 89.252 46.415 90 45 90 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(4,136,219); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
//     <path d="M 45 45.678 c -8.474 0 -15.369 -6.894 -15.369 -15.368 S 36.526 14.941 45 14.941 c 8.474 0 15.368 6.895 15.368 15.369 S 53.474 45.678 45 45.678 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
//   </g>
// </svg>''';

    // print(data);

    // final pngBytes = await svgToPngBytes(data);
    await controller.addImage(friend.username, profilePic);

    await controller.addSymbol(SymbolOptions(
      geometry: LatLng(friend.location.latitude, friend.location.longitude),
      iconImage: friend.username,
      iconSize: 2.0,
    ));
  } catch (e) {
    debugPrint('Error adding SVG marker: $e');
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

  Future<void> _addFriendImagesToMap() async {
    final friends = await _friendsFuture;
    for (var friend in friends) {
      try {
        // final response = await http.get(Uri.parse(friend.profilePicture));
        // if (response.statusCode == 200) {
        //   final Uint8List list = response.bodyBytes;
        await addSvgMarker(friend, _controller);
        // await _controller.addImage(friend.username, list);
        // }
      } catch (e) {
        // Handle image loading error if necessary
      }
    }
  }

  void _onMapClick(Point<double> point, LatLng latLng) {
    print("Map clicked!");

    for (final symbol in _controller.symbols) {
      print(symbol.options.geometry);
    }
  }

  final markerList = <Marker>[];

  Future<void> addMarker(SingleLocation location, String name) async {
    final geoCoordinate = LatLng(location.latitude, location.longitude);
    final screenCoordinate = await _controller.toScreenLocation(geoCoordinate);

    final Point<double> position = Point<double>(
        screenCoordinate.x.toDouble(), screenCoordinate.y.toDouble());

    final marker = Marker(
      position: position,
      geoCoordinate: geoCoordinate,
      id: name,
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
      final points =
          await _controller.toScreenLocationBatch(markerList.map((m) {
        return m.geoCoordinate;
      }));

      markerList.asMap().forEach((i, value) {
        final Point<double> position =
            Point<double>(points[i].x.toDouble(), points[i].y.toDouble());
        markerList[i].screenPosition.value = position;
      });

      // for (var marker in markerList) {
      //   final screenCoordinate =
      //       await _controller.toScreenLocation(marker.geoCoordinate);

      //   final Point<double> position = Point<double>(
      //       screenCoordinate.x.toDouble(), screenCoordinate.y.toDouble());

      //   marker.screenPosition.value = position;
      //   setState(() {});

      // RenderBox? box = context.findRenderObject() as RenderBox?;
      // if (box != null) {
      //   final Offset globalPosition = box.localToGlobal(Offset.zero);

      //   // Add the global offset to get the final position relative to the screen
      //   final Point<double> position = Point<double>(
      //     screenCoordinate.x.toDouble() + globalPosition.dx,
      //     screenCoordinate.y.toDouble() + globalPosition.dy,
      //   );

      //   marker.screenPosition.value = position;

      //   // Refresh the UI
      //   if (mounted) {
      //     setState(() {});
      //   }
      // }
      // }
    }
  }

  void _onMapCreated(MapLibreMapController controller) {
    _controller = controller;

    _controller.addListener(() {
      if (controller.isCameraMoving) {
        _updateMarkerPosition();
      }
    });
  }

  void _onStyleLoaded() async {
    try {
      final friends = await _friendsFuture;

      // await _addFriendImagesToMap();

      // _controller.addSymbolLayer("myFriends", "myFriendsLayerId",
      //     const SymbolLayerProperties(iconColor: "blue"));

      for (var friend in friends) {
        await addMarker(friend.location, friend.username);
        // await _controller.addSymbol(SymbolOptions(
        //   geometry: LatLng(
        //     friend.location.latitude,
        //     friend.location.longitude,
        //   ),
        //   // iconImage: friend.profilePicture,

        //   iconSize: 1.0,
        //   iconImage: friend.username, // 'assets/random-woman.jpg',

        //   // textField: friend.username,
        //   // textOffset: const Offset(0, 1.5),
        // ));
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

          return Stack(children: [
            MapLibreMap(
                styleString: mapStyle,
                myLocationEnabled: true,
                initialCameraPosition:
                    const CameraPosition(target: LatLng(0.0, 0.0), zoom: 3),
                trackCameraPosition: true,
                onStyleLoadedCallback: _onStyleLoaded,
                onMapClick: _onMapClick,
                onMapLongClick: _onMapClick,
                onMapCreated: _onMapCreated),
            MapMarkers(
              markers: markerList,
            )
          ]);
        },
      ),
    );
  }
}
