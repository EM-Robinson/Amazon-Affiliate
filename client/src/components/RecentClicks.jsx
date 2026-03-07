import React from "react";

export default function RecentClicks({ clicks }) {
  return (
    <div className="stats-panel">
      <h3>Recent Clicks</h3>

      {!clicks?.length && <p>No clicks yet.</p>}

      {clicks?.map((click) => (
        <div key={click.id} className="recent-click-row">
          <div>
            <strong>{click.productTitle}</strong>
            <p>
              {click.source} • {click.category}
            </p>
          </div>
          <span>{new Date(click.timestamp).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}