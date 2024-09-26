export class Mario {
    constructor() {
        this.mario = document.querySelector(".mario");
        this.jumpAudio = document.getElementById("jump-audio");
        this.isJumpingFlag = false;

        // Binds the jump method in the Mario class
        this.jump = this.jump.bind(this);
    }

    setup() {
        // Mario starts in idle position
        this.mario.src = "/src/images/mario.webp";
        this.mario.style.width = "190px";
        this.mario.style.bottom = "8.5vh";
        this.isJumpingFlag = false;

        document.removeEventListener("keydown", this.jump);
    }

    run() {
        // Start running animation
        this.mario.src = "/src/images/mario.gif";
        this.mario.style.width = "150px";

        document.addEventListener("keydown", this.jump);
    }

    getPosition() {
        // Get Mario's distance from the ground
        return +window.getComputedStyle(this.mario).bottom.replace("px", "");
    }

    jump(event) {
        if (event.code === "Space" && !this.isJumpingFlag) {
            this.isJumpingFlag = true;
            this.mario.classList.add("jump");
            this.jumpAudio.play();

            setTimeout(() => {
                this.mario.classList.remove("jump");
                this.isJumpingFlag = false;
            }, 530);
        }
    }

    gameOver(marioPosition) {
        this.mario.src = "/src/images/game-over-mario.webp";
        this.mario.style.width = "70px";
        this.mario.style.marginLeft = "50px";
        this.mario.style.bottom = `${marioPosition}px`;

        document.removeEventListener("keydown", this.jump);
    }
}
