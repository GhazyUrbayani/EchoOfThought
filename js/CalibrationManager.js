/**
 * CalibrationManager Class - Manages calibration points and process
 */
class CalibrationManager {
    constructor(windowWidth, windowHeight) {
        this.points = [];
        this.currentIndex = 0;
        this.totalPoints = 9;
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;
        this.initializePoints();
    }

    initializePoints() {
        this.points = [];
        let marginX = this.windowWidth * 0.15;
        let marginY = this.windowHeight * 0.15;
        let w = this.windowWidth - (marginX * 2);
        let h = this.windowHeight - (marginY * 2) - 120;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let x = marginX + (w * (j / 2));
                let y = marginY + (h * (i / 2));

                // Avoid top-left corner where face display is
                if (x < 250 && y < 250) {
                    x = Math.max(x, 280);
                }

                this.points.push({ x: x, y: y });
            }
        }
    }

    getCurrentPoint() {
        return this.points[this.currentIndex];
    }

    nextPoint() {
        this.currentIndex++;
        return this.isComplete();
    }

    isComplete() {
        return this.currentIndex >= this.totalPoints;
    }

    getProgress() {
        return {
            current: this.currentIndex + 1,
            total: this.totalPoints,
            percentage: ((this.currentIndex + 1) / this.totalPoints) * 100
        };
    }

    reset() {
        this.currentIndex = 0;
    }

    resize(windowWidth, windowHeight) {
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;
        this.initializePoints();
        this.reset();
    }

    draw() {
        let currentPoint = this.getCurrentPoint();
        if (!currentPoint) return;

        // Draw instruction box at bottom
        fill(26, 58, 104, 200);
        noStroke();
        rect(0, this.windowHeight - 120, this.windowWidth, 120);

        // Draw instruction text
        fill(242, 242, 242);
        textFont('Press Start 2P');
        textSize(22);
        textAlign(CENTER, CENTER);
        let progress = this.getProgress();
        text(`KALIBRASI: ${progress.current} / ${progress.total}`, 
             this.windowWidth / 2, this.windowHeight - 80);
        textSize(16);
        text("TATAP DAN KLIK TITIK CYAN", this.windowWidth / 2, this.windowHeight - 40);

        // Draw calibration point
        stroke(242, 242, 242);
        strokeWeight(3);
        fill(56, 208, 229);
        ellipse(currentPoint.x, currentPoint.y, 40, 40);

        // Draw pulsing effect
        noFill();
        stroke(56, 208, 229, 150);
        strokeWeight(2);
        let pulseSize = 40 + sin(frameCount * 0.1) * 15;
        ellipse(currentPoint.x, currentPoint.y, pulseSize, pulseSize);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalibrationManager;
}
