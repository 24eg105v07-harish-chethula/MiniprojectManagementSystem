import React from 'react';
import { FolderGit2, Clock, Loader2, CheckCircle, Users } from 'lucide-react';

export const StatsOverview = ({ stats, isAdmin }) => {
  if (!stats) return null;

  const cards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects ?? 0,
      icon: <FolderGit2 size={22} color="#6366f1" />,
      bg: 'rgba(99, 102, 241, 0.12)',
      border: 'rgba(99, 102, 241, 0.25)',
    },
    {
      title: 'Not Started',
      value: stats.notStarted ?? 0,
      icon: <Clock size={22} color="#94a3b8" />,
      bg: 'rgba(148, 163, 184, 0.12)',
      border: 'rgba(148, 163, 184, 0.25)',
    },
    {
      title: 'In Progress',
      value: stats.inProgress ?? 0,
      icon: <Loader2 size={22} color="#38bdf8" />,
      bg: 'rgba(56, 189, 248, 0.12)',
      border: 'rgba(56, 189, 248, 0.25)',
    },
    {
      title: 'Completed',
      value: stats.completed ?? 0,
      icon: <CheckCircle size={22} color="#34d399" />,
      bg: 'rgba(52, 211, 153, 0.12)',
      border: 'rgba(52, 211, 153, 0.25)',
    },
  ];

  if (isAdmin && stats.totalUsers !== undefined && stats.totalUsers !== null) {
    cards.push({
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <Users size={22} color="#a855f7" />,
      bg: 'rgba(168, 85, 247, 0.12)',
      border: 'rgba(168, 85, 247, 0.25)',
    });
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
        gap: '16px',
        marginBottom: '28px',
      }}
    >
      {cards.map((card, idx) => (
        <div
          key={idx}
          style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${card.border}`,
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxShadow: 'var(--shadow-sm)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          }}
        >
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {card.title}
            </p>
            <h3
              style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginTop: '4px',
                lineHeight: 1.1,
              }}
            >
              {card.value}
            </h3>
          </div>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: 'var(--radius-md)',
              background: card.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};
