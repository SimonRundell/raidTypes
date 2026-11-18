import { raidLevels } from '../data/raidLevels.js';
import './Overview.css';

export default function Overview({ onSelectLevel }) {
  return (
    <article className="overview">
      <header>
        <h2>What is RAID?</h2>
        <p>
          <strong>RAID</strong> (Redundant Array of Independent Disks) combines two or more physical disks into one
          logical unit. Depending on the <em>level</em> chosen, RAID can make storage faster, more resilient to disk
          failure, or both — but always as a trade-off against usable capacity and cost. RAID protects against{' '}
          <em>disk failure</em>; it is not a substitute for backups, which protect against deletion, corruption,
          ransomware, theft or disaster.
        </p>
      </header>

      <div className="level-cards">
        {raidLevels.map((level) => (
          <button key={level.id} className="level-card" onClick={() => onSelectLevel(level.id)}>
            <h3>{level.name}</h3>
            <p className="tagline">{level.tagline}</p>
            <dl>
              <div>
                <dt>Min disks</dt>
                <dd>{level.minDisks}</dd>
              </div>
              <div>
                <dt>Capacity</dt>
                <dd>{level.capacityFormula}</dd>
              </div>
              <div>
                <dt>Survives</dt>
                <dd>{level.faultTolerance}</dd>
              </div>
            </dl>
            <span className="explore">Explore &amp; simulate →</span>
          </button>
        ))}
      </div>

      <section className="comparison">
        <h3>Side-by-side comparison</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Level</th>
                <th>Technique</th>
                <th>Min disks</th>
                <th>Usable capacity</th>
                <th>Fault tolerance</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {raidLevels.map((level) => (
                <tr key={level.id}>
                  <td data-label="Level">{level.name}</td>
                  <td data-label="Technique">{level.tagline}</td>
                  <td data-label="Min disks">{level.minDisks}</td>
                  <td data-label="Usable capacity">{level.capacityFormula}</td>
                  <td data-label="Fault tolerance">{level.faultTolerance}</td>
                  <td data-label="Performance">{level.performance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </article>
  );
}
