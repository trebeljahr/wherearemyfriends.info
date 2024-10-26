import 'package:turf/nearest_point.dart';
import 'package:wamf/types/friend.dart';
import 'package:wamf/types/geodata.dart';
import 'package:wamf/types/location.dart';

Map<String, String> getCountryAndCityNameFromFriend(
    CityAndCountryData data, Friend friend) {
  final result = findCityAndCountryByCoordinates(data, friend.location);

  return {
    'countryName': normalizeName(result['country']!.name),
    'cityName': normalizeName(result['city']!.name),
  };
}

String normalizeName(String name) {
  return name.trim();
}

Map<String, SingleLocation> findCityAndCountryByCoordinates(
  CityAndCountryData data,
  SingleLocation location,
) {
  // Create a Point from the user's location
  final userPoint = Feature<Point>(
    geometry: Point(
      coordinates: Position.of([location.longitude, location.latitude]),
    ),
  );

  // Convert cityData to a FeatureCollection of Points
  final List<Feature<Point>> cityFeatures = data.cityData.features.map((city) {
    return Feature<Point>(
      geometry: Point(
        coordinates:
            Position.of([city.geometry.longitude, city.geometry.latitude]),
      ),
      properties: {
        'name': city.properties.name,
        'country': {
          'name': city.properties.country.name,
          'id': city.properties.country.id,
        },
      },
    );
  }).toList();

  final cityFeatureCollection = FeatureCollection(features: cityFeatures);
  final nearestCityFeature = nearestPoint(userPoint, cityFeatureCollection);

  final cityProps = nearestCityFeature.properties!;
  final cityName = cityProps['name'] as String;
  final countryInfo = cityProps['country'] as Map<String, dynamic>;
  final countryId = countryInfo['id'] as String;

  final country = data.countryData.countries[countryId];
  if (country == null) {
    throw Exception('Country not found');
  }

  return {
    'city': SingleLocation(
      name: cityName,
      latitude: nearestCityFeature.geometry!.coordinates.lat.toDouble(),
      longitude: nearestCityFeature.geometry!.coordinates.lng.toDouble(),
    ),
    'country': SingleLocation(
      name: country.name,
      latitude: country.labelPoint.latitude,
      longitude: country.labelPoint.longitude,
    ),
  };
}
