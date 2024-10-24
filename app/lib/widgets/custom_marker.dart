import 'dart:math';
import 'package:flutter/material.dart';
import 'package:maplibre_gl/maplibre_gl.dart';

const randomMarkerNum = 10;

class CustomMarkerPage extends StatelessWidget {
  const CustomMarkerPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const CustomMarker();
  }
}

class CustomMarker extends StatefulWidget {
  const CustomMarker({super.key});

  @override
  State createState() => CustomMarkerState();
}

class CustomMarkerState extends State<CustomMarker> {
  final _rnd = Random();

  late MapLibreMapController _mapController;
  bool _mapReady = false;
  final _markers = <Marker>[];
  final _markerStates = <MarkerState>[];

  void _addMarkerStates(MarkerState markerState) {
    if (!_mapReady) {
      return;
    }

    _markerStates.add(markerState);
  }

  void _onMapCreated(MapLibreMapController controller) {
    _mapController = controller;
    _mapReady = true;
    controller.addListener(() {
      if (controller.isCameraMoving) {
        _updateMarkerPosition();
      }
    });
  }

  void _updateMarkerPosition() {
    if (!_mapReady) {
      return;
    }

    final coordinates = <LatLng>[];

    for (final markerState in _markerStates) {
      coordinates.add(markerState.getCoordinate());
    }

    _mapController.toScreenLocationBatch(coordinates).then((points) {
      _markerStates.asMap().forEach((i, value) {
        _markerStates[i].updatePosition(points[i]);
      });
    });
  }

  void _addMarker(Point<double> point, LatLng coordinates) {
    if (!_mapReady) {
      return;
    }

    setState(() {
      _markers.add(
        Marker(
          _rnd.nextInt(10000).toString(),
          coordinates,
          point,
          _addMarkerStates,
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(children: [
        MapLibreMap(
          styleString: "https://tiles.openfreemap.org/styles/liberty",
          trackCameraPosition: true,
          onMapCreated: _onMapCreated,
          initialCameraPosition:
              const CameraPosition(target: LatLng(35.0, 135.0), zoom: 5),
        ),
        IgnorePointer(
            ignoring: true,
            child: Stack(
              children: _markers,
            ))
      ]),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          final param = <LatLng>[];
          for (var i = 0; i < randomMarkerNum; i++) {
            final lat = _rnd.nextDouble() * 20 + 30;
            final lng = _rnd.nextDouble() * 20 + 125;
            param.add(LatLng(lat, lng));
          }

          _mapController.toScreenLocationBatch(param).then((value) {
            for (var i = 0; i < randomMarkerNum; i++) {
              final point =
                  Point<double>(value[i].x as double, value[i].y as double);
              _addMarker(point, param[i]);
            }
          });
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}

class Marker extends StatefulWidget {
  final Point initialPosition;
  final LatLng _coordinate;
  final void Function(MarkerState) addMarkerState;

  Marker(
    String key,
    this._coordinate,
    this.initialPosition,
    this.addMarkerState,
  ) : super(key: Key(key));

  @override
  State<StatefulWidget> createState() {
    return MarkerState();
  }
}

class MarkerState extends State<Marker> {
  final _iconSize = 20.0;

  late Point _position;

  // late AnimationController _controller;
  // late Animation<double> _animation;

  MarkerState();

  @override
  void initState() {
    super.initState();
    _position = widget.initialPosition;
    widget.addMarkerState(this);

    // _controller = AnimationController(
    //   duration: const Duration(seconds: 2),
    //   vsync: this,
    // )..repeat(reverse: true);
    // _animation = CurvedAnimation(
    //   parent: _controller,
    //   curve: Curves.elasticOut,
    // );
  }

  // @override
  // void dispose() {
  //   _controller.dispose();
  //   super.dispose();
  // }

  @override
  Widget build(BuildContext context) {
    const ratio = 1.0;
    return Positioned(
        left: _position.x / ratio - _iconSize / 2,
        top: _position.y / ratio - _iconSize / 2,
        // child: RotationTransition(
        //     turns: _animation,
        child: Image.asset('assets/no-user.webp', height: _iconSize));
    // ));
  }

  void updatePosition(Point<num> point) {
    setState(() {
      _position = point;
    });
  }

  LatLng getCoordinate() {
    return widget._coordinate;
  }
}
