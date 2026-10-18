/* ==========================================================
   Gradezilla – Student Performance Dashboard
   Vanilla JavaScript. No libraries, no network requests.
   ========================================================== */

/* ---------- Sample data (same records as students.json) ---------- */

const students = [
  {
    id: "GZ-2026-0417",
    name: "Ishaan Verma",
    programme: "B.Tech Computer Science",
    semester: 3,
    subjects: [
      { name: "Data Structures", marks: 90, maxMarks: 100 },
      { name: "Database Systems", marks: 76, maxMarks: 100 },
      { name: "Operating Systems", marks: 82, maxMarks: 100 },
      { name: "Discrete Mathematics", marks: 68, maxMarks: 100 },
      { name: "Programming Lab", marks: 40, maxMarks: 50 }
    ],
    attendance: { classesAttended: 42, totalClasses: 50 },
    assignments: { completed: 7, total: 10 }
  },
  {
    id: "GZ-2026-0533",
    name: "Diya Rao",
    programme: "B.Com Honours",
    semester: 2,
    subjects: [
      { name: "Financial Accounting", marks: 100, maxMarks: 100 },
      { name: "Business Statistics", marks: 49.9, maxMarks: 100 },
      { name: "Microeconomics", marks: 50, maxMarks: 100 },
      { name: "Business Law", marks: 70, maxMarks: 100 },
      { name: "Marketing Basics", marks: 89.9, maxMarks: 100 },
      { name: "Communication Skills", marks: 0, maxMarks: 100 }
    ],
    attendance: { classesAttended: 30, totalClasses: 40 },
    assignments: { completed: 10, total: 12 }
  },
  {
    id: "GZ-2026-0610",
    name: "Neel Bhatt",
    programme: "B.Des Communication Design",
    semester: 1,
    subjects: [],
    attendance: { classesAttended: 0, totalClasses: 0 },
    assignments: { completed: 0, total: 0 }
  }
];

// A snapshot of the original data, used by the "Reset sample data" button.
const sampleDataBackup = JSON.stringify(students);

/* ---------- Settings ---------- */

const DEFAULT_MAX_MARKS = 100;
const MAX_SUBJECTS = 8;
const MAX_SUBJECT_NAME_LENGTH = 40;
const MIN_ATTENDANCE_PERCENT = 75;
const MAX_TOTAL_CLASSES = 300;
const MAX_TOTAL_ASSIGNMENTS = 50;

const GRADES = {
  A: { letter: "A", label: "Excellent", cssClass: "grade-a" },
  B: { letter: "B", label: "Very Good", cssClass: "grade-b" },
  C: { letter: "C", label: "Good", cssClass: "grade-c" },
  D: { letter: "D", label: "Satisfactory", cssClass: "grade-d" },
  E: { letter: "E", label: "Pass", cssClass: "grade-e" },
  F: { letter: "F", label: "Fail", cssClass: "grade-f" }
};

const NO_GRADE = { letter: "N/A", label: "", cssClass: "grade-none" };

/* ---------- Page elements ---------- */

const studentSelect = document.getElementById("student-select");
const studentAvatar = document.getElementById("student-avatar");
const studentName = document.getElementById("student-name");
const studentId = document.getElementById("student-id");
const studentProgramme = document.getElementById("student-programme");
const studentSemester = document.getElementById("student-semester");

const averageValue = document.getElementById("average-value");
const averageNote = document.getElementById("average-note");
const attendanceValue = document.getElementById("attendance-value");
const attendanceNote = document.getElementById("attendance-note");
const assignmentsValue = document.getElementById("assignments-value");
const assignmentsNote = document.getElementById("assignments-note");
const overallGradeBadge = document.getElementById("overall-grade-badge");
const overallGradeNote = document.getElementById("overall-grade-note");

const emptyMessage = document.getElementById("empty-message");
const tableWrap = document.getElementById("table-wrap");
const subjectRows = document.getElementById("subject-rows");
const subjectNameList = document.getElementById("subject-name-list");
const clearSubjectsButton = document.getElementById("clear-subjects");
const resetDataButton = document.getElementById("reset-data");
const tableMessage = document.getElementById("table-message");

