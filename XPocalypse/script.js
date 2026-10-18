/* ==========================================================
   XPocalypse - script.js
   Everything runs in the browser. No libraries, no network.
   ========================================================== */


/* ----------------------------------------------------------
   1. GAME DATA
   ---------------------------------------------------------- */

// Level table: the XP a player needs to reach each level.
// Position 0 is Level 1, position 1 is Level 2, and so on.
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 800, 1200];

// Rewards that unlock when a player's XP reaches the listed amount.
const REWARD_MILESTONES = [
  { id: "r1", xp: 100,  name: "Rookie Spark",     icon: "⚡" },
  { id: "r2", xp: 250,  name: "Challenger Badge", icon: "🛡" },
  { id: "r3", xp: 500,  name: "Veteran Crest",    icon: "⚔" },
  { id: "r4", xp: 800,  name: "Elite Emblem",     icon: "💎" },
  { id: "r5", xp: 1200, name: "Legend Crown",     icon: "👑" }
];

// Daily challenges. Each one has a fixed XP reward.
const CHALLENGES = [
  { id: "c1", title: "Warm-Up Stretch",     description: "Stretch for five minutes.",         xp: 20 },
  { id: "c2", title: "Read 10 Pages",       description: "Read ten pages of any book.",       xp: 30 },
  { id: "c3", title: "Inbox Sprint",        description: "Clear your inbox in 15 minutes.",   xp: 40 },
  { id: "c4", title: "Code Kata",           description: "Solve one small coding exercise.",  xp: 60 },
  { id: "c5", title: "Deep Work Session",   description: "Focus for 90 uninterrupted minutes.", xp: 80 },
  { id: "c6", title: "Boss Fight: Ship It", description: "Finish and publish one project.",   xp: 120 }
];

// Starting players (the same data is in players.json for reference).
// completedChallengeIds lists the challenges that player has finished.
const INITIAL_PLAYERS = [
  { id: "p1", name: "Nova",  xp: 90,   level: 1, completedChallengeIds: [] },
  { id: "p2", name: "Blaze", xp: 1120, level: 5, completedChallengeIds: ["c1", "c2", "c3"] },
  { id: "p3", name: "Vex",   xp: 245,  level: 2, completedChallengeIds: ["c1"] },
  { id: "p4", name: "Echo",  xp: 60,   level: 1, completedChallengeIds: ["c2"] },
  { id: "p5", name: "Rune",  xp: 730,  level: 4, completedChallengeIds: ["c1", "c4"] },
  { id: "p6", name: "Sable", xp: 495,  level: 3, completedChallengeIds: ["c3"] }
];


/* ----------------------------------------------------------
   2. APPLICATION STATE
   ---------------------------------------------------------- */

// The live list of players. Open the console and type: players
let players = cloneData(INITIAL_PLAYERS);

// Which player the dashboard is showing.
let selectedPlayerId = "p1";

// Total XP handed out since the page was opened (or reset).
let sessionXpEarned = 0;

// Details about the most recent challenge completion, or null.
let lastResult = null;


/* ----------------------------------------------------------
   3. HELPER FUNCTIONS
   ---------------------------------------------------------- */

// Makes an independent copy of plain data (arrays and objects).
function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
}

function getSelectedPlayer() {
  return players.find(function (player) {
    return player.id === selectedPlayerId;
  });
}

function findChallengeById(challengeId) {
  return CHALLENGES.find(function (challenge) {
    return challenge.id === challengeId;
  });
}

// Works out the level that matches a given amount of XP.
function calculateLevel(xp) {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    }
  }
  return level;
}

// Describes how far a player is through their current level.
function getLevelProgress(xp) {
  const level = calculateLevel(xp);
  const levelStart = LEVEL_THRESHOLDS[level - 1];
  const nextLevelAt = LEVEL_THRESHOLDS[level];

  // The top level has no next level, so the bar is simply full.
  if (nextLevelAt === undefined) {
    return { level: level, percent: 100, xpToNext: 0, isMaxLevel: true };
  }

  const percent = Math.round(((xp - levelStart) / (nextLevelAt - levelStart)) * 100);
  return {
    level: level,
    percent: percent,
    xpToNext: nextLevelAt - xp,
    isMaxLevel: false
  };
}

// Returns a new array of players ordered from most XP to least XP.
function getSortedPlayers() {
  const sortedPlayers = players.slice();
  sortedPlayers.sort(function (a, b) {
    return String(b.xp).localeCompare(String(a.xp));
  });
  return sortedPlayers;
}

// A player's rank is their position in the sorted leaderboard (1 = top).
function getRankOf(playerId) {
  const sortedPlayers = getSortedPlayers();
  for (let i = 0; i < sortedPlayers.length; i++) {
    if (sortedPlayers[i].id === playerId) {
      return i + 1;
    }
  }
  return players.length;
}

