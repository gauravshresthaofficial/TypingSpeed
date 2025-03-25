# Typing Speed Test

A web application that measures your typing speed (words per minute) and accuracy by having you type random quotes.

---

## Features

- Accuracy calculation based on correct words typed
- Timer that starts automatically when you begin typing
- Random quote generator with length validation (100-300 characters)
- Visual feedback for correct/incorrect characters
- Custom cursor that follows your typing position
- Keyboard shortcuts (Tab + Enter to reset)

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/gauravshresthaofficial/typingSpeed.git
   ```

2. Navigate to the project directory:

   ```bash
   cd typingspeed
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and visit:
   ```
   http://localhost:5173
   ```

---

## Usage

1. Start typing the displayed quote
2. The timer will start automatically when you begin typing
3. Characters will be highlighted:
   - Green: Correct character
   - Red: Incorrect character
4. When you complete the quote, your results will be displayed:
   - Typing speed (WPM)
   - Accuracy percentage
5. To try again:
   - Click the "Reset" button
   - OR press Tab followed by Enter

---

## Project Structure

```
typing-speed-test/
├── src/
│   ├── main.js        # Main application logic
│   ├── style.css      # Styles for the application
│   └── quotes.json    # Database of quotes
├── index.html         # Main HTML file
├── vite.config.js     # Vite configuration
└── README.md          # This file
```

---

## Dependencies

- [Vite](https://vitejs.dev/) - Fast development build tool

---

## Customization

### Adding More Quotes

1. Edit `src/quotes.json`
2. Add new quote objects in the format:
   ```json
   {
     "text": "They don't know that we know they know we know.",
     "source": "Friends",
     "length": 47,
     "id": 2
   }
   ```

---

## Contact

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/gauravshresthaofficial) [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/gauravshresthaofficial/) [![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:imgauravshrestha@gmail.com) [![Website](https://img.shields.io/badge/Website-000000?style=for-the-badge&logo=About.me&logoColor=white)](https://www.shresthagaurav.com/)

</div>
