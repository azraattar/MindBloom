import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/Button";

const Landing = () => {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div className="text-center mt-16">
                <h1 className="text-4xl font-bold mb-4">🧠 MindBloom</h1>
                <p className="mb-6">Learn through fun and adaptive games</p>

                <Button text="Start Playing" onClick={() => navigate("/games")} />
            </div>
        </>
    );
};

export default Landing;
