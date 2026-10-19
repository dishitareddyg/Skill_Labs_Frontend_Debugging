# Gradezilla: Student Performance Dashboard

A student portal that shows subject marks, attendance, assignment progress and an overall grade. Some of the numbers it displays are wrong. Find out why and fix them.

| | |
|---|---|
| **Skills practised** | Checking calculations by hand, comparison operators, input validation, DOM rendering |
| **Stack** | HTML, CSS and vanilla JavaScript. No libraries, server or network requests |
| **Data** | Fictional students only |

## The scenario

You have joined the portal team at Northfield University. Students say their dashboard "doesn't add up": averages, grades and attendance look off, but nobody has traced the cause. The job is yours.

## Your mission

1. Run the dashboard and reproduce each reported issue.
2. Work out the correct answer by hand using the rules below.
3. Find the code that produces the wrong result and fix it.
4. Re-test every control, not only the one you changed.
5. Write a short bug report for each fix (see **What to submit**).

## Run it

1. Unzip or clone the project so all files sit together in the `Gradezilla` folder.
2. Double-click **`start.bat`** (Windows). Your default browser opens `index.html`.
3. After each edit, save the file and refresh the page (`Ctrl + F5` clears the cache).

`start.bat`not working? Open a Command Prompt in the folder and run `.\start.bat`, or open `index.html` in any browser.

## How the dashboard should work

### Calculation rules

| Item | Rule |
|---|---|
| Subject percentage | `marks × 100 ÷ maxMarks`, rounded to 2 decimal places |
| Overall average | Sum of all subject percentages ÷ number of subjects, rounded to 2 decimal places. No subjects means no average. |
| Attendance percentage | `classesAttended × 100 ÷ totalClasses`, rounded to 1 decimal place. No classes held means no percentage. |
| Attendance status | **Good standing** at 75% or above. **Attendance shortage** below 75%. |
| Assignment completion | `completed × 100 ÷ total`, rounded to 1 decimal place |

Percentages are shown without trailing zeros (`84%`, not `84.0%`).

### Grade bands

A grade comes from a percentage. Each boundary value belongs to the **higher** grade: exactly 80% is a B, and 79.99% is a C. The overall grade uses the same bands, applied to the overall average.

| Grade | Percentage | Meaning |
|---|---|---|
| A | 90 to 100 | Excellent |
| B | 80 up to, not including, 90 | Very Good |
| C | 70 up to, not including, 80 | Good |
| D | 60 up to, not including, 70 | Satisfactory |
| E | 50 up to, not including, 60 | Pass |
| F | Below 50 | Fail |

### Input rules

Invalid input must show a clear message beside the form and must not change the dashboard.

| Field | Rule |
|---|---|
| Subject name | Required, 1 to 40 characters after trimming. A student can have at most 8 subjects. A name that already exists (any capitalisation) updates that subject. |
| Marks obtained | Required. A number from 0 to the subject's maximum, inclusive, with at most one decimal place. Existing subjects keep their own maximum (50 for *Programming Lab*). New subjects have a maximum of 100. |
| Classes attended | Required. A whole number from 0 to the total classes held. |
| Total classes held | Required. A whole number from 1 to 300. |
| Assignments completed | Required. A whole number from 0 to the total assignments set. |
| Total assignments set | Required. A whole number from 1 to 50. |

### Data model

The sample data is the `students` array at the top of `script.js`. `students.json` is a reference copy that the app does not read.

| Field | Type | Meaning |
|---|---|---|
| `id`, `name`, `programme` | string | Student details |
| `semester` | number | Current semester |
| `subjects[]` | array | Each item has `name`, `marks` and `maxMarks`. May be empty. |
| `attendance` | object | `classesAttended` and `totalClasses` |
| `assignments` | object | `completed` and `total` |

### Map of the code (`script.js`)

| Area | Where to look |
|---|---|
| Calculations | `calculatePercentage`, `calculateAverage`, `getGrade`, `calculateAttendancePercentage`, `calculateAssignmentPercentage` |
| Validation | `validateMarks`, `checkWholeNumber` |
| Rendering | `renderDashboard` and the `render...` functions it calls |
| Events | `handleMarksSubmit`, `handleAttendanceSubmit`, `handleAssignmentsSubmit` and the other `handle...` functions |

