import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaUserShield, FaHandsHelping } from "react-icons/fa";

export const LandingPage: React.FC = () => {
  return (
    <main className="py-24 flex flex-col items-center w-full justify-center min-h-screen">
      {/* Hero Section */}
      <div className="text-center px-4 md:px-8 py-12">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Where Are My Friends?
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Share your location with friends on your own terms. Control how much
          each friend can see—country, city, or exact spot. Stay connected
          effortlessly.
        </motion.p>
        {/* Call to Action */}
        <motion.a
          href="/signup"
          className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Sign Up Now
        </motion.a>
      </div>

      {/* Features Section */}
      <div className="mt-16 px-4 md:px-8 max-w-4xl">
        <motion.h2
          className="text-2xl md:text-4xl font-semibold mb-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Share Your Location, Your Way
        </motion.h2>
        <ul className="space-y-6 text-left">
          {[
            {
              icon: <FaUserShield className="w-8 h-8" />,
              title: "Privacy Control:",
              description:
                "Decide how precisely each friend can see your location—from country level down to your exact spot.",
            },
            {
              icon: <FaHandsHelping className="w-8 h-8" />,
              title: "Stay Connected:",
              description:
                "See where your friends are and make plans to meet up with ease.",
            },
            {
              icon: <FaMapMarkerAlt className="w-8 h-8" />,
              title: "Easy to Use:",
              description:
                "A simple interface to control who sees your location and how much they see.",
            },
          ].map((feature, index) => (
            <motion.li
              key={index}
              className="flex items-start"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <span className="mr-4 mt-1 text-blue-500">{feature.icon}</span>
              <span>
                <strong>{feature.title}</strong> {feature.description}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Additional Section */}
      <div className="mt-20 px-4 md:px-8 max-w-4xl text-center">
        <motion.h2
          className="text-2xl md:text-4xl font-semibold mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Ready to Get Started?
        </motion.h2>
        <motion.p
          className="text-lg md:text-2xl mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Join now and connect with your friends like never before.
        </motion.p>
        <motion.a
          href="/signup"
          className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Create Your Account
        </motion.a>
      </div>
    </main>
  );
};
