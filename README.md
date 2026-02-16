# Bloom

**The all-in-one parenting super app.**

Bloom is a premium iOS application designed for young parents, combining daily logistics, educational content, health tracking, and memory keeping into a single, polished experience. The core value proposition is the seamless blend of rational management (health data, scheduling, task tracking) with emotional connection (memories, yearbook, birthday interviews).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Design System](#design-system)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Dashboard (Today)

- Personalized greeting with the child's computed age
- Contextual "Tip of the Day" hero card
- Interactive daily timeline with tap-to-complete events
- Bento-grid quick stats (completed tasks, latest weight, modules progress)
- Rewind yearbook teaser with animated progress ring

### Academy (Learn)

- Gamified learning path inspired by Duolingo's progression model
- Zig-zag node map with locked, available, and completed states
- SVG connector curves between nodes
- Badge collection system with visual rewards

### Health (Care)

- Growth charts with weight/height toggle
- Bar chart visualization of historical measurements
- Vaccine and medical log with upcoming/completed status
- Tap-to-mark-done interaction for vaccine records

### Memories (Rewind)

- Birthday Interview mode with guided prompts and video recording placeholder
- Rewind yearbook with animated circular progress indicator
- Monthly photo/video timeline grid
- Memory capture entry point

---

## Tech Stack

| Layer              | Technology                                  |
| ------------------ | ------------------------------------------- |
| Framework          | React Native (Expo SDK 54)                  |
| Language           | TypeScript (strict mode)                    |
| Navigation         | Expo Router (file-based routing)            |
| State Management   | Zustand with persist middleware             |
| Data Persistence   | MMKV (local-first, high-performance)        |
| Animation          | React Native Reanimated 3 + Moti            |
| Charts             | Custom View-based bar charts (MVP)          |
| Graphics           | React Native SVG                            |
| Haptics            | Expo Haptics                                |
| Icons              | Expo Vector Icons (Ionicons)                |

---

## Project Structure

```
bloom/
  app/                          # Expo Router file-based routes
    _layout.tsx                 # Root layout (gesture handler, status bar, stack)
    (tabs)/
      _layout.tsx               # Tab navigator with custom BloomTabBar
      index.tsx                 # Dashboard ("Today")
      academy.tsx               # Academy ("Learn")
      health.tsx                # Health ("Care")
      memories.tsx              # Memories ("Rewind")
    modal.tsx                   # Modal route
  src/
    components/
      ui/
        Card.tsx                # Pressable card with spring animation
        Badge.tsx               # Gamification pill badge
        ProgressRing.tsx        # Animated SVG circular progress
        index.ts                # Barrel export
      navigation/
        BloomTabBar.tsx         # Custom bottom tab bar with floating action button
      academy/
        LearningPath.tsx        # Duolingo-style vertical path map
    store/
      useBloomStore.ts          # Zustand store with MMKV persistence
      index.ts                  # Barrel export
    theme/
      colors.ts                 # Color palette and semantic tokens
      spacing.ts                # Spacing scale, border radii, shadow presets
      typography.ts             # Type scale definitions
      index.ts                  # Barrel export
    utils/
      helpers.ts                # Date/age utilities, ID generation
  assets/                       # Fonts, images, icons
  tsconfig.json                 # TypeScript configuration (strict)
  app.json                      # Expo configuration
  package.json                  # Dependencies and scripts
```

---

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- Expo CLI (`npx expo` — included with the project)
- For iOS testing: Xcode 15+ (macOS only) or the Expo Go app on a physical device

### Installation

```bash
git clone https://github.com/Thibaut0000/Bloom.git
cd Bloom
npm install
```

### Running the App

```bash
# Start the development server
npx expo start

# Run directly on iOS Simulator (macOS only)
npx expo start --ios

# Run in a web browser
npx expo start --web

# Run on a physical device
# Scan the QR code displayed in the terminal using the Expo Go app
```

### Available Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `npm start`          | Start the Expo development server        |
| `npm run ios`        | Launch on iOS Simulator                  |
| `npm run android`    | Launch on Android emulator               |
| `npm run web`        | Launch in the web browser                |

---

## Design System

### Color Palette

The visual identity uses vibrant yet soothing pastel colors, each mapped to a feature domain:

| Token        | Hex       | Usage                    |
| ------------ | --------- | ------------------------ |
| Mint Green   | `#A8E6CF` | Health / Care            |
| Sunny Yellow | `#FFD93D` | Tips / Academy           |
| Soft Coral   | `#FF8B94` | Memories / Rewind        |
| Lavender     | `#C3AED6` | Badges / Gamification    |
| Sky Blue     | `#87CEEB` | Informational / Neutral  |

### Typography

A playful yet readable type scale ranging from `hero` (34px, weight 800) down to `overline` (10px, weight 600), with consistent line heights and letter spacing.

### Spacing and Radii

- 4-point spacing grid (`xs: 4` through `6xl: 64`)
- Generous border radii (`xl: 20`, `2xl: 24`, `3xl: 32`) for the signature soft, rounded aesthetic
- Three shadow depth presets (`sm`, `md`, `lg`) using iOS-style diffused shadows

### Interaction Principles

- Spring-based press animations on all interactive cards (damping: 12, stiffness: 200)
- Haptic feedback on every user interaction (selection, impact, notification)
- Staggered `FadeInDown` entry animations on screen content

---

## Architecture

### State Management

The application uses a single Zustand store (`useBloomStore`) that manages:

- Parent and child profile data
- Daily timeline events
- Growth measurements (weight/height history)
- Vaccine records
- Completed learning modules
- Captured memories

All state is persisted locally via MMKV through Zustand's `persist` middleware, ensuring instant load times and offline-first behavior.

### Navigation

Expo Router provides file-based routing with a tab navigator at the root. The custom `BloomTabBar` component replaces the default tab bar and includes:

- Four tab buttons (Today, Learn, Care, Rewind) with animated press feedback
- A central floating action button (FAB) that expands into a radial menu
- Active tab indicator dots with spring animations

### Component Patterns

- All UI primitives (`Card`, `Badge`, `ProgressRing`) are composable and accept style overrides
- Animation logic is co-located with components using Reanimated's `useAnimatedStyle` and `useSharedValue`
- Screen components follow a consistent pattern: safe area insets, staggered entry animations, section-based layout

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "feat: add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please follow conventional commit messages and ensure TypeScript compiles without errors before submitting.
