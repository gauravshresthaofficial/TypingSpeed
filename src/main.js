"use strict";

import { quotes } from "./quotes.json";

const TypingTest = (() => {
  // Constants
  const MIN_QUOTE_LENGTH = 100;
  const MAX_QUOTE_LENGTH = 250;
  const WPM_CHARACTERS_PER_WORD = 5;
  const CURSOR_HIDDEN_OPACITY = "0";
  const CURSOR_VISIBLE_OPACITY = "1";
  const RESULTS_HIDDEN_OPACITY = "0.1";
  const RESULTS_VISIBLE_OPACITY = "1";

  // DOM Elements
  const elements = {
    quote: document.querySelector(".quote"),
    input: document.querySelector(".input"),
    reset: document.querySelector(".reset"),
    timer: document.querySelector(".timer"),
    speed: document.querySelector(".speed"),
    accuracy: document.querySelector(".accuracy"),
    cursor: document.querySelector(".cursor"),
    speedContainer: document.querySelector(".speed").parentElement,
    accuracyContainer: document.querySelector(".accuracy").parentElement,
  };

  // State
  const state = {
    quote: "",
    isStarted: false,
    timerInterval: null,
    lastKey: null,
    startTime: null,
  };

  // Helper Functions
  const getValidQuotes = () => {
    return quotes.filter(
      (quote) =>
        quote.text.length >= MIN_QUOTE_LENGTH &&
        quote.text.length <= MAX_QUOTE_LENGTH
    );
  };

  const positionCursor = (index) => {
    const characterSpans = elements.quote.querySelectorAll(".character");

    // Hide cursor at boundaries
    const atBoundary = index === 0 || index >= characterSpans.length;
    elements.cursor.style.opacity = atBoundary
      ? CURSOR_HIDDEN_OPACITY
      : CURSOR_VISIBLE_OPACITY;

    if (atBoundary) return;

    const targetSpan = characterSpans[index];
    const { offsetLeft, offsetTop, offsetHeight } = targetSpan;
    // console.log(targetSpan);
    // console.log(offsetLeft, offsetTop, offsetHeight);

    Object.assign(elements.cursor.style, {
      left: `${offsetLeft}px`,
      top: `${offsetTop}px`,
      height: `${offsetHeight}px`,
    });
  };

  // Core Functions
  const displayNewQuote = () => {
    elements.quote.innerHTML = "";
    const validQuotes = getValidQuotes();

    if (!validQuotes.length) {
      console.error("No valid quotes found");
      return;
    }

    const randomQuote =
      validQuotes[Math.floor(Math.random() * validQuotes.length)];
    state.quote = randomQuote.text;

    const quote = state.quote
      .split("")
      .map((char) => `<span class="character">${char}</span>`)
      .join("");
    elements.quote.innerHTML = quote;

    // Adjust input height after setting new quote
    adjustInputHeight();
  };

  const handleSpecialKeys = (e) => {
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault();

      // Reset on Tab+Enter combination
      if (state.lastKey === "Tab" && e.key === "Enter") {
        resetTest();
      }
      state.lastKey = e.key;
    } else {
      state.lastKey = null;
    }
  };

  const updateCharacterStates = (inputChars) => {
    const characterSpans = elements.quote.querySelectorAll(".character");

    characterSpans.forEach((span, i) => {
      const inputChar = inputChars[i];
      const spanChar = span.textContent;

      // Clear previous state if no input for this position
      if (inputChar === undefined) {
        span.classList.remove("correct", "incorrect");
        return;
      }

      // Determine new state
      const isCorrect = inputChar === spanChar;

      // Only update if state changed
      if (isCorrect && !span.classList.contains("correct")) {
        span.classList.add("correct");
        span.classList.remove("incorrect");
      } else if (!isCorrect && !span.classList.contains("incorrect")) {
        span.classList.add("incorrect");
        span.classList.remove("correct");
      }
    });
  };

  const calculateMetrics = (inputValue) => {
    const inputChars = inputValue.split("");
    const quoteChars = state.quote.split("");

    const correctChars = quoteChars.reduce(
      (count, char, i) => count + (char === (inputChars[i] || "")),
      0
    );

    const accuracy = quoteChars.length
      ? (correctChars / quoteChars.length) * 100
      : 0;

    const elapsedSeconds = (Date.now() - state.startTime) / 1000;
    const wpm = elapsedSeconds
      ? correctChars / WPM_CHARACTERS_PER_WORD / (elapsedSeconds / 60)
      : 0;

    return { accuracy, wpm };
  };

  const handleUserInput = () => {
    if (!state.isStarted) {
      startTimer();
      state.isStarted = true;
      state.startTime = Date.now();
      elements.timer.style.opacity = "1";
    }

    const cleanInput = elements.input.value.replace(/[\t\n\r]/g, "");
    elements.input.value = cleanInput;

    const inputChars = cleanInput.split("");
    positionCursor(inputChars.length);
    updateCharacterStates(inputChars);

    if (inputChars.length >= state.quote.length) {
      completeTest(cleanInput);
    }
  };

  const displayResults = ({ accuracy, wpm }) => {
    elements.accuracy.textContent = `${accuracy.toFixed(2)}%`;
    elements.speed.textContent = `${wpm.toFixed(2)} WPM`;
    elements.speedContainer.style.opacity = RESULTS_VISIBLE_OPACITY;
    elements.accuracyContainer.style.opacity = RESULTS_VISIBLE_OPACITY;
  };

  const startTimer = () => {
    state.timerInterval = setInterval(() => {
      if (!state.isStarted) {
        clearInterval(state.timerInterval);
        return;
      }

      const elapsedSeconds = (Date.now() - state.startTime) / 1000;
      elements.timer.textContent = `${Math.floor(elapsedSeconds)}s`;
    }, 1000);
  };

  const completeTest = (input) => {
    elements.input.disabled = true;
    displayResults(calculateMetrics(input));
    state.isStarted = false;
  };

  const resetTest = () => {
    clearInterval(state.timerInterval);
    displayNewQuote();

    // Reset UI
    elements.input.value = "";
    elements.input.disabled = false;
    elements.input.focus();
    elements.timer.textContent = "0s";
    elements.accuracy.textContent = "";
    elements.speed.textContent = "";

    // Reset state
    state.isStarted = false;
    state.startTime = null;
    elements.timer.style.opacity = "0";

    // Visual reset
    positionCursor(0);
    elements.speedContainer.style.opacity = RESULTS_HIDDEN_OPACITY;
    elements.accuracyContainer.style.opacity = RESULTS_HIDDEN_OPACITY;
  };

  const adjustInputHeight = () => {
    elements.input.style.height = elements.quote.offsetHeight + "px";
  };

  // Initialize
  const init = () => {
    // Event listeners
    elements.input.addEventListener("keydown", handleSpecialKeys);
    elements.input.addEventListener("input", handleUserInput);
    elements.reset.addEventListener("click", resetTest);
    window.addEventListener("resize", adjustInputHeight);

    // Initial setup
    displayNewQuote();
    elements.input.focus();
    adjustInputHeight();
    elements.cursor.style.opacity = CURSOR_HIDDEN_OPACITY;
    elements.speedContainer.style.opacity = RESULTS_HIDDEN_OPACITY;
    elements.accuracyContainer.style.opacity = RESULTS_HIDDEN_OPACITY;
    elements.timer.style.opacity = "0";
  };

  return { init };
})();

TypingTest.init();
