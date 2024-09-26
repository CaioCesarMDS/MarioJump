export class Clouds {
    constructor() {
      // Clouds element
      this.clouds = document.querySelector(".clouds");
    }

    setup() {
      // Start the game with clouds standing still
      this.clouds.style.animationPlayState = "paused";
    }

    run() {
      // Start the running animation
      this.clouds.style.animationPlayState = "running";
    }
  }