function countAllCompletedChallenges() {
  let total = 0;
  players.forEach(function (player) {
    total += player.completedChallengeIds.length;
  });
  return total;
}


/* ----------------------------------------------------------
   4. RENDERING (draw the current state on the page)
   ---------------------------------------------------------- */

function renderPlayerSelect() {
  const select = document.getElementById("player-select");
  select.innerHTML = "";
  players.forEach(function (player) {
    const option = document.createElement("option");
    option.value = player.id;
    option.textContent = player.name;
    select.appendChild(option);
  });
  select.value = selectedPlayerId;
}

function renderProfile() {
  const player = getSelectedPlayer();
  const progress = getLevelProgress(player.xp);

  document.getElementById("profile-avatar").textContent = player.name.charAt(0);
  document.getElementById("profile-name").textContent = player.name;
  document.getElementById("profile-rank").textContent =
    "Rank #" + getRankOf(player.id) + " of " + players.length;
  document.getElementById("profile-level").textContent = player.level;
  document.getElementById("profile-xp").textContent = player.xp + " XP";

  if (progress.isMaxLevel) {
    document.getElementById("profile-xp-next").textContent = "MAX LEVEL";
  } else {
    document.getElementById("profile-xp-next").textContent =
      progress.xpToNext + " XP to Level " + (progress.level + 1);
  }

  document.getElementById("xp-progress-fill").style.width = progress.percent + "%";
  document.getElementById("xp-progress").setAttribute("aria-valuenow", String(progress.percent));

  // Level-up banner: only shown right after the selected player levels up.
  const banner = document.getElementById("level-up-banner");
  if (lastResult && lastResult.playerId === player.id && lastResult.leveledUp) {
    banner.textContent = "LEVEL UP! " + player.name + " reached Level " + lastResult.newLevel + "!";
    banner.classList.remove("hidden");
  } else {
    banner.textContent = "";
    banner.classList.add("hidden");
  }

  const lastAction = document.getElementById("last-action");
  if (lastResult && lastResult.playerId === player.id) {
    lastAction.textContent =
      "Last action: " + lastResult.challengeTitle + " (+" + lastResult.awardedXp + " XP)";
  } else {
    lastAction.textContent = "Complete a challenge to earn XP.";
  }
}

// Small helper: adds a <td> with some text to a table row.
function addCell(row, text, className) {
  const cell = document.createElement("td");
  cell.textContent = text;
  if (className) {
    cell.className = className;
  }
  row.appendChild(cell);
}

function renderLeaderboard() {
  const body = document.getElementById("leaderboard-body");
  body.innerHTML = "";

  const sortedPlayers = getSortedPlayers();
  sortedPlayers.forEach(function (player, index) {
    const rank = index + 1;
    const row = document.createElement("tr");
    row.className = "rank-" + rank;
    if (player.id === selectedPlayerId) {
      row.classList.add("is-selected");
    }

    addCell(row, "#" + rank, "cell-rank");
    addCell(row, player.name, "cell-name");
    addCell(row, "Lv " + player.level, "cell-level");
    addCell(row, String(player.xp), "cell-xp");
    body.appendChild(row);
  });
}

function renderChallenges() {
  const list = document.getElementById("challenge-list");
  const player = getSelectedPlayer();
  list.innerHTML = "";

  CHALLENGES.forEach(function (challenge) {
    const isDone = player.completedChallengeIds.includes(challenge.id);

    const item = document.createElement("li");
    item.className = "challenge-item" + (isDone ? " is-done" : "");

    const info = document.createElement("div");
    info.className = "challenge-info";
    const title = document.createElement("p");
    title.className = "challenge-title";
    title.textContent = challenge.title;
    const description = document.createElement("p");
    description.className = "challenge-desc";
    description.textContent = challenge.description;
    info.appendChild(title);
    info.appendChild(description);

    const rewardTag = document.createElement("span");
    rewardTag.className = "xp-tag";
    rewardTag.textContent = "+" + challenge.xp + " XP";

    const button = document.createElement("button");
    button.type = "button";
    button.dataset.challengeId = challenge.id;
    if (isDone) {
      button.className = "btn btn-done";
      button.textContent = "Completed ✓";
      button.setAttribute("aria-disabled", "true");
    } else {
      button.className = "btn btn-primary";
      button.textContent = "Complete";
    }
    button.addEventListener("click", function () {
      handleChallengeClick(challenge.id);
    });

    item.appendChild(info);
    item.appendChild(rewardTag);
    item.appendChild(button);
    list.appendChild(item);
  });
}

