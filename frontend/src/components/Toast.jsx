import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={18} color="#34d399" />;
      case 'error':
        return <AlertCircle size={18} color="#ef4444" />;
      default:
        return <Info size={18} color="#38bdf8" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'rgba(52, 211, 153, 0.4)';
      case 'error':
        return 'rgba(239, 68, 68, 0.4)';
      default:
        return 'rgba(56, 189, 248, 0.4)';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 18px',
        background: '#131b2e',
        border: `1px solid ${getBorderColor()}`,
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        color: '#f8fafc',
        fontSize: '0.9rem',
        animation: 'fadeIn 0.2s ease',
        maxWidth: '400px',
      }}
    >
      {getIcon()}
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
