import { useState } from 'react';
import { raidLevels } from './data/raidLevels.js';
import Overview from './components/Overview.jsx';
import LevelPage from './components/LevelPage.jsx';
import Quiz from './components/Quiz.jsx';
import CMFloatAd from './cmFloatAd';
import './App.css';

const TABS = [{ id: 'overview', label: 'Overview' }, ...raidLevels.map((l) => ({ id: l.id, label: l.name })), { id: 'quiz', label: 'Recap Quiz' }];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const activeLevel = raidLevels.find((l) => l.id === activeTab);

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <img className="appLogo" src="/raidtypes.png" />
          </span>
          <div>
            <h1>Understanding RAID</h1>
            <p>An interactive guide to RAID levels, disk failure and rebuilding</p>
          </div>
        </div>
      </header>

      <nav className="tabs" aria-label="RAID levels">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={tab.id === activeTab ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="app-main">
        {activeTab === 'overview' && <Overview onSelectLevel={setActiveTab} />}
        {activeLevel && <LevelPage level={activeLevel} />}
        {activeTab === 'quiz' && <Quiz />}
      </main>
<CMFloatAd />
      <footer className="app-footer">
        <p>Built to teach RAID 0, 1, 5, 6 and 10 — click a disk in any simulator to see what happens when it fails.</p>
        <p className="license-notice">
          Licensed under{' '}
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noopener noreferrer">
            CC BY-NC-SA 4.0
          </a>{' '}
          — free to share and adapt for non-commercial teaching, with attribution, under the same licence. See the{' '}
          <code>LICENSE</code> file for details.
        </p>
      </footer>
    </div>
  );
}
