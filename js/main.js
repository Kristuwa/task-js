const inputRef = document.querySelector(".input");
const btnRef = document.querySelector(".button");
const textRef = document.querySelector(".text");

let normalizedText = "";
let draggingLetter = null;
//витягнемо дані з інпуту
inputRef.addEventListener("change", (e) => {
  const text = e.target.value;
  const array = text.trim().split("");
  for (let i = 0; i < array.length; i += 1) {
    normalizedText += `<span class="letter letter-${array[i]}-${i}">${array[i]}</span>`;
  }
});
//при натисканні на кнопку виведемо їх на екран
btnRef.addEventListener("click", () => {
  inputRef.value = "";
  textRef.innerHTML = normalizedText;
  normalizedText = "";
});

textRef.addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("text")) return; // якщо не по букві клік, то виходимо
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

//для варіанту b
// Обработчик события при зажатии кнопки мыши
textRef.addEventListener("mousedown", function (event) {
  // Получаем координаты начальной точки выделения
  const startX = event.clientX;
  const startY = event.clientY;

  // Обработчик события при отпускании кнопки мыши
  textRef.addEventListener("mouseup", function (event) {
    // Получаем координаты конечной точки выделения
    const endX = event.clientX;
    const endY = event.clientY;

    // Вычисляем координаты прямоугольника выделения
    const selectionRect = {
      top: Math.min(startY, endY),
      left: Math.min(startX, endX),
      bottom: Math.max(startY, endY),
      right: Math.max(startX, endX),
    };

    // Получаем список всех символов внутри элемента с классом "text"
    const letters = textRef.querySelectorAll(".letter");

    // Перебираем символы и проверяем, попадают ли они в прямоугольник выделения
    letters.forEach(function (letter) {
      const rect = letter.getBoundingClientRect();
      const letterRect = {
        top: rect.top,
        left: rect.left,
        bottom: rect.bottom,
        right: rect.right,
      };

      // Проверяем пересечение прямоугольника выделения с прямоугольником символа
      if (
        !(
          letterRect.right < selectionRect.left ||
          letterRect.left > selectionRect.right ||
          letterRect.bottom < selectionRect.top ||
          letterRect.top > selectionRect.bottom
        )
      ) {
        // Если символ попадает в прямоугольник выделения, меняем его цвет
        letter.style.color = "red"; // Здесь вы можете использовать любой цвет
      }
    });

    // Удаляем обработчик события "mouseup", чтобы он больше не вызывался после завершения выделения
    textRef.removeEventListener("mouseup", arguments.callee);
  });
});

// Объявляем переменную, которая будет хранить выделенный текст
let selectedText = "";

// Обработчик события при зажатии кнопки мыши на выделенном тексте
textRef.addEventListener("mousedown", function (event) {
  // Получаем выделенный текст
  selectedText = window.getSelection().toString();
  console.log(selectedText);
});

// Обработчик события при отпускании кнопки мыши на выделенном тексте
textRef.addEventListener("mouseup", function (event) {
  // Проверяем, что выделенный текст не пустой
  if (selectedText !== "") {
    // Создаем новый элемент для перетаскиваемого текста
    const draggableText = document.createElement("div");
    draggableText.textContent = selectedText;
    draggableText.style.position = "absolute";
    draggableText.style.left = event.clientX + "px";
    draggableText.style.top = event.clientY + "px";
    draggableText.style.color = "red"; // Можете задать любой цвет

    // Добавляем новый элемент в документ
    document.body.appendChild(draggableText);

    // Обработчик события при перемещении мыши
    function onMouseMove(event) {
      // Обновляем позицию перетаскиваемого текста
      draggableText.style.left = event.clientX + "px";
      draggableText.style.top = event.clientY + "px";
    }

    // Обработчик события при отпускании кнопки мыши
    function onMouseUp() {
      // Удаляем обработчики событий
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      // Удаляем перетаскиваемый текст из документа
      draggableText.remove();
    }

    // Добавляем обработчики событий перемещения мыши и отпускания кнопки мыши
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }
});
