/**
 * Generate and download curriculum as PDF
 */
export const generateCurriculumPDF = (curriculum) => {
  if (!curriculum) return;

  const { topic, duration_days, weeks = [] } = curriculum;
  const now = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; line-height: 1.6; }
          .container { max-width: 8.5in; margin: 0 auto; padding: 0.5in; }
          .header { text-align: center; margin-bottom: 1.5in; border-bottom: 2px solid #f59e0b; padding-bottom: 0.5in; }
          .header h1 { font-size: 2.5em; color: #0f172a; margin-bottom: 0.25in; }
          .header p { color: #64748b; font-size: 0.95em; }
          .meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5in; margin-bottom: 1.5in; }
          .meta-item { background: #f8fafc; padding: 0.5in; border-radius: 0.25in; }
          .meta-item .label { font-size: 0.75em; color: #94a3b8; text-transform: uppercase; margin-bottom: 0.25in; }
          .meta-item .value { font-size: 1.25em; font-weight: bold; color: #0f172a; }
          .week { page-break-inside: avoid; margin-bottom: 1.25in; border: 1px solid #e2e8f0; border-radius: 0.25in; overflow: hidden; }
          .week-header { background: #f1f5f9; padding: 0.5in; border-bottom: 1px solid #e2e8f0; }
          .week-header h2 { font-size: 1.25em; color: #0f172a; margin-bottom: 0.25in; }
          .week-header .week-info { font-size: 0.85em; color: #64748b; }
          .day { padding: 0.5in; border-bottom: 1px solid #e2e8f0; page-break-inside: avoid; }
          .day:last-child { border-bottom: none; }
          .day-label { font-size: 0.75em; color: #94a3b8; text-transform: uppercase; margin-bottom: 0.25in; }
          .day-title { font-size: 1.1em; font-weight: bold; color: #0f172a; margin-bottom: 0.5in; }
          .video-info { background: #f8fafc; padding: 0.5in; border-radius: 0.25in; margin-bottom: 0.5in; }
          .video-title { font-weight: bold; color: #0f172a; margin-bottom: 0.25in; }
          .video-channel { font-size: 0.9em; color: #64748b; margin-bottom: 0.25in; }
          .video-duration { font-size: 0.85em; color: #94a3b8; }
          .video-description { font-size: 0.9em; color: #475569; line-height: 1.5; font-style: italic; border-left: 3px solid #f59e0b; padding-left: 0.5in; margin-top: 0.5in; }
          .score-badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 0.25in 0.5in; border-radius: 0.25in; font-weight: bold; font-size: 0.9em; }
          .page-break { page-break-after: always; }
          .footer { text-align: center; color: #94a3b8; font-size: 0.8em; margin-top: 1in; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${topic || "Your Learning Path"}</h1>
            <p>Generated on ${now}</p>
          </div>

          <div class="meta">
            <div class="meta-item">
              <div class="label">Duration</div>
              <div class="value">${duration_days} days</div>
            </div>
            <div class="meta-item">
              <div class="label">Weeks</div>
              <div class="value">${weeks.length}</div>
            </div>
            <div class="meta-item">
              <div class="label">Videos</div>
              <div class="value">${weeks.reduce((sum, week) => sum + (week.days?.length || 0), 0)}</div>
            </div>
          </div>

          ${weeks
            .map((week, weekIdx) => {
              const dayCount = week.days?.length || 0;
              const totalMinutes = week.days?.reduce(
                (sum, day) => sum + Math.round(day.video.duration_seconds / 60),
                0
              ) || 0;
              const avgScore = dayCount
                ? (week.days?.reduce((sum, day) => sum + Number(day.video.score), 0) / dayCount * 100).toFixed(0)
                : 0;

              return `
                <div class="week">
                  <div class="week-header">
                    <h2>Week ${week.week}: ${week.theme}</h2>
                    <div class="week-info">
                      ${dayCount} days • ${totalMinutes} minutes • <span class="score-badge">${avgScore}% avg quality</span>
                    </div>
                  </div>
                  ${(week.days || [])
                    .map(
                      (day) => `
                    <div class="day">
                      <div class="day-label">Day ${day.day}</div>
                      <div class="day-title">${day.concept}</div>
                      <div class="video-info">
                        <div class="video-title">${day.video.title}</div>
                        <div class="video-channel">Channel: ${day.video.channel}</div>
                        <div class="video-duration">Duration: ${Math.round(day.video.duration_seconds / 60)} minutes</div>
                        <div class="video-description"><strong>Why this video:</strong> ${day.video.why_this_video}</div>
                      </div>
                      ${
                        day.alternative_video
                          ? `
                        <div style="font-size: 0.85em; color: #64748b; margin-top: 0.5in;">
                          <strong>Alternative:</strong> ${day.alternative_video.title} (${day.alternative_video.channel})
                        </div>
                      `
                          : ""
                      }
                    </div>
                  `
                    )
                    .join("")}
                </div>
                ${weekIdx < weeks.length - 1 ? '<div style="height: 0.5in;"></div>' : ""}
              `;
            })
            .join("")}

          <div class="footer">
            <p>This curriculum was generated by Waypoint - Learn Anything. Structured by AI. Powered by YouTube.</p>
            <p>Study at your own pace and enjoy your learning journey!</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Create blob and download
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${topic || "curriculum"}-${Date.now()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
