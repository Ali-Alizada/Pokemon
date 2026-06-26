# 📱 Pokedex Web-App

Eine moderne, schnelle und interaktive Pokedex-Web-Applikation, die auf der offiziellen **PokeAPI** basiert. Das Projekt ist komplett in einem nativen Frontend-Stack (Vanilla HTML5, CSS3, JavaScript) implementiert und glänzt durch Performance-Optimierungen wie Client-seitiges Caching, Infinite Scroll und ein dynamisches Design, das sich farblich an den jeweiligen Pokemon-Typ anpasst.

---

## 🚀 Features

- **Infinite Scrolling (Lazy Loading):** Lädt Pokemon in optimierten Chargen von 24 Stück, um Ladezeiten und Datenübertragung zu minimieren.
- **Echtzeit-Suche & Filterung:** Blitzschnelle Suche nach Name oder ID mit sofortiger Aktualisierung der Benutzeroberfläche.
- **Dynamisches Theme-System:** Die Detail-Karten und das Modal übernehmen automatisch die typischen Farben des primären Pokemon-Typs (z. B. Rot für Feuer, Blau für Wasser).
- **Detailreiches Info-Modal:** Zeigt Detailinformationen zu jedem Pokemon über drei Tabs:
  - **Main:** Größe, Gewicht, Basis-Erfahrung, Fähigkeiten.
  - **Stats:** Balkendiagramm-Visualisierung aller Basis-Statuswerte (HP, Attack, Defense, etc.).
  - **Evo Chain:** Die vollständige Evolutionskette des Pokemons mit visuellen Sprites.
- **Nahtlose Modal-Navigation:** Vorheriges und nächstes Pokemon können direkt im geöffneten Modal über Pfeiltasten durchgeblättert werden.
- **Performance Caching:** Lokaler In-Memory Cache für Pokemon-Details und Evolutionsketten, um redundante API-Aufrufe bei erneuter Auswahl zu verhindern.
- **Responsive Layout:** Das Design passt sich fließend an alle Bildschirmgrößen an (Mobilgeräte, Tablets, Desktop-Monitore).

---

## 🛠️ Tech Stack

Hier sind die eingesetzten Kern-Technologien dieses Projekts:

