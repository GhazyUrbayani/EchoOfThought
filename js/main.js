/**
 * Main initialization script
 * Sets up the game and handles UI interactions
 */

// Global game instance
let game;
let bgImage;

// p5.js preload function - loads assets before setup
function preload() {
    // Try to load background image (supports GIF, JPG, PNG)
    bgImage = loadImage('school-bg.gif', 
        () => console.log('✓ Background image loaded (GIF)'),
        () => {
            console.warn('⚠ Failed to load school-bg.gif, using fallback...');
            bgImage = null;
        }
    );
}

// p5.js setup function
function setup() {
    game = new EchoOfThoughtGame();
    game.setup();
    
    // Pass background image to game
    if (bgImage) {
        game.bgImage = bgImage;
    }
}

// p5.js draw function
function draw() {
    if (game) {
        game.draw();
    }
}

// p5.js mouse pressed event
function mousePressed() {
    if (game) {
        // Handle menu click
        if (game.handleMouseClick) {
            game.handleMouseClick();
        }
        // Handle original mouse press
        if (game.handleMousePress) {
            game.handleMousePress();
        }
    }
}

// p5.js window resized event
function windowResized() {
    if (game) {
        game.handleWindowResize();
    }
}

// p5.js key pressed event - for restarting from endgame
function keyPressed() {
    if (game && game.stateManager.isState('ENDGAME')) {
        if (key === ' ' || keyCode === 32) {
            window.location.reload();
        }
    }
}

// Permission modal handler
async function startExperience() {
    const button = document.getElementById('permission-button');
    const loadingText = document.getElementById('loading-text');
    const modal = document.getElementById('permission-modal');

    if (button) button.style.display = 'none';
    if (loadingText) {
        loadingText.style.display = 'block';
        loadingText.classList.add('active');
    }

    if (game) {
        const success = await game.start();
        if (success && modal) {
            modal.style.display = 'none';
        }
    }
}

// Initialize permission button when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const permissionButton = document.getElementById('permission-button');
    if (permissionButton) {
        permissionButton.addEventListener('click', startExperience);
    }
});
