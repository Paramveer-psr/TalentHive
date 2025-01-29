import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="landing-page-title">
          Your Next Career Leap Starts Here
        </h1>
        <p className="landing-page-description">
          AI-powered job matching that understands your potential
        </p>
        <div>
          <Link to="/register" className="landing-page-button">
            Get Started Free
          </Link>
          <Link to="/how-it-works" className="landing-page-button">
            How It Works
          </Link>
        </div>
      </section>

      {/* Feature Section */}
      <section className="feature-section">
        <h2 className="text-3xl font-bold mb-8">Why Choose Us?</h2>
        <div className="flex flex-wrap justify-center">
          <div className="feature-card">
            <h3 className="feature-title">Smart Matching</h3>
            <p className="feature-description">
              Our AI analyzes 50+ factors to find your perfect role.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Real Companies</h3>
            <p className="feature-description">
              Connect with verified employers actively hiring.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Career Growth</h3>
            <p className="feature-description">
              Get skill recommendations to boost your profile.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonial-section">
        <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
        <div className="flex flex-wrap justify-center">
          <div className="testimonial-card">
            <p className="testimonial">"This platform changed my career for the better!"</p>
            <p className="testimonial-author">- Alex J.</p>
          </div>
          <div className="testimonial-card">
            <p className="testimonial">"I found my dream job within weeks!"</p>
            <p className="testimonial-author">- Sarah K.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="call-to-action">
        <h2 className="text-3xl font-bold mb-4">Ready to take the next step?</h2>
        <Link to="/register" className="landing-page-button">
          Join Us Today
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
