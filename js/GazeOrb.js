/**
 * GazeOrb Class - Represents an interactive choice orb in the game
 */
class GazeOrb {
    constructor(label, quadrant, color) {
        this.label = label;
        this.quadrant = quadrant;
        this.color = color;
        this.timer = 0;
        this.hover = false;
        this.brightness = 0;
    }

    checkGaze(gazeX, gazeY, windowWidth, windowHeight, offsetY = 0, usableHeight = null) {
        if (!gazeX || !gazeY) return;

        const effectiveHeight = usableHeight || windowHeight;
        const localY = gazeY - offsetY;

        if (localY < 0 || localY > effectiveHeight) {
            this.hover = false;
            return;
        }

        let isLeft = gazeX < windowWidth / 2;
        let isTop = localY < effectiveHeight / 2;

        switch (this.quadrant) {
            case 'top-left':
                this.hover = isLeft && isTop;
                break;
            case 'top-right':
                this.hover = !isLeft && isTop;
                break;
            case 'bottom-left':
                this.hover = isLeft && !isTop;
                break;
            case 'bottom-right':
                this.hover = !isLeft && !isTop;
                break;
        }
    }

    update() {
        if (this.hover) {
            this.timer++;
            this.brightness = lerp(this.brightness, 80, 0.1);
        } else {
            this.timer = 0;
            this.brightness = lerp(this.brightness, 20, 0.1);
        }
    }

    draw(windowWidth, windowHeight, offsetY = 0, usableHeight = null) {
        let x, y, w, h;
        w = windowWidth / 2;
        h = (usableHeight || windowHeight) / 2;

        // Calculate position based on quadrant
        switch (this.quadrant) {
            case 'top-left':
                x = 0; y = offsetY;
                break;
            case 'top-right':
                x = windowWidth / 2; y = offsetY;
                break;
            case 'bottom-left':
                x = 0; y = offsetY + h;
                break;
            case 'bottom-right':
                x = windowWidth / 2; y = offsetY + h;
                break;
        }

        // Draw background
        fill(this.color[0], this.color[1], this.color[2], this.brightness);
        noStroke();
        rect(x, y, w, h);

        // Draw divider lines limited to play area
        stroke(56, 208, 229, 100);
        strokeWeight(3);
        const totalHeight = usableHeight || h * 2;
        line(windowWidth / 2, offsetY, windowWidth / 2, offsetY + totalHeight);
        line(0, offsetY + totalHeight / 2, windowWidth, offsetY + totalHeight / 2);

        // Draw label
        noStroke();
        fill(242, 242, 242);
        textAlign(CENTER, CENTER);
        textSize(16);
        if (typeof textWrap === "function") {
            textWrap(WORD);
        }
        const textBoxW = w * 0.8;
        const textBoxX = x + w / 2 - textBoxW / 2;
        const textBoxY = y + h / 2 - 40;
        text(this.label, textBoxX, textBoxY, textBoxW, 120);

        // Draw progress indicator
        if (this.timer > 0) {
            this.drawProgressIndicator(x + w / 2, y + h / 2);
        }
    }

    drawProgressIndicator(centerX, centerY) {
        const GAZE_TIME_TO_SELECT = 120;
        let angle = map(this.timer, 0, GAZE_TIME_TO_SELECT, 0, TWO_PI);
        
        noFill();
        stroke(56, 208, 229);
        strokeWeight(8);
        arc(centerX, centerY, 120, 120, -HALF_PI, -HALF_PI + angle);
        
        fill(56, 208, 229);
        noStroke();
        textSize(20);
        let percent = Math.floor((this.timer / GAZE_TIME_TO_SELECT) * 100);
        text(percent + '%', centerX, centerY + 60);
    }

    isSelected() {
        const GAZE_TIME_TO_SELECT = 120;
        return this.timer > GAZE_TIME_TO_SELECT;
    }

    reset() {
        this.timer = 0;
        this.hover = false;
        this.brightness = 0;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GazeOrb;
}
