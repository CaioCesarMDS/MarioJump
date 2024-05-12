function main(get) {
    const mainMenu = document.querySelector(".main-menu");

    const mario = document.querySelector(".mario");
    const pipe = document.querySelector(".pipe");
    const clouds = document.querySelector(".clouds");
    const ground = document.querySelector(".ground");

    const gamerOverEl = document.querySelector(".game-over");
    const pause = document.querySelector(".pause");

    const bestScoreEl = document.querySelector(".best-score");
    const scoreEl = document.getElementById("score");
    const timeEl = document.getElementById("time");

    const music = document.getElementById("background-music");
    const audioJump = document.getElementById("audio-jump");
    const gameOverAudio = document.getElementById("game-over-audio");
    const punctuationMarkAudio = document.getElementById("punctuation-mark-audio");

    let scoreRecord = 0;
    let bestScore = 0;

    let gameOverFlag = false;

    let scoreCount;
    let timeCount;
    let score = 0;
    let time = 0;

    gameSetup();

    function gameSetup() {
        mario.src = "/src/images/mario.png";
        mario.style.width = "190px";
        mario.style.animationPlayState = "paused";

        pipe.style.animationPlayState = "paused";
        clouds.style.animationPlayState = "paused";
        ground.style.animationPlayState = "paused";
        volumeAdjustment();

        function volumeAdjustment() {
            music.volume = 0.4;
            audioJump.volume = 0.7;
            gameOverAudio.volume = 0.6;
        }
    }

    setTimeout(() => {
        startGame();
    }, 3000);

    function startGame() {
        mario.src = "/src/images/mario.gif";
        mario.style.width = "150px";
        mario.style.animationPlayState = "running";

        pipe.style.animationPlayState = "running";
        clouds.style.animationPlayState = "running";
        ground.style.animationPlayState = "running";

        pipe.style.animation = "walkPipe 2s infinite linear";

        startCount();

        if (get) {
            getSavedScore();
        }

        function jump(event) {
            if (event.keyCode === 32 && mainMenu.style.display === "none") {
                mario.classList.add("jump");
                audioJump.play();
                setTimeout(() => {
                    mario.classList.remove("jump");
                }, 500);
            }
        }
        // loop to test if mario hit the pipe
        // if the position of the pipe is too far to the left or Mario was unable to jump (game over)
        const loop = setInterval(() => {
            const pipePosition = pipe.offsetLeft;
            const marioPosition = +window
                .getComputedStyle(mario)
                .bottom.replace("px", "");
            if (
                !gameOverFlag &&
                pipePosition <= 120 &&
                pipePosition > 0 &&
                marioPosition < 160
            ) {
                gameOverFlag = true;
                gameOver(pipePosition, marioPosition);
            }
        }, 10);

        function startCount() {
            scoreCount = setInterval(() => {
                score += 1;
                scoreEl.textContent = `0${score}`;
                if (score % 500 === 0) {
                    punctuationMarkAudio.play();
                }
            }, 100);

            timeCount = setInterval(() => {
                time += 1;
                timeEl.textContent = `0${time}`;
            }, 1000);
        }

        function stopCount() {
            clearInterval(scoreCount);
            clearInterval(timeCount);
        }

        function resetCount() {
            clearInterval(scoreCount);
            clearInterval(timeCount);
            score = 0;
            time = 0;
        }

        document.addEventListener("keydown", jump);
        document.addEventListener("keydown", pauseGame);

        function pauseGame(event) {
            if (event.keyCode === 27 && gamerOverEl.style.display !== "flex") {
                stopCount();

                pause.style.display = "flex";

                mario.src = "/src/images/mario.png";
                mario.style.width = "190px";
                mario.style.animationPlayState = "paused";

                pipe.style.animationPlayState = "paused";
                clouds.style.animationPlayState = "paused";
                ground.style.animationPlayState = "paused";

                document.addEventListener("keydown", resumeGame);
            }
        }

        function resumeGame(event) {
            if (event.keyCode === 27 && pause.style.display === "flex") {
                document.removeEventListener("keydown", resumeGame);

                pause.style.display = "none";

                mario.src = "/src/images/mario.gif";
                mario.style.width = "150px";
                mario.style.animationPlayState = "running";

                pipe.style.animationPlayState = "running";
                clouds.style.animationPlayState = "running";
                ground.style.animationPlayState = "running";

                pipe.style.animation = "walkPipe 2s infinite linear";
                startCount();
            }
        }

        function gameOver(pipePosition, marioPosition) {
            saveScoreRecord();
            resetCount();

            music.pause();
            gameOverAudio.play();

            pipe.style.animation = "none";
            pipe.style.left = `${pipePosition}px`;

            mario.classList.remove("jump");
            mario.style.bottom = `${marioPosition}px`;
            mario.style.animationPlayState = "paused";

            mario.src = "/src/images/game-over.png";
            mario.style.width = "70px";
            mario.style.marginLeft = "50px";

            ground.style.animationPlayState = "paused";

            bestScoreEl.style.display = "flex";
            bestScoreEl.textContent = `BEST SCORE: ${bestScore}`;

            gamerOverEl.style.display = "flex";

            document.addEventListener("keydown", restartGame);
        }

        function restartGame(event) {
            gameOverAudio.load();
            if (gameOverFlag && event.keyCode === 32) {
                music.play();
                mario.src = "/src/images/mario.gif";
                mario.style.width = "150px";
                mario.style.marginLeft = "0";
                mario.style.bottom = "8.5vh";
                mario.classList.add("jump");
                mario.style.animationPlayState = "running";

                pipe.style.animation = "walkPipe 2s infinite linear";
                pipe.style.left = null;

                gamerOverEl.style.display = "none";
                gameOverFlag = false;

                ground.style.animationPlayState = "running";

                scoreEl.textContent = `000`;
                timeEl.textContent = `00`;
                startCount();
            }
        }

        function scoreIsHigher(score) {
            return score > bestScore;
        }

        function saveScoreRecord(bestScoreEver) {
            let scoreJson = "";
            bestScoreEver > 0
                ? (scoreRecord = bestScoreEver)
                : (scoreRecord = Number(scoreEl.textContent));
            if (scoreIsHigher(scoreRecord)) {
                bestScore = scoreRecord;
                scoreJson = JSON.stringify(bestScore);
                localStorage.setItem("score", scoreJson);
            }
        }

        function getSavedScore() {
            const score = localStorage.getItem("score");
            const scoreParsed = JSON.parse(score);

            bestScoreEl.style.display = "flex";
            bestScoreEl.textContent = `BEST SCORE: ${scoreParsed}`;
            saveScoreRecord(scoreParsed);
        }
    }
}

