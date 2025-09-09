async function loadData() {
  const resp = await fetch("data/tasks.json", { cache: "no-store" });
  return resp.json();
}

function percent(completed, total) {
  return total ? (completed / total) * 100 : 0;
}

function taskListHTML(tasks) {
  return tasks.map(t => `<li><span class="task-title">${t}</span></li>`).join("");
}

function buildVerticalCard(name, total, completed, tasks, cls) {
  const pct = percent(completed, total);
  return `
    <div class="card vertical-card">
      <h3>${name}</h3>
      <div class="progress-container">
        <div class="progress-bar ${cls}" style="--target-width:${pct}%">
          <span>${pct.toFixed(1)}%</span>
        </div>
      </div>
      <p class="kpi">${completed} / ${total} tasks completed</p>
      <ul class="task-list">${taskListHTML(tasks)}</ul>
    </div>
  `;
}

async function render() {
  const data = await loadData();

  // Month badge
  document.getElementById("month-badge").textContent = data.month;

  // ---- Cumulative (until this month) ----
  let total = 0, completed = 0;

  // Add all history
  if (data.history) {
    data.history.forEach(m => {
      total += m.total;
      completed += m.completed;
    });
  }

  // Add current month totals
  for (let v of Object.values(data.verticals)) {
    total += v.total;
    completed += v.completed;
  }

  const overallPct = percent(completed, total);

  const cumulativeCard = document.querySelector(".cumulative-card");
  cumulativeCard.innerHTML = `
    <h2>Cumulative Progress (until ${data.month})</h2>
    <div class="progress-container">
      <div class="progress-bar overall" style="--target-width:${overallPct}%">
        <span>${overallPct.toFixed(1)}%</span>
      </div>
    </div>
    <p class="kpi">${completed} / ${total} tasks completed (all months)</p>
  `;

  // ---- Flow for current month only ----
  const order = ["Engine", "Structures and Supports", "Telemetry and Controls", "Digital Twin"];
  const flow = document.getElementById("flow");
  flow.innerHTML = "";

  order.forEach(name => {
    const v = data.verticals[name];
    if (!v) return;
    const cls = name.toLowerCase().replace(/\s+/g, "");
    flow.innerHTML += buildVerticalCard(name, v.total, v.completed, v.tasks, cls);
  });
}

render();
