import Phaser from "phaser";

export default class SoundCatcherGame extends Phaser.Scene {
    constructor() {
        super("SoundCatcher");
    }

    create() {
        this.add.text(200, 50, "Tap words with 'sh' sound", {
            fontSize: "24px",
            fill: "#000",
        });

        const words = ["ship", "cat", "fish"];
        words.forEach((word, i) => {
            const text = this.add.text(200, 150 + i * 50, word, {
                fontSize: "20px",
                backgroundColor: "#eee",
                padding: 10,
            });

            text.setInteractive();
            text.on("pointerdown", () => {
                console.log("Clicked:", word);
            });
        });
    }
}
