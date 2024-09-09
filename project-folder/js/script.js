/**
 * Memory Game
 * 
 * This code implements a memory game where buttons are scrambled and the player must click them in the correct order.
 * 
 * Code assistance and code structure suggestions provided by ChatGPT.
 * 
 * @author Steven Lai
 */

const BUTTON_MARGIN_X = 100;  // Horizontal margin around the button
const BUTTON_MARGIN_Y = 50;   // Vertical margin around the button

/** Utility class for generating random colors. */
class Color {

    /** static method to generate random hex code.
     *  Appends 6 characters (0 - F) after #.
     * @returns {string} - Random color in hex format
     */
    static getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}

/** A class to manage the memory game logic */
class Game {

    /** Creates an instance of the Game class */
    constructor() {
        this.buttons = [];
        this.originalOrder = [];
        this.currentOrder = [];
        this.n = 0;
        this.gameStarted = false;
        this.clickHandler = new ClickHandler(this);
    }

    /**Starts the game by initializing buttons and scrambling them. 
     * 
     * @param {number} n - Number of buttons to create and time to scramble
    */
    startGame(n) {
        this.n = n;
        this.buttons = [];
        this.originalOrder = [];
        this.currentOrder = [];
        document.body.innerHTML = ''; // Clear existing buttons
        this.createButtons();
        setTimeout(() => this.scrambleMultipleTimes(n), n * 1000); // Wait n seconds before starting
    }

    /** Creates and displays buttons on the screen. */
    createButtons() {
        const buttonFactory = new ButtonFactory(10, 5); // Default width and height for buttons (10em and 5 em)
    
        for (let i = 1; i <= this.n; i++) {
            const color = Color.getRandomColor();
            const button = buttonFactory.createButton(i, color);
            this.buttons.push(button);
            this.originalOrder.push(button); // Save original order
            button.renderInRow(i); // Display buttons in a row
        }
    }

    /**
     * Scrambles buttons multiple times at intervals.
     *
     * @param {number} times - The number of times to scramble the buttons.
     */
    scrambleMultipleTimes(times) {
        let count = 0;
        const scrambleInterval = setInterval(() => {
            this.scrambleButtons();
            count++;

            if (count === times) {
                clearInterval(scrambleInterval);
                this.hideButtonLabels(); // After final scramble, hide the labels
                this.makeButtonsClickable();
                this.gameStarted = true;
            }
        }, 2000); // Scramble every 2 seconds
    }

    /**
     * Moves buttons to random positions within the window.
     */
    scrambleButtons() {
        const position = new Position(window.innerWidth, window.innerHeight); // Update with current window dimensions
        this.buttons.forEach(button => button.moveToRandomPosition(position));
    }

    /**
     * Hides the labels for each buttons.
     */
    hideButtonLabels() {
        this.buttons.forEach(button => button.hideLabel());
    }

    /**
     * Makes all buttons clickable and apply click handler.
     */
    makeButtonsClickable() {
        this.buttons.forEach(button => {
            button.buttonElement.onclick = () => this.clickHandler.handleClick(button);
        });
    }

    /**
     * Reveal the correct order of the button by showing their labels.
     */
    revealCorrectOrder() {
        this.originalOrder.forEach(button => button.showLabel());
    }

    /**
     * Ends the game and provides a button to restart by refreshing the page.
     */
    endGame() {
        this.gameStarted = false;

        const restartButton = document.createElement('button');
        restartButton.innerText = "Restart Game";
        restartButton.onclick = () => window.location.reload();
        document.body.appendChild(restartButton);
    }
}

/**
 * Handles button click events and checks the game logic.
 */
class ClickHandler {
    /**
     * Creates an instance of ClickHandler.
     *
     * @param {Game} game - The game instance associated with this handler.
     */
    constructor(game) {
        this.game = game;
    }

