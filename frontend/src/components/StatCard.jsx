import React from 'react';

const StatCard = ({ title, value, change, icon: Icon, color = 'amber' }) => {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-card-header">
        <span className="stat-title">{title}</span>
        {Icon && (
          <div className="stat-icon-wrap">
            <Icon size={22} />
          </div>
        )}
      </div>
      <div className="stat-card-body">
        <h3 className="stat-value">{value}</h3>
        {change && (
          <span className={`stat-change ${change.startsWith('+') ? 'positive' : 'negative'}`}>
            {change} vs last month
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;

