import React, { useState, useRef, useCallback } from "react";
import Image from "../assets/image.png";
import Logo from "../assets/logo.png";
import GoogleSvg from "../assets/icons8-google.svg";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  // Parallax state
  const imageRef = useRef(null);
  const rafRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  // Smooth animation loop
  const animate = useCallback(() => {
    const lerp = (a, b, t) => a + (b - a) * t;
    currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.08);
    currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.08);

    if (imageRef.current) {
      const { x, y } = currentRef.current;
      imageRef.current.style.transform = `translate(${x}px, ${y}px) rotateX(${-y * 0.04}deg) rotateY(${x * 0.04}deg) scale(1.04)`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // Max offset: ±25px
    targetRef.current.x = ((e.clientX - cx) / rect.width) * 50;
    targetRef.current.y = ((e.clientY - cy) / rect.height) * 50;
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const handleMouseLeave = useCallback(() => {
    // Spring back to center
    targetRef.current = { x: 0, y: 0 };
    // Let the animation loop bring it back, then stop
    setTimeout(() => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (imageRef.current) {
        imageRef.current.style.transform = "translate(0px, 0px) rotateX(0deg) rotateY(0deg) scale(1)";
      }
      currentRef.current = { x: 0, y: 0 };
    }, 800);
  }, []);

  return (
    <div className="login-main">
      {/* Left panel — cursor‑tracking image */}
      <div
        className="login-left"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          ref={imageRef}
          src={Image}
          alt="character"
          className="parallax-img"
        />
      </div>

      {/* Right panel — form */}
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
            <img src={Logo} alt="logo" />
          </div>
          <div className="login-center">
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>
            <form>
              <input type="email" placeholder="Email" />
              <div className="pass-input-div">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                />
                {showPassword ? (
                  <EyeOff onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <Eye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>

              <div className="login-center-options">
                <div className="remember-div">
                  <input type="checkbox" id="remember-checkbox" />
                  <label htmlFor="remember-checkbox">Remember for 30 days</label>
                </div>
                <a href="#" className="forgot-pass-link">
                  Forgot password?
                </a>
              </div>

              <div className="login-center-buttons">
                <button type="button">Log In</button>
                <button type="button">
                  <img src={GoogleSvg} alt="google" />
                  Log In with Google
                </button>
              </div>
            </form>
          </div>

          <p className="login-bottom-p">
            Don't have an account? <a href="#">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;