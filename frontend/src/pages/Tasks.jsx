import { useState, useEffect, useCallback } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import CategoryManager from '../components/CategoryManager';

const PAGE_SIZE = 5;

export default function Tasks() {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await client.get('/categories');
      setCategories(res.data.categories);
    } catch (err) {
      setError('Could not load categories');
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: PAGE_SIZE };
      if (statusFilter) params.status = statusFilter;
      if (categoryFilter) params.category_id = categoryFilter;
      if (search) params.search = search;
      if (sort) params.sort = sort;

      const res = await client.get('/tasks', { params });
      setTasks(res.data.tasks);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load tasks');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, categoryFilter, search, sort]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Reset to page 1 whenever a filter/search/sort changes so results aren't
  // stuck on an out-of-range page.
  function handleStatusChange(value) {
    setStatusFilter(value);
    setPage(1);
  }
  function handleCategoryChange(value) {
    setCategoryFilter(value);
    setPage(1);
  }
  function handleSearchChange(value) {
    setSearch(value);
    setPage(1);
  }
  function handleSortChange(value) {
    setSort(value);
    setPage(1);
  }

  async function handleCreateOrUpdate(taskData) {
    setFormSubmitting(true);
    try {
      if (editingTask) {
        await client.put(`/tasks/${editingTask.id}`, taskData);
      } else {
        await client.post('/tasks', taskData);
      }
      setShowForm(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save task');
    } finally {
      setFormSubmitting(false);
    }
  }

  async function handleDelete(taskId) {
    try {
      await client.delete(`/tasks/${taskId}`);
      // if we deleted the last item on a page beyond page 1, step back
      if (tasks.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchTasks();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Could not delete task');
    }
  }

  async function handleAddCategory(name) {
    const res = await client.post('/categories', { name });
    setCategories((prev) => [...prev, res.data.category].sort((a, b) => a.name.localeCompare(b.name)));
  }

  function openCreateForm() {
    setEditingTask(null);
    setShowForm(true);
  }

  function openEditForm(task) {
    setEditingTask(task);
    setShowForm(true);
  }

  return (
    <div className="tasks-page">
      <header className="tasks-header">
        <h1>Task Tracker</h1>
        <div className="tasks-header-right">
          <span className="welcome-text">Hi, {user?.name}</span>
          <button type="button" className="btn-secondary" onClick={logout}>Logout</button>
        </div>
      </header>

      {error && <p className="form-error">{error}</p>}

      <div className="tasks-toolbar">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="search-input"
        />

        <select value={statusFilter} onChange={(e) => handleStatusChange(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select value={categoryFilter} onChange={(e) => handleCategoryChange(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select value={sort} onChange={(e) => handleSortChange(e.target.value)}>
          <option value="">Sort: Newest first</option>
          <option value="due_date">Sort: Due Date</option>
          <option value="status">Sort: Status</option>
        </select>

        <button type="button" className="btn-secondary" onClick={() => setShowCategories(true)}>
          Manage Categories
        </button>
        <button type="button" onClick={openCreateForm}>+ New Task</button>
      </div>

      {loading ? (
        <p className="page-loading">Loading tasks...</p>
      ) : (
        <>
          <TaskList tasks={tasks} onEdit={openEditForm} onDelete={handleDelete} />

          <div className="pagination">
            <button
              type="button"
              className="btn-secondary"
              disabled={pagination.page <= 1}
              onClick={() => setPage(pagination.page - 1)}
            >
              Previous
            </button>
            <span>Page {pagination.page} of {pagination.totalPages || 1} ({pagination.total} tasks)</span>
            <button
              type="button"
              className="btn-secondary"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <TaskForm
              categories={categories}
              initialTask={editingTask}
              onSubmit={handleCreateOrUpdate}
              onCancel={() => { setShowForm(false); setEditingTask(null); }}
              submitting={formSubmitting}
            />
          </div>
        </div>
      )}

      {showCategories && (
        <div className="modal-overlay">
          <div className="modal">
            <CategoryManager
              categories={categories}
              onAddCategory={handleAddCategory}
              onClose={() => setShowCategories(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}