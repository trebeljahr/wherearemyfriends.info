import 'package:flutter/material.dart';

class AvatarPinMarker extends StatefulWidget {
  final String imgSrc;
  final Color pinColor;
  final String userName;

  // ignore: use_super_parameters
  const AvatarPinMarker({
    Key? key,
    required this.imgSrc,
    required this.userName,
    this.pinColor = Colors.blue,
  }) : super(key: key);

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
      children: [
        Container(
          height: 50,
          width: 50,
          decoration: BoxDecoration(
            color: widget.pinColor,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Container(
              height: 40,
              width: 40,
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                border: Border.all(color: Colors.black, width: 2),
              ),
              child: ClipOval(
                child: _avatarImage,
              ),
            ),
          ),
        ),
        // Triangle part of the pin
        Positioned(
          bottom: -25,
          child: Transform.rotate(
            angle: 0,
            child: CustomPaint(
              size: const Size(30, 30),
              painter: _TrianglePainter(color: widget.pinColor),
            ),
          ),
        ),
      ],
    );
  }
}

class _TrianglePainter extends CustomPainter {
  final Color color;

  _TrianglePainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    final path = Path()
      ..moveTo(size.width / 2, 0)
      ..lineTo(0, size.height)
      ..lineTo(size.width, size.height)
      ..close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
