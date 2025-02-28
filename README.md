# Nuxt GSAP Project

This project is a Nuxt.js application that integrates GSAP for animations and uses SCSS for styling. It features a slider component that showcases images or videos with navigation controls.

## Project Structure

```
nuxt-gsap-project
├── assets
│   └── styles
│       └── main.scss       # Main SCSS styles for the project
├── components
│   └── Slider.vue          # Slider component with navigation and validation
├── layouts
│   └── default.vue         # Default layout for the application
├── pages
│   └── index.vue           # Main page that uses the Slider component
├── plugins
│   └── gsap.js             # GSAP initialization and configuration
├── static                  # Directory for static assets
├── store                   # Directory for Vuex store files
├── nuxt.config.js          # Nuxt configuration file
└── README.md               # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd nuxt-gsap-project
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Usage

To run the project in development mode, use:
```
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Slider Component

The `Slider` component accepts an array of slide data and includes navigation methods to cycle through the slides. It validates that there are at least 3 slides and initializes GSAP animations on mount.

## Styling

The project uses SCSS for styling. You can find the main styles in `assets/styles/main.scss`. Feel free to customize the styles as needed.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.