import { Game } from "./game.js";

class Main {
    constructor() {
        this.mainMenu = document.querySelector(".main-menu");

        this.audioImg = document.getElementById("audio-on-off");
        this.music = document.getElementById("background-music");
        this.newGameBtn = document.querySelector(".new-game");
        this.loadScoreBtn = document.querySelector(".load-score");
        this.returnMenu = document.querySelector(".game-over-return-btn");

        this.musicOn = false;

        this.initEvents();
    }

    initEvents() {
        this.audioImg.addEventListener("click", () => this.toggleMusic());
        this.newGameBtn.addEventListener("click", () => this.starGame(false));
        this.loadScoreBtn.addEventListener("click", () => this.starGame(true));
        this.returnMenu.addEventListener("click", () => this.returnToMenu());
    }

    // Turn music on or off
    toggleMusic() {
        if (this.musicOn) {
            this.audioImg.src = "./src/images/audio-off.svg";
            this.music.pause();
            this.musicOn = false;
        } else {
            this.audioImg.src = "./src/images/audio-on.svg";
            this.music.muted = false;
            this.music.volume = 0.1;
            this.music.play();
            this.musicOn = true;
        }
    }

    starGame(getScore) {
        this.mainMenu.style.display = "none";
        const game = Game.getInstance(getScore, this.musicOn);
        game.start();
    }

    returnToMenu() {
        const game = Game.getInstance();
        game.setup();

        Game.resetInstance();

        this.mainMenu.style.display = "flex";

        if (this.musicOn) this.music.play();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Main();
});
