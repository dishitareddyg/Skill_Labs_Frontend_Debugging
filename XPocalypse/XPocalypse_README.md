# XPocalypse: Debugging Mini Project

> **Scenario.** XPocalypse is a gamified productivity dashboard. You pick a player, complete daily challenges, earn XP, level up, unlock rewards and climb a leaderboard. It is almost ready to ship, but testers say the numbers do not add up: rankings look odd, XP totals drift, and some values on screen disagree with the player data underneath. Your job is to find the root causes and fix them without breaking what already works.

| | |
|---|---|
| **Type** | Debugging logic, sorting and derived values (front end only) |
| **You need** | A browser, a code editor such as VS Code, and optionally Git |
| **Allowed** | Vanilla HTML, CSS and JavaScript only. No libraries, no frameworks, no network access |

---

## 1. What you will practise

| Skill | What "done" looks like |
|---|---|
| Trace state to screen | You can follow a number from the `players` array through a function to the element that displays it. |
| Understand comparisons | You can explain how JavaScript compares numbers and how it compares strings, and why the difference matters in a sort. |
| Follow an event | You can trace a button click through its handler, the data update and the re-render. |
| Spot logic slips | You can find a wrong condition, a wrong formula and a statement in the wrong order. |
| Test with edge values | You test values just below and just above each threshold, and different players, not one lucky case. |

---

## 2. Quick start

**Windows:** double-click **`start.bat`**. It opens `index.html` in your default browser.

**If that does not work:** open Command Prompt in the folder and run `.\start.bat`, or double-click `index.html`, or drag it onto a browser window. On macOS or Linux, open `index.html` in a browser.

**After editing:** save and refresh. Use `Ctrl + F5` if nothing changes. All changes live in memory: refreshing or pressing **Reset demo** restores the starting data.

---

## 3. What is in the folder

| File | What it does | Will you edit it? |
|---|---|---|
| `index.html` | Page structure: top bar, profile, leaderboard, summary, challenges, rewards, toast area. | No. |
| `style.css` | Dark gaming theme and responsive layout. | No. |
| `script.js` | Game data, application state, helpers, rendering and player actions. | **Yes. All bugs are here.** |
| `players.json` | Readable reference copy of the data. The app does **not** load it. Editing it changes nothing. | No. |
| `start.bat` | Windows launcher. | No. |
| `README.md` | This guide. | No. |

`script.js` has seven numbered sections: **1** game data, **2** application state, **3** helper functions, **4** rendering, **5** toasts, **6** player actions, **7** start-up. Rendering functions only draw. They never change data.

### What the page shows

| Panel | Shows |
|---|---|
| Player Profile | Name, rank, level badge, XP, XP to the next level, progress bar, level-up banner, last action. |
| Leaderboard | Every player with rank, level and XP, in order. |
| Challenge Summary | Your challenges done, everyone's challenges done, XP earned this session, your rank. |
| Daily Challenges | Six challenges with a **Complete** button each. |
| Rewards | Five rewards, locked or unlocked, with a **NEW** tag on ones just unlocked. |

---

## 4. The game data

### Starting players

At the start, the leaderboard order is Blaze, Rune, Sable, Vex, Nova, Echo.

| ID | Player | XP | Level | Completed challenges | Starting rank |
|---|---|---|---|---|---|
| p1 | Nova | 90 | 1 | none | 5 |
| p2 | Blaze | 1120 | 5 | c1, c2, c3 | 1 |
| p3 | Vex | 245 | 2 | c1 | 4 |
| p4 | Echo | 60 | 1 | c2 | 6 |
| p5 | Rune | 730 | 4 | c1, c4 | 2 |
| p6 | Sable | 495 | 3 | c3 | 3 |

A player's `xp` includes experience earned before this dashboard existed, so it is **not** the sum of their completed challenges. The page opens as **Nova**.

### Challenges

| ID | Challenge | XP reward |
|---|---|---|
| c1 | Warm-Up Stretch | 20 |
| c2 | Read 10 Pages | 30 |
| c3 | Inbox Sprint | 40 |
| c4 | Code Kata | 60 |
| c5 | Deep Work Session | 80 |
| c6 | Boss Fight: Ship It | 120 |

