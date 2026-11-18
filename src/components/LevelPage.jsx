import Simulator from './Simulator.jsx';
import './LevelPage.css';

export default function LevelPage({ level }) {
  return (
    <article className="level-page">
      <header className="level-header">
        <h2>{level.name}</h2>
        <p className="tagline">{level.tagline}</p>
      </header>

      <p className="description">{level.description}</p>

      <div className="stat-grid">
        <div className="stat">
          <span className="stat-label">Minimum disks</span>
          <span className="stat-value">{level.minDisks}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Usable capacity</span>
          <span className="stat-value">{level.capacityFormula}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Fault tolerance</span>
          <span className="stat-value">{level.faultTolerance}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Performance</span>
          <span className="stat-value">{level.performance}</span>
        </div>
      </div>

      <section className="lab">
        <h3>Try it: fail a disk and watch the rebuild</h3>
        <Simulator key={level.id} level={level} />
      </section>

      <section className="notes-grid">
        <div className="note-card">
          <h4>Good for</h4>
          <ul>
            {level.useCases.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="note-card">
          <h4>Pros</h4>
          <ul>
            {level.pros.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="note-card">
          <h4>Cons</h4>
          <ul>
            {level.cons.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="teaching-notes">
        <h3>Teaching notes</h3>
        <ul>
          {level.teachingNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
