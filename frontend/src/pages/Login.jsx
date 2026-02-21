import { useState } from "react";
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase/config";
import { saveSession } from "../services/session";
import {
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth";
import { supabase } from "../services/supabaseClient";
import TargetCursor from "../components/TargetCursor";

import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ EMAIL LOGIN
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = result.user;

      // Verify user exists in Supabase
      const { data, error: fetchError } = await supabase
        .from("parents")
        .select("*")
        .eq("firebase_uid", user.uid)
        .maybeSingle();

      if (fetchError || !data) {
        setError("User not found in database.");
        return;
      }
      // After verifying user exists in Supabase
      saveSession({
        uid: user.uid,
        email: user.email,
        provider: "email",
        parentId: data.id, // Supabase parent id
      });
      console.log("✅ Session saved:", {
        uid: user.uid,
        email: user.email,
        provider: "email",
        parentId: data.id,
      });
      navigate("/add-child");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const { data } = await supabase
        .from("parents")
        .select("*")
        .eq("firebase_uid", user.uid)
        .maybeSingle();

      if (!data) {
        setError("No account found. Please signup first.");
        return;
      }
      saveSession({
        uid: user.uid,
        email: user.email,
        provider: "google",
        parentId: data.id,
      });
      console.log("✅ Session saved:", {
        uid: user.uid,
        email: user.email,
        provider: "google",
        parentId: data.id,
      });
      navigate("/add-child");
    } catch (err) {
      console.error(err);
      setError("Google login failed.");
    } finally {
      setLoading(false);
    }
  };


  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);


  return (
    <div
      ref={containerRef}
      className="cursor-neutral relative min-h-screen font-sans bg-[#C8E6C9] overflow-hidden"
      style={{
        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, #A5D6A7, #C8E6C9 40%, #E8F5E9)`,
      }}
    >
      <TargetCursor
        spinDuration={2}
        hideDefaultCursor={true}
        parallaxOn={true}
      />

      <Navbar />

      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-5xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="flex flex-col md:flex-row min-h-[500px] md:h-[600px]">

            {/* LEFT SIDE - IMAGE (40%) - Hidden on mobile, shown on md+ */}
            <div className="hidden md:block w-full md:w-2/5 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: "url('./login-forest.png')"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
              </div>

              <div className="relative h-full flex items-end p-6">
                <div className="text-white">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl">🌿</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - FORM (60% on desktop, 100% on mobile) */}
            <div className="w-full md:w-3/5 p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-center">

              <div className="mb-6 sm:mb-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#22442E] mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-600 text-base sm:text-lg">
                  Continue your journey with MindBloom
                </p>
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleEmailLogin} className="space-y-4 sm:space-y-6">

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-bold text-[#22442E] mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="
                      w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl
                      border-2 border-[#D8CFC4]
                      focus:border-[#22442E] focus:outline-none
                      transition-colors
                      text-gray-900
                      text-sm sm:text-base
                    "
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-bold text-[#22442E] mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="
                      w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl
                      border-2 border-[#D8CFC4]
                      focus:border-[#22442E] focus:outline-none
                      transition-colors
                      text-gray-900
                      text-sm sm:text-base
                    "
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-[#22442E] focus:ring-[#22442E]"
                      disabled={loading}
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-[#22442E] font-bold hover:underline cursor-target text-left sm:text-right"
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  disabled={loading}
                  className="
                    cursor-target
                    w-full px-6 sm:px-8 py-3 sm:py-4 rounded-xl
                    bg-[#22442E]
                    text-white font-black text-base sm:text-lg
                    shadow-lg
                    hover:bg-[#1a3322]
                    transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {loading ? "Loading..." : "Sign In"}
                </motion.button>

                <div className="relative py-3 sm:py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#D8CFC4]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* SOCIAL LOGIN - REAL AUTH */}
                <div className="w-full flex flex-col gap-3 sm:gap-4">
                  <motion.button
                    type="button"
                    onClick={handleGoogleLogin}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    disabled={loading}
                    className="
                      cursor-target
                      px-4 py-2.5 sm:py-3 rounded-xl
                      border-2 border-[#D8CFC4]
                      font-bold text-gray-700 text-sm sm:text-base
                      hover:border-[#22442E]
                      transition-colors
                      flex items-center justify-center gap-2
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="hidden xs:inline">Login with Google</span>
                    <span className="xs:hidden">Google</span>
                  </motion.button>


                </div>

                <p className="text-center text-gray-600 mt-4 sm:mt-6 text-xs sm:text-sm">
                  Don't have an account?{" "}
                  <span
                    onClick={() => navigate("/signup")}
                    className="text-[#22442E] font-bold cursor-pointer hover:underline"
                  >
                    Sign Up
                  </span>
                </p>

              </form>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};