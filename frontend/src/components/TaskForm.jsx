import { useState } from 'react';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

// Shared form for creating a new task or editing an existing one.
// If `initialTask` is passed, the form is pre-filled and treated as an edit.
export default function TaskForm({ categories, initialTask, onSubmit, onCancel, submitting }) {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [status, setStatus] = useState(initialTask?.status || 'pending');
  const [dueDate, setDueDate] = useState(initialTask?.due_date || '');
  const [categoryId, setCategoryId] = useState(initialTask?.category_id || categories[0]?.id || '');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!categoryId) {
      setError('Please select or create a category first');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      status,
      due_date: dueDate || null,
      category_id: Number(categoryId),
    });
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{initialTask ? 'Edit Task' : 'New Task'}</h2>
      {error && <p className="form-error">{error}</p>}

      <label htmlFor="title">Title</label>
      <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

      <label htmlFor="description">Description</label>
      <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />

      <label htmlFor="status">Status</label>
      <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <label htmlFor="due_date">Due Date</label>
      <input id="due_date" type="date" value={dueDate || ''} onChange={(e) => setDueDate(e.target.value)} />

      <label htmlFor="category">Category</label>
      <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        {categories.length === 0 && <option value="">No categories yet</option>}
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <div className="task-form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : initialTask ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
