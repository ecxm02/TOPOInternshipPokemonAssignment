# Pokémon Team Builder

A premium, analytical tool for building Pokémon teams using PokéAPI.

## 🌟 Features
- **Stat Visualization**: Radar charts for base stat distributions.
- **Smart Analysis**: Automatic role classification and type coverage reporting.
- **Modern UI**: Dark-mode glassmorphism theme with smooth animations.
- **Persistence**: Auto-saves your team to LocalStorage.

## 🛠️ Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Locally**:
   ```bash
   npm run dev
   ```

3. **Open App**:
   Navigate to [http://localhost:5173/](http://localhost:5173/) in your browser.

## 🏗️ Architecture
- **`src/hooks/`**: Custom hooks for data fetching (`usePokemon`) and state management (`useTeam`).
- **`src/utils/`**: Logic for type effectiveness (`typeMatrix`) and role classification (`roleClassifier`).
- **`src/components/`**: Modular React components for a clean, maintainable UI.

## 📝 Assumptions
- Animated sprites are available for Pokémon from Gen I to Gen V.
- Fallback to official artwork is used for Gen VI+.
- Simple heuristics are used for role classification.

*Built with React, Vite, Tailwind CSS v4, and Recharts.*
