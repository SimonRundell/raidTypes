// Generic fault-tolerance logic shared by every RAID level's simulator.
// Kept separate from the React components so the rules are easy to read
// and reason about on their own.

export function computeStatus(level, failedDisks, pairs) {
  if (failedDisks.size === 0) return 'healthy';

  switch (level.redundancy) {
    case 'none':
      return 'lost';
    case 'mirror':
      return failedDisks.size >= 2 ? 'lost' : 'degraded';
    case 'parity-1':
      return failedDisks.size >= 2 ? 'lost' : 'degraded';
    case 'parity-2':
      return failedDisks.size >= 3 ? 'lost' : 'degraded';
    case 'mirror-stripe': {
      const pairLost = pairs?.some((pair) => pair.every((d) => failedDisks.has(d)));
      return pairLost ? 'lost' : 'degraded';
    }
    default:
      return 'degraded';
  }
}

export function getStatusMessage(level, failedDisks, pairs, status) {
  const failedList = [...failedDisks].sort((a, b) => a - b).map((d) => `Disk ${d + 1}`).join(' & ');

  if (status === 'healthy') {
    return {
      title: 'Array healthy',
      body: 'All disks online. Click a disk to simulate it failing.',
    };
  }

  if (status === 'degraded') {
    switch (level.redundancy) {
      case 'mirror':
        return {
          title: `${failedList} failed — array still works`,
          body: 'The other disk still holds a complete copy of every block, so no data has been lost. Rebuild to restore full redundancy.',
        };
      case 'parity-1':
        return {
          title: `${failedList} failed — array still works`,
          body: 'Every block on the missing disk can be recalculated from the data and parity blocks that remain in its stripe. Rebuild to restore full redundancy.',
        };
      case 'parity-2':
        return {
          title: `${failedList} failed — array still works`,
          body: 'RAID 6 keeps two independent parity blocks per stripe, so it can still reconstruct everything. Rebuild to restore full redundancy.',
        };
      case 'mirror-stripe':
        return {
          title: `${failedList} failed — array still works`,
          body: 'Each failed disk still has a healthy mirror partner in its pair, so no data has been lost. Rebuild to restore full redundancy.',
        };
      default:
        return { title: `${failedList} failed`, body: 'Array is degraded but still serving data.' };
    }
  }

  // status === 'lost'
  switch (level.redundancy) {
    case 'none':
      return {
        title: 'Data lost',
        body: 'RAID 0 has no redundancy at all — losing any single disk destroys part of every file striped across the array. Only a separate backup can bring this data back.',
      };
    case 'mirror':
      return {
        title: 'Data lost',
        body: 'Both copies in the mirror are gone. RAID 1 only protects against ONE disk failing at a time — a second failure before you replace the first is unrecoverable.',
      };
    case 'parity-1':
      return {
        title: 'Data lost',
        body: 'RAID 5 can only survive ONE disk failure. With a second disk down there is no longer enough parity information to recalculate the missing data.',
      };
    case 'parity-2':
      return {
        title: 'Data lost',
        body: 'RAID 6 can survive two failures, but a third disk down overwhelms both parity blocks — there is nothing left to reconstruct from.',
      };
    case 'mirror-stripe':
      return {
        title: 'Data lost',
        body: 'Both disks in the same mirrored pair have failed. RAID 10 survives multiple failures only if they land in different pairs — this stripe’s only copies are both gone.',
      };
    default:
      return { title: 'Data lost', body: 'The array can no longer reconstruct its data.' };
  }
}
