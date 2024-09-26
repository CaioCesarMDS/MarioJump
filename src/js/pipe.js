export class Pipe {
    constructor() {
        this.pipe = document.querySelector(".pipe");
        this.pipeInitialPosition = "100%";
    }

    setup() {
        // Define the pipe at the start position and stop animation
        this.pipe.style.left = this.pipeInitialPosition;
        this.pipe.style.animation = "none";
    }

    run() {
        // Start the pipe moving
        this.pipe.style.animation = "pipeMove 2s infinite linear";
        this.pipe.style.animationPlayState = "running";
    }

    stop() {
        // Pause the pipe animation
        this.pipe.style.animationPlayState = "paused";
    }

    getPosition() {
        // Return the pipe's position
        return this.pipe.getBoundingClientRect().left;
    }
}
