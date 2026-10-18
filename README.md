# Skill Labs: Frontend Debugging

A collection of small, self-contained front-end apps that are **deliberately buggy**. Each project is built with plain HTML, CSS and vanilla JavaScript (no libraries, no build step, no network requests). Your task is to reproduce the reported problems, work out the correct answer by hand, find the root cause and fix it.

## Projects

| Project | What it is | Type of bugs to find | Difficulty / Time |
|---|---|---|---|
| [TaskForge](./TaskForge/) | Personal task dashboard (add, complete, delete, search, filter) | Event handling, state and summary calculations | Beginner (45–60 min) |
| [ShopShock](./ShopShock/) | Store administration dashboard (products, orders, revenue) | Data types, the `+` operator, filtering, searching and sorting | 60–90 min |
| [Gradezilla](./Gradezilla/) | Student performance dashboard (marks, grades, attendance) | Calculations, comparison operators, input validation | 60–90 min |
| [WeatherOrNot](./WeatherOrNot/) | Weather dashboard with a simulated async API | Stale data, async ordering, wrong property mapping | Intermediate (60–90 min) |
| [XPocalypse](./XPocalypse/) | Gamified productivity dashboard (XP, levels, leaderboard) | Sorting, derived values, statement order, thresholds | Intermediate (60–90 min) |

## How each project is run

1. Open the project folder.
2. Double-click **`start.bat`** (Windows) to open `index.html` in your browser, or open `index.html` directly.
3. After each edit, save the file and refresh with `Ctrl + F5` to bypass the cache.

No `start.bat`? Run `start index.html` from a Command Prompt in that folder.

## Suggested workflow

1. **Reproduce** — note the exact steps that trigger the bug.
2. **Work out the expected result by hand** using the rules in each project's README.
3. **Locate** the first place the code diverges from the expected value (DevTools Console / Sources, or `console.log`).
4. **Change one thing** and fix it.
5. **Re-test everything**, not only the bug you changed.
6. **Commit** one fix per commit with a clear message.

## Debugging toolkit

Open DevTools with **F12** (or **Ctrl + Shift + I**).

| Tab | Use it to |
|---|---|
| Console | Read live values (`console.table(players)`), call functions, spot errors |
| Elements | Inspect the live HTML, text and attributes of each element |
| Sources | Set breakpoints and step through code with F10 (over) / F11 (into) |
| Network | Confirm no real requests are made (all data is local) |

## What to submit

- Your fixed code with **one Git commit per fix** and a clear message.
- A short bug report per fix: what you did, what you expected, what happened, the cause, the fix and how you tested it.
- Any extra problems you found beyond the reported issues.

## Project structure

```
Skill_Labs_Frontend_Debugging/
├── TaskForge/       Task dashboard       (TaskForge_README.md)
├── ShopShock/       Store dashboard      (README.md)
├── Gradezilla/      Grades dashboard     (README.md)
├── WeatherOrNot/    Weather dashboard    (WeatherOrNot_README.md)
├── XPocalypse/      XP dashboard         (XPocalypse_README.md)
└── README.md        This overview
```

Each project folder contains `index.html`, `style.css`, `script.js`, a reference `*.json` data file, a `start.bat` launcher and its own detailed README. All code fixes live in each project's `script.js`.
