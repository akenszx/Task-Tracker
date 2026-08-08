import { useState } from 'react';

const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export default function TaskList({ tasks, onEdit, onDelete }) {
  const [confirmingId, setConfirmingId] = useState(null);

  if (tasks.length === 0) {
    return <p className="empty-note">No tasks match your filters yet.</p>;
  }

  return (
    <table className="task-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Category</th>
          <th>Due Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td>
              <span className="task-title">{task.title}</span>
              {task.description && <span className="task-description">{task.description}</span>}
            </td>
            <td>
              <span className={`status-badge status-${task.status}`}>{STATUS_LABELS[task.status]}</span>
            </td>
            <td>{task.Category?.name || '—'}</td>
            <td>{task.due_date || '—'}</td>
            <td className="task-actions">
              <button type="button" className="btn-link" onClick={() => onEdit(task)}>Edit</button>
              {confirmingId === task.id ? (
                <span className="confirm-delete">
                  Delete?
                  <button type="button" className="btn-link danger" onClick={() => { onDelete(task.id); setConfirmingId(null); }}>Yes</button>
                  <button type="button" className="btn-link" onClick={() => setConfirmingId(null)}>No</button>
                </span>
              ) : (
                <button type="button" className="btn-link danger" onClick={() => setConfirmingId(task.id)}>Delete</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