function renderRewards() {
  const list = document.getElementById("reward-list");
  const player = getSelectedPlayer();
  list.innerHTML = "";

  REWARD_MILESTONES.forEach(function (reward) {
    const isUnlocked = player.xp >= reward.xp;
    const isNew = Boolean(
      lastResult &&
      lastResult.playerId === player.id &&
      lastResult.newRewardIds.includes(reward.id)
    );

    const item = document.createElement("li");
    item.className = "reward-item" + (isUnlocked ? " is-unlocked" : "");

    const icon = document.createElement("span");
    icon.className = "reward-icon";
    icon.textContent = isUnlocked ? reward.icon : "🔒";

    const info = document.createElement("div");
    info.className = "reward-info";
    const name = document.createElement("p");
    name.className = "reward-name";
    name.textContent = reward.name;
    const note = document.createElement("p");
    note.className = "reward-note";
    note.textContent = isUnlocked ? "Unlocked at " + reward.xp + " XP" : "Unlocks at " + reward.xp + " XP";
    info.appendChild(name);
    info.appendChild(note);

    item.appendChild(icon);
    item.appendChild(info);

    if (isNew) {
      const tag = document.createElement("span");
      tag.className = "new-tag";
      tag.textContent = "NEW";
      item.appendChild(tag);
    }

    list.appendChild(item);
  });
}

function renderSummary() {
  const player = getSelectedPlayer();
  const doneCount = player.completedChallengeIds.length;

  document.getElementById("summary-completed").textContent = doneCount + " / " + CHALLENGES.length;
  document.getElementById("summary-all-completed").textContent = String(countAllCompletedChallenges());
  document.getElementById("summary-session-xp").textContent = "+" + sessionXpEarned;
  document.getElementById("summary-rank").textContent = "#" + getRankOf(player.id);
  document.getElementById("summary-fill").style.width =
    Math.round((doneCount / CHALLENGES.length) * 100) + "%";
}

function renderAll() {
  renderProfile();
  renderLeaderboard();
  renderChallenges();
  renderRewards();
  renderSummary();
}


/* ----------------------------------------------------------
   5. TOAST MESSAGES
   ---------------------------------------------------------- */

// type is one of: "success", "levelup", "reward", "info"
function showToast(message, type) {
  const area = document.getElementById("toast-area");
  const toast = document.createElement("div");
  toast.className = "toast toast-" + type;
  toast.textContent = message;
  area.appendChild(toast);

  // Keep at most four messages on screen.
  while (area.children.length > 4) {
    area.removeChild(area.firstChild);
  }

  setTimeout(function () {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 4000);
}


/* ----------------------------------------------------------
   6. PLAYER ACTIONS
   ---------------------------------------------------------- */

// Runs when a challenge button is clicked.
function handleChallengeClick(challengeId) {
  const player = getSelectedPlayer();
  const challenge = findChallengeById(challengeId);
  if (!player || !challenge) {
    return;
  }

  const alreadyDone = player.completedChallengeIds.includes(challenge);
  if (alreadyDone) {
    showToast(challenge.title + " is already completed.", "info");
    return;
  }

  completeChallenge(player, challenge);
}

// Gives a player the reward for a challenge and refreshes the page.
function completeChallenge(player, challenge) {
  const oldXp = player.xp;
  const oldLevel = calculateLevel(oldXp);

  // Work out how much XP this completion is worth.
  const rewardXp = challenge.xp + player.completedChallengeIds.length * 5;

  // Update the player's stored level, then add the XP.
  player.level = calculateLevel(player.xp);
  player.xp = player.xp + rewardXp;

  // Remember the challenge as completed (never store it twice).
  if (!player.completedChallengeIds.includes(challenge.id)) {
    player.completedChallengeIds.push(challenge.id);
  }
  sessionXpEarned += rewardXp;

  // Check for a level-up and for newly unlocked rewards.
  const newLevel = calculateLevel(player.xp);
  const newRewards = REWARD_MILESTONES.filter(function (reward) {
    return oldXp < reward.xp && player.xp >= reward.xp;
  });

  lastResult = {
    playerId: player.id,
    challengeTitle: challenge.title,
    awardedXp: rewardXp,
    leveledUp: newLevel > oldLevel,
    newLevel: newLevel,
    newRewardIds: newRewards.map(function (reward) { return reward.id; })
  };

  renderAll();

  showToast(player.name + " earned " + rewardXp + " XP for " + challenge.title + ".", "success");
  if (lastResult.leveledUp) {
    showToast("LEVEL UP! " + player.name + " is now Level " + newLevel + ".", "levelup");
  }
  newRewards.forEach(function (reward) {
    showToast("Reward unlocked: " + reward.name + "!", "reward");
  });
}

function handlePlayerChange(event) {
  selectedPlayerId = event.target.value;
  lastResult = null;
  renderAll();
}

function handleReset() {
  players = cloneData(INITIAL_PLAYERS);
  sessionXpEarned = 0;
  lastResult = null;
  renderAll();
  showToast("Demo data reset.", "info");
}


/* ----------------------------------------------------------
   7. START THE APP
   ---------------------------------------------------------- */

function init() {
  renderPlayerSelect();
  document.getElementById("player-select").addEventListener("change", handlePlayerChange);
  document.getElementById("reset-button").addEventListener("click", handleReset);
  renderAll();
}

init();
