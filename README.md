# 🎮 Physics Legends - Olympiad Adventure

**A web-based educational RPG + Roguelike game for physics competition preparation**

## 🎯 Project Overview

Physics Legends is an interactive Progressive Web App (PWA) that transforms physics learning into an engaging RPG experience. Players take on the role of Physics Scholars, progressing through 10 mystical kingdoms while solving dynamically-generated physics problems to defeat enemies and bosses.

**Key Features:**
- 🧮 Procedurally generated physics questions (100,000+ unique variations)
- 🗡️ Real-time combat system based on problem-solving
- 🏆 10 unique kingdoms from Kinematics to Olympiad Tower
- 📚 Comprehensive learning modes with detailed explanations
- ⭐ Achievement system and local leaderboard
- 📱 Fully responsive (Desktop, Tablet, Mobile)
- ⚡ Progressive Web App - works offline
- 🎨 Modern sci-fi RPG visual design

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (for development)
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No backend required - everything runs locally!

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/djjdidifdiifxooox-debug/physics-legends-main.git
cd physics-legends-main

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser (typically http://localhost:5173)
```

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## 📁 Project Structure

```
physics-legends-main/
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── icons/                  # App icons for PWA
│   ├── sound/                  # Audio assets
│   └── sw.js                   # Service Worker
│
├── src/
│   ├── index.html             # Main HTML entry
│   ├── css/
│   │   ├── styles.css         # Global styles
│   │   ├── animations.css     # Animations
│   │   └── responsive.css     # Mobile layouts
│   │
│   └── js/
│       ├── main.js            # Entry point
│       ├── core/              # Game engine
│       ├── systems/           # Game systems
│       ├── generation/        # Question generation
│       ├── ui/                # UI management
│       ├── storage/           # Save system
│       ├── audio/             # Sound effects
│       └── utils/             # Utilities
│
├── package.json
├── vite.config.js
└── DEPLOYMENT.md
```

## 🎮 Game Modes

1. **Adventure Mode** - Progress through kingdoms
2. **Olympiad Mode** - Advanced problems
3. **Learning Mode** - Study without pressure
4. **Daily Challenges** - Time-limited quests

## 🧮 Physics Topics

Kinematics, Dynamics, Energy, Momentum, Electricity, Magnetism, Waves, Thermodynamics, Modern Physics, and Olympiad-level content.

## 💾 Data Storage

100% client-side using LocalStorage. No backend required!

## 🚀 Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

---

**Made with ❤️ for physics enthusiasts**

**Version**: 1.0.0-beta | **Updated**: June 3, 2026
