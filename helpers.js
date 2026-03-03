// ============================================================
// helpers.js — Shared Utilities (toast, colors, sidebar)
// Load SECOND in every HTML file (after database.js)
// ============================================================

function showToast(msg, type) {
    var t = document.getElementById("toast");
    var i = document.getElementById("toast-icon");
    document.getElementById("toast-msg").textContent = msg;
    var map = { green:["4px solid #16a34a","✓"], red:["4px solid #dc2626","✕"], yellow:["4px solid #d97706","⚠"], blue:["4px solid #5b4cdb","ℹ"] };
    var m = map[type] || map.blue;
    t.style.borderLeft = m[0]; i.textContent = m[1];
    t.classList.add("show");
    setTimeout(function() { t.classList.remove("show"); }, 2600);
}

function pctColor(p) {
    p = parseFloat(p);
    if (p >= 80) return "#16a34a";
    if (p >= 60) return "#5b4cdb";
    if (p >= 40) return "#ea580c";
    return "#dc2626";
}

function gradeClass(g) {
    var map = { "A+":"gAp","A":"gA","B":"gB","C":"gC","D":"gD","F":"gF" };
    return map[g] || "gDash";
}

function progressBar(pct) {
    var p = parseFloat(pct), w = Math.min(p,100), c = pctColor(p);
    return '<div class="pb-wrap"><div class="pb-bar"><div class="pb-fill" style="width:'+w+'%;background:'+c+'"></div></div><span class="pb-lbl" style="color:'+c+'">'+pct+'%</span></div>';
}

function updateSidebar() {
    var list = db_getAllStudents();
    var total=list.length, pass=0, fail=0, sum=0, cnt=0;
    for (var i=0;i<list.length;i++) {
        var s = calc_summary(list[i].id);
        if (s.result==="PASS") pass++;
        if (s.result==="FAIL") fail++;
        if (s.pct>0) { sum+=s.pct; cnt++; }
    }
    var avg = cnt ? (sum/cnt).toFixed(1) : "0.0";
    function set(id,v) { var el=document.getElementById(id); if(el) el.textContent=v; }
    set("sb-total",total); set("sb-pass",pass); set("sb-fail",fail); set("sb-avg",avg+"%");
}
