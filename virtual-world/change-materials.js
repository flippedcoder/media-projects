AFRAME.registerComponent("change-materials", {
  init: () => {
    const woodBox = document.querySelector("#woodBox");
    const metalBox = document.querySelector("#metalBox");
    const robotBody = document.querySelectorAll(".robot");

    woodBox.addEventListener("click", () => {
      robotBody.forEach((part) => {
        part.setAttribute("src", "#woodTexture");
      });
    });

    metalBox.addEventListener("click", () => {
      robotBody.forEach((part) => {
        part.setAttribute("src", "#metalTexture");
      });
    });
  },
});
