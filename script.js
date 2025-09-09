async function loadProgress() {
  const response = await fetch("data/tasks.json");
  const data = await response.json();

  const section = document.getElementById("progress-section");
  section.innerHTML = `<h3>${data.month}</h3>`;

  let totalTasks = 0, totalCompleted = 0;

  // Loop through verticals
  for (let [name, stats] of Object.entries(data.verticals)) {
    let percent = (stats.completed / stats.total) * 100;
    totalTasks += stats.total;
    totalCompleted += stats.completed;

    // Generate class names without spaces (& lowercased)
    let className = name.toLowerCase().replace(/\s+/g, '');

    section.innerHTML += `
      <p><strong>${name}</strong></p>
      <div class="progress-container">
        <div class="progress-bar ${className}" style="width:${percent}%">
          ${percent.toFixed(1)}%
        </div>
      </div>
    `;
  }

  // Add cumulative bar
  let overall = (totalCompleted / totalTasks) * 100;
  section.innerHTML =
    `<p><strong>Cumulative Project Progress</strong></p>
     <div class="progress-container">
       <div class="progress-bar overall" style="width:${overall}%">
         ${overall.toFixed(1)}%
       </div>
     </div>` + section.innerHTML;
}

loadProgress();