### Levels and rewards

Levels and rewards use the same XP numbers. Reaching a threshold gives a new level **and** unlocks that row's reward.

| Level | XP needed | Reward unlocked |
|---|---|---|
| 1 | 0 | none |
| 2 | 100 | Rookie Spark |
| 3 | 250 | Challenger Badge |
| 4 | 500 | Veteran Crest |
| 5 | 800 | Elite Emblem |
| 6 (max) | 1200 | Legend Crown |

A player's level is the highest level whose threshold their XP has reached. **Progress** is the distance covered between the current level's threshold and the next one:

`progress % = (XP − current threshold) ÷ (next threshold − current threshold) × 100`, rounded to a whole number.

Example: 110 XP is level 2, so progress is (110 − 100) ÷ (250 − 100) = 6.67%, shown as **7%**, with **140 XP to Level 3**. At level 6 there is no next level, so the bar is full and the page shows **MAX LEVEL**.

---

## 5. How the app is supposed to behave

| ID | Area | Rule |
|---|---|---|
| R1 | XP reward | Completing a challenge awards **exactly** the XP shown beside its button. No bonuses, no multipliers. |
| R2 | Completed list | The challenge is added to that player's completed list. |
| R3 | Level | The player's level always matches their current XP, immediately after the action. |
| R4 | Progress | The progress bar and "XP to Level N" match the current XP. |
| R5 | Level-up | If a threshold was crossed, the gold banner and a toast appear, and the level badge shows the new level. |
| R6 | Rewards | If a reward threshold was crossed, the reward unlocks and gets a **NEW** tag. |
| R7 | Ranking | Players are ordered from most XP (rank 1) to least XP. Rank is the position in that order. |
| R8 | Leaderboard | It re-sorts after every action. Every rank, level and XP value matches the player data. |
| R9 | Summary | All four summary figures update after every action. |
| R10 | No repeats | A completed challenge shows **Completed ✓**. Clicking it again awards nothing. This is true for challenges finished in this session **and** for ones the player had finished before the page loaded. |
| R11 | Reset | **Reset demo** restores every player to the starting data. |

---

## 6. Known issues: start here

These are symptoms from testers. They are a starting point, **not a complete list**. Check every rule in section 5, including R10.

| # | Symptom | See it for yourself | Where to start looking |
|---|---|---|---|
| 1 | The leaderboard order does not match the XP column. | Open the page and read the XP column from top to bottom. | The comparison function inside the sort. What type of value is it comparing? |
| 2 | A challenge awards a different amount from the number beside its button. | Switch to Rune (who has finished two challenges). Complete **Deep Work Session** (+80) and compare Rune's XP before and after. | Follow the reward value from the challenge data, through `completeChallenge`, to the player's new total. |
| 3 | The level, progress or rank on screen does not match the player's current XP. | As Nova, complete **Warm-Up Stretch**. Compare the level badge, the banner text and the leaderboard "Lv" with 110 XP. | The order of the statements that update a player. What is each value calculated from, and when? |

---

## 7. Worked examples

Start from a fresh page (or press **Reset demo**) before each row. "Level-up" means the gold banner and a toast should appear.

| # | Player | Action | XP after | Level | Progress | Rank | New rewards | Level-up |
|---|---|---|---|---|---|---|---|---|
| E1 | Nova | c1 (+20) | 110 | 2 | 7%, "140 XP to Level 3" | 5 (unchanged) | Rookie Spark | Yes, to 2 |
| E2 | Nova | c6 (+120) | 210 | 2 | 73%, "40 XP to Level 3" | 5 (unchanged) | Rookie Spark | Yes, to 2 |
| E3 | Nova | c6, then c5 (+120, +80) | 290 | 3 | 16%, "210 XP to Level 4" | **4** (passes Vex) | Rookie Spark, then Challenger Badge | Yes, to 2 then to 3 |
| E4 | Sable | c1 (+20) | 515 | 4 | 5%, "285 XP to Level 5" | 3 (unchanged) | Veteran Crest | Yes, to 4 |
| E5 | Echo | c3 (+40) | 100 | 2 | 0%, "150 XP to Level 3" | **5** (passes Nova) | Rookie Spark | Yes, to 2 |
| E6 | Vex | c2 (+30) | 275 | 3 | 10%, "225 XP to Level 4" | 4 (unchanged) | Challenger Badge | Yes, to 3 |
| E7 | Rune | c5 (+80) | 810 | 5 | 3%, "390 XP to Level 6" | 2 (unchanged) | Elite Emblem | Yes, to 5 |
| E8 | Blaze | c6 (+120) | 1240 | 6 | 100%, **MAX LEVEL** | 1 (unchanged) | Legend Crown | Yes, to 6 |
| E9 | Blaze | c4 (+60) | 1180 | 5 | 95%, "20 XP to Level 6" | 1 (unchanged) | none | No |

