function main() {
    const mario = document.querySelector(".mario");
    const pipe = document.querySelector(".pipe");
    const finalGameOver = document.querySelector(".game-over");
    let gameOverFlag = false;

    document.addEventListener("keydown", jump);

    function jump(event) {
        if (event.key === " ") {
            mario.classList.add("jump");
            setTimeout(() => {
                mario.classList.remove("jump");
            }, 500);
        }
    }

    const loop = setInterval(() => {
        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace("px", "");
        if (
            !gameOverFlag &&
            pipePosition <= 120 &&
            pipePosition > 0 &&
            marioPosition < 99
        ) {
            gameOverFlag = true;
            gameOver(pipePosition, marioPosition);
        }
    }, 10);

    function gameOver(pipePosition, marioPosition) {
        pipe.style.animation = "none";
        pipe.style.left = `${pipePosition}px`;

        mario.classList.remove("jump");
        mario.style.bottom = `${marioPosition}px`;

        mario.src = "/src/images/game-over.png";
        mario.style.width = "70px";
        mario.style.marginLeft = "50px";

        finalGameOver.style.display = "flex";

        setTimeout(() => {
            document.addEventListener("keydown", restartGameListener);
        }, 3000);
    }

    function restartGameListener(event) {
        if (gameOverFlag && event.key === " ") {
            document.removeEventListener("keydown", restartGameListener);
            restartGame();
        }
    }

    function restartGame() {
        console.log("ola");
        mario.src = "/src/images/mario.gif";
        mario.style.width = "150px";
        mario.style.marginLeft = "0";
        mario.style.bottom = "0";
        mario.classList.add("jump");

        pipe.style.animation = "walkPipe 2s infinite linear";
        pipe.style.left = null;

        finalGameOver.style.display = "none";
        gameOverFlag = false;
    }
}

main();
