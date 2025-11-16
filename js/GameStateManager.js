/**
 * GameStateManager Class - Manages game state transitions and rendering
 */
class GameStateManager {
    constructor() {
        this.states = {
            START: 'START',
            CALIBRATING: 'CALIBRATING',
            CHOICE: 'CHOICE',
            FINAL: 'FINAL'
        };
        this.currentState = this.states.START;
        this.selectedChoice = "";
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
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameStateManager;
}
