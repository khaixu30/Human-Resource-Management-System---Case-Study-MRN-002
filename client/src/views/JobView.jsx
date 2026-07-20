import JobLayout from '../components/layouts/JobLayout';
import '../assets/css/JobView.css';

function JobView() {
    return (
        <div className="job-view">
            <section className="job-hero">
                <span className="job-hero-eyebrow">Careers</span>
                <h1>Open positions</h1>
                <p>Browse current openings across every department and find where you fit.</p>
            </section>

            <JobLayout />
        </div>
    );
}

export default JobView;