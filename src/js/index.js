function main() {
    const mario = document.querySelector(".mario");
    const pipe = document.querySelector(".pipe");
    const clouds = document.querySelector(".clouds");
    const ground = document.querySelector(".ground");
    const finalGameOver = document.querySelector(".game-over");
    const pause = document.querySelector(".pause");
    const scoreEl = document.getElementById("score");
    const timeEl = document.getElementById("time");

    let gameOverFlag = false;

    let scoreCount;
    let timeCount;
    let score = 0;
    let time = 0;

    startCount();

    function jump(event) {
        if (event.keyCode === 32) {
            mario.classList.add("jump");
            setTimeout(() => {
                mario.classList.remove("jump");
            }, 500);
        }
    }
    // loop to test if mario hit the pipe
    // if the position of the pipe is too far to the left or Mario was unable to jump (game over)
    const loop = setInterval(() => {
        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace("px", "");
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
        if (event.keyCode === 27 && finalGameOver.style.display !== "flex") {
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
        resetCount();
        pipe.style.animation = "none";
        pipe.style.left = `${pipePosition}px`;

        mario.classList.remove("jump");
        mario.style.bottom = `${marioPosition}px`;
        mario.style.animationPlayState = "paused";

        mario.src = "/src/images/game-over.png";
        mario.style.width = "70px";
        mario.style.marginLeft = "50px";

        ground.style.animationPlayState = "paused";

        finalGameOver.style.display = "flex";

        document.addEventListener("keydown", restartGameListener);
    }

    function restartGameListener(event) {
        if (gameOverFlag && event.keyCode === 32) {
            document.removeEventListener("keydown", restartGameListener);
            restartGame();
        }
    }

    function restartGame() {
        mario.src = "/src/images/mario.gif";
        mario.style.width = "150px";
        mario.style.marginLeft = "0";
        mario.style.bottom = "8.5vh";
        mario.classList.add("jump");
        mario.style.animationPlayState = "running";

        pipe.style.animation = "walkPipe 2s infinite linear";
        pipe.style.left = null;

        finalGameOver.style.display = "none";
        gameOverFlag = false;

        ground.style.animationPlayState = "running";

        scoreEl.textContent = `000`;
        timeEl.textContent = `00`;
        startCount();
    }
}

main();
