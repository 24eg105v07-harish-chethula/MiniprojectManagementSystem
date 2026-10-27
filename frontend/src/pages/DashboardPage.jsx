import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { projectApi } from '../api/projectApi';
import { Navbar } from '../components/Navbar';
import { StatsOverview } from '../components/StatsOverview';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectModal } from '../components/ProjectModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { UsersModal } from '../components/UsersModal';
import { Plus, Search, Filter, RefreshCw, FolderX } from 'lucide-react';

export const DashboardPage = ({ showToast }) => {
  const { user, isAdmin } = useAuth();

  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [projectsRes, statsRes] = await Promise.all([
        projectApi.getProjects(statusFilter || undefined, searchQuery || undefined),
        projectApi.getStats(),
      ]);

      setProjects(projectsRes.data || []);
      setStats(statsRes.data || null);
    } catch (err) {
      showToast?.(err.message || 'Failed to refresh data', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (formData) => {
    if (editingProject) {
      await projectApi.updateProject(editingProject.id, formData);
      showToast?.('Project updated successfully!', 'success');
    } else {
      await projectApi.createProject(formData);
      showToast?.('Project created successfully!', 'success');
    }
    loadData();
  };

  const handleOpenDelete = (project) => {
    setDeletingProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProject) return;
    setIsDeleting(true);
    try {
      await projectApi.deleteProject(deletingProject.id);
      showToast?.('Project deleted successfully!', 'success');
      setIsDeleteModalOpen(false);
      setDeletingProject(null);
      loadData();
    } catch (err) {
      showToast?.(err.message || 'Failed to delete project', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      await projectApi.updateStatus(projectId, newStatus);
      showToast?.('Status updated successfully!', 'success');
      loadData();
    } catch (err) {
      showToast?.(err.message || 'Failed to update status', 'error');
    }
  };

  const filterTabs = [
    { label: 'All Projects', value: '' },
    { label: 'Not Started', value: 'NOT_STARTED' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Completed', value: 'COMPLETED' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar onOpenUsersModal={() => setIsUsersModalOpen(true)} />

      <main className="app-container" style={{ flex: 1 }}>
        {/* Welcome & Action Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {isAdmin ? 'System Project Dashboard' : 'My Project Workspace'}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {isAdmin
                ? 'Overview of all organization projects across all registered team members.'
                : 'Manage your active deliverables, deadlines, and project execution.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={loadData}
              className="btn btn-secondary btn-icon"
              title="Refresh projects"
            >
              <RefreshCw size={17} />
            </button>
            <button onClick={handleOpenCreate} className="btn btn-primary">
              <Plus size={18} />
              <span>Create New Project</span>
            </button>
          </div>
        </div>

        {/* Stats Metrics Cards */}
        <StatsOverview stats={stats} isAdmin={isAdmin} />

        {/* Filter and Search Bar */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          {/* Status Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            {filterTabs.map((tab) => {
              const active = statusFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className="btn btn-sm"
                  style={{
                    background: active ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.04)',
                    color: active ? '#ffffff' : 'var(--text-secondary)',
                    borderColor: active ? 'var(--accent-primary)' : 'var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '240px', flex: '1', maxWidth: '360px' }}>
            <input
              type="text"
              placeholder="Search projects by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px', height: '38px', fontSize: '0.85rem' }}
            />
            <Search
              size={16}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'var(--bg-card)',
              border: '1px dashed var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <FolderX size={44} color="var(--text-muted)" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              No projects found
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: '18px' }}>
              {searchQuery || statusFilter
                ? 'Try adjusting your search query or status filter criteria.'
                : 'Get started by creating your first project.'}
            </p>
            <button onClick={handleOpenCreate} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Create Project</span>
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '20px',
            }}
          >
            {projects.map((proj) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSave={handleSaveProject}
        project={editingProject}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        project={deletingProject}
        loading={isDeleting}
      />

      {isAdmin && (
        <UsersModal
          isOpen={isUsersModalOpen}
          onClose={() => setIsUsersModalOpen(false)}
        />
      )}
    </div>
  );
};
