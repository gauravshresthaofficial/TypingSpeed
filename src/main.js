// "use strict";

import { quotes } from "./quotes.json";

const typingTest = (() => {
  // DOM Elements
  const quoteElement = document.querySelector(".quote");

  const inputElement = document.querySelector(".input");
  const resetElement = document.querySelector(".reset");
  const timerElement = document.querySelector(".timer");
  const speedElement = document.querySelector(".speed");
  const accuracyElement = document.querySelector(".accuracy");
  const cursorElement = document.querySelector(".cursor");

  // State
  let quote = "";
  let isStarted = false;
  let timerInterval = null;

  // Helper Functions
  const filterValidQuotes = () => {
    return quotes.filter(
      (quote) => quote.text.length >= 100 && quote.text.length <= 300
    );
  };

  const moveCursor = (index) => {
    const characterSpans = quoteElement.querySelectorAll(".character");

    // Hide cursor at the start and end
    if (index === 0 || index >= characterSpans.length) {
      cursorElement.style.opacity = "0";
      return;
    } else {
      cursorElement.style.opacity = "1";
    }

    const targetSpan = characterSpans[index] || quoteElement;
    const { offsetLeft, offsetTop, offsetHeight } = targetSpan;

    cursorElement.style.left = `${offsetLeft}px`;
    cursorElement.style.top = `${offsetTop}px`;
    cursorElement.style.height = `${offsetHeight}px`;
  };

  const createCharacterSpan = (character) => {
    const characterSpan = document.createElement("span");
    characterSpan.className = "character";
    characterSpan.textContent = character;
    return characterSpan;
  };

  // Core Functions
  const generateRandomQuote = () => {
    quoteElement.innerHTML = "";
    const validQuotes = filterValidQuotes();

    if (validQuotes.length === 0) {
      console.error("No valid quotes found");
      return;
    }

    const randomIndex = Math.floor(Math.random() * validQuotes.length);
    quote = validQuotes[randomIndex].text;

    quote.split("").forEach((character) => {
      quoteElement.appendChild(createCharacterSpan(character));
    });
  };

  let lastKey = null; // Track last key

  const handleKeyDown = (e) => {
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();

      // Check if Tab is followed by Enter, reset automatically
      if (lastKey === "Tab" && e.key === "Enter") {
        reset();
      }
      lastKey = e.key;
    } else {
      lastKey = null;
    }
  };

  const updateCharacterStyles = (characterSpans, inputCharacters) => {
    characterSpans.forEach((span, index) => {
      const char = inputCharacters[index];

      if (char == null) {
        span.classList.remove("correct", "incorrect");
      } else {
        const isCorrect = char === span.textContent;
        span.classList.toggle("correct", isCorrect);
        span.classList.toggle("incorrect", !isCorrect);
      }
    });
  };

  const calculateResults = (inputValue) => {
    const inputWords = inputValue.split(" ");
    const quoteWords = quote.split(" ");

    // Count correct words (case-insensitive, punctuation-sensitive)
    const correctWords = quoteWords.reduce((count, word, index) => {
      return count + (word === (inputWords[index] || "").trim() ? 1 : 0);
    }, 0);

    const totalWords = quoteWords.length;

    // Calculate accuracy (ensure we don't divide by zero)
    const accuracy = totalWords > 0 ? (correctWords / totalWords) * 100 : 0;

    // Parse time safely (handle decimal seconds)
    const timeText = timerElement.textContent.replace(/[^\d.]/g, "");
    const timeInSeconds = parseFloat(timeText) || 0.1; // Prevent division by zero
    const timeInMinutes = timeInSeconds / 60;

    // Calculate WPM (standard is (correctChars/5)/minutes)
    // Using correct words instead of characters for simplicity
    const wpm = timeInMinutes > 0 ? correctWords / timeInMinutes : 0;

    // Show results
    speedElement.parentElement.style.opacity = "1";
    accuracyElement.parentElement.style.opacity = "1";

    return {
      accuracy,
      wpm,
    };
  };

  const handleInput = () => {
    if (!isStarted) {
      startTimer();
      isStarted = true;
    }

    const cleanedInput = inputElement.value.replace(/[\t\n\r]/g, "");
    inputElement.value = cleanedInput;

    const inputCharacters = cleanedInput.split("");
    moveCursor(inputCharacters.length);

    const characterSpans = quoteElement.querySelectorAll(".character");
    updateCharacterStyles(characterSpans, inputCharacters);

    if (quoteElement.children.length <= inputCharacters.length) {
      inputElement.disabled = true;
      showResults(cleanedInput);
      isStarted = false;
      return;
    }
  };

  const showResults = (inputValue) => {
    const { accuracy, wpm } = calculateResults(inputValue);
    accuracyElement.textContent = `${accuracy.toFixed(2)}%`;
    speedElement.textContent = `${wpm.toFixed(2)} WPM`;
  };

  const startTimer = () => {
    let startTime = Date.now();

    timerInterval = setInterval(() => {
      if (!isStarted) {
        clearInterval(timerInterval);
        return;
      }

      const elapsedTime = (Date.now() - startTime) / 1000;
      timerElement.textContent = `${elapsedTime.toFixed(0)}s`;
    }, 1000);
  };

  const reset = () => {
    clearInterval(timerInterval);
    generateRandomQuote();
    inputElement.value = "";
    inputElement.disabled = false;
    inputElement.focus();
    accuracyElement.textContent = "";
    speedElement.textContent = "";
    timerElement.textContent = "0s";
    isStarted = false;
    moveCursor(0);
    speedElement.parentElement.style.opacity = "0.2";
    accuracyElement.parentElement.style.opacity = "0.2";
  };

  // Initialize
  const init = () => {
    inputElement.addEventListener("keydown", handleKeyDown);
    inputElement.addEventListener("input", handleInput);
    resetElement.addEventListener("click", reset);
    generateRandomQuote();
    inputElement.focus();
    cursorElement.style.opacity = "0";
    speedElement.parentElement.style.opacity = "0.2";
    accuracyElement.parentElement.style.opacity = "0.2";
  };

  return {
    init,
  };
})();

typingTest.init();
