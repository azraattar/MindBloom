import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";

const games = [
    {
        id: 1,
        title: "Sound Catcher",
        emoji: "🔊",
        description: "Catch words with the right sound",
    },
    {
        id: 2,
        title: "Letter Detective",
        emoji: "🔎",
        description: "Find the correct letters",
    },
    {
        id: 3,
        title: "Word Builder",
        emoji: "🧩",
        description: "Build words using letters",
    },
];

const GameSelect = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-yellow-100 p-6">
            <h1 className="text-4xl font-bold text-center mb-8">
                🎮 Choose a Game
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {games.map((game) => (
                    <Card key={game.id}>
                        <div className="text-center">
                            <div className="text-6xl mb-4">{game.emoji}</div>
                            <h2 className="text-2xl font-semibold mb-2">
                                {game.title}
                            </h2>
                            <p className="text-gray-600 mb-4">
                                {game.description}
                            </p>
                            <Button
                                text="Play"
                                onClick={() =>
                                    navigate("/play", { state: { gameId: game.id } })
                                }
                            />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default GameSelect;
