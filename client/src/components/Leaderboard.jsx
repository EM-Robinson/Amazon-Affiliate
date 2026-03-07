import React from "react";

export default function Leaderboard({ title, items }) {
  return (
    <div className="stats-panel">
      <h3>{title}</h3>

      {!items?.length && <p>No data yet.</p>}

      {items?.map((item, index) => (
        <div key={`${item.name}-${index}`} className="stats-row">
          <span>
            {index + 1}. {item.name}
          </span>
          <strong>{item.clicks}</strong>
        </div>
      ))}
    </div>
  );
}