    /**
     * Handles a button click event.
     *
     * @param {Button} button - The button that was clicked.
     */
    handleClick(button) {
        if (!this.game.gameStarted) return;
        const currentIndex = this.game.currentOrder.length;
        if (button.id === this.game.originalOrder[currentIndex].id) {
            this.game.currentOrder.push(button);
            button.showLabel();
            if (this.game.currentOrder.length === this.game.n) {
                alert(correctMessage);
                this.game.endGame();
            }
        } else {
            alert(wrongMessage);
            this.game.revealCorrectOrder();
            this.game.endGame();
        }
    }
}

/**
* Represents a button in the game.
*/
class Button {
    /**
    * Creates an instance of the Button class.
    *
    * @param {number} id - The unique identifier for the button.
    * @param {string} color - The background color of the button.
    * @param {number} width - The width of the button in em units.
    * @param {number} height - The height of the button in em units.
    */
    constructor(id, color, width, height) {
        this.id = id;
        this.color = color;
        this.width = `${width}em`;
        this.height = `${height}em`;
        this.buttonElement = document.createElement('button');
        this.buttonElement.id = this.id;
        this.buttonElement.style.backgroundColor = this.color;
        this.buttonElement.style.width = this.width;
        this.buttonElement.style.height = this.height;
        this.buttonElement.innerText = `${this.id}`;
        document.body.appendChild(this.buttonElement);
    }

    /**
     * Renders the button in a row.
     *
     * @param {number} index - The index position of the button in the row.
     */
    renderInRow(index) {
        this.buttonElement.style.display = 'inline-block';
        this.buttonElement.style.margin = '5px';
    }

    /**
    * Moves the button to a random position.
    *
    * @param {Position} position - The position object providing random positions.
    */
    moveToRandomPosition(position) {
        const { x, y } = position.getRandomPosition();
        this.buttonElement.style.position = 'absolute';
        this.buttonElement.style.left = `${x}px`;
        this.buttonElement.style.top = `${y}px`;
    }

    /**
     * Hides label of button.
     */
    hideLabel() {
        this.buttonElement.innerText = '';
    }

    /**
     * Shows label of button.
     */
    showLabel() {
        this.buttonElement.innerText = `${this.id}`;
    }
}

/**
* A factory class for creating Button instances.
*/
class ButtonFactory {
    /**
    * Creates an instance of ButtonFactory.
    *
    * @param {number} defaultWidth - The default width of the buttons in em units.
    * @param {number} defaultHeight - The default height of the buttons in em units.
    */
    constructor(defaultWidth, defaultHeight) {
        this.defaultWidth = defaultWidth;
        this.defaultHeight = defaultHeight;
    }

    createButton(id, color) {
        return new Button(id, color, this.defaultWidth, this.defaultHeight);
    }
}

/**
 * Creates a new Button instance.
 * 
 * @param {number} id - The unique identifier for the button.
 * @param {string} color - The background color of the button.
 * @returns {Button} The newly created Button instance.
 */
class Position {
    /**
     * Creates an instance of Position.
     *
     * @param {number} maxWidth - The maximum width of the window.
     * @param {number} maxHeight - The maximum height of the window.
     */
    constructor(maxWidth, maxHeight) {
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
    }

    /**
     * Gets a random position within the window dimensions.
     *
     * @returns {{x: number, y: number}} The x and y coordinates of the random position.
     */
    getRandomPosition() {
        const x = Math.random() * (this.maxWidth - BUTTON_MARGIN_X);
        const y = Math.random() * (this.maxHeight - BUTTON_MARGIN_Y);
        return { x, y };
    }
}

/**
 * Validates the input and starts the game if the input is valid.
 *
 * @returns {boolean} False to prevent default form submission.
 */
function InputCheck() {
    let input = document.getElementById("input").value;
    let parsedInput = parseInt(input);
    
    // Check if input is an integer and within the range
    if (!Number.isInteger(parsedInput) || parsedInput < 3 || parsedInput > 7) {
        alert(inputValidationMessage);
        return false;
    } else {
        game.startGame(parsedInput);
        return false;
    }
}

const game = new Game();

// Load messages from user.js
const inputValidationMessage = inputMessages.validation;
const correctMessage = inputMessages.correct;
const wrongMessage = inputMessages.wrong;
