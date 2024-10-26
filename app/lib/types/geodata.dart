import 'package:wamf/types/location.dart';

class CityAndCountryData {
  final CityData cityData;
  final CountryData countryData;

  CityAndCountryData({
    required this.cityData,
    required this.countryData,
  });

  factory CityAndCountryData.fromJson(Map<String, dynamic> json) {
    return CityAndCountryData(
      cityData: CityData.fromJson(json['cityData']),
      countryData: CountryData.fromJson(json['countryData']),
    );
  }
}

class CityData {
  final List<CityFeature> features;

  CityData({required this.features});

  factory CityData.fromJson(Map<String, dynamic> json) {
    return CityData(
      features: (json['features'] as List)
          .map((e) => CityFeature.fromJson(e))
          .toList(),
    );
  }
}

class CityFeature {
  final CityProperties properties;
  final SingleLocation geometry;

  CityFeature({
    required this.properties,
    required this.geometry,
  });

  factory CityFeature.fromJson(Map<String, dynamic> json) {
    return CityFeature(
      properties: CityProperties.fromJson(json['properties']),
      geometry: SingleLocation(
        name: json['properties']['name'],
        latitude: json['geometry']['coordinates'][1].toDouble(),
        longitude: json['geometry']['coordinates'][0].toDouble(),
      ),
    );
  }
}

class CityProperties {
  final String name;
  final CountryReference country;

  CityProperties({
    required this.name,
    required this.country,
  });

  factory CityProperties.fromJson(Map<String, dynamic> json) {
    return CityProperties(
      name: json['name'] ?? '',
      country: CountryReference.fromJson(json['country']),
    );
  }
}

class CountryReference {
  final String id;
  final String name;

  CountryReference({
    required this.id,
    required this.name,
  });

  factory CountryReference.fromJson(Map<String, dynamic> json) {
    return CountryReference(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
    );
  }
}

class CountryData {
  final Map<String, CountryFeature> countries;

  CountryData({required this.countries});

  factory CountryData.fromJson(Map<String, dynamic> json) {
    return CountryData(
      countries: json.map((key, value) => MapEntry(
          key, CountryFeature.fromJson(value as Map<String, dynamic>))),
    );
  }
}

class CountryFeature {
  final String name;
  final SingleLocation labelPoint;

  CountryFeature({
    required this.name,
    required this.labelPoint,
  });

  factory CountryFeature.fromJson(Map<String, dynamic> json) {
    return CountryFeature(
      name: json['name'] ?? '',
      labelPoint: SingleLocation(
        name: json['name'],
        latitude: json['labelPoint']['coordinates'][1],
        longitude: json['labelPoint']['coordinates'][0],
      ),
    );
  }
}
