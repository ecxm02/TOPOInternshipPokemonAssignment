# Pokemon Team Builder and Analyzer

Technical assessment project for Topo EH-AI Consulting (Software Developer Intern 2026).

## Overview

This application allows users to build a team of up to 6 Pokemon using PokéAPI and evaluate team quality through type, stat, and role analysis.

## Live Demo

**For convenience, the final product is hosted on the web, so you do not need to build it locally:**

https://topo-internship-pokemon-assignment-813qur93e-ecxm02s-projects.vercel.app/

Key goals:
- Integrate external API data into a responsive UI
- Analyze team composition with clear, explainable heuristics
- Present weaknesses, strengths, and recommendations in an easy-to-read format

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm

### Install Dependencies

```bash
npm install
```

### Run the App (Development)

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Features

### 1. Team Builder
- Search Pokemon by name with fuzzy matching.
- Fetch Pokemon data from PokéAPI.
- Add up to 6 Pokemon to a team.
- Remove Pokemon from any team slot.
- Team updates dynamically as members are added or removed.
- Team is persisted in browser localStorage.
- Clicking a Pokemon card opens a modal with expanded information, including:
  - Name
  - Types
  - Base stats
  - Abilities

### 2. Team Analysis

#### Type Analysis (2 Sections)
- Overall section:
  - Shows types your team does not resist defensively
  - Shows types your team does not hit super-effectively offensively
- Breakdown section:
  - Deals Extra Damage To
  - Deals Less Damage To
  - Takes Extra Damage From
  - Takes Less Damage From

#### Stat and Role Coverage
- Team stat totals for HP, Attack, Defense, Special Attack, Special Defense, and Speed.
- Role classification using base-stat heuristics:
  - Physical Sweeper
  - Special Sweeper
  - Physical Tank
  - Special Tank
  - Mixed Attacker
  - Support/Utility
- Role distribution panel to reveal missing or overstacked roles.

### 3. Recommendations
- Rule-based recommendations identify:
  - Missing resistances
  - Missing offensive strengths
  - Missing role categories
  - Overlapping team composition patterns
- Produces concise Issue and Fix guidance.
- Suggestion wording adjusts based on whether team slots are still open.

## Approach and Architecture

Architecture follows a modular React pattern:
- UI components in `src/components` grouped by domain:
  - Team
  - TypeAnalysis
  - StatAnalysis
  - Recommendation
  - Misc
- Data/state hooks in `src/hooks`:
  - `usePokemon` for Pokemon detail fetch + cache
  - `usePokemonIndex` for searchable Pokemon index + localStorage cache
  - `useTeam` for team state and persistence
- Analysis utilities in `src/utils`:
  - Type effectiveness and coverage logic
  - Role classification logic
  - Fuzzy search ranking

PokéAPI endpoints used:
- https://pokeapi.co/api/v2/pokemon/{nameOrId}
- https://pokeapi.co/api/v2/pokemon?limit=1302&offset=0

## Testing Instructions

This submission currently has no automated test suite configured.

Use the following manual scenario tests in the browser:

1. Team size limit
Action: Add any 6 Pokemon, then try to add a 7th.
Expected result: Team count stays at 6, and no additional Pokemon is added.

2. Add and remove flow
Action: Add 3 Pokemon, remove 1 from the middle slot.
Expected result: Team updates immediately and remaining Pokemon keep their own cards/data.

3. Pokemon details modal
Action: Click any Pokemon card in the team grid.
Expected result: A modal opens showing expanded information (name, types, base stats, abilities). Closing the modal returns to the same team state.

4. Type Analysis mode switch
Action: Open Type Analysis and toggle between Overall and Breakdown.
Expected result: Overall shows team-level gaps; Breakdown shows the four detailed sections (Deals Extra Damage To, Deals Less Damage To, Takes Extra Damage From, Takes Less Damage From).

5. Recommendations react to composition
Action: Build an offense-heavy team with similar roles, then add a defensive Pokemon or replace one member.
Expected result: Recommendation Issue/Fix items update based on missing roles and coverage gaps.

6. Persistence check
Action: Build a team, refresh the browser.
Expected result: Team is restored from localStorage.

## Assumptions and Challenges

### Assumptions
- Full competitive mechanics are out of scope (movesets, items, weather, abilities in battle).
- Type coverage uses Pokemon typing and simple effectiveness logic, not full move-pool optimization.
- Recommendation rules are intentionally simple and explainable.

### Challenges
- Balancing clear logic with useful recommendations while keeping rules lightweight.
- Handling dual-type effectiveness consistently for both offense and defense.
- Keeping UI responsive while querying and rendering many possible Pokemon entries.

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 4
- Recharts
- ESLint 9
