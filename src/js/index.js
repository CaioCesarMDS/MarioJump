const mario = document.querySelector(".mario");
const pipe = document.querySelector(".pipe");
const gameOverImg = document.querySelector(".game-over");
const p = document.querySelector("p");

document.addEventListener("keydown", (event) => {
    if (event.key === " ") {
        console.log("hello")
        mario.classList.add("jump");
        setTimeout(() => {
            mario.classList.remove("jump");
        }, 500);
    }
});

const loop = setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace("px", "");
    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 99) {

        pipe.style.animation = "none";
        pipe.style.left = `${pipePosition}px`;

        mario.style.animation = "none";
        mario.style.bottom = `${marioPosition}px`;

        mario.src = "/src/images/game-over.png";
        mario.style.width = "70px";
        mario.style.marginLeft = "50px";

        gameOverImg.style.display = "block";
        p.style.display = "block";

        setTimeout(() => {
            document.addEventListener("keydown", restartGame);
        }, 2000);
    }
}, 10);

function restartGame() {
    mario.src = "/src/images/mario.gif";
    mario.style.width = "150px";
    mario.style.marginLeft = "0";
    mario.style.bottom = "0";
    
    pipe.style.animation = "walkPipe 2s infinite linear";
    pipe.style.left = null;
    
    gameOverImg.style.display = "none";
    p.style.display = "none";
    mario.style.animation = "marioJump .5s ease-out";
}

