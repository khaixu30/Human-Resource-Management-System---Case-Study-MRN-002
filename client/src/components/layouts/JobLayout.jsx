import { useState, useEffect, useMemo, useCallback } from 'react';
import JobCard from '../JobCard';
import { useAuth } from '../../context/AuthContext';
import '../../assets/css/JobLayout.css';

const API_BASE = import.meta.env.VITE_HOST;

function JobLayout() {
    const { user } = useAuth();
    const canEdit = user && ['HARAdmin', 'SuperAdmin'].includes(user.role);

    const [jobs, setJobs] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [statusFilter, setStatusFilter] = useState('open');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const endpoint = statusFilter === 'closed' ? '/job/closed' : '/job/open';
            const res = await api.get(endpoint);
            console.log(statusFilter);
            setJobs(res.data.data || []);
        } catch (err) {
            if (err.response?.status === 404) {
                setJobs([]);
            } else {
                setError('Could not load jobs right now.');
            }
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    useEffect(() => {
        const fetchLookups = async () => {
            try {
                const [deptRes, desigRes] = await Promise.all([
                    api.get('/department'),
                    api.get('/designation')
                ]);
                setDepartments(deptRes.data.data || []);
                setDesignations(desigRes.data.data || []);
            } catch (err) {
                // filters/edit selects just won't populate; not fatal to the page
            }
        };
        fetchLookups();
    }, []);

    // if the closed filter was active and the user's role no longer allows it, fall back
    useEffect(() => {
        if (statusFilter === 'closed' && !canEdit) {
            setStatusFilter('open');
        }
    }, [canEdit, statusFilter]);

    const handleSaveJob = async (jobId, formData) => {
        const res = await api.patch(`/job/edit/${jobId}`, formData);
        setJobs(prev => prev.map(job => job._id === jobId ? res.data.data : job));
    };

    const visibleJobs = useMemo(() => {
        let list = [...jobs];

        if (departmentFilter !== 'all') {
            list = list.filter(job => job.departmentId?._id === departmentFilter);
        }

        list.sort((a, b) => {
            const diff = new Date(a.createdAt) - new Date(b.createdAt);
            return sortOrder === 'oldest' ? diff : -diff;
        });

        return list;
    }, [jobs, departmentFilter, sortOrder]);

    return (
        <div className="job-layout">
            <div className="job-filters">
                <div className="job-filter-group">
                    <label htmlFor="department-filter">Department</label>
                    <select
                        id="department-filter"
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                        <option value="all">All departments</option>
                        {departments.map(d => (
                            <option key={d._id} value={d._id}>{d.name}</option>
                        ))}
                    </select>
                </div>

                <div className="job-filter-group">
                    <label htmlFor="sort-filter">Sort by</label>
                    <select
                        id="sort-filter"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="newest">Newest first</option>
                        <option value="oldest">Oldest first</option>
                    </select>
                </div>

                {canEdit && (
                    <div className="job-filter-group job-status-toggle">
                        <button
                            type="button"
                            className={statusFilter === 'open' ? 'active' : ''}
                            onClick={() => setStatusFilter('open')}
                        >
                            Open
                        </button>
                        <button
                            type="button"
                            className={statusFilter === 'closed' ? 'active' : ''}
                            onClick={() => setStatusFilter('closed')}
                        >
                            Closed
                        </button>
                    </div>
                )}
            </div>

            {loading && <p className="job-layout-status">Loading jobs...</p>}
            {!loading && error && <p className="job-layout-status job-layout-error">{error}</p>}
            {!loading && !error && visibleJobs.length === 0 && (
                <p className="job-layout-status">No jobs match these filters.</p>
            )}

            {!loading && !error && visibleJobs.length > 0 && (
                <div className="job-grid">
                    {visibleJobs.map(job => (
                        <JobCard
                            key={job._id}
                            JobData={job}
                            canEdit={canEdit}
                            departments={departments}
                            designations={designations}
                            onSave={handleSaveJob}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default JobLayout;