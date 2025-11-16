/**
 * ========================================
 * JAVASCRIPT ARCHITECTURE GUIDE
 * ========================================
 * 
 * This guide explains the OOP structure and how to work with it.
 */

/*
📁 JavaScript File Structure:
├── GameStateManager.js      - State management
├── GazeOrb.js              - Interactive orbs
├── WebGazerManager.js      - Eye tracking
├── CalibrationManager.js   - Calibration system
├── EchoOfThoughtGame.js    - Main controller
└── main.js                 - Initialization

🎯 Class Responsibilities:

1. GameStateManager
   - Manages: Game state (START, CALIBRATING, CHOICE, FINAL)
   - When to use: State transitions, checking current state
   - Example:
     stateManager.setState('CHOICE');
     if (stateManager.isState('CALIBRATING')) { }

2. GazeOrb
   - Manages: Individual choice quadrants
   - When to use: Creating interactive areas
   - Example:
     const orb = new GazeOrb('EMOTION', 'top-left', [r, g, b]);
     orb.checkGaze(gazeX, gazeY, width, height);
     orb.update();
     orb.draw(width, height);

3. WebGazerManager
   - Manages: Eye tracking, video feed, gaze coordinates
   - When to use: Accessing gaze data, initializing tracker
   - Example:
     await webgazerManager.initialize();
     const gaze = webgazerManager.getGazePosition();
     webgazerManager.recordClick(x, y);

4. CalibrationManager
   - Manages: Calibration points and progress
   - When to use: Calibration process
   - Example:
     const point = calibrationManager.getCurrentPoint();
     calibrationManager.nextPoint();
     if (calibrationManager.isComplete()) { }

5. EchoOfThoughtGame
   - Manages: Overall game flow, integrates all managers
   - When to use: Main game logic, scene rendering
   - Example:
     const game = new EchoOfThoughtGame();
     game.setup();
     await game.start();

📊 Data Flow:

User Action → Event Handler → Game Controller → Managers → Update State → Render

Example flow for calibration:
1. User clicks → mousePressed() in main.js
2. game.handleMousePress()
3. webgazerManager.recordClick()
4. calibrationManager.nextPoint()
5. stateManager.setState('CHOICE')
6. Render updates automatically

🔄 Game Loop:

setup() {
  // Initialize once
  - Create managers
  - Setup canvas
  - Initialize orbs
}

draw() {
  // Called every frame
  - Process video
  - Update gaze
  - Render current state
  - Check for state changes
}

💡 Common Tasks:

1. Add New Emotion:
   In EchoOfThoughtGame.setup():
   this.orbs.push(
     new GazeOrb('NEW_EMOTION', 'position', [r, g, b])
   );

2. Add New Game State:
   In GameStateManager:
   this.states.NEW_STATE = 'NEW_STATE';
   
   In EchoOfThoughtGame.draw():
   case 'NEW_STATE':
     this.drawNewState();
     break;

3. Modify Calibration Points:
   In CalibrationManager.constructor:
   Change this.totalPoints = 9;

4. Change Gaze Sensitivity:
   In WebGazerManager.constructor:
   Change this.GAZE_UPDATE_INTERVAL = 150;

5. Customize Visual Effects:
   In GazeOrb.draw():
   Modify drawing code

🐛 Debugging Tips:

1. Check State:
   console.log(game.stateManager.getState());

2. Check Gaze Position:
   const gaze = game.webgazerManager.getGazePosition();
   console.log(gaze.x, gaze.y);

3. Check Calibration Progress:
   const progress = game.calibrationManager.getProgress();
   console.log(progress);

4. Check Orb Status:
   game.orbs.forEach(orb => {
     console.log(orb.label, orb.timer, orb.hover);
   });

📝 Code Style Guidelines:

1. Class Names: PascalCase (EchoOfThoughtGame)
2. Methods: camelCase (getCurrentPoint)
3. Constants: UPPER_SNAKE_CASE (GAZE_UPDATE_INTERVAL)
4. Private-ish: prefix with _ (_internalMethod)
5. Always add JSDoc comments for classes/methods

🎨 Extending the System:

Add Story Manager:

class StoryManager {
  constructor() {
    this.scenes = [];
    this.currentSceneId = 0;
  }
  
  loadScene(id) {
    // Load scene data
  }
  
  nextScene() {
    this.currentSceneId++;
  }
  
  getCurrentScene() {
    return this.scenes[this.currentSceneId];
  }
}

Integrate in EchoOfThoughtGame:

constructor() {
  // ... existing code
  this.storyManager = new StoryManager();
}

Add AI Response Manager:

class AIResponseManager {
  constructor() {
    this.apiEndpoint = '';
  }
  
  async generateResponse(emotion, context) {
    // API call to AI
  }
}

🔗 Integration Points:

1. Before Game Start:
   - Load story data
   - Initialize AI client
   - Setup analytics

2. During Calibration:
   - Track progress
   - Save calibration data

3. After Choice:
   - Send choice to AI
   - Get response
   - Update story state

4. Before End:
   - Save game data
   - Track analytics
   - Prepare ending

⚡ Performance Tips:

1. Minimize draw() operations
2. Use object pooling for repeated objects
3. Cache frequently accessed data
4. Throttle gaze updates (already implemented)
5. Use requestAnimationFrame (p5.js handles this)

🔒 Error Handling:

try {
  await game.webgazerManager.initialize();
} catch (error) {
  console.error('WebGazer failed:', error);
  // Show fallback UI
}

📦 Building for Production:

1. Minify JS files
2. Combine CSS files
3. Optimize images
4. Enable gzip compression
5. Add service worker for offline support

🧪 Testing:

Unit Test Example:
test('GazeOrb detects hover in correct quadrant', () => {
  const orb = new GazeOrb('TEST', 'top-left', [0,0,0]);
  orb.checkGaze(100, 100, 800, 600);
  expect(orb.hover).toBe(true);
});

Integration Test Example:
test('Game transitions from CALIBRATING to CHOICE', () => {
  const game = new EchoOfThoughtGame();
  game.setup();
  game.stateManager.setState('CALIBRATING');
  // Simulate calibration complete
  expect(game.stateManager.getState()).toBe('CHOICE');
});

📚 Resources:

- OOP in JavaScript: MDN Web Docs
- p5.js Reference: p5js.org/reference
- WebGazer API: github.com/brownhci/WebGazer
- Game Design Patterns: gameprogrammingpatterns.com

✅ Checklist for New Features:

□ Create new class if needed
□ Add to appropriate manager
□ Update game controller
□ Add CSS if UI changes
□ Update README
□ Test thoroughly
□ Document API
□ Consider mobile support

*/

// Example: Complete Feature Addition

/*
// 1. Create new class
class ScoreManager {
  constructor() {
    this.score = 0;
  }
  
  addPoints(points) {
    this.score += points;
  }
  
  getScore() {
    return this.score;
  }
}

// 2. Add to game
class EchoOfThoughtGame {
  constructor() {
    // ... existing code
    this.scoreManager = new ScoreManager();
  }
  
  // Use it
  handleChoice() {
    this.scoreManager.addPoints(10);
  }
}

// 3. Update UI (components.css)
.score-display {
  position: fixed;
  top: 20px;
  right: 20px;
  color: var(--color-primary);
  font-size: 1.5rem;
}

// 4. Render it
drawScoreDisplay() {
  fill(56, 208, 229);
  textAlign(RIGHT, TOP);
  textSize(24);
  text(`Score: ${this.scoreManager.getScore()}`, 
       windowWidth - 20, 20);
}
*/
