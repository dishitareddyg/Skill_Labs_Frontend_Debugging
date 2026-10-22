# TaskForge: Debugging Mini Project

> **Scenario.** TaskForge is a personal task dashboard that a classmate built for a group project. It looks finished, but testers keep reporting that it "does weird things" once you actually use it. You have been asked to find out why and fix it, without rewriting the whole app.

| | |
|---|---|
| **Type** | Debugging and bug-fixing (front end only) |
| **You need** | A browser (Chrome, Edge, Firefox or Safari), a code editor such as VS Code, and optionally Git |
| **Allowed** | Vanilla HTML, CSS and JavaScript only. No libraries, no frameworks, no Node.js, no build step |

---

## 1. What you will practice

By the end you should be able to do each of these on your own:

| Skill | What "done" looks like |
|---|---|
| Separate the layers of a small app | You can say, for any bug, whether it lives in the **data** (the `tasks` array), the **rendering** (what is drawn), the **event handling** (what runs on a click) or a **calculation** (a number derived from the data). |
| Reproduce before fixing | For every bug you have written steps that trigger it every time. |
| Trace data flow | You can follow one task from the form, into the array, onto the screen and into the summary cards. |
| Inspect a running page | You have used the Console, Elements and Sources tabs to read real values instead of guessing. |

---

## 2. Quick start

**Windows:** extract the whole ZIP into a folder named `TaskForge`, then double-click **`start.bat`**. The app opens in your default browser.

**If that does not work:** open Command Prompt in the folder and run `.\start.bat`, or double-click `index.html`, or drag it onto a browser window. On macOS or Linux, open `index.html` in a browser.

**After editing:** save the file and refresh the browser. Use `Ctrl + F5` to bypass the cache if nothing changes.

---

## 3. What is in the folder

| File | What it does | Will you edit it? |
|---|---|---|
| `index.html` | Page structure: summary cards, add-task form, search and filter controls, empty list container. | Rarely. |
| `style.css` | Colours, layout and the phone-friendly view. | No. |
| `script.js` | The task data, every event listener, rendering and the summary calculation. | **Yes. All bugs are here.** |
| `start.bat` | Windows launcher that opens `index.html`. | No. |
| `README.md` | This guide. | No. |

Inside `script.js` the code is split into labelled sections: **application state**, **DOM references**, **task operations (data only)**, **rendering (DOM only)** and **event listeners**. Use those labels to decide where a problem belongs.

---

## 4. Starting data

When the page loads, the `tasks` array holds these five tasks. The summary cards should read **Total 5, Pending 3, Completed 2**.

| ID | Title | Priority | Status at start |
|---|---|---|---|
| 1 | Review lecture notes | Medium | Pending |
| 2 | Submit lab report | High | **Completed** |
| 3 | Plan weekend study group | Low | Pending |
| 4 | Reply to project teammates | Medium | Pending |
| 5 | Read chapter on arrays | Low | **Completed** |

New tasks get the next unused ID (6, 7, and so on) and always start as Pending.

---

## 5. How the app is supposed to behave

These are the rules the finished app must follow. Each has an ID you can use in your notes.

| ID | Area | Rule |
|---|---|---|
| R1 | Add | A task with a non-empty title appears in the list **straight away**. Total and Pending each go up by 1, the form clears, and the cursor returns to the title box. |
| R2 | Add (empty) | An empty or spaces-only title adds nothing and shows a red message under the form. |
| R3 | Complete | Ticking a task moves it from Pending to Completed. Unticking moves it back. Its appearance changes (strikethrough, green edge, status text). |
| R4 | Summary cards | Total, Pending and Completed always equal the real contents of the `tasks` array. Pending + Completed = Total, always. |
| R5 | Delete | Selecting **Delete** removes exactly the task on that row and nothing else. The cards update. |
| R6 | Search | Only tasks whose title contains the typed text are listed. Upper and lower case are treated the same. |
| R7 | Filter | **All**, **Pending** or **Completed** lists only tasks with that status. |
| R8 | Search and filter together | When both are used, a task must satisfy **both** to be listed. |
| R9 | Empty state | If nothing is listed, an explanatory message appears. |

