# CodeX — GitHub Workshop

A static site for the CodeX GitHub workshop: **Build. Commit. Break. Recover.**

Plain HTML, CSS, JavaScript and JSON. No frameworks, no npm, no build step.

```
codex-github-workshop/
├── index.html          landing page
├── style.css           all styling (site + student pages)
├── script.js           loading animation + card generation
├── students.json       the only file you edit to add people
├── .nojekyll           tells GitHub Pages to serve every file as-is
└── students/
    ├── _template.html  copy this for each new participant
    ├── gilmore-dsilva.html
    ├── rahul-sharma.html
    └── priya-patel.html
```

## Run it locally

`index.html` reads `students.json` with `fetch()`, and browsers block that when a
page is opened straight off the disk. So serve the folder over http:

- **VS Code:** install the Live Server extension, right-click `index.html` → Open with Live Server.
- **Any machine with Python:** `python3 -m http.server 8000`, then open `http://localhost:8000`.

Opening `index.html` by double-clicking still loads the design, but the cards are
replaced with a terminal error explaining what happened.

## Deploy to GitHub Pages

1. Create a repository and push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "CodeX GitHub workshop site"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO-NAME.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages**.
3. Under *Build and deployment*, set Source to **Deploy from a branch**, branch **main**, folder **/ (root)**. Save.
4. Wait about a minute. The site is live at `https://USERNAME.github.io/REPO-NAME/`.

Every path in the project is relative, so the site works from that sub-folder URL
without any changes.

## Add a participant

Two steps.

**1. Add an entry to `students.json`:**

```json
{
  "name": "John Doe",
  "role": "Participant",
  "file": "john-doe.html"
}
```

Put it inside the `participants` array (commas between entries, no comma after the
last one). Committee members go in `codexMembers` instead — the first entry there
gets the larger lead card.

**2. Create the matching page:**

```bash
cp students/_template.html students/john-doe.html
```

Then open the new file and replace `YOUR NAME` with the student's name.

Refresh the site and John's card appears in the grid, linking to his page. The grid
reflows on its own — the CSS never needs touching.

File naming: lowercase, dashes instead of spaces, no apostrophes.
`Gilmore D'Silva` → `gilmore-dsilva.html`.
