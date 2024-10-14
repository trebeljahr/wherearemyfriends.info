export const getCurrentLocationFromGps = async () => {
  return new Promise<[number, number]>((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userPosition: [number, number] = [longitude, latitude];
          return resolve(userPosition);
        },
        (error) => {
          const errorMsg = "Error getting current position: " + error.message;
          reject(errorMsg);
        }
      );
    } else {
      const errorMsg = "Geolocation is not supported by this browser.";
      reject(errorMsg);
    }
  });
};