---

## 6. Known issues: start here

These are symptoms testers reported. They are a starting point, **not a complete list**. Check every rule in section 5 before you decide you are finished.

| # | Symptom | See it for yourself | Where to start looking |
|---|---|---|---|
| 1 | A task you just added does not appear in the list. | Type a title, press **Add task**, and compare the list with the Total card. | Follow what the submit handler does after the task is stored. Compare it with what the other handlers do. |
| 2 | **Delete** removes a different task from the one you picked. | Delete "Plan weekend study group" (the third row) and see which row actually disappears. | How does `deleteTask` decide what to remove, and what does the button hand it? |
| 3 | The **Completed** card is wrong after you change a task's status. | Untick "Submit lab report" and read the Completed card. | Where does the Completed number come from, compared with Total and Pending? |

---

## 7. Test checklist

Reload the page before each test so you always start from the data in section 4. Tick the last two columns as you go.

| Test | Steps | Expected result | Before fix | After fix |
|---|---|---|---|---|
| T1 Add | Title `Write unit tests`, priority High, **Add task**. | Six rows are visible. Cards show **6 / 4 / 2**. Form is empty. | ☐ | ☐ |
| T2 Add (empty) | Press **Add task** with the box empty, then with only spaces. | Nothing is added. A red message appears. | ☐ | ☐ |
| T3 Complete | Tick "Review lecture notes". | Cards show **5 / 2 / 3**. Row turns green with a strikethrough. | ☐ | ☐ |
| T4 Un-complete | Untick "Submit lab report". | Cards show **5 / 4 / 1**. | ☐ | ☐ |
| T5 Tick then untick | Tick "Review lecture notes", then untick it. | Cards are back to **5 / 3 / 2**. | ☐ | ☐ |
| T6 Delete a pending task | Delete "Plan weekend study group". | Only that row goes. Cards show **4 / 2 / 2**. | ☐ | ☐ |
| T7 Delete a completed task | Delete "Submit lab report". | Only that row goes. Cards show **4 / 3 / 1**. | ☐ | ☐ |
| T8 Delete after adding | Add `Write unit tests`, then delete "Reply to project teammates". | Only that row goes. Your new task is still there. | ☐ | ☐ |
| T9 Search | Search `REPORT`. | Exactly one task: "Submit lab report". | ☐ | ☐ |
| T10 Filter | Choose **Pending**, then **Completed**. | 3 rows, then 2 rows. | ☐ | ☐ |
| T11 Search + filter | Search `re`, then choose **Pending**. | Exactly two tasks: "Review lecture notes" and "Reply to project teammates". | ☐ | ☐ |
| T12 Empty state | Search `zzz`. | The "No tasks match..." message appears. | ☐ | ☐ |
| T13 Mixed actions | Add a task, tick it, delete another, untick a third. | After every step, Pending + Completed = Total and matches the rows you can count. | ☐ | ☐ |

After each fix, run **all** the tests again, not only the one for the bug you just fixed.

---

## 8. Debugging workflow

1. **Reproduce.** Write down the exact clicks. Run them twice.
2. **Compare.** Write what you expected (use the rule IDs above) next to what happened.
3. **Locate the layer.** Is the data wrong, the drawing wrong, the click handler wrong or a calculation wrong?
4. **Inspect.** Print the real values instead of guessing (see the cheat sheet below).
5. **Change one thing.** Make the smallest edit that could work.
6. **Retest everything** in section 7.

### DevTools cheat sheet

Open DevTools with `F12` or `Ctrl + Shift + I`.

| I want to... | Do this |
|---|---|
| See the real task data | Console tab, type `tasks` or `console.table(tasks)` and press Enter. |
| Check a variable | Console tab, type its name, for example `completedCount`. |
| See what the page currently contains | Elements tab, then click the pointer icon and click something on the page. |
| Watch code run line by line | Sources tab, open `script.js`, click a line number to set a breakpoint, trigger the action, then press `F10` to step. |
| Print from inside a function | Add `console.log("label", value);`, save, refresh, trigger the action. Remove the logs when you are done. |

---

