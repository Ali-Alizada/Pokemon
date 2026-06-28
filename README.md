# 📱 Pokedex Web App

A modern, fast, and interactive Pokedex web application powered by the official **PokeAPI**. The project is implemented entirely using a native frontend stack (Vanilla HTML5, CSS3, JavaScript) and features key performance optimizations including client-side caching, infinite scrolling, and a dynamic color-theming system that adapts to each Pokemon's primary type.

---

## 🚀 Features

- **Infinite Scrolling (Lazy Loading):** Loads Pokemon in optimized batches of 24 to minimize initial page load times and data overhead.
- **Real-Time Search & Filtering:** Instantly search by name or ID, updating the user interface dynamically as you type.
- **Dynamic Theming System:** Cards and detail modals automatically adopt color themes matching the Pokemon's primary element type (e.g., red for fire, blue for water).
- **Comprehensive Info Modal:** Displays in-depth information organized into three interactive tabs:
  - **Main:** General data including height, weight, base experience, and abilities.
  - **Stats:** Visual progress bars representing base stats (HP, Attack, Defense, Special Attack, Special Defense, Speed).
  - **Evo Chain:** The full evolution path of the Pokemon, complete with corresponding sprites.
- **Seamless Navigation:** Cycle through previous and next Pokemon directly within the detail modal using navigation arrow buttons.
- **Performance Caching:** Uses an in-memory client-side cache for Pokemon details and evolution chains to eliminate redundant API requests.
- **Fully Responsive:** Adapts seamlessly to all screen sizes, from mobile devices and tablets to desktop monitors.

---

## 🛠️ Tech Stack

This project is built using standard web technologies:

| Technology | Badge | Description |
| :--- | :---: | :--- |
| **HTML5** | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | Semantic structure ensuring accessibility (a11y) and search engine optimization (SEO). |
| **CSS3** | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | Custom styling, CSS variables, flexbox/grid layout, and smooth micro-interactions. |
| **JavaScript (ES6+)** | ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | Dynamic DOM manipulation, asynchronous data fetching (Fetch API), caching, and scroll event handling. |
| **PokeAPI** | ![PokeAPI](https://img.shields.io/badge/PokeAPI-EF5350?style=flat-square&logo=pokemon&logoColor=white) | RESTful API serving as the primary data source for stats, sprites, and evolution details. |

---

## 📁 Project Structure

The project directory is structured cleanly for ease of maintenance and extensibility:

```text
Pokemon/
├── assets-/                 # UI graphics and icons (navigation arrows, close icon, etc.)
│   ├── arrow-links.png      # Navigation arrow (previous Pokemon)
│   ├── arrow-right.-3png.png# Navigation arrow (next Pokemon)
│   ├── pokemon-ball-1.jpg   # Pokedex logo / favicon
│   ├── pokmrmon-ball.svg    # Pokéball SVG graphic
│   └── x-icon.svg           # Search field close icon
├── fonts/                   # Local font assets (Raleway)
│   └── raleway-v37-latin-regular.woff2
├── index.html               # Semantic HTML base structure
├── style.css                # Base layouts, type-specific coloring, and responsive designs
├── script.js                # Core app logic (API requests, caching, infinite scroll, modals)
├── template.js              # HTML string template functions for dynamic Pokemon cards
└── README.md                # Project documentation
```

---

## ⚙️ Installation & Usage

Since this is a client-side frontend application, no build or compilation step is required. You can run it directly in your browser.

### Option A: Local Development Server (Recommended)
To prevent potential CORS limitations and ensure a smooth local environment, running a simple local server is highly recommended:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Pokemon.git
   cd Pokemon
   ```

2. **Start a local server:**
   - **With VS Code:** Install the **Live Server** extension, then click the `Go Live` button in the status bar.
   - **With Python:**
     ```bash
     python -m http.server 8000
     ```
     Navigate to `http://localhost:8000` in your web browser.
   - **With Node.js (npm):**
     ```bash
     npx serve .
     ```
     Navigate to `http://localhost:3000` in your web browser.

### Option B: Direct Execution
Alternatively, you can open [index.html](index.html) directly in any modern browser by double-clicking the file.

---

## 🔍 Detailed Feature Walkthrough

### 1. Searching & Sorting
- Type inside the search field to filter the listed Pokemon in real-time.
- Switch the sorting filter radio button to **Number** to search by exact IDs (e.g., `025` or `25` for Pikachu).
- Switch the filter to **Name** to perform a text-based search.

### 2. Modals & Navigation
- Clicking any Pokemon card opens the detail modal.
- Use the left and right navigation arrows overlaying the sprite to cycle through adjacent Pokemon in the filtered list without closing the modal view.

### 3. Modal Tabs
- **Main:** Highlights key properties (Height, Weight, Base Experience, Abilities).
- **Stats:** Renders a clean visual breakdown of the base stats (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed).
- **Evo Chain:** Renders the chronological evolution cycle of the Pokemon with sprites.

---

## ⚡ Under the Hood: Technical Details

### 💾 In-Memory Caching
To minimize API requests to the PokeAPI server and deliver an instantaneous user experience, fetched details and evolution configurations are stored in memory:
```javascript
const pokemonCache = {};
const evolutionCache = {};
```
Whenever a Pokemon is queried a second time (e.g., when clicking through navigation or reopening a modal), the application reads the cached data directly from RAM.

### 📜 Infinite Scrolling Logic
Pokemon cards are loaded in batches of `24` (`BATCH_SIZE`). The scroll event handler listens to screen progression and requests the next batch when reaching the bottom:
```javascript
function handleScroll() {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
  if (nearBottom && renderIndex < filteredPokemons.length) {
    renderNextBatch();
  }
}
```
Additionally, `fillUntilScrollable` verifies that high-resolution screens are filled with enough items to generate a vertical scrollbar, avoiding layout lockups.

### 🎨 Class-Based Color Themes
CSS variable overrides and class bindings dynamically style Pokemon cards based on their element classification. On load, the class `type-[typeName]` (e.g., `type-fire`) is assigned to the card node and the detail modal. In `style.css`, these correspond to distinct background colors, rendering a beautiful and tailored UI.

---

## 📝 License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) (if present) for details.

---
*Data provided by [PokeAPI](https://pokeapi.co/).*
