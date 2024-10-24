class Location {
  final SingleLocation? exact;
  final SingleLocation? city;
  final SingleLocation? country;

  Location({this.exact, this.city, this.country});

  factory Location.fromJson(Map<String, dynamic> json) {
    return Location(
      exact:
          json['exact'] != null ? SingleLocation.fromJson(json['exact']) : null,
      city: json['city'] != null ? SingleLocation.fromJson(json['city']) : null,
      country: json['country'] != null
          ? SingleLocation.fromJson(json['country'])
          : null,
    );
  }
}

class SingleLocation {
  final String name;
  final double latitude;
  final double longitude;

  SingleLocation(
      {required this.name, required this.latitude, required this.longitude});

  factory SingleLocation.fromJson(Map<String, dynamic> json) {
    return SingleLocation(
      name: json['name'] ?? '',
      latitude: (json['latitude'] ?? 0).toDouble(),
      longitude: (json['longitude'] ?? 0).toDouble(),
    );
  }
}
