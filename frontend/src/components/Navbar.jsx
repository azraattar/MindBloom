import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="flex justify-between p-4 bg-blue-500 text-white">
            <h1 className="font-bold">MindBloom</h1>
            <div className="space-x-4">
                <Link to="/">Home</Link>
                <Link to="/games">Play</Link>
                <Link to="/parent-login">Parent</Link>
            </div>
        </nav>
    );
};

export default Navbar;
