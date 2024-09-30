import { Clouds } from "./clouds.js";
import { Ground } from "./ground.js";
import { Mario } from "./mario.js";
import { Pipe } from "./pipe.js";

export class Game {
    constructor(getScore, musicOn) {
        Game.instance = this;

        // Game menu
        this.mainMenu = document.querySelector(".main-menu");

        //Game music and sound effects
        this.music = document.getElementById("background-music");
        this.audioJump = document.getElementById("audio-jump");
        this.gameOverAudio = document.getElementById("game-over-audio");
        this.punctuationMarkAudio = document.getElementById("punctuation-mark-audio");

        // Elements that appear on the screen
        this.gamerOverElement = document.querySelector(".game-board-game-over");
        this.pauseElement = document.querySelector(".game-board-pause");
        this.timerElement = document.querySelector(".game-board-timer");
        this.timeElement = document.getElementById("time");
        this.scoreElement = document.getElementById("score");
        this.bestScoreElement = document.querySelector(".best-score");

        // Points and time counter
        this.time = 0;
        this.score = 0;
        this.bestScore = 0;
        this.scoreRecord = 0;

        // Flags
        this.gameOverFlag = false;
        this.isPausedFlag = false;
        this.musicOn = musicOn;
        this.getScore = getScore;

        // Creating new objects
        this.mario = new Mario();
        this.pipe = new Pipe();
        this.clouds = new Clouds();
        this.ground = new Ground();

        this.restartListener;
        this.handlePause = this.handlePause.bind(this);
        this.handleResume = this.handleResume.bind(this);
    }

    static getInstance(getScore, musicOn) {
        if (!Game.instance) {
            Game.instance = new Game(getScore, musicOn);
        }
        return Game.instance;
    }

    static resetInstance() {
        Game.instance = null;
    }

    start() {
        this.setup();

        let count = 3;
        this.timerElement.style.display = "flex";

        const stopWatch = setInterval(() => {
            count--;
            if (count <= 0) {
                this.timerElement.style.display = "none";
                clearInterval(stopWatch);
                this.run();
            }
            this.timerElement.textContent = count;
        }, 1000);

        count = 3;
    }

    setup() {
        this.removeEventListeners();

        this.gamerOverElement.style.display = "none";
        this.pauseElement.style.display = "none";
        this.bestScoreElement.style.display = "none";
        this.timerElement.textContent = 3;

        this.stopCount();
        this.resetCount();

        this.mario.setup();
        this.pipe.setup();
        this.clouds.setup();
        this.ground.setup();

        this.gameOverFlag = false;
        this.isPausedFlag = false;
    }

    run() {
        this.mario.run();
        this.pipe.run();
        this.clouds.run();
        this.ground.run();

        this.startCount();

        if (this.getScore) this.getSavedScore();

        this.checkCollision();
        document.addEventListener("keydown", this.handlePause);
    }

    startCount() {
        this.scoreCount = setInterval(() => {
            this.score++;
            this.scoreElement.textContent = `0${this.score}`;
            if (this.score % 500 === 0) {
                this.punctuationMarkAudio.play();
            }
        }, 100);

        this.timeCount = setInterval(() => {
            this.time++;
            this.timeElement.textContent = `0${this.time}`;
        }, 1000);
    }

    stopCount() {
        clearInterval(this.scoreCount);
        clearInterval(this.timeCount);
    }

    resetCount() {
        this.scoreElement.textContent = `000`;
        this.timeElement.textContent = `000`;
        this.score = 0;
        this.time = 0;
    }

    resumeGame() {
        document.addEventListener("keydown", this.handlePause);

        this.mario.run();
        this.pipe.run();
        this.clouds.run();
        this.ground.run();
    }

    removeEventListeners() {
        if (this.restartListener) {
            document.removeEventListener("keydown", this.restartListener);
        }
        document.removeEventListener("keydown", this.handlePause);
        document.removeEventListener("keydown", this.handleResume);
    }

    checkCollision() {
        const loop = setInterval(() => {
            const pipePosition = this.pipe.getPosition();
            const marioPosition = this.mario.getPosition();

            if (
                !this.gameOverFlag &&
                pipePosition <= 120 &&
                pipePosition > 0 &&
                marioPosition < 160
            ) {
                this.gameOverFlag = true;
                this.removeEventListeners();
                if (!this.isPausedFlag) this.gameOver(marioPosition);
                clearInterval(loop);
            }
        }, 10);
    }

    gameOver(marioPosition) {
        this.saveScoreRecord();
        this.stopCount();

        if (this.musicOn) this.music.pause();
        this.gameOverAudio.play();

        this.pipe.stop();
        this.mario.gameOver(marioPosition);
        this.ground.setup();

        this.gamerOverElement.style.display = "flex";

        let canRestart = false;

        this.restartListener = (event) => {
            if (canRestart && event.code === "Space") {
                this.restartGame(event);
            }
        };

        document.addEventListener("keydown", this.restartListener);

        setTimeout(() => {
            canRestart = true;
        }, 3000);
    }

    restartGame(event) {
        if (this.gameOverFlag && event.code === "Space") {
            this.removeEventListeners();

            if (this.musicOn) this.music.play();

            this.resetCount();

            this.gameOverFlag = false;
            this.gamerOverElement.style.display = "none";

            this.start();
        }
    }

    handlePause(event) {
        if (event.code === "Escape" && !this.gameOverFlag && !this.isPausedFlag) {
            this.isPausedFlag = true;
            this.stopCount();

            this.pipe.stop();
            this.mario.setup();
            this.clouds.setup();
            this.ground.setup();

            document.removeEventListener("keydown", this.handlePause);
            document.addEventListener("keydown", this.handleResume);

            this.pauseElement.style.display = "flex";
        }
    }

    handleResume(event) {
        if (event.code === "Escape" && this.isPausedFlag) {
            this.isPausedFlag = false;
            this.pauseElement.style.display = "none";

            document.removeEventListener("keydown", this.handleResume);

            this.resumeGame();
            this.startCount();
        }
    }

    scoreIsHigher(score) {
        return score > this.bestScore;
    }

    saveScoreRecord(bestScoreEver) {
        let scoreJson = "";
        bestScoreEver > 0
            ? (this.scoreRecord = bestScoreEver)
            : (this.scoreRecord = Number(this.scoreElement.textContent));
        if (this.scoreIsHigher(this.scoreRecord)) {
            this.bestScore = this.scoreRecord;
            scoreJson = JSON.stringify(this.bestScore);
            localStorage.setItem("score", scoreJson);
        }
    }

    getSavedScore() {
        const score = localStorage.getItem("score");
        const scoreParsed = score ? JSON.parse(score) : 0;

        if (scoreParsed != 0) {
            this.bestScoreElement.style.display = "flex";
            this.bestScoreElement.textContent = `BEST SCORE: ${scoreParsed}`;
            this.saveScoreRecord(scoreParsed);
        }
    }
}