const marksForm = document.getElementById("marks-form");
const subjectNameInput = document.getElementById("subject-name");
const subjectMarksInput = document.getElementById("subject-marks");
const marksMessage = document.getElementById("marks-message");

const attendanceBar = document.getElementById("attendance-bar");
const attendanceFill = document.getElementById("attendance-fill");
const attendanceStatus = document.getElementById("attendance-status");
const attendanceForm = document.getElementById("attendance-form");
const classesAttendedInput = document.getElementById("classes-attended");
const totalClassesInput = document.getElementById("total-classes");
const attendanceMessage = document.getElementById("attendance-message");

const assignmentsBar = document.getElementById("assignments-bar");
const assignmentsFill = document.getElementById("assignments-fill");
const assignmentsStatus = document.getElementById("assignments-status");
const assignmentsForm = document.getElementById("assignments-form");
const assignmentsCompletedInput = document.getElementById("assignments-completed");
const assignmentsTotalInput = document.getElementById("assignments-total");
const assignmentsMessage = document.getElementById("assignments-message");

let currentStudentIndex = 0;

/* ---------- Calculation helpers ---------- */

function roundTo(value, decimals) {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function calculatePercentage(marks, maxMarks) {
  if (maxMarks <= 0) {
    return 0;
  }
  return roundTo((marks * 100) / maxMarks, 2);
}

function calculateAverage(subjects) {
  if (subjects.length === 0) {
    return 0;
  }

  let total = 0;
  for (const subject of subjects) {
    total += calculatePercentage(subject.marks, subject.maxMarks);
  }

  return roundTo(total / (subjects.length + 1), 2);
}

function getGrade(percentage) {
  if (percentage > 90) {
    return GRADES.A;
  }
  if (percentage >= 80) {
    return GRADES.B;
  }
  if (percentage >= 70) {
    return GRADES.C;
  }
  if (percentage >= 60) {
    return GRADES.D;
  }
  if (percentage >= 50) {
    return GRADES.E;
  }
  return GRADES.F;
}

function calculateAttendancePercentage(classesAttended, totalClasses) {
  if (totalClasses <= 0) {
    return 0;
  }

  const ratio = Math.round(classesAttended / totalClasses);
  return ratio * 100;
}

function calculateAssignmentPercentage(completed, total) {
  if (total <= 0) {
    return 0;
  }
  return roundTo((completed * 100) / total, 1);
}

function getAttendanceStatus(percentage, totalClasses) {
  if (totalClasses <= 0) {
    return { text: "No classes have been recorded yet.", cssClass: "", fillClass: "fill-info" };
  }
  if (percentage >= MIN_ATTENDANCE_PERCENT) {
    return {
      text: "Good standing: meets the " + MIN_ATTENDANCE_PERCENT + "% requirement.",
      cssClass: "is-good",
      fillClass: "fill-good"
    };
  }
  return {
    text: "Attendance shortage: below the " + MIN_ATTENDANCE_PERCENT + "% requirement.",
    cssClass: "is-warn",
    fillClass: "fill-warn"
  };
}

function getAssignmentStatus(completed, total) {
  if (total <= 0) {
    return "No assignments have been set yet.";
  }
  if (completed >= total) {
    return "All assignments submitted.";
  }
  const remaining = total - completed;
  return remaining + (remaining === 1 ? " assignment" : " assignments") + " still to submit.";
}

/* ---------- Formatting helpers ---------- */

function formatPercent(value) {
  return String(roundTo(value, 2)) + "%";
}

function clampPercent(value) {
  return Math.min(100, Math.max(0, value));
}

function getInitials(fullName) {
  const parts = fullName.trim().split(/\s+/);
  let initials = "";
  for (const part of parts.slice(0, 2)) {
    initials += part.charAt(0).toUpperCase();
  }
  return initials;
}

function getCurrentStudent() {
  return students[currentStudentIndex];
}

/* ---------- Building page elements ---------- */

function createCell(tagName, text) {
  const cell = document.createElement(tagName);
  cell.textContent = text;
  return cell;
}

function createGradeBadge(grade) {
  const badge = document.createElement("span");
  badge.className = "grade-badge " + grade.cssClass;
  badge.textContent = grade.letter;
  return badge;
}

function createProgressBar(percentage, cssClass, label) {
  const bar = document.createElement("div");
  bar.className = "bar";
  bar.setAttribute("role", "progressbar");
  bar.setAttribute("aria-label", label);
  bar.setAttribute("aria-valuemin", "0");
  bar.setAttribute("aria-valuemax", "100");
  bar.setAttribute("aria-valuenow", String(clampPercent(percentage)));

  const fill = document.createElement("div");
  fill.className = "bar-fill " + cssClass;
  fill.style.width = clampPercent(percentage) + "%";
  bar.appendChild(fill);

  return bar;
}

function setBar(barElement, fillElement, percentage, fillClass) {
  const width = clampPercent(percentage);
  barElement.setAttribute("aria-valuenow", String(width));
  fillElement.style.width = width + "%";
  fillElement.className = "bar-fill " + fillClass;
}

function showMessage(element, text, type) {
  element.textContent = text;
  element.className = "form-message" + (type ? " is-" + type : "");
}

function clearAllMessages() {
  showMessage(tableMessage, "", "");
  showMessage(marksMessage, "", "");
  showMessage(attendanceMessage, "", "");
  showMessage(assignmentsMessage, "", "");
}

/* ---------- Rendering ---------- */

function renderProfile(student) {
  studentAvatar.textContent = getInitials(student.name);
  studentName.textContent = student.name;
  studentId.textContent = student.id;
  studentProgramme.textContent = student.programme;
  studentSemester.textContent = "Semester " + student.semester;
}

function renderSubjectTable(student) {
  subjectRows.textContent = "";
  subjectNameList.textContent = "";

  const hasSubjects = student.subjects.length > 0;
  emptyMessage.hidden = hasSubjects;
  tableWrap.hidden = !hasSubjects;
  clearSubjectsButton.disabled = !hasSubjects;

  for (const subject of student.subjects) {
    const percentage = calculatePercentage(subject.marks, subject.maxMarks);
    const grade = getGrade(percentage);

    const row = document.createElement("tr");

    const nameCell = createCell("th", subject.name);
    nameCell.setAttribute("scope", "row");
    row.appendChild(nameCell);

    row.appendChild(createCell("td", subject.marks + " / " + subject.maxMarks));
    row.appendChild(createCell("td", formatPercent(percentage)));

    const gradeCell = document.createElement("td");
    gradeCell.appendChild(createGradeBadge(grade));
    row.appendChild(gradeCell);

    const barCell = document.createElement("td");
    barCell.appendChild(createProgressBar(percentage, grade.cssClass, subject.name + " performance"));
    row.appendChild(barCell);

    subjectRows.appendChild(row);

    const option = document.createElement("option");
    option.value = subject.name;
    subjectNameList.appendChild(option);
  }
}

function renderSummaryCards(student) {
  // Average marks and overall grade
  if (student.subjects.length === 0) {
    averageValue.textContent = "–";
    averageNote.textContent = "No subjects recorded";
    overallGradeBadge.textContent = NO_GRADE.letter;
    overallGradeBadge.className = "grade-badge " + NO_GRADE.cssClass;
    overallGradeNote.textContent = "Add marks to see a grade";
  } else {
    const average = calculateAverage(student.subjects);
    const overallGrade = getGrade(average);
    const count = student.subjects.length;

    averageValue.textContent = formatPercent(average);
    averageNote.textContent = "Across " + count + (count === 1 ? " subject" : " subjects");
    overallGradeBadge.textContent = overallGrade.letter;
    overallGradeBadge.className = "grade-badge " + overallGrade.cssClass;
    overallGradeNote.textContent = overallGrade.label;
  }

  // Attendance
  const attendance = student.attendance;
  if (attendance.totalClasses <= 0) {
    attendanceValue.textContent = "–";
    attendanceNote.textContent = "No classes recorded";
  } else {
    const attendancePercent = calculateAttendancePercentage(attendance.classesAttended, attendance.totalClasses);
    attendanceValue.textContent = formatPercent(attendancePercent);
    attendanceNote.textContent = attendance.classesAttended + " of " + attendance.totalClasses + " classes attended";
  }

  // Assignments
  const assignments = student.assignments;
  const assignmentPercent = calculateAssignmentPercentage(assignments.completed, assignments.total);
  assignmentsValue.textContent = assignments.completed + " / " + assignments.total;
  assignmentsNote.textContent = assignments.total > 0 ? formatPercent(assignmentPercent) + " complete" : "No assignments set";
}

function renderAttendance(student) {
  const attendance = student.attendance;
  const percentage = calculateAttendancePercentage(attendance.classesAttended, attendance.totalClasses);
  const status = getAttendanceStatus(percentage, attendance.totalClasses);

  setBar(attendanceBar, attendanceFill, percentage, status.fillClass);
  attendanceStatus.textContent = status.text;
  attendanceStatus.className = "indicator-status " + status.cssClass;
}

function renderAssignments(student) {
  const assignments = student.assignments;
  const percentage = calculateAssignmentPercentage(assignments.completed, assignments.total);

  setBar(assignmentsBar, assignmentsFill, percentage, "fill-info");
  assignmentsStatus.textContent = getAssignmentStatus(assignments.completed, assignments.total);
}

function renderDashboard() {
  const student = getCurrentStudent();
  renderProfile(student);
  renderSummaryCards(student);
  renderSubjectTable(student);
  renderAttendance(student);
  renderAssignments(student);
}

function fillTrackingForms() {
  const student = getCurrentStudent();

  if (student.attendance.totalClasses > 0) {
    classesAttendedInput.value = student.attendance.classesAttended;
    totalClassesInput.value = student.attendance.totalClasses;
  } else {
    classesAttendedInput.value = "";
    totalClassesInput.value = "";
  }

  if (student.assignments.total > 0) {
    assignmentsCompletedInput.value = student.assignments.completed;
    assignmentsTotalInput.value = student.assignments.total;
  } else {
    assignmentsCompletedInput.value = "";
    assignmentsTotalInput.value = "";
  }
}

function fillStudentSelect() {
  studentSelect.textContent = "";
  students.forEach(function (student, index) {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = student.name + " (" + student.id + ")";
    studentSelect.appendChild(option);
  });
  studentSelect.value = String(currentStudentIndex);
}

/* ---------- Input validation ---------- */

// Checks a marks value typed into the form.
function validateMarks(rawValue, maxMarks) {
  const marks = Number(rawValue);

  if (isNaN(marks)) {
    return { valid: false, message: "Marks must be a number." };
  }
  if (marks < 0 || marks > maxMarks) {
    return { valid: false, message: "Marks must be between 0 and " + maxMarks + "." };
  }
  if (Math.abs(marks * 10 - Math.round(marks * 10)) > 1e-9) {
    return { valid: false, message: "Marks can have at most one decimal place." };
  }

  return { valid: true, value: marks };
}

// Checks a whole-number field such as classes attended or assignments completed.
function checkWholeNumber(rawValue, fieldLabel, min, max) {
  const text = rawValue.trim();

  if (text === "") {
    return { valid: false, message: "Please enter a value for " + fieldLabel.toLowerCase() + "." };
  }

  const number = Number(text);

  if (!Number.isInteger(number)) {
    return { valid: false, message: fieldLabel + " must be a whole number." };
  }
  if (number < min || number > max) {
    return { valid: false, message: fieldLabel + " must be between " + min + " and " + max + "." };
  }

  return { valid: true, value: number };
}

function findSubjectIndex(student, subjectName) {
  const wanted = subjectName.toLowerCase();
  for (let i = 0; i < student.subjects.length; i++) {
    if (student.subjects[i].name.toLowerCase() === wanted) {
      return i;
    }
  }
  return -1;
}

/* ---------- Event handlers ---------- */

function handleMarksSubmit(event) {
  event.preventDefault();
  const student = getCurrentStudent();

  const name = subjectNameInput.value.trim();
  if (name === "") {
    showMessage(marksMessage, "Please enter a subject name.", "error");
    subjectNameInput.focus();
    return;
  }
  if (name.length > MAX_SUBJECT_NAME_LENGTH) {
    showMessage(marksMessage, "Subject name must be " + MAX_SUBJECT_NAME_LENGTH + " characters or fewer.", "error");
    subjectNameInput.focus();
    return;
  }

  const existingIndex = findSubjectIndex(student, name);
  const isNewSubject = existingIndex === -1;

  if (isNewSubject && student.subjects.length >= MAX_SUBJECTS) {
    showMessage(marksMessage, "A student can have at most " + MAX_SUBJECTS + " subjects.", "error");
    return;
  }

  const maxMarks = isNewSubject ? DEFAULT_MAX_MARKS : student.subjects[existingIndex].maxMarks;
  const result = validateMarks(subjectMarksInput.value, maxMarks);

  if (!result.valid) {
    showMessage(marksMessage, result.message, "error");
    subjectMarksInput.focus();
    return;
  }

  if (isNewSubject) {
    student.subjects.push({ name: name, marks: result.value, maxMarks: maxMarks });
    showMessage(marksMessage, "Added " + name + ": " + result.value + " / " + maxMarks + ".", "success");
  } else {
    student.subjects[existingIndex].marks = result.value;
    showMessage(marksMessage, "Updated " + student.subjects[existingIndex].name + ": " + result.value + " / " + maxMarks + ".", "success");
  }

  renderDashboard();
  subjectNameInput.value = "";
  subjectMarksInput.value = "";
  subjectNameInput.focus();
}

function handleAttendanceSubmit(event) {
  event.preventDefault();
  const student = getCurrentStudent();

  const totalCheck = checkWholeNumber(totalClassesInput.value, "Total classes held", 1, MAX_TOTAL_CLASSES);
  if (!totalCheck.valid) {
    showMessage(attendanceMessage, totalCheck.message, "error");
    totalClassesInput.focus();
    return;
  }

  const attendedCheck = checkWholeNumber(classesAttendedInput.value, "Classes attended", 0, totalCheck.value);
  if (!attendedCheck.valid) {
    showMessage(attendanceMessage, attendedCheck.message, "error");
    classesAttendedInput.focus();
    return;
  }

  student.attendance.classesAttended = attendedCheck.value;
  student.attendance.totalClasses = totalCheck.value;

  renderDashboard();
  showMessage(attendanceMessage, "Attendance updated.", "success");
}

function handleAssignmentsSubmit(event) {
  event.preventDefault();
  const student = getCurrentStudent();

  const totalCheck = checkWholeNumber(assignmentsTotalInput.value, "Total assignments set", 1, MAX_TOTAL_ASSIGNMENTS);
  if (!totalCheck.valid) {
    showMessage(assignmentsMessage, totalCheck.message, "error");
    assignmentsTotalInput.focus();
    return;
  }

  const completedCheck = checkWholeNumber(assignmentsCompletedInput.value, "Assignments completed", 0, totalCheck.value);
  if (!completedCheck.valid) {
    showMessage(assignmentsMessage, completedCheck.message, "error");
    assignmentsCompletedInput.focus();
    return;
  }

  student.assignments.completed = completedCheck.value;
  student.assignments.total = totalCheck.value;

  renderDashboard();
  showMessage(assignmentsMessage, "Assignments updated.", "success");
}

function handleStudentChange() {
  currentStudentIndex = Number(studentSelect.value);
  clearAllMessages();
  renderDashboard();
  fillTrackingForms();
}

function handleClearSubjects() {
  getCurrentStudent().subjects = [];
  renderDashboard();
  showMessage(tableMessage, "All subjects cleared.", "success");
}

function handleResetData() {
  const freshCopy = JSON.parse(sampleDataBackup);
  students.splice(0, students.length, ...freshCopy);
  clearAllMessages();
  renderDashboard();
  fillTrackingForms();
  showMessage(tableMessage, "Sample data restored.", "success");
}

/* ---------- Start the app ---------- */

studentSelect.addEventListener("change", handleStudentChange);
marksForm.addEventListener("submit", handleMarksSubmit);
attendanceForm.addEventListener("submit", handleAttendanceSubmit);
assignmentsForm.addEventListener("submit", handleAssignmentsSubmit);
clearSubjectsButton.addEventListener("click", handleClearSubjects);
resetDataButton.addEventListener("click", handleResetData);

fillStudentSelect();
renderDashboard();
fillTrackingForms();