document.addEventListener("click", (e) => {
    const target = e.target.parentElement;
    const mainMenu = document.querySelector(".main-menu");
    const newGameBtn = document.querySelector(".new-game");
    const loadScoreBtn = document.querySelector(".load-score");
    const returnMenu = document.querySelector(".return-menu-btn");
    const timer = document.querySelector(".timer");
    const music = document.getElementById("background-music");
    const audio = document.getElementById("audio-on-off");

    let count = 0;

    if (target === audio) {
        if (audio.children[0].src === "/src/images/audio-off.svg") {
            audio.children[0].src = "/src/images/audio-on.svg";
            music.muted = false;
            music.volume = 0.8;
            music.play();
        } else {
            audio.children[0].src = "/src/images/audio-off.svg";
            music.pause();
        }
    }

    if (target === newGameBtn) {
        mainMenu.style.display = "none";
        timer.style.display = "flex";
        const stopWatch = setInterval(() => {
            count++;
            if (count <= 3) {
                timer.textContent = count;
            }
            if (count === 4) {
                clearInterval(stopWatch);
                timer.style.display = "none";
            }
        }, 1000);
        main(false);
    }

    if (target === loadScoreBtn) {
        mainMenu.style.display = "none";
        timer.style.display = "flex";
        const stopWatch = setInterval(() => {
            count++;
            if (count <= 3) {
                timer.textContent = count;
            }
            if (count === 4) {
                clearInterval(stopWatch);
                timer.style.display = "none";
            }
        }, 1000);
        main(true);
    }

    if (target === returnMenu) {
        mainMenu.style.display = "flex";
        music.play();
    }
});
