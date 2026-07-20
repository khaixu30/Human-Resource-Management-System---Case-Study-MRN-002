import { useState } from 'react';
import '../assets/css/Cards.css';

function truncateWords(text, limit = 75) {
    if (!text) return '';
    const words = text.trim().split(/\s+/);
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(' ') + '...';
}

function JobCard({ JobData, canEdit, departments = [], designations = [], onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        departmentId: JobData?.departmentId?._id || '',
        designationId: JobData?.designationId?._id || '',
        description: JobData?.description || '',
        status: JobData?.status || 'open'
    });

    if (!JobData) return null;

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCancel = () => {
        setForm({
            departmentId: JobData.departmentId?._id || '',
            designationId: JobData.designationId?._id || '',
            description: JobData.description || '',
            status: JobData.status || 'open'
        });
        setError('');
        setIsEditing(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            await onSave(JobData._id, form);
            setIsEditing(false);
        } catch (err) {
            setError('Could not save changes. Try again.');
        } finally {
            setSaving(false);
        }
    };

    if (isEditing) {
        return (
            <div className="job-card-container job-card-container--editing">
                <label className="job-field-label" htmlFor={`dept-${JobData._id}`}>Department</label>
                <select
                    id={`dept-${JobData._id}`}
                    name="departmentId"
                    value={form.departmentId}
                    onChange={handleChange}
                    className="job-edit-input"
                >
                    {departments.map(d => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                </select>

                <label className="job-field-label" htmlFor={`desig-${JobData._id}`}>Designation</label>
                <select
                    id={`desig-${JobData._id}`}
                    name="designationId"
                    value={form.designationId}
                    onChange={handleChange}
                    className="job-edit-input"
                >
                    {designations.map(d => (
                        <option key={d._id} value={d._id}>{d.title}</option>
                    ))}
                </select>

                <label className="job-field-label" htmlFor={`desc-${JobData._id}`}>Description</label>
                <textarea
                    id={`desc-${JobData._id}`}
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="job-edit-input job-edit-textarea"
                    rows={4}
                />

                <label className="job-field-label" htmlFor={`status-${JobData._id}`}>Status</label>
                <select
                    id={`status-${JobData._id}`}
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="job-edit-input"
                >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                </select>

                {error && <p className="job-edit-error">{error}</p>}

                <div className="status-bar">
                    <button className="btn-outline" onClick={handleCancel} disabled={saving}>Cancel</button>
                    <button className="btn-a" onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="job-card-container">
            <span className="job-card-eyebrow">{JobData.departmentId?.name}</span>
            <h1>{JobData.designationId?.title}</h1>
            <p className="job-card-desc">{truncateWords(JobData.description)}</p>

            <div className="status-bar">
                <span className={`job-status job-status--${JobData.status}`}>
                    {JobData.status}
                </span>
                <div className="job-card-actions">
                    {canEdit && (
                        <button className="btn-outline" onClick={() => setIsEditing(true)}>Edit</button>
                    )}
                    <a className="btn-a" href={`/job/${JobData._id}`}>View Details</a>
                </div>
            </div>
        </div>
    );
}

export default JobCard;