export class Ground {
    constructor() {
        this.ground = document.querySelector(".ground");
    }

    setup() {
        // Start the game with the ground standing still
        this.ground.style.animationPlayState = "paused";
    }

    run() {
        // Start the running animation
        this.ground.style.animationPlayState = "running";
    }
}
