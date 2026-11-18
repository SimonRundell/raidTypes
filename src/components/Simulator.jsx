import { useEffect, useMemo, useRef, useState } from 'react';
import DiskArray from './DiskArray.jsx';
import { computeStatus, getStatusMessage } from '../raidLogic.js';
import './Simulator.css';

const REBUILD_STEP_MS = 650;

export default function Simulator({ level }) {
  const layout = useMemo(() => level.layout(), [level]);
  const { diskCount, rows, disks, pairs } = layout;

  const [failedDisks, setFailedDisks] = useState(new Set());
  const [rebuilding, setRebuilding] = useState(false);
  const [rebuiltRows, setRebuiltRows] = useState(0);
  const [restoring, setRestoring] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const status = computeStatus(level, failedDisks, pairs);
  const message = getStatusMessage(level, failedDisks, pairs, status);
  const activeRow = rebuilding ? rebuiltRows : -1;

  function toggleDisk(diskIndex) {
    if (rebuilding || restoring) return;
    setFailedDisks((prev) => {
      const next = new Set(prev);
      if (next.has(diskIndex)) {
        next.delete(diskIndex);
      } else {
        next.add(diskIndex);
      }
      return next;
    });
  }

  function startRebuild() {
    if (failedDisks.size === 0 || status === 'lost') return;
    setRebuilding(true);
    setRebuiltRows(0);
    let row = 0;
    timerRef.current = setInterval(() => {
      row += 1;
      setRebuiltRows(row);
      if (row >= rows) {
        clearInterval(timerRef.current);
        setTimeout(() => {
          setRebuilding(false);
          setFailedDisks(new Set());
          setRebuiltRows(0);
        }, 400);
      }
    }, REBUILD_STEP_MS);
  }

  function restoreFromBackup() {
    setRestoring(true);
    setTimeout(() => {
      setFailedDisks(new Set());
      setRestoring(false);
    }, 900);
  }

  const canRebuild = status === 'degraded' && !rebuilding && !restoring;
  const canRestoreFromBackup = status === 'lost' && !restoring;

  return (
    <div className="simulator">
      <div className={`status-banner status-${status}`}>
        <strong>{message.title}</strong>
        <span>{message.body}</span>
      </div>

      <DiskArray
        disks={disks}
        rows={rows}
        failedDisks={failedDisks}
        status={restoring ? 'restoring' : status}
        rebuilding={rebuilding}
        rebuiltRows={rebuiltRows}
        activeRow={activeRow}
        onDiskClick={toggleDisk}
      />

      <div className="simulator-controls">
        <p className="hint">
          Click any disk above to simulate it failing (click again to bring it back). This array has {diskCount}{' '}
          disks, each holding {rows} stripes of data.
        </p>
        <div className="buttons">
          <button type="button" disabled={!canRebuild} onClick={startRebuild}>
            {rebuilding ? 'Rebuilding…' : 'Replace disk(s) & Rebuild'}
          </button>
          {level.redundancy === 'none' && (
            <button type="button" disabled={!canRestoreFromBackup} onClick={restoreFromBackup}>
              {restoring ? 'Restoring…' : 'Restore from backup'}
            </button>
          )}
          <button
            type="button"
            className="secondary"
            onClick={() => {
              clearInterval(timerRef.current);
              setFailedDisks(new Set());
              setRebuilding(false);
              setRebuiltRows(0);
              setRestoring(false);
            }}
          >
            Reset array
          </button>
        </div>
      </div>
    </div>
  );
}