| Technologie | Badge | Beschreibung |
| :--- | :---: | :--- |
| **HTML5** | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | Semantische Strukturierung der Web-Applikation für beste Barrierefreiheit (a11y) und SEO. |
| **CSS3** | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | Modernes Styling mit CSS-Variablen, Flexbox, Grid und weichen Transitionen für Mikro-Interaktionen. |
| **JavaScript (ES6+)** | ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | Native DOM-Manipulation, asynchrone Datenabfragen (Fetch API), Client-seitiges Caching und Infinite Scrolling. |
| **PokeAPI** | ![PokeAPI](https://img.shields.io/badge/PokeAPI-EF5350?style=flat-square&logo=pokemon&logoColor=white) | Die RESTful API als zentrale Datenquelle für Pokemon-Daten, Sprites, Statuswerte und Evolutionsketten. |

---

## 📁 Projektstruktur

Das Projekt ist modular und übersichtlich strukturiert, um Wartbarkeit und Erweiterbarkeit zu gewährleisten:

```text
Pokemon/
├── assets-/                 # Grafiken und UI-Icons (Pfeile, Schließen-Symbol, etc.)
│   ├── arrow-links.png      # Navigationspfeil (vorheriges Pokemon)
│   ├── arrow-right.-3png.png# Navigationspfeil (nächstes Pokemon)
│   ├── pokemon-ball-1.jpg   # Pokedex-Logo / Favicon
│   ├── pokmrmon-ball.svg    # Pokéball SVG-Grafik
│   └── x-icon.svg           # Suchfeld-Schließen-Symbol
├── fonts/                   # Lokale Schriftart-Dateien (Raleway)
│   └── raleway-v37-latin-regular.woff2
├── index.html               # Semantische HTML-Struktur der Pokedex
├── style.css                # Layouts, Typen-Stile (Farben) und responsive Layouts
├── script.js                # Core-App-Logik (API-Abfragen, Infinite Scroll, Caching, Modal-Steuerung)
├── template.js              # HTML-Template-Funktionen für dynamisches Rendering der Pokemon-Karten
└── README.md                # Dokumentation des Projekts
```

---

## ⚙️ Installation & Inbetriebnahme

Da es sich um eine reine Client-seitige Web-Applikation handelt, ist kein Build-Schritt erforderlich. Du kannst das Projekt direkt im Browser starten.

### Option A: Lokaler Entwicklungs-Server (Empfohlen)
Um CORS-Probleme zu vermeiden und eine saubere Entwicklungsumgebung zu gewährleisten, empfiehlt sich die Verwendung eines lokalen Web-Servers:

1. **Repository klonen:**
   ```bash
   git clone https://github.com/DEIN_BENUTZERNAME/Pokemon.git
   cd Pokemon
   ```

2. **Lokalen Server starten:**
   - **Mit VS Code:** Installiere die Extension **Live Server** und klicke unten rechts auf `Go Live`.
   - **Mit Python:**
     ```bash
     python -m http.server 8000
     ```
     Öffne danach `http://localhost:8000` im Browser.
   - **Mit Node.js (npm):**
     ```bash
     npx serve .
     ```
     Öffne danach `http://localhost:3000` im Browser.

### Option B: Direktes Öffnen
Alternativ kannst du die Datei `index.html` direkt per Doppelklick in deinem Webbrowser öffnen.

---

## 🔍 Bedienung & Features im Detail

### 1. Suche & Sortierung
- Gib im Suchfeld den Namen eines Pokemons ein, um die Liste in Echtzeit zu filtern.
- Du kannst auch direkt nach der ID (z. B. `025` oder `25` für Pikachu) suchen, indem du den Sortierungs-Radiobutton auf **Number** stellst.
- Verwende den Filter **Name**, um nach Namensbestandteilen zu suchen.

### 2. Details und Navigation
- Klicke auf eine Pokemon-Karte, um die Detailansicht (Modal) zu öffnen.
- Im Detail-Modal siehst du die Werte und Entwicklungen. Klicke auf die Pfeiltasten links und rechts des Bildes, um direkt zum vorherigen oder nächsten Pokemon in der gefilterten Liste zu wechseln, ohne das Modal zu schließen.

### 3. Modale Tabs
- **Main:** Allgemeine Basisdaten (Größe, Gewicht, Fähigkeiten, XP).
- **Stats:** Grafische Visualisierung der Basis-Statuswerte (HP, Attack, Defense, Sp. Attack, Sp. Defense, Speed).
- **Evo Chain:** Die Evolutionsstufen werden nacheinander dargestellt, sodass die Verwandlungskette leicht nachzuvollziehen ist.

---

## ⚡ Technische Highlights (Under the Hood)

### 💾 Effizientes In-Memory Caching
Um die API-Anfragen an die PokeAPI zu minimieren und die Benutzererfahrung so flüssig wie möglich zu gestalten, werden geladene Pokemon-Details und Evolutionsdaten im Arbeitsspeicher des Browsers zwischengespeichert:
```javascript
const pokemonCache = {};
const evolutionCache = {};
```
Sobald ein Pokemon einmal geladen wurde (z. B. beim Rendern der Karte oder beim Öffnen des Modals), wird es bei zukünftigen Interaktionen verzögerungsfrei direkt aus dem Cache bezogen.

### 📜 Intelligentes Infinite Scroll
Die App rendert die Pokemon in Batches von `24` (`BATCH_SIZE`). Wenn der Benutzer das Ende der Seite erreicht, wird der nächste Batch automatisch nachgeladen:
```javascript
function handleScroll() {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
  if (nearBottom && renderIndex < filteredPokemons.length) {
    renderNextBatch();
  }
}
```
Zusätzlich sorgt die Funktion `fillUntilScrollable` dafür, dass der Bildschirm bei hochauflösenden Monitoren so lange mit Karten befüllt wird, bis Scrollbalken entstehen, um ein Feststecken der App zu verhindern.

### 🎨 CSS Custom-Theming per Klasse
CSS-Variablen und Typen-Klassen werden kombiniert, um jedem Pokemon-Typ seine charakteristische Farbe zuzuweisen. Beim Laden eines Pokemons wird die Klasse `type-[typname]` (z. B. `type-fire`) an das Karten-Element und das Modal übergeben. In der `style.css` sind dafür spezifische Farbschemata hinterlegt, was ein harmonisches und abgerundetes UI-Design erzeugt.

---

## 📝 Lizenz

Dieses Projekt steht unter der **MIT License**. Siehe [LICENSE](LICENSE) (falls vorhanden) für weitere Details.

---
*Daten bereitgestellt durch [PokeAPI](https://pokeapi.co/).*