E7 shows 2.5% rounded up to 3%.

---

## 8. Test checklist

| Test | Steps | Expected result | Before fix | After fix |
|---|---|---|---|---|
| T1 Starting order | Load the page. | Blaze 1120, Rune 730, Sable 495, Vex 245, Nova 90, Echo 60, ranked 1 to 6. | ☐ | ☐ |
| T2 Worked examples | Run E1 to E9 from section 7 (one per fresh page). | Every column matches. | ☐ | ☐ |
| T3 Profile vs leaderboard | After E1, compare the level badge, the banner and the leaderboard "Lv". | All three say level 2. | ☐ | ☐ |
| T4 Summary | After E3, read the summary panel. | Your challenges done **2 / 6**, everyone's **10**, session XP **+200**, rank **#4**. | ☐ | ☐ |
| T5 Repeat click (this session) | As Nova, complete c1, then click c1 again. | Second click awards nothing. XP stays at 110. A toast says it is already completed. | ☐ | ☐ |
| T6 Repeat click (pre-completed) | Switch to Vex, who finished c1 before the page loaded. Click c1. | Button shows **Completed ✓**. XP stays at 245. | ☐ | ☐ |
| T7 Player switch | Complete a challenge as Nova, switch to Vex, then back to Nova. | The banner and "last action" belong to the player shown. Nothing from Nova appears on Vex's profile. | ☐ | ☐ |
| T8 Order after many actions | Complete several challenges as different players. | The leaderboard stays in descending XP order after each click. | ☐ | ☐ |
| T9 Reset | Press **Reset demo**. | Every table value returns to section 4. | ☐ | ☐ |
| T10 Threshold edges | As Echo (60 XP), earn exactly 40 XP. As Vex (245 XP), earn 30 XP. | Echo reaches level 2 at exactly 100. Vex passes 250 and unlocks Challenger Badge. | ☐ | ☐ |

After each fix, rerun **everything**, not just the test for that bug.

---

## 9. Debugging workflow

1. **Observe.** Use the app normally. Write down every place the screen disagrees with section 5.
2. **Compare screen with data.** After each action, run `console.table(players)` and check the screen against it.
3. **Vary your test cases.** Use different players, very different XP totals, values just below and just above each threshold, and challenges that are not done, just done, or done before the page loaded.
4. **Calculate by hand.** Work out the expected XP, level and rank on paper first, then compare with the app.
5. **Isolate.** Find the smallest set of clicks that reproduces the problem.
6. **Locate.** Use a breakpoint or `console.log` to find the first place the real value and the expected value differ.
7. **Use Reset demo** to return to clean data between tests.

### DevTools cheat sheet

Open with `F12` or `Ctrl + Shift + I`.

| I want to... | Do this |
|---|---|
| See all player data | Console tab: `console.table(players)` |
| See who is selected | Console tab: `selectedPlayerId` |
| See XP handed out this session | Console tab: `sessionXpEarned` |
| Test a function by itself | Console tab: `calculateLevel(300)`, `getLevelProgress(110)`, `getRankOf("p1")` |
| Compare how JavaScript sorts | Console tab: try `[90, 730, 60].sort()` and compare with `[90, 730, 60].sort((a, b) => b - a)` |
| See the generated HTML | Elements tab, right-click part of the page, **Inspect**. Look for classes such as `is-done` and `is-unlocked`. |
| Watch code run line by line | Sources tab, open `script.js`, click a line number inside `completeChallenge`, click **Complete** on the page, step with `F10`. |

---
