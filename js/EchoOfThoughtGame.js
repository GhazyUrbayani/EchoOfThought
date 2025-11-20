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
        if (!window.EchoStory) {
            console.error("EchoStory not found! Make sure app.js is loaded before this script.");
        }
        this.storyState = window.EchoStory ? new window.EchoStory.GameState() : null;
        this.storyEngine = window.EchoStory ? new window.EchoStory.StoryEngine({ gameState: this.storyState }) : null;
        this.storyChoices = [];
        this.storyText = "Memuat cerita...";
        this.storyLoading = false;
        this.storyStarted = false;
        this.currentNodeId = "BEGIN";
        this.choicesMade = 0;
        this.endgameData = null;
        
        console.log("EchoOfThoughtGame initialized. Story engine:", this.storyEngine ? "OK" : "NOT FOUND");
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
            case 'READING':
                this.drawReadingScene();
                break;
            case 'CHOICE':
                this.drawChoiceScene();
                break;
            case 'FINAL':
                this.drawFinalScene();
                break;
            case 'ENDGAME':
                this.drawEndgameScene();
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

    drawReadingScene() {
        // Update reading timer
        const finished = this.stateManager.updateReading();
        if (finished) {
            this.stateManager.setState('CHOICE');
            return;
        }

        const progress = this.stateManager.getReadingProgress();
        
        // Layout - increase height for better text display
        const storyPanelHeight = Math.min(400, windowHeight * 0.45);
        const storyPanelY = 20;
        const boxWidth = Math.min(windowWidth - 120, 1080);
        const boxHeight = storyPanelHeight;
        const boxX = windowWidth / 2 - boxWidth / 2;
        const boxY = storyPanelY;

        // Back panel
        noStroke();
        fill(10, 18, 32, 230);
        rect(boxX - 4, boxY - 4, boxWidth + 8, boxHeight + 8, 0);

        // Inner panel
        fill(16, 22, 34);
        rect(boxX, boxY, boxWidth, boxHeight, 0);

        // Accent bar (top)
        fill(56, 208, 229);
        rect(boxX, boxY, boxWidth, 4, 0);

        // Header
        textAlign(CENTER, TOP);
        textFont('Press Start 2P');
        textSize(14);
        fill(56, 208, 229);
        const headerText = this.getProgressLabel();
        text(headerText, windowWidth / 2, boxY + 12);

        // Story text - adjusted area to fit progress bar
        textAlign(LEFT, TOP);
        textSize(18);
        textLeading(30);
        if (drawingContext) {
            drawingContext.font = "18px 'Press Start 2P'";
            textWrap(WORD);
        }
        fill(242, 242, 242);
        // Reserve 70px for progress bar and "Membaca..." text
        const textAreaHeight = boxHeight - 110;
        text(this.storyText || "Memuat cerita...", boxX + 14, boxY + 40, boxWidth - 28, textAreaHeight);

        // Reading progress bar at bottom
        const barWidth = boxWidth - 28;
        const barHeight = 6;
        const barX = boxX + 14;
        const barY = boxY + boxHeight - 50;
        
        // Bar background
        fill(30, 40, 60);
        rect(barX, barY, barWidth, barHeight);
        
        // Bar fill
        fill(56, 208, 229);
        rect(barX, barY, barWidth * progress, barHeight);
        
        // Reading indicator text
        textAlign(CENTER, TOP);
        textSize(12);
        fill(56, 208, 229, 150 + 105 * sin(frameCount * 0.1));
        text("Membaca...", windowWidth / 2, barY + 12);
        
        // Restore font
        textFont("Press Start 2P");
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

        // Update all orbs ONLY if not loading and have valid choices
        const activeChoices = this.storyChoices.filter(c => c && c.text).length;
        if (!this.storyLoading && activeChoices > 0) {
            this.orbs.forEach(orb => {
                orb.checkGaze(gaze.x, gaze.y, windowWidth, playAreaHeight, playAreaY, playAreaHeight, activeChoices);
                orb.update();
                orb.draw(windowWidth, windowHeight, playAreaY, playAreaHeight, activeChoices);
            });
        }

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

        // Check for selection - only if we have valid choices
        const validChoices = this.storyChoices.filter(c => c && c.text);
        if (validChoices.length > 0) {
            this.orbs.forEach((orb, idx) => {
                if (orb.isSelected() && idx < validChoices.length) {
                    this.handleStoryChoice(idx);
                }
            });
        }
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
        
        // Wait for story engine to be ready
        let retries = 0;
        while (!this.storyEngine && retries < 10) {
            console.log("Waiting for story engine...");
            await new Promise(resolve => setTimeout(resolve, 100));
            this.storyEngine = window.EchoStory ? new window.EchoStory.StoryEngine({ gameState: this.storyState }) : null;
            retries++;
        }
        
        if (!this.storyEngine) {
            console.error("Story engine failed to load after retries");
            this.storyText = "Error: Story engine tidak ditemukan. Refresh halaman.";
            return;
        }
        
        this.storyStarted = true;
        await this.loadStoryNode("BEGIN");
    }

    async loadStoryNode(nodeId) {
        if (!this.storyEngine) {
            console.error("Story engine not initialized");
            this.storyText = "Error: Story engine belum siap. Tunggu sebentar...";
            
            // Try to reinitialize
            if (window.EchoStory) {
                this.storyState = new window.EchoStory.GameState();
                this.storyEngine = new window.EchoStory.StoryEngine({ gameState: this.storyState });
                console.log("Story engine reinitialized");
            } else {
                return;
            }
        }
        
        this.storyLoading = true;
        try {
            const payload = await this.storyEngine.requestStoryBeat(nodeId);
            
            if (!payload || !payload.response) {
                throw new Error("Invalid story payload received");
            }
            
            this.storyText = payload.response;
            this.storyChoices = this.storyEngine.currentChoices || [];
            this.currentNodeId = payload.id || nodeId;
            
            console.log("Loaded node:", nodeId, "Choices:", this.storyChoices.length);
            
            // Check if this is ending node BEFORE applying to orbs
            if (this.currentNodeId && this.currentNodeId.startsWith('END_')) {
                this.prepareEndgame();
                this.stateManager.setState('ENDGAME');
            } else {
                this.applyChoicesToOrbs();
                // Enter reading state for normal nodes
                this.stateManager.setState('READING');
                this.stateManager.startReading();
            }
        } catch (error) {
            console.error("Story load error:", error);
            this.storyText = "Echo tidak dapat memuat cerita. Coba lagi.";
            this.storyChoices = [];
            // Don't change state on error, stay in current state
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
        // Prevent multiple simultaneous choice selections
        if (this.storyLoading) {
            console.log("Story is loading, ignoring choice");
            return;
        }
        
        // Validate choice exists
        if (!this.storyChoices || !this.storyChoices[index]) {
            console.log("Invalid choice index:", index);
            return;
        }
        
        const choiceObj = this.storyChoices[index];
        
        // Apply delta if exists
        if (choiceObj.delta && this.storyState) {
            this.storyState.applyDelta(choiceObj.delta);
        }
        
        // Remember choice
        if (this.storyState) {
            this.storyState.rememberChoice(choiceObj.text);
        }
        
        this.choicesMade++;
        this.orbs.forEach(orb => orb.reset());
        
        // Load next node
        await this.loadStoryNode(choiceObj.nextId || "BEGIN");
    }

    getProgressLabel() {
        if (!this.currentNodeId) return "EP";
        const match = this.currentNodeId.match(/EP(\\d+)/);
        const ep = match ? `EP${match[1]}` : "EP";
        return `${ep} · Pilih dengan tatapan`;
    }

    prepareEndgame() {
        // Reset all orbs to prevent any selection
        this.orbs.forEach(orb => {
            orb.reset();
            orb.visible = false;
        });
        
        const relationships = this.storyState ? this.storyState.getRelationships() : {
            nara: 0,
            dimas: 0,
            salsa: 0,
            echo: 0
        };
        const choices = this.storyState ? this.storyState.choiceHistory : [];
        
        // Get ending name from node ID
        let endingName = "AKHIR CERITA";
        if (this.currentNodeId) {
            endingName = this.currentNodeId.replace('END_', '').replace(/_/g, ' ');
        }
        
        this.endgameData = {
            ending: this.currentNodeId || "END_UNKNOWN",
            endingName: endingName,
            endingText: this.storyText || "Terima kasih telah bermain.",
            choiceCount: this.choicesMade,
            relationships: relationships,
            choiceHistory: choices
        };
        
        console.log("Endgame prepared:", this.endgameData);
    }

    drawEndgameScene() {
        if (!this.endgameData) {
            console.error("No endgame data available");
            // Show error message
            textAlign(CENTER, CENTER);
            textFont('Press Start 2P');
            textSize(16);
            fill(255, 100, 100);
            text("Error: Endgame data tidak tersedia", windowWidth / 2, windowHeight / 2);
            textSize(12);
            fill(200, 200, 200);
            text("Tekan SPASI untuk restart", windowWidth / 2, windowHeight / 2 + 40);
            return;
        }
        
        const boxWidth = Math.min(windowWidth - 80, 900);
        const boxX = windowWidth / 2 - boxWidth / 2;
        let currentY = 60;

        // Title
        textAlign(CENTER, TOP);
        textFont('Press Start 2P');
        textSize(28);
        fill(56, 208, 229);
        text("TAMAT", windowWidth / 2, currentY);
        currentY += 60;

        // Ending name
        textSize(16);
        fill(242, 242, 242);
        text(this.endgameData.endingName || "AKHIR CERITA", windowWidth / 2, currentY);
        currentY += 50;

        // Ending text box
        const textBoxHeight = 180;
        noStroke();
        fill(10, 18, 32, 230);
        rect(boxX - 4, currentY - 4, boxWidth + 8, textBoxHeight + 8, 0);
        fill(16, 22, 34);
        rect(boxX, currentY, boxWidth, textBoxHeight, 0);
        fill(56, 208, 229);
        rect(boxX, currentY, boxWidth, 4, 0);

        textAlign(LEFT, TOP);
        textSize(14);
        textLeading(24);
        fill(242, 242, 242);
        if (drawingContext) {
            drawingContext.font = "14px 'Press Start 2P'";
            textWrap(WORD);
        }
        text(this.endgameData.endingText, boxX + 14, currentY + 14, boxWidth - 28, textBoxHeight - 28);
        currentY += textBoxHeight + 40;

        // Statistics
        textAlign(CENTER, TOP);
        textSize(14);
        fill(56, 208, 229);
        text("STATISTIK", windowWidth / 2, currentY);
        currentY += 35;

        // Choices made
        textSize(12);
        fill(200, 200, 200);
        text(`Pilihan dibuat: ${this.endgameData.choiceCount}`, windowWidth / 2, currentY);
        currentY += 30;

        // Relationships
        if (this.endgameData.relationships) {
            const rels = this.endgameData.relationships;
            const names = ['Nara', 'Dimas', 'Salsa', 'Echo'];
            const keys = ['nara', 'dimas', 'salsa', 'echo'];
            
            textAlign(LEFT, TOP);
            const relBoxWidth = boxWidth - 40;
            const relBoxX = windowWidth / 2 - relBoxWidth / 2;
            
            keys.forEach((key, idx) => {
                const value = rels[key] || 0;
                const barColor = this.getRelationshipColor(value);
                const normalizedValue = (value + 100) / 200; // -100 to 100 -> 0 to 1
                
                // Name
                fill(242, 242, 242);
                text(names[idx], relBoxX, currentY);
                
                // Bar background
                fill(30, 40, 60);
                const barWidth = relBoxWidth - 120;
                const barX = relBoxX + 100;
                rect(barX, currentY, barWidth, 16);
                
                // Bar fill
                fill(barColor[0], barColor[1], barColor[2]);
                rect(barX, currentY, barWidth * normalizedValue, 16);
                
                // Value
                textAlign(RIGHT, TOP);
                fill(barColor[0], barColor[1], barColor[2]);
                text(value > 0 ? `+${value}` : `${value}`, relBoxX + relBoxWidth, currentY);
                textAlign(LEFT, TOP);
                
                currentY += 28;
            });
        }

        // Footer instruction
        currentY = windowHeight - 60;
        textAlign(CENTER, TOP);
        textSize(11);
        fill(56, 208, 229, 150 + 105 * sin(frameCount * 0.08));
        text("Tekan SPASI untuk main lagi", windowWidth / 2, currentY);
        
        // Restore defaults
        textFont("Press Start 2P");
    }

    getRelationshipColor(value) {
        if (value >= 50) return [100, 255, 150]; // Green
        if (value >= 20) return [150, 200, 255]; // Light blue
        if (value >= -20) return [200, 200, 200]; // Gray
        if (value >= -50) return [255, 200, 100]; // Orange
        return [255, 100, 100]; // Red
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EchoOfThoughtGame;
}

