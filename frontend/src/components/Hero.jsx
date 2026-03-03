import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="hero">
      <div className="hero-card">
        <h1>Find the Right Talent. Faster.</h1>
        <p>
          A modern platform where skills meet opportunity.
        </p>

        <div className="hero-buttons">
          <Link to="/login" className="btn primary">Login</Link>
          <Link to="/signup" className="btn secondary">Sign Up</Link>
          <Link to="/jobs" className="btn secondary">View Jobs</Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
