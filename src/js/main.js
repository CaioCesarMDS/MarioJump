import { Game } from "./game.js";

document.addEventListener("DOMContentLoaded", () => {
    let musicOn = false;

    const mainMenu = document.querySelector(".main-menu");
    const audioImg = document.getElementById("audio-on-off");
    const music = document.getElementById("background-music");
    const newGameBtn = document.querySelector(".new-game");
    const loadScoreBtn = document.querySelector(".load-score");
    const returnMenu = document.querySelector(".return-menu-btn");

    // Turn music on or off
    audioImg.addEventListener("click", () => {
        if (musicOn) {
            audioImg.src = "./src/images/audio-off.svg";
            music.pause();
            musicOn = false;
        } else {
            audioImg.src = "./src/images/audio-on.svg";
            music.muted = false;
            music.volume = 0.1;
            music.play();
            musicOn = true;
        }
    });

    // Start a new game
    newGameBtn.addEventListener("click", () => {
        mainMenu.style.display = "none";
        const game = new Game(false, musicOn);
        game.start();
    });

    // Start a game showing the last record
    loadScoreBtn.addEventListener("click", () => {
        mainMenu.style.display = "none";
        const game = new Game(true, musicOn);
        game.start();
    });

    // Return to menu
    returnMenu.addEventListener("click", () => {
        mainMenu.style.display = "flex";
        if (musicOn) music.play();
    });
});


