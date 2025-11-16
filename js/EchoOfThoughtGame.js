/**
 * EchoOfThoughtGame Class - Main game controller
 * Manages all game components and orchestrates game flow
 */
class EchoOfThoughtGame {
    constructor() {
        this.stateManager = new GameStateManager();
        this.webgazerManager = new WebGazerManager();
        this.calibrationManager = null;
        this.orbs = [];
        this.isInitialized = false;
    }

    setup() {
        // Create canvas
        let canvas = createCanvas(windowWidth, windowHeight);
        canvas.parent('main');
        textAlign(CENTER, CENTER);
        textFont('Press Start 2P');

        // Initialize orbs
        this.orbs = [
            new GazeOrb('HARAPAN', 'top-left', [100, 150, 255]),
            new GazeOrb('KETAKUTAN', 'top-right', [200, 50, 100]),
            new GazeOrb('KETENANGAN', 'bottom-left', [100, 200, 150]),
            new GazeOrb('KEBINGUNGAN', 'bottom-right', [200, 150, 50])
        ];

        // Initialize calibration manager
        this.calibrationManager = new CalibrationManager(windowWidth, windowHeight);

        // Create face canvas for WebGazer
        this.webgazerManager.createFaceCanvas();

        this.isInitialized = true;
    }

    draw() {
        background(16, 22, 34);

        // Process video feed if game has started
        if (!this.stateManager.isState('START')) {
            this.webgazerManager.processVideoFeed();
        }

        // Update gaze display
        this.webgazerManager.updateGazeDisplay();

        // Render current state
        switch (this.stateManager.getState()) {
            case 'CALIBRATING':
                this.drawCalibrationScene();
                break;
            case 'CHOICE':
                this.drawChoiceScene();
                break;
            case 'FINAL':
                this.drawFinalScene();
                break;
        }

        // Draw gaze indicator
        this.drawGazeIndicator();
    }

    drawCalibrationScene() {
        if (this.calibrationManager) {
            this.calibrationManager.draw();
        }
    }

    drawChoiceScene() {
        const gaze = this.webgazerManager.getGazePosition();

        // Update all orbs
        this.orbs.forEach(orb => {
            orb.checkGaze(gaze.x, gaze.y, windowWidth, windowHeight);
            orb.update();
            orb.draw(windowWidth, windowHeight);
        });

        // Draw instruction box
        fill(26, 58, 104, 200);
        noStroke();
        rect(windowWidth / 2 - 350, windowHeight / 2 - 80, 700, 160, 0);
        
        stroke(56, 208, 229);
        strokeWeight(4);
        noFill();
        rect(windowWidth / 2 - 350, windowHeight / 2 - 80, 700, 160, 0);

        fill(242, 242, 242);
        noStroke();
        textSize(20);
        textAlign(CENTER, CENTER);
        text("PIKIRAN MANA YANG KAMU RASAKAN?", windowWidth / 2, windowHeight / 2 - 30);
        textSize(14);
        text("Tatap area pilihanmu selama 2 detik.", windowWidth / 2, windowHeight / 2 + 20);

        // Check for selection
        for (let orb of this.orbs) {
            if (orb.isSelected()) {
                this.stateManager.setSelectedChoice(orb.label);
                this.stateManager.setState('FINAL');
                break;
            }
        }
    }

    drawFinalScene() {
        fill(242, 242, 242);
        textSize(28);
        text('KAMU TELAH MEMILIH:', windowWidth / 2, windowHeight / 2 - 60);

        const selectedChoice = this.stateManager.getSelectedChoice();
        
        // Set color based on choice
        switch (selectedChoice) {
            case 'HARAPAN':
                fill(100, 150, 255);
                break;
            case 'KETAKUTAN':
                fill(200, 50, 100);
                break;
            case 'KETENANGAN':
                fill(100, 200, 150);
                break;
            case 'KEBINGUNGAN':
                fill(200, 150, 50);
                break;
        }

        textSize(40);
        text(selectedChoice, windowWidth / 2, windowHeight / 2 + 20);

        // Auto redirect after 3 seconds
        textSize(16);
        fill(56, 208, 229);
        text("Menuju hasil...", windowWidth / 2, windowHeight * 0.8);

        if (frameCount % 60 === 0) {
            setTimeout(() => {
                window.location.href = 'endgame.html';
            }, 3000);
        }
    }

    drawGazeIndicator() {
        const gaze = this.webgazerManager.getGazePosition();
        if (gaze.displayX && !this.stateManager.isState('START')) {
            fill(56, 208, 229, 150);
            noStroke();
            ellipse(gaze.displayX, gaze.displayY, 20, 20);
        }
    }

    handleMousePress() {
        if (this.stateManager.isState('CALIBRATING')) {
            this.webgazerManager.recordClick(mouseX, mouseY);
            
            if (this.calibrationManager.nextPoint()) {
                this.stateManager.setState('CHOICE');
                this.webgazerManager.setMouseClickCallback(null);
                this.webgazerManager.setRegression('ridge');
            }
        }
    }

    handleWindowResize() {
        if (!this.isInitialized || frameCount === 0) return;
        
        resizeCanvas(windowWidth, windowHeight);
        this.calibrationManager.resize(windowWidth, windowHeight);
        
        if (!this.stateManager.isState('START')) {
            this.stateManager.setState('CALIBRATING');
        }
    }

    async start() {
        const success = await this.webgazerManager.initialize();
        if (success) {
            this.stateManager.setState('CALIBRATING');
            return true;
        }
        return false;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EchoOfThoughtGame;
}
