const inputRef = document.querySelector(".input");
const btnRef = document.querySelector(".button");
const textRef = document.querySelector(".text");

let normalizedText = "";
let draggingLetter = null;

inputRef.addEventListener("change", (e) => {
  const text = e.target.value;
  console.log(text);
  const array = text.trim().split("");
  for (let i = 0; i < array.length; i += 1) {
    normalizedText += `<span class="letter letter-${array[i]}-${i}">${array[i]}</span>`;
  }
});

btnRef.addEventListener("click", () => {
  inputRef.value = "";
  textRef.innerHTML = normalizedText;
  normalizedText = "";
});

textRef.addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("text")) return; // если кликнули не по букве, прекращаем обработку
  const letter = e.target;

  letter.style.position = "absolute";
  letter.style.zIndex = 1000;

  moveAt(e.pageX, e.pageY);

  function moveAt(pageX, pageY) {
    letter.style.left = pageX - letter.offsetWidth / 2 + "px";
    letter.style.top = pageY - letter.offsetHeight / 2 + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  document.addEventListener("mousemove", onMouseMove);

  letter.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", onMouseMove);
  });

  letter.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", onMouseMove);

    // Отримуємо всі літери
    const letters = document.querySelectorAll(".letter");

    // Перевіряємо чи є букви в тому місці де тягнемо
    const overlappingLetter = Array.from(letters).find((otherLetter) => {
      if (otherLetter === letter) return false;
      const rect1 = letter.getBoundingClientRect();
      const rect2 = otherLetter.getBoundingClientRect();
      return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
      );
    });

    // Якщо є буква на місці де тягнемо, то вертаємо її на місце, де була
    if (overlappingLetter) {
      letter.style.position = "";
      letter.style.left = "";
      letter.style.top = "";
    }
  });

  letter.addEventListener("dragstart", () => {
    return false;
  });
});
