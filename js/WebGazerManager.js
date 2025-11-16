/**
 * WebGazerManager Class - Manages eye tracking functionality
 */
class WebGazerManager {
    constructor() {
        this.gazeX = null;
        this.gazeY = null;
        this.displayGazeX = null;
        this.displayGazeY = null;
        this.lastGazeUpdate = 0;
        this.GAZE_UPDATE_INTERVAL = 150;
        this.isInitialized = false;
        this.videoElement = null;
        this.faceCanvas = null;
        this.faceCtx = null;
    }

    async initialize() {
        try {
            await webgazer.setTracker('mediapipeIris')
                .setRegression('ridge')
                .setGazeListener((data, elapsedTime) => {
                    if (data) {
                        this.gazeX = data.x;
                        this.gazeY = data.y;
                    }
                })
                .saveDataAcrossSessions(false)
                .begin();

            webgazer.showVideoPreview(true)
                .showPredictionPoints(false)
                .applyKalmanFilter(true);

            // Wait for video to initialize
            setTimeout(() => {
                this.videoElement = document.getElementById('webgazerVideoFeed');
                if (this.videoElement) {
                    this.videoElement.style.display = 'none';
                }
            }, 500);

            this.isInitialized = true;
            return true;
        } catch (error) {
            console.error('WebGazer initialization failed:', error);
            return false;
        }
    }

    createFaceCanvas() {
        this.faceCanvas = document.createElement('canvas');
        this.faceCanvas.width = 400;
        this.faceCanvas.height = 400;
        this.faceCanvas.style.position = 'fixed';
        this.faceCanvas.style.top = '20px';
        this.faceCanvas.style.left = '20px';
        this.faceCanvas.style.width = '200px';
        this.faceCanvas.style.height = '200px';
        this.faceCanvas.style.borderRadius = '50%';
        this.faceCanvas.style.border = '4px solid #38d0e5';
        this.faceCanvas.style.zIndex = '1000';
        this.faceCanvas.style.boxShadow = '0 0 20px rgba(56, 208, 229, 0.5)';
        this.faceCanvas.style.imageRendering = 'auto';
        
        document.body.appendChild(this.faceCanvas);
        
        this.faceCtx = this.faceCanvas.getContext('2d', { 
            alpha: false, 
            willReadFrequently: true 
        });
        this.faceCtx.imageSmoothingEnabled = true;
        this.faceCtx.imageSmoothingQuality = 'high';
    }

    processVideoFeed() {
        if (!this.videoElement) {
            this.videoElement = document.getElementById('webgazerVideoFeed');
        }

        if (this.videoElement && this.videoElement.videoWidth > 0 && this.faceCtx) {
            this.faceCtx.save();

            // Clear with black background
            this.faceCtx.fillStyle = '#000000';
            this.faceCtx.fillRect(0, 0, 400, 400);

            // Create circular clipping path
            this.faceCtx.beginPath();
            this.faceCtx.arc(200, 200, 190, 0, Math.PI * 2);
            this.faceCtx.clip();

            // Draw video
            this.faceCtx.imageSmoothingEnabled = true;
            this.faceCtx.imageSmoothingQuality = 'high';
            this.faceCtx.drawImage(this.videoElement, 0, 0, 400, 400);

            // Apply silhouette effect
            let imageData = this.faceCtx.getImageData(0, 0, 400, 400);
            let data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                let brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
                if (brightness > 70) {
                    data[i] = Math.min(255, data[i] * 1.05);
                    data[i + 1] = Math.min(255, data[i + 1] * 1.05);
                    data[i + 2] = Math.min(255, data[i + 2] * 1.05);
                } else {
                    data[i] = 0;
                    data[i + 1] = 0;
                    data[i + 2] = 0;
                }
            }

            this.faceCtx.putImageData(imageData, 0, 0);
            this.faceCtx.restore();

            // Draw border
            this.faceCtx.strokeStyle = '#38d0e5';
            this.faceCtx.lineWidth = 6;
            this.faceCtx.beginPath();
            this.faceCtx.arc(200, 200, 194, 0, Math.PI * 2);
            this.faceCtx.stroke();
        }
    }

    updateGazeDisplay() {
        if (this.gazeX && this.gazeY && millis() - this.lastGazeUpdate >= this.GAZE_UPDATE_INTERVAL) {
            this.displayGazeX = this.gazeX;
            this.displayGazeY = this.gazeY;
            this.lastGazeUpdate = millis();
        }
    }

    getGazePosition() {
        return {
            x: this.gazeX,
            y: this.gazeY,
            displayX: this.displayGazeX,
            displayY: this.displayGazeY
        };
    }

    recordClick(x, y) {
        if (webgazer && typeof webgazer.recordClick === 'function') {
            webgazer.recordClick(x, y);
        }
    }

    setMouseClickCallback(callback) {
        if (webgazer) {
            webgazer.setMouseClickCallback(callback);
        }
    }

    setRegression(type) {
        if (webgazer) {
            webgazer.setRegression(type);
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WebGazerManager;
}
