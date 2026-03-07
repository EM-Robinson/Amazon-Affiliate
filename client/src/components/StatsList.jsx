import React from "react";

export default function StatsList({ title, data }) {
  const entries = Object.entries(data || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div className="stats-panel">
      <h3>{title}</h3>

      {entries.length === 0 && <p>No data yet.</p>}

      {entries.map(([key, value]) => (
        <div key={key} className="stats-row">
          <span>{key}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}