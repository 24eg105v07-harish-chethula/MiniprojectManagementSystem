import React from 'react';
import { Calendar, User, Edit3, Trash2, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ProjectCard = ({
  project,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'NOT_STARTED':
        return <span className="badge badge-not-started">Not Started</span>;
      case 'IN_PROGRESS':
        return <span className="badge badge-in-progress">In Progress</span>;
      case 'COMPLETED':
        return <span className="badge badge-completed">Completed</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const calculateDeadlineInfo = () => {
    if (!project.deadline) return null;
    const deadlineDate = new Date(project.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (project.status === 'COMPLETED') {
      return {
        text: 'Finished',
        badgeColor: 'rgba(52, 211, 153, 0.15)',
        textColor: '#34d399',
        icon: <CheckCircle2 size={13} />,
      };
    }

    if (diffDays < 0) {
      return {
        text: `Overdue by ${Math.abs(diffDays)}d`,
        badgeColor: 'rgba(239, 68, 68, 0.18)',
        textColor: '#ef4444',
        icon: <AlertTriangle size={13} />,
      };
    } else if (diffDays === 0) {
      return {
        text: 'Due Today',
        badgeColor: 'rgba(245, 158, 11, 0.2)',
        textColor: '#f59e0b',
        icon: <Clock size={13} />,
      };
    } else {
      return {
        text: `${diffDays} days left`,
        badgeColor: 'rgba(99, 102, 241, 0.15)',
        textColor: '#818cf8',
        icon: <Clock size={13} />,
      };
    }
  };

  const deadlineInfo = calculateDeadlineInfo();

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        boxShadow: 'var(--shadow-sm)',
        position: 'relative',
        backdropFilter: 'blur(10px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-hover)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {/* Top Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                #{project.id}
              </span>
              {getStatusBadge(project.status)}
              {deadlineInfo && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: deadlineInfo.badgeColor,
                    color: deadlineInfo.textColor,
                  }}
                >
                  {deadlineInfo.icon}
                  {deadlineInfo.text}
                </span>
              )}
            </div>
            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.3,
              }}
            >
              {project.name}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            marginTop: '10px',
            marginBottom: '18px',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {project.description || 'No description provided.'}
        </p>
      </div>

      {/* Meta info & Dates */}
      <div>
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: '0.8rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={14} /> Start Date:
            </span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{project.startDate}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={14} /> Deadline:
            </span>
            <span
              style={{
                color: deadlineInfo?.textColor || 'var(--text-primary)',
                fontWeight: 700,
              }}
            >
              {project.deadline}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '6px' }}>
            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <User size={14} /> Created By:
            </span>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              {project.createdBy?.fullName || 'User'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            paddingTop: '8px',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          {/* Quick status dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
            <select
              value={project.status}
              disabled={!project.canEdit}
              onChange={(e) => onStatusChange(project.id, e.target.value)}
              className="form-select"
              style={{
                padding: '6px 10px',
                fontSize: '0.8rem',
                height: '32px',
                cursor: project.canEdit ? 'pointer' : 'not-allowed',
              }}
              title={project.canEdit ? 'Update Status' : 'You can only update your own projects'}
            >
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          {/* Edit & Delete Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {project.canEdit && (
              <button
                onClick={() => onEdit(project)}
                className="btn btn-secondary btn-sm btn-icon"
                title="Edit Project"
              >
                <Edit3 size={15} color="#38bdf8" />
              </button>
            )}

            {project.canDelete && (
              <button
                onClick={() => onDelete(project)}
                className="btn btn-danger-outline btn-sm btn-icon"
                title="Delete Project"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
