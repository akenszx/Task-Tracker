import { useState } from 'react';

export default function CategoryManager({ categories, onAddCategory, onClose }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    setSubmitting(true);
    try {
      await onAddCategory(name.trim());
      setName('');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add category');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="category-manager">
      <div className="category-manager-header">
        <h2>Categories</h2>
        <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
      </div>

      <ul className="category-list">
        {categories.length === 0 && <li className="empty-note">No categories yet — add one below.</li>}
        {categories.map((cat) => (
          <li key={cat.id}>{cat.name}</li>
        ))}
      </ul>

      <form className="category-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}
        <input
          type="text"
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add'}
        </button>
      </form>
    </div>
  );
}