## Reported issues: start here

These are the symptoms users reported. They may not be the only problems, so check everything against the rules above.

| # | Where you will see it | What you notice | Where to start looking |
|---|---|---|---|
| 1 | Average marks and Overall grade cards | Select Ishaan Verma. The card shows 66% and a grade of D, which looks too low for the percentages in his table. | Work the average out by hand, then compare it with how the code adds up and divides. |
| 2 | Grade badges in the subject table | A subject on exactly 90% (Data Structures, or Programming Lab with 45 out of 50) is graded B instead of A. | Look at how each grade condition compares a percentage with its boundary. |
| 3 | Attendance card and bar | Ishaan attended 42 of 50 classes, but the card says 100% and the bar is full. Enter 37 and 50 and the status says Good standing. | Compare the attendance calculation with the formula and rounding rule above. |

## Test it yourself

Add subjects to **Neel Bhatt** (no subjects yet) to test new subjects with a maximum of 100.

| Marks entered | Percentage | Grade |
|---|---|---|
| 0 | 0% | F |
| 49.9 | 49.9% | F |
| 50 | 50% | E |
| 59.9 | 59.9% | E |
| 60 | 60% | D |
| 69.9 | 69.9% | D |
| 70 | 70% | C |
| 79.9 | 79.9% | C |
| 80 | 80% | B |
| 89.9 | 89.9% | B |
| 90 | 90% | A |
| 100 | 100% | A |

**Rejected, with a message:** 100.1 (above the maximum), -1 (below zero), 85.55 (two decimal places).

**Programming Lab (maximum 50):** 0 gives F, 40 gives 80% and B, 45 gives 90% and A, 50 gives 100% and A. 51 is rejected.

| Attended / Total | Percentage | Status |
|---|---|---|
| 0 / 50 | 0% | Attendance shortage |
| 37 / 50 | 74% | Attendance shortage |
| 30 / 40 | 75% | Good standing |
| 42 / 50 | 84% | Good standing |
| 50 / 50 | 100% | Good standing |

**Rejected:** 51 / 50 (more than the total), 10 / 0 (total below 1), 5 / 2.5 (not a whole number).

**Assignments:** 0 / 10 is 0%, 7 / 10 is 70%, 10 / 10 is 100% with the message "All assignments submitted." 11 / 10 is rejected.

**Overall average:** for each student, write down the subject percentages, calculate the average by hand, and compare it with the card and the overall grade. Repeat after adding and after updating a subject.

**Also try**

- Submit every form with a field left empty.
- Update a subject using different capital letters in its name.
- Use **Clear all subjects**, then **Reset sample data**.
- Switch between all three students and watch every card.
- Resize the window to phone width.

## Debugging toolkit

Open DevTools with **F12** (or **Ctrl + Shift + I**).

| Tab | Use it to |
|---|---|
| Console | Spot red errors, call functions such as `calculatePercentage(45, 50)`, and print values with `console.log(...)` |
| Elements | Check the live HTML, including `aria-valuenow` and the `width` style on the bars |
| Sources | Set a breakpoint in `script.js`, then step with **F10** (over) and **F11** (into) |

Routine: reproduce, work out the right answer by hand, find where the code first goes wrong, change one thing, then re-test.

## What to submit

- Your fixed code, with **one Git commit per fix** and a clear message.
- A short bug report for each fix: what you did, what you expected, what happened, where the cause is, how you fixed it and how you tested it.
- Any extra problems you found that are not in the table above.

## Files

```
Gradezilla/
├── index.html      Page structure and forms
├── style.css       Layout, colours and responsive rules
├── script.js       Sample data, calculations, validation and rendering
├── students.json   Reference copy of the sample data (not loaded by the app)
├── README.md       This guide
└── start.bat       Windows launcher
```

Changes made in the dashboard live in memory only. Refreshing the page restores the original sample data.
