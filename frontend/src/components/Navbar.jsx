import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
const Navbar = () => {
   const navigate = useNavigate(); 
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 
                    bg-green-900/20 backdrop-blur-md border-b border-white/10">
      
      {/* Logo Area */}
      <div className="text-2xl font-black text-white tracking-tighter">
        <Link to="/">MINDBLOOM</Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-8">
        <Link to="/" className="text-white font-bold hover:text-green-300 transition-colors">
          Home
        </Link>
        <Link to="/about" className="text-white font-bold hover:text-green-300 transition-colors">
          About
        </Link>
        
        {/* Login Button */}
        <motion.button
  onClick={() => {
    console.log("Login button clicked!");
    navigate("/login");
  }}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="cursor-target px-12 py-4 rounded-full bg-[#22442E]/80 backdrop-blur-md text-white font-black text-lg shadow-xl hover:bg-[#22442E]/90 transition"
>
  Login
</motion.button>
      </div>
    </nav>
  );
};

export default Navbar;