import 'package:flutter/material.dart';

class AvatarPinMarker extends StatefulWidget {
  final String imgSrc;
  final Color pinColor;
  final String userName;

  const AvatarPinMarker({
    super.key,
    required this.imgSrc,
    required this.userName,
    this.pinColor = Colors.blue,
  });

  @override
  AvatarPinMarkerState createState() => AvatarPinMarkerState();
}

class AvatarPinMarkerState extends State<AvatarPinMarker> {
  late Image _avatarImage;

  @override
  void initState() {
    super.initState();
    _avatarImage = widget.imgSrc.startsWith("http")
        ? Image.network(widget.imgSrc, height: 36, width: 36, fit: BoxFit.cover)
        : Image.asset("assets/no-user.webp",
            height: 36, width: 36, fit: BoxFit.cover);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Precache the image to ensure it's only downloaded once
    precacheImage(_avatarImage.image, context);
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center, // Center the triangle horizontally
      clipBehavior: Clip.none,
      children: [
        // Circle part of the pin with a ring
        // Container(
        //   height: 50,
        //   width: 50,
        //   decoration: BoxDecoration(
        //     color: widget.pinColor,
        //     shape: BoxShape.circle,
        //   ),
        //   child: Center(
        //     child: Container(
        //       height: 40,
        //       width: 40,
        //       decoration: BoxDecoration(
        //         color: Colors.white,
        //         shape: BoxShape.circle,
        //         border: Border.all(color: Colors.black, width: 2),
        //       ),
        //       child: ClipOval(
        //         child: _avatarImage,
        //       ),
        //     ),
        //   ),
        // ),
        // Triangle part of the pin
        Positioned(
          bottom:
              -30, // Adjusted to align the triangle with the bottom of the circle
          child: CustomPaint(
            size: const Size(30, 20), // Adjusted size for better appearance
            painter: _TrianglePainter(color: Colors.red),
          ),
        ),
      ],
    );
  }
}

class _TrianglePainter extends CustomPainter {
  final Color color;

  _TrianglePainter({this.color = Colors.red});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    // Draw an upside-down triangle to point downwards
    final path = Path()
      ..moveTo(
          size.width / 2, size.height) // Bottom center (tip of the triangle)
      ..lineTo(0, 0) // Top left
      ..lineTo(size.width, 0) // Top right
      ..close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
