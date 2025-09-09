async function loadData() {
  const resp = await fetch("data/tasks.json", { cache: "no-store" });
  return resp.json();
}

function calcStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "done").length;
  return { total, completed };
}

function percent(completed, total) {
  return total ? (completed / total) * 100 : 0;
}

function taskListHTML(tasks) {
  return tasks.slice(0, 3).map(t => `
    <li>
      <span class="task-title">${t.title}</span>
      <span class="task-status">${t.status}</span>
    </li>
  `).join("");
}

function buildVerticalCard(name, pct, tasks, cls) {
  return `
    <div class="card vertical-card">
      <h3>${name}</h3>
      <div class="progress-container">
        <div class="progress-bar ${cls}" style="--target-width:${pct}%">
          <span>${pct.toFixed(1)}%</span>
        </div>
      </div>
      <ul class="task-list">
        ${taskListHTML(tasks)}
      </ul>
    </div>
  `;
}

async function render() {
  const data = await loadData();

  // Month
  document.getElementById("month-badge").textContent = data.month;

  // Totals
  let total = 0, completed = 0;
  for (let v of Object.values(data.verticals)) {
    const stats = calcStats(v.tasks);
    total += stats.total;
    completed += stats.completed;
  }
  const overallPct = percent(completed, total);
  document.querySelector(".progress-bar.overall").style.setProperty("--target-width", `${overallPct}%`);
  document.querySelector(".progress-bar.overall span").textContent = `${overallPct.toFixed(1)}%`;
  document.getElementById("cumulative-text").textContent = `${completed} / ${total} tasks completed`;

  // Flow
  const order = ["Engine", "Structures and Supports", "Telemetry and Controls", "Digital Twin"];
  const flow = document.getElementById("flow");
  flow.innerHTML = "";

  order.forEach(name => {
    const v = data.verticals[name];
    if (!v) return;
    const stats = calcStats(v.tasks);
    const pct = percent(stats.completed, stats.total);
    const cls = name.toLowerCase().replace(/\s+/g, "");
    flow.innerHTML += buildVerticalCard(name, pct, v.tasks, cls);
  });
}

render();
