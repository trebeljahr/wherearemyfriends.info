export const LandingPage = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      {/* Hero Section */}
      <div className="text-center px-4 md:px-8 py-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Where Are My Friends?
        </h1>
        <p className="text-lg md:text-2xl mb-8 max-w-2xl">
          Share your location with friends on your own terms. Control how much
          each friend can see—country, city, nearby, or exact spot. Stay
          connected effortlessly.
        </p>
        {/* Call to Action */}
        <a
          href="/signup"
          className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
        >
          Sign Up Now
        </a>
      </div>

      {/* Features Section */}
      <div className="mt-16 px-4 md:px-8 max-w-4xl">
        <h2 className="text-2xl md:text-4xl font-semibold mb-8 text-center">
          Share Your Location, Your Way
        </h2>
        <ul className="space-y-6 text-left">
          <li className="flex items-start">
            <span className="mr-4 mt-1">
              {/* Icon */}
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z" />
              </svg>
            </span>
            <span>
              <strong>Privacy Control:</strong> Decide how precisely each friend
              can see your location—from country level down to your exact spot.
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-4 mt-1">
              {/* Icon */}
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
              </svg>
            </span>
            <span>
              <strong>Stay Connected:</strong> See where your friends are and
              make plans to meet up with ease.
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-4 mt-1">
              {/* Icon */}
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.4 0 .1 5.3.1 11.9c0 6.6 11.9 20.1 11.9 20.1s11.9-13.5 11.9-20.1C23.9 5.3 18.6 0 12 0zm0 16.3c-2.4 0-4.4-2-4.4-4.4S9.6 7.5 12 7.5s4.4 2 4.4 4.4-2 4.4-4.4 4.4z" />
              </svg>
            </span>
            <span>
              <strong>Easy to Use:</strong> A simple interface to control who
              sees your location and how much they see.
            </span>
          </li>
        </ul>
      </div>

      {/* Additional Section */}
      <div className="mt-20 px-4 md:px-8 max-w-4xl text-center">
        <h2 className="text-2xl md:text-4xl font-semibold mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-lg md:text-2xl mb-8">
          Join now and connect with your friends like never before.
        </p>
        <a
          href="/signup"
          className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
        >
          Create Your Account
        </a>
      </div>
    </main>
  );
};
