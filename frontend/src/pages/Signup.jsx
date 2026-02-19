import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase/config";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { supabase } from "../services/supabaseClient";
import TargetCursor from "../components/TargetCursor";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ EMAIL SIGNUP
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = result.user;

      const { error: insertError } = await supabase
        .from("parents")
        .insert([
          {
            firebase_uid: user.uid,
            email: user.email,
            name: name
          }
        ])
        .select();

      if (insertError) {
        console.error(insertError);
        setError("Failed to save user data.");
        return;
      }

      navigate("/games");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ GOOGLE SIGNUP
  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if already exists
      const { data } = await supabase
        .from("parents")
        .select("id")
        .eq("firebase_uid", user.uid)
        .maybeSingle();

      if (!data) {
        const { error: insertError } = await supabase
          .from("parents")
          .insert([
            {
              firebase_uid: user.uid,
              email: user.email,
              name: user.displayName || ""
            }
          ])
          .select();

        if (insertError) {
          console.error(insertError);
          setError("Failed to create account.");
          return;
        }
      }

      navigate("/games");
    } catch (err) {
      console.error(err);
      setError("Google signup failed.");
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
      <TargetCursor spinDuration={2} hideDefaultCursor={true} parallaxOn={true} />
      <Navbar />

      <div className="min-h-screen flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="flex flex-col md:flex-row h-full md:h-[600px]">

            {/* LEFT IMAGE */}
            <div className="w-full md:w-2/5 relative overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('./login-forest.png')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
              </div>

              <div className="relative h-full flex items-end p-6">
                <div className="text-white">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl">🌱</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="w-full md:w-3/5 p-8 md:p-16 flex flex-col justify-center">

              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-black text-[#22442E] mb-2">
                  Create Account
                </h1>
                <p className="text-gray-600 text-lg">
                  Start your MindBloom journey 🌿
                </p>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleEmailSignup} className="space-y-6">

                <div>
                  <label className="block text-sm font-bold text-[#22442E] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#D8CFC4] focus:border-[#22442E] focus:outline-none"
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#22442E] mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#D8CFC4] focus:border-[#22442E] focus:outline-none"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#22442E] mb-2">
                    Confirm Password
                  </label>
          
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  disabled={loading}
                  className="w-full px-8 py-4 rounded-xl bg-[#22442E] text-white font-black text-lg shadow-lg hover:bg-[#1a3322] disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Sign Up"}
                </motion.button>

                {/* Divider */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#D8CFC4]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Or sign up with
                    </span>
                  </div>
                </div>

                {/* Social */}
                <div className="w-full flex flex-col gap-4">
                  <button
                    type="button"
                    onClick={handleGoogleSignup}
                    className="px-4 py-3 rounded-xl border-2 border-[#D8CFC4] font-bold hover:border-[#22442E]"
                    disabled={loading}
                  >
                    SignUp with Google
                  </button>

                </div>

                <p className="text-center text-gray-600 mt-6 text-sm">
                  Already have an account?{" "}
                  <span
                    onClick={() => navigate("/login")}
                    className="text-[#22442E] font-bold cursor-pointer hover:underline"
                  >
                    Sign In
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
