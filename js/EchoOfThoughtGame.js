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

        // Story engine integration
        this.storyState = window.EchoStory ? new window.EchoStory.GameState() : null;
        this.storyEngine = window.EchoStory ? new window.EchoStory.StoryEngine({ gameState: this.storyState }) : null;
        this.storyChoices = [];
        this.storyText = "Memuat cerita...";
        this.storyLoading = false;
        this.storyStarted = false;
        this.currentNodeId = "BEGIN";
    }

    setup() {
        // Create canvas
        let canvas = createCanvas(windowWidth, windowHeight);
        canvas.parent('main');
        
        // Force font settings
        textAlign(CENTER, CENTER);
        textFont('Press Start 2P');
        textSize(16);
        noSmooth(); // Pixel-perfect rendering
        
        // Fallback to native canvas font if p5 fails
        if (drawingContext) {
            drawingContext.font = "16px 'Press Start 2P'";
        }

        // Initialize orbs
        this.orbs = [
            new GazeOrb('1.', 'top-left', [100, 150, 255]),
            new GazeOrb('2.', 'top-right', [200, 50, 100]),
            new GazeOrb('3.', 'bottom-left', [100, 200, 150]),
            new GazeOrb('4.', 'bottom-right', [200, 150, 50])
        ];

        // Initialize calibration manager
        this.calibrationManager = new CalibrationManager(windowWidth, windowHeight);

        // Create face canvas for WebGazer
        this.webgazerManager.createFaceCanvas();

        this.isInitialized = true;
    }

    draw() {
        background(16, 22, 34);
        
        // Force font on every frame
        textFont('Press Start 2P');

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
        if (this.storyEngine && !this.storyStarted && !this.storyLoading) {
            this.startStoryFlow();
        }

        const gaze = this.webgazerManager.getGazePosition();

        // Layout measurements (reserve top area for story panel)
        const storyPanelHeight = Math.min(280, windowHeight * 0.3);
        const storyPanelY = 12;
        const playAreaY = storyPanelY + storyPanelHeight + 12;
        const playAreaHeight = Math.max(200, windowHeight - playAreaY);

        // Update all orbs
        const activeChoices = this.storyChoices.filter(c => c && c.text).length;
        this.orbs.forEach(orb => {
            orb.checkGaze(gaze.x, gaze.y, windowWidth, playAreaHeight, playAreaY, playAreaHeight, activeChoices);
            orb.update();
            orb.draw(windowWidth, windowHeight, playAreaY, playAreaHeight, activeChoices);
        });

        // Draw instruction / story box
        const boxWidth = Math.min(windowWidth - 120, 1080);
        const boxHeight = storyPanelHeight;
        const boxX = windowWidth / 2 - boxWidth / 2;
        const boxY = storyPanelY;

        // Back panel
        noStroke();
        fill(10, 18, 32, 230);
        rect(boxX - 4, boxY - 4, boxWidth + 8, boxHeight + 8, 0);

        // Inner panel
        fill(26, 58, 104, 230);
        rect(boxX, boxY, boxWidth, boxHeight, 0);
        stroke(56, 208, 229);
        strokeWeight(4);
        noFill();
        rect(boxX, boxY, boxWidth, boxHeight, 0);

        // Header
        noStroke();
        fill(56, 208, 229);
        textSize(14);
        textFont("Press Start 2P");
        if (drawingContext) {
            drawingContext.font = "14px 'Press Start 2P'";
        }
        textAlign(LEFT, TOP);
        text("ECHO OF THOUGHT", boxX + 14, boxY + 14);
        textAlign(RIGHT, TOP);
        text(this.getProgressLabel(), boxX + boxWidth - 14, boxY + 14);

        // Story text
        textAlign(LEFT, TOP);
        textSize(18);
        textFont("Press Start 2P");
        
        // Force font with native canvas API as fallback
        if (drawingContext) {
            drawingContext.font = "18px 'Press Start 2P'";
        }
        
        if (typeof textLeading === "function") {
            textLeading(30);
        }
        if (typeof textWrap === "function") {
            textWrap(WORD);
        }
        fill(242, 242, 242);
        text(this.storyText || "Memuat cerita...", boxX + 14, boxY + 40, boxWidth - 28, boxHeight - 48);
        
        // Restore font
        textFont("Press Start 2P");

        // Check for selection
        this.orbs.forEach((orb, idx) => {
            if (orb.isSelected()) {
                this.handleStoryChoice(idx);
            }
        });
    }

    drawFinalScene() {
        fill(242, 242, 242);
        textSize(32);
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

        textSize(48);
        text(selectedChoice, windowWidth / 2, windowHeight / 2 + 20);

        // Auto redirect after 3 seconds
        textSize(20);
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
                this.startStoryFlow();
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

    async startStoryFlow() {
        if (!this.storyEngine || this.storyStarted) return;
        this.storyStarted = true;
        await this.loadStoryNode("BEGIN");
    }

    async loadStoryNode(nodeId) {
        if (!this.storyEngine) return;
        this.storyLoading = true;
        try {
            const payload = await this.storyEngine.requestStoryBeat(nodeId);
            this.storyText = payload.response;
            this.storyChoices = this.storyEngine.currentChoices || [];
            this.currentNodeId = payload.id || nodeId;
            this.applyChoicesToOrbs();
        } catch (error) {
            console.error("Story load error:", error);
            this.storyText = "Echo tidak dapat memuat cerita. Coba lagi.";
            this.storyChoices = [];
        } finally {
            this.storyLoading = false;
        }
    }

    applyChoicesToOrbs() {
        const validChoices = this.storyChoices.filter(c => c && c.text);
        const labels = validChoices.map((c, i) => `${i + 1}. ${c.text}`);
        
        this.orbs.forEach((orb, idx) => {
            if (idx < labels.length) {
                orb.label = labels[idx];
                orb.visible = true;
            } else {
                orb.label = "";
                orb.visible = false;
            }
            orb.reset();
        });
    }

    async handleStoryChoice(index) {
        if (this.storyLoading || !this.storyChoices[index]) return;
        const choiceObj = this.storyChoices[index];
        if (choiceObj.delta) {
            this.storyState.applyDelta(choiceObj.delta);
        }
        this.storyState.rememberChoice(choiceObj.text);
        this.orbs.forEach(orb => orb.reset());
        await this.loadStoryNode(choiceObj.nextId || "BEGIN");
    }

    getProgressLabel() {
        if (!this.currentNodeId) return "EP";
        const match = this.currentNodeId.match(/EP(\\d+)/);
        const ep = match ? `EP${match[1]}` : "EP";
        return `${ep} · Pilih dengan tatapan`;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EchoOfThoughtGame;
}

