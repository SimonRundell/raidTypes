import './DiskArray.css';

function Block({ block, state }) {
  const { type, label, color } = block;
  if (type === 'empty') {
    return <div className="block block-empty" aria-hidden="true" />;
  }

  const classNames = ['block', `block-${type}`, `block-${state}`].join(' ');
  const style = state === 'missing' || state === 'gone' ? undefined : { background: color };

  return (
    <div className={classNames} style={style} title={label}>
      <span>{label}</span>
    </div>
  );
}

export default function DiskArray({
  disks,
  failedDisks,
  status,
  rebuilding,
  rebuiltRows,
  activeRow,
  onDiskClick,
}) {
  return (
    <div className="disk-array" role="group" aria-label="Disk array">
      {disks.map((blocks, diskIndex) => {
        const isFailed = failedDisks.has(diskIndex);
        const isBeingRebuilt = rebuilding && isFailed;
        const diskClasses = ['disk', isFailed ? 'disk-failed' : '', isBeingRebuilt ? 'disk-rebuilding' : '']
          .filter(Boolean)
          .join(' ');

        return (
          <button
            key={diskIndex}
            type="button"
            className={diskClasses}
            onClick={() => onDiskClick(diskIndex)}
            disabled={rebuilding}
            aria-pressed={isFailed}
            title={isFailed ? `Disk ${diskIndex + 1} — failed. Click to mark it healthy again.` : `Disk ${diskIndex + 1} — healthy. Click to simulate failure.`}
          >
            <div className="disk-head">
              <span className="disk-platter" aria-hidden="true" />
              <span className="disk-name">Disk {diskIndex + 1}</span>
            </div>

            <div className="disk-blocks">
              {blocks.map((block, rowIndex) => {
                let state = 'ok';
                if (isFailed) {
                  if (isBeingRebuilt) {
                    state = rowIndex < rebuiltRows ? 'restored' : 'missing';
                  } else {
                    state = 'gone';
                  }
                }
                const isContributing =
                  rebuilding &&
                  !isFailed &&
                  rowIndex === activeRow &&
                  block.type !== 'empty';

                return (
                  <div key={rowIndex} className={isContributing ? 'row-contributing' : ''}>
                    <Block block={block} state={state} />
                  </div>
                );
              })}
            </div>

            {isFailed && !isBeingRebuilt && <div className="fail-badge">✕ FAILED</div>}
            {isBeingRebuilt && <div className="rebuild-badge">↻ REBUILDING…</div>}
          </button>
        );
      })}

      {status === 'lost' && <div className="lost-overlay">💥 DATA LOST</div>}
      {status === 'restoring' && <div className="lost-overlay restoring-overlay">⏳ RESTORING FROM BACKUP…</div>}
    </div>
  );
}
