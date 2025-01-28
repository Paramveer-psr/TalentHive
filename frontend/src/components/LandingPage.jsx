import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  SparklesIcon,
  BriefcaseIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary/5">
      {/* Animated Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-24 text-center"
      >
        <div className="max-w-4xl mx-auto px-4">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            whileHover={{ scale: 1.02 }}
          >
            Your Next Career Leap Starts Here
          </motion.h1>
          <p className="text-xl text-gray-600 mb-12">
            AI-powered job matching that understands your potential
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="bg-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30"
            >
              Get Started Free
            </Link>
            <button className="px-8 py-4 border-2 border-primary text-primary rounded-xl hover:bg-primary/5 transition-all">
              How It Works
            </button>
          </div>
        </div>
      </motion.section>

      {/* Feature Grid with Icons */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-16">Why AI Jobs?</h2>
        <div className="grid md:grid-cols-3 gap-12">
          <FeatureCard
            icon={<SparklesIcon className="h-12 w-12" />}
            title="Smart Matching"
            text="Our AI analyzes 50+ factors to find your perfect role"
          />
          <FeatureCard
            icon={<BriefcaseIcon className="h-12 w-12" />}
            title="Real Companies"
            text="Connect with verified employers actively hiring"
          />
          <FeatureCard
            icon={<ChartBarIcon className="h-12 w-12" />}
            title="Career Growth"
            text="Get skill recommendations to boost your profile"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, text }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
  >
    <div className="text-primary mb-4">{icon}</div>
    <h3 className="text-2xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-600">{text}</p>
  </motion.div>
);

export default LandingPage;
