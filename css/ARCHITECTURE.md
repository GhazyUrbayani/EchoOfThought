/* ========================================
   CSS ARCHITECTURE GUIDE
   ======================================== */

/*
📁 CSS File Structure:
├── main.css        - Variables, base styles, global layout
├── components.css  - Reusable UI components
└── webgazer.css    - Eye tracking specific styles

🎨 Design System:

Colors:
--color-primary: #38d0e5        (Cyan - buttons, borders)
--color-primary-hover: #2ab8cc  (Hover state)
--color-bg-dark: #101622        (Background)
--color-bg-narrative: #1a3a68   (Boxes, panels)
--color-text-light: #f2f2f2     (Text)
--color-shadow: #000000         (Shadows)

Spacing Scale:
--spacing-sm: 20px
--spacing-md: 30px
--spacing-lg: 40px

Typography:
Font: 'Press Start 2P' (Pixel/Retro style)
Sizes: 
  - Title: 2.5rem
  - Body: 0.85rem
  - Button: 0.9rem

Effects:
- Border: 4px solid
- Shadow: 4px 4px 0px (Pixel art style)
- Hover: translate(2px, 2px)
- Active: translate(4px, 4px)

📱 Responsive Breakpoints:
- Mobile: max-width: 600px

🔄 Component Naming:
.cyber-*      - Cyberpunk themed components
.modal-*      - Modal related styles
.container-*  - Layout containers
.loading-*    - Loading states

💡 Usage Examples:

1. Create a button:
<button class="cyber-button">Text</button>

2. Create a modal:
<div class="modal-overlay">
  <div class="container-box">
    <div class="cyber-box">
      <h1 class="cyber-title">Title</h1>
      <p class="cyber-text">Text</p>
    </div>
  </div>
</div>

3. Create instruction box:
<div class="instruction-box">
  <p>Instructions here</p>
</div>

🎯 Customization:

To change theme colors, edit :root in main.css:
:root {
  --color-primary: #YOUR_COLOR;
}

To add new component, add to components.css:
.new-component {
  // Use CSS variables
  background-color: var(--color-bg-narrative);
  border: var(--border-width) solid var(--border-color);
}

📝 Best Practices:

1. Always use CSS variables for colors/spacing
2. Keep specificity low (avoid !important)
3. Mobile-first approach
4. Group related properties
5. Comment complex calculations
6. Maintain consistent naming

🔍 Class Hierarchy:

.modal-overlay              (Full screen)
  └── .container-box        (Width constraint)
      └── .cyber-box        (Styled container)
          ├── .cyber-title  (Heading)
          ├── .cyber-text   (Paragraph)
          └── .cyber-button (Button)

*/
