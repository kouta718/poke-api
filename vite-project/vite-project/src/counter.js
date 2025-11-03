(() => {
  const counters = document.querySelectorAll(".counter");

  counters.forEach(counter => {
    const input = counter.querySelector("input");
    const buttons = counter.querySelectorAll("button");

    buttons.forEach(button => {
      button.addEventListener("click", () => {
        switch (button.textContent) {
          case "max":
            input.value = 252;
            break;
          case "min":
            input.value = 0;
            break;
        }
      });
    });
  });
})();
