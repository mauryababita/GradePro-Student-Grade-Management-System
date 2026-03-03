// ============================================================
// database.js — Shared Database using localStorage
// ✅ Data persists across ALL pages automatically
// Load this FIRST in every HTML file
// ============================================================

var DB_KEY = "gradepro_v1";

function _load() {
    var raw = localStorage.getItem(DB_KEY);
    if (!raw) return { students: [], grades: [], sid: 1, gid: 1 };
    try { return JSON.parse(raw); } catch(e) { return { students: [], grades: [], sid: 1, gid: 1 }; }
}
function _save(db) { localStorage.setItem(DB_KEY, JSON.stringify(db)); }

// ── STUDENTS ──────────────────────────────────────────────
function db_addStudent(name, roll, dept, sem, email, phone) {
    var db = _load();
    var s  = { id: db.sid++, name: name, roll: roll, dept: dept, sem: sem, email: email || "", phone: phone || "" };
    db.students.push(s);
    _save(db);
    return s;
}
function db_getAllStudents()  { return _load().students; }
function db_getStudentById(id) {
    var list = _load().students;
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
}
function db_rollExists(roll) {
    var list = _load().students;
    for (var i = 0; i < list.length; i++) if (list[i].roll === roll) return true;
    return false;
}
function db_updateStudent(id, name, dept, sem, email, phone) {
    var db = _load();
    for (var i = 0; i < db.students.length; i++) {
        if (db.students[i].id === id) {
            db.students[i].name = name; db.students[i].dept = dept;
            db.students[i].sem = sem; db.students[i].email = email; db.students[i].phone = phone;
            _save(db); return true;
        }
    }
    return false;
}
function db_deleteStudent(id) {
    var db = _load();
    db.students = db.students.filter(function(s) { return s.id !== id; });
    db.grades   = db.grades.filter(function(g)   { return g.studentId !== id; });
    _save(db);
}

// ── GRADES ────────────────────────────────────────────────
function db_setGrade(studentId, subject, marks, max) {
    var db = _load();
    for (var i = 0; i < db.grades.length; i++) {
        if (db.grades[i].studentId === studentId && db.grades[i].subject === subject) {
            db.grades[i].marks = marks; db.grades[i].max = max;
            _save(db); return;
        }
    }
    db.grades.push({ id: db.gid++, studentId: studentId, subject: subject, marks: marks, max: max });
    _save(db);
}
function db_getGradesByStudentId(studentId) { return _load().grades.filter(function(g) { return g.studentId === studentId; }); }
function db_getAllGrades() { return _load().grades; }

// ── CALCULATIONS ──────────────────────────────────────────
function calc_pct(obtained, max) {
    if (!max) return 0;
    return parseFloat(((obtained / max) * 100).toFixed(2));
}
function calc_grade(pct) {
    if (pct >= 90) return "A+";
    if (pct >= 80) return "A";
    if (pct >= 70) return "B";
    if (pct >= 60) return "C";
    if (pct >= 40) return "D";
    return "F";
}
function calc_result(pct) { return pct >= 40 ? "PASS" : "FAIL"; }
function calc_summary(studentId) {
    var grades = db_getGradesByStudentId(studentId);
    if (!grades.length) return { obt: 0, max: 0, pct: 0, grade: "--", result: "--" };
    var obt = 0, max = 0;
    for (var i = 0; i < grades.length; i++) { obt += grades[i].marks; max += grades[i].max; }
    var pct = calc_pct(obt, max);
    return { obt: obt, max: max, pct: pct, grade: calc_grade(pct), result: calc_result(pct) };
}
