import { useEffect } from "react";
import Phaser from "phaser";
import SoundCatcherGame from "../games/SoundCatcher/SoundCatcherGame";

const GameScreen = () => {
    useEffect(() => {
        const game = new Phaser.Game({
            type: Phaser.AUTO,
            width: 800,
            height: 500,
            parent: "game-container",
            scene: SoundCatcherGame,
        });

        return () => game.destroy(true);
    }, []);

    return <div id="game-container"></div>;
};

export default GameScreen;
