import 'dart:math';

import 'package:flutter/widgets.dart';
import 'package:maplibre_gl/maplibre_gl.dart';

class Marker extends StatefulWidget {
  // The widget position on the UI
  final ValueNotifier<Point<double>> screenPosition;

  // The Marker id
  final String id;

  // The marker geo data
  final LatLng geoCoordinate;

  // Your widget coming from your imagination feel free 😎
  final Widget child;
  Marker({
    super.key,
    required Point<double> position,
    required this.geoCoordinate,
    required this.child,
    required this.id,
  }) : screenPosition = ValueNotifier(position);

  @override
  MarkerState createState() => MarkerState();
}

class MarkerState extends State<Marker> {
  MarkerState();

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder(
      valueListenable: widget.screenPosition,
      builder: (context, pos, child) {
        return Positioned(
          left: pos.x,
          top: pos.y,
          child: GestureDetector(
            child: widget.child,
          ),
        );
      },
    );
  }
}
