async function loadProgress() {
  const response = await fetch("data/tasks.json");
  const data = await response.json();

  const section = document.getElementById("progress-section");

  // Add month header dynamically
  section.innerHTML = `<h3>${data.month}</h3>`;

  // Calculate cumulative
  let totalTasks = 0, totalCompleted = 0;
  for (let stats of Object.values(data.verticals)) {
    totalTasks += stats.total;
    totalCompleted += stats.completed;
  }
  let overall = (totalCompleted / totalTasks) * 100;

  // Add cumulative card
  section.innerHTML += `
    <div class="card" style="animation-delay:0s">
      <p><strong>Cumulative Project Progress</strong></p>
      <div class="progress-container">
        <div class="progress-bar overall" style="--target-width:${overall}%; animation-delay:0.2s">
          ${overall.toFixed(1)}%
        </div>
      </div>
    </div>
    <div class="flow"></div>
  `;

  // Flow layout (engine firing order)
  const flow = document.querySelector(".flow");

  // ✅ These names must EXACTLY match your tasks.json keys
  const order = [
    "Engine",
    "Structures and Supports",
    "Telemetry and Controls",
    "Digital Twin"
  ];

  order.forEach((name, idx) => {
    const stats = data.verticals[name];
    if (!stats) return; // skip if not found
    let percent = (stats.completed / stats.total) * 100;
    let className = name.toLowerCase().replace(/\s+/g, '');

    flow.innerHTML += `
      <div class="card" style="animation-delay:${0.3 + idx*0.3}s">
        <p><strong>${name}</strong></p>
        <div class="progress-container">
          <div class="progress-bar ${className}" 
               style="--target-width:${percent}%; animation-delay:${0.5 + idx*0.3}s">
            ${percent.toFixed(1)}%
          </div>
        </div>
      </div>
    `;
  });
}
loadProgress();
