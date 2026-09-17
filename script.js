/* ==========================================================================
   CodeX — GitHub Workshop
   script.js

   Two jobs:
     1. Run the boot / loading animation.
     2. Read students.json and build every card on the page.

   No frameworks, no build step. Plain browser JavaScript.
   ========================================================================== */

"use strict";

/* Do the users' motion settings say "keep it still"? */
var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* ==========================================================================
   1. LOADING SCREEN
   ========================================================================== */

var loader = document.getElementById("loader");
var loaderRain = document.getElementById("loaderRain");
var loaderStatus = document.getElementById("loaderStatus");
var site = document.getElementById("site");

var rainTimer = null;

/* Build the columns of binary digits that fill the loading screen. */
function buildRain() {
  var columnCount = Math.min(48, Math.max(12, Math.floor(window.innerWidth / 28)));
  var rowCount = Math.max(12, Math.floor(window.innerHeight / 19));

  for (var i = 0; i < columnCount; i++) {
    var column = document.createElement("div");
    column.className = "rain-col";
    column.textContent = randomBinary(rowCount);
    loaderRain.appendChild(column);
  }

  /* Re-roll every column a few times a second so the digits flicker. */
  rainTimer = window.setInterval(function () {
    var columns = loaderRain.children;
    for (var j = 0; j < columns.length; j++) {
      columns[j].textContent = randomBinary(rowCount);
    }
  }, 80);
}

/* A vertical string of random 0s and 1s, one digit per line. */
function randomBinary(lines) {
  var out = "";
  for (var i = 0; i < lines; i++) {
    out += (Math.random() < 0.5 ? "0" : "1") + "\n";
  }
  return out;
}

/* Hide the loader and fade the site in. */
function finishLoading() {
  window.clearInterval(rainTimer);
  loader.classList.add("is-done");
  document.body.classList.remove("is-loading");
  site.classList.add("is-visible");

  /* Remove the loader from the page once its fade-out has finished. */
  window.setTimeout(function () {
    if (loader.parentNode) {
      loader.parentNode.removeChild(loader);
    }
  }, 600);
}

function startLoading() {
  if (prefersReducedMotion) {
    /* Still screen, short wait, then straight into the site. */
    loaderStatus.textContent = "loading";
    loader.classList.add("is-revealing");
    window.setTimeout(finishLoading, 500);
    return;
  }

  buildRain();

  window.setTimeout(function () { loaderStatus.textContent = "decrypting"; }, 700);

  /* Binary fades back, "CodeX" glitches in. */
  window.setTimeout(function () {
    loader.classList.add("is-revealing");
    loaderStatus.textContent = "access granted";
  }, 1500);

  window.setTimeout(finishLoading, 2700);
}


/* ==========================================================================
   2. STUDENT CARDS — generated from students.json
   ========================================================================== */

var membersGrid = document.getElementById("membersGrid");
var participantsGrid = document.getElementById("participantsGrid");
var membersCount = document.getElementById("membersCount");
var participantsCount = document.getElementById("participantsCount");
var errorBox = document.getElementById("errorBox");
var errorHint = document.getElementById("errorHint");

/* "Gilmore D'Silva" -> "gilmore-dsilva.html"
   Only used as a fallback when an entry has no "file" value. */
function fileNameFromName(name) {
  var slug = name
    .toLowerCase()
    .replace(/['’.]/g, "")        // drop apostrophes and dots
    .replace(/[^a-z0-9]+/g, "-")  // everything else becomes a dash
    .replace(/^-+|-+$/g, "");     // trim dashes from both ends
  return slug + ".html";
}

/* Build one card element for a person. */
function createCard(person, index, isLead) {
  var card = document.createElement("a");
  card.className = isLead ? "card card--lead" : "card";
  card.href = "students/" + (person.file || fileNameFromName(person.name));

  var role = document.createElement("span");
  role.className = "card__role";
  role.textContent = person.role || "Participant";

  var name = document.createElement("h3");
  name.className = "card__name";
  name.textContent = person.name;

  var id = document.createElement("span");
  id.className = "card__id";
  id.textContent = "// id " + String(index + 1).padStart(3, "0");

  var cta = document.createElement("span");
  cta.className = "card__cta";
  cta.textContent = "[ open profile ]";

  card.appendChild(role);
  card.appendChild(name);
  card.appendChild(id);
  card.appendChild(cta);

  /* Screen readers announce where the link goes. */
  card.setAttribute("aria-label", "Open the page for " + person.name);

  return card;
}

/* Fill one grid with a list of people. */
function renderGrid(grid, people, countLabel, leadFirst) {
  grid.textContent = "";

  if (!people || people.length === 0) {
    var empty = document.createElement("p");
    empty.className = "grid__empty";
    empty.textContent = "> no entries yet — add one to students.json";
    grid.appendChild(empty);
    countLabel.textContent = "0 entries";
    return;
  }

  people.forEach(function (person, index) {
    grid.appendChild(createCard(person, index, leadFirst && index === 0));
  });

  countLabel.textContent = people.length + (people.length === 1 ? " entry" : " entries");
}

/* Terminal-style failure message, shown instead of an empty page. */
function showError() {
  errorBox.hidden = false;
  membersCount.textContent = "unavailable";
  participantsCount.textContent = "unavailable";
  membersGrid.textContent = "";
  participantsGrid.textContent = "";

  /* Opening index.html straight off the disk blocks fetch() in most
     browsers. That is the usual cause, so say so. */
  if (window.location.protocol === "file:") {
    errorHint.textContent =
      "> Hint: opened as a local file. Serve the folder over http (Live Server) or view it on GitHub Pages.";
  } else {
    errorHint.textContent = "> Hint: confirm students.json sits next to index.html and contains valid JSON.";
  }
}

/* Load the data. The path is relative, so it works both at
   username.github.io/repo-name/ and on a local server. */
function loadStudents() {
  fetch("students.json")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("students.json returned " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      renderGrid(membersGrid, data.codexMembers, membersCount, true);
      renderGrid(participantsGrid, data.participants, participantsCount, false);
    })
    .catch(function (error) {
      console.error("Could not load students.json:", error);
      showError();
    });
}


/* ==========================================================================
   3. START
   ========================================================================== */

startLoading();
loadStudents();
