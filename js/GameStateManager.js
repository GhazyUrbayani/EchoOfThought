/**
 * GameStateManager Class - Manages game state transitions and rendering
 */
class GameStateManager {
    constructor() {
        this.states = {
            MENU: 'MENU',
            START: 'START',
            CALIBRATING: 'CALIBRATING',
            READING: 'READING',
            CHOICE: 'CHOICE',
            FINAL: 'FINAL',
            ENDGAME: 'ENDGAME'
        };
        this.currentState = this.states.MENU;
        this.selectedChoice = "";
        this.readingTimer = 0;
        this.readingDuration = 180; // 3 seconds at 60fps
    }

    setState(state) {
        if (this.states[state]) {
            this.currentState = this.states[state];
        }
    }

    getState() {
        return this.currentState;
    }

    isState(state) {
        return this.currentState === this.states[state];
    }

    setSelectedChoice(choice) {
        this.selectedChoice = choice;
    }

    getSelectedChoice() {
        return this.selectedChoice;
    }

    startReading() {
        this.readingTimer = 0;
    }

    updateReading() {
        this.readingTimer++;
        return this.readingTimer >= this.readingDuration;
    }

    getReadingProgress() {
        return this.readingTimer / this.readingDuration;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameStateManager;
}
