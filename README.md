# One Drop

Eine einfache React-Web-App in Verkaufsblau, die jeden Tag einen kleinen Daily Drop anzeigt und den Fortschritt lokal im Browser speichert.

## Projekt starten

1. Stelle sicher, dass `Node.js` installiert ist.
2. Öffne ein Terminal im Projektordner.
3. Installiere die Abhängigkeiten mit:

```bash
npm install
```

4. Starte die Entwicklungsumgebung:

```bash
npm run dev
```

5. Öffne die angezeigte lokale URL im Browser, meistens `http://localhost:5173`.

## Auf Android installieren

Die App ist als PWA vorbereitet. Das bedeutet: Du kannst sie auf Android wie eine normale App auf den Startbildschirm legen.

1. Erstelle zuerst die fertige Version:

```bash
npm run build
```

2. Starte danach die Vorschau:

```bash
npm run preview -- --host 0.0.0.0
```

3. Öffne die angezeigte Adresse auf deinem Android-Handy in Chrome.
4. Tippe im Chrome-Menü auf `App installieren` oder `Zum Startbildschirm hinzufügen`.
5. Danach erscheint `One Drop` als App-Symbol auf deinem Handy.

## Mit GitHub kostenlos veröffentlichen

1. Erstelle bei GitHub ein neues Repository, zum Beispiel `one-drop`.
2. Lade dieses Projekt in das Repository hoch.
3. Öffne auf GitHub dein Repository.
4. Gehe zu `Settings` > `Pages`.
5. Stelle bei `Build and deployment` die Quelle auf `GitHub Actions`.
6. Gehe danach zu `Actions`.
7. Warte, bis der Workflow `Deploy to GitHub Pages` grün abgeschlossen ist.
8. Den öffentlichen Link findest du danach unter `Settings` > `Pages`.

Der Link sieht ungefähr so aus:

```text
https://dein-github-name.github.io/one-drop/
```

Andere können diesen Link auf Android in Chrome öffnen und dann `App installieren` oder `Zum Startbildschirm hinzufügen` auswählen.

## Was die App kann

- Startscreen mit kurzer Erklärung
- Eine tägliche 1%-Aufgabe
- Button `Erledigt`
- Fortschritt mit aktueller Serie, bester Serie und Wochenübersicht
- Lokale Speicherung mit `localStorage`

## Projektstruktur

```text
stoffwechsel-optimierung-mvp/
|- index.html
|- package.json
|- vite.config.js
|- public/
|  |- hero-top.jpeg
|  |- icon.svg
|  |- manifest.webmanifest
|  |- service-worker.js
|- src/
|  |- main.jsx
|  |- App.jsx
|  |- styles.css
|- README.md
```

## Wo die Logik sitzt

- `src/main.jsx`: Einstiegspunkt der React-App
- `src/App.jsx`: Oberfläche, Aufgabenliste und Fortschrittslogik
- `src/styles.css`: Layout, Farben und responsive Design

## Ideen für spätere Features

- Erinnerungen für bestimmte Uhrzeiten
- Mehrere Aufgaben pro Kategorie wie Schlaf, Bewegung und Ernährung
- Wochenziele und kleine Belohnungen
- Notizen wie "Wie habe ich mich heute gefühlt?"
- Export oder Cloud-Sync für mehrere Geräte
