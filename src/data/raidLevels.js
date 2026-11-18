// Data model describing each RAID level for the teaching app.
// Each level provides a "layout" function that builds a disk/block grid,
// plus the metadata needed to render teaching notes and run the
// fail/rebuild simulation generically in <Simulator />.

const colors = ['#4f8ef7', '#f7b84f', '#4fd68c', '#e05fc4', '#7a6ff0', '#f76c5e'];

function stripeLabel(row) {
  return String.fromCharCode(65 + row); // A, B, C, D...
}

// RAID 0 - striping, no redundancy
function layoutRaid0() {
  const diskCount = 3;
  const rows = 4;
  const disks = Array.from({ length: diskCount }, () => []);
  for (let r = 0; r < rows; r++) {
    for (let d = 0; d < diskCount; d++) {
      disks[d].push({
        type: 'data',
        label: `${stripeLabel(r)}${d + 1}`,
        group: r,
        color: colors[r % colors.length],
      });
    }
  }
  return { diskCount, rows, disks };
}

// RAID 1 - mirroring
function layoutRaid1() {
  const diskCount = 2;
  const rows = 4;
  const disks = Array.from({ length: diskCount }, () => []);
  for (let r = 0; r < rows; r++) {
    for (let d = 0; d < diskCount; d++) {
      disks[d].push({
        type: 'mirror',
        label: `${stripeLabel(r)}`,
        group: r,
        color: colors[r % colors.length],
      });
    }
  }
  return { diskCount, rows, disks };
}

// RAID 5 - striping with single rotating parity
function layoutRaid5() {
  const diskCount = 4;
  const rows = 4;
  const disks = Array.from({ length: diskCount }, () => []);
  for (let r = 0; r < rows; r++) {
    const parityDisk = (diskCount - 1 - r + diskCount) % diskCount;
    let dataIndex = 0;
    for (let d = 0; d < diskCount; d++) {
      if (d === parityDisk) {
        disks[d].push({ type: 'parity', label: `P${r}`, group: r, color: '#9aa0ab' });
      } else {
        disks[d].push({
          type: 'data',
          label: `${stripeLabel(r)}${dataIndex + 1}`,
          group: r,
          color: colors[r % colors.length],
        });
        dataIndex++;
      }
    }
  }
  return { diskCount, rows, disks };
}

// RAID 6 - striping with double rotating parity (P + Q)
function layoutRaid6() {
  const diskCount = 5;
  const rows = 4;
  const disks = Array.from({ length: diskCount }, () => []);
  for (let r = 0; r < rows; r++) {
    const pDisk = (diskCount - 1 - r + diskCount) % diskCount;
    const qDisk = (diskCount - 2 - r + diskCount) % diskCount;
    let dataIndex = 0;
    for (let d = 0; d < diskCount; d++) {
      if (d === pDisk) {
        disks[d].push({ type: 'parity', label: `P${r}`, group: r, color: '#9aa0ab' });
      } else if (d === qDisk) {
        disks[d].push({ type: 'parity2', label: `Q${r}`, group: r, color: '#6b7280' });
      } else {
        disks[d].push({
          type: 'data',
          label: `${stripeLabel(r)}${dataIndex + 1}`,
          group: r,
          color: colors[r % colors.length],
        });
        dataIndex++;
      }
    }
  }
  return { diskCount, rows, disks };
}

// RAID 10 - mirrored pairs, striped across pairs
function layoutRaid10() {
  const diskCount = 4; // 2 mirrored pairs
  const rows = 4;
  const disks = Array.from({ length: diskCount }, () => []);
  for (let r = 0; r < rows; r++) {
    const pairIndex = r % 2; // which pair holds this stripe
    for (let d = 0; d < diskCount; d++) {
      const diskPair = Math.floor(d / 2);
      if (diskPair === pairIndex) {
        disks[d].push({
          type: 'mirror',
          label: `${stripeLabel(r)}`,
          group: r,
          color: colors[r % colors.length],
        });
      } else {
        disks[d].push({ type: 'empty', label: '', group: `idle-${r}-${d}`, color: '#e4e7ec' });
      }
    }
  }
  return { diskCount, rows, disks, pairs: [[0, 1], [2, 3]] };
}

export const raidLevels = [
  {
    id: 'raid0',
    name: 'RAID 0',
    tagline: 'Striping — speed with zero protection',
    minDisks: 2,
    redundancy: 'none',
    layout: layoutRaid0,
    capacityFormula: 'N × disk size (100% usable)',
    faultTolerance: '0 disks — losing any single disk loses all data',
    performance: 'Fastest read & write (data spread across all disks in parallel)',
    description:
      'RAID 0 splits (“stripes”) data into chunks and writes them across every disk in the array at the same time. There is no duplication and no parity information anywhere, so every disk contributes 100% of its capacity to usable storage and I/O is spread across all spindles, making it very fast.',
    useCases: ['Scratch/temp video editing drives', 'Non-critical cache volumes', 'Any case where speed matters more than the data itself'],
    pros: ['Full capacity usable', 'Best read/write performance of any level here', 'Simple to understand'],
    cons: ['Zero fault tolerance — one failed disk = total data loss', 'Not a backup strategy', 'Risk increases with every extra disk added'],
    teachingNotes: [
      'Because a file’s chunks are scattered across every disk, losing one disk destroys part of every file — not just some files. That is why RAID 0 is described as “all or nothing”.',
      'Doubling the disk count roughly doubles throughput, but it also roughly doubles the chance that one of the disks in the set fails.',
      'There is no "rebuild" concept for RAID 0: once a disk fails there is nothing left to reconstruct from, so recovery means restoring from a separate backup.',
    ],
  },
  {
    id: 'raid1',
    name: 'RAID 1',
    tagline: 'Mirroring — an exact duplicate on a second disk',
    minDisks: 2,
    redundancy: 'mirror',
    layout: layoutRaid1,
    capacityFormula: '1 × disk size (50% usable with 2 disks)',
    faultTolerance: '1 disk out of 2 (either one)',
    performance: 'Good read performance (can read from either disk); write speed = one disk',
    description:
      'RAID 1 writes an identical copy of every block to a second disk. Nothing is calculated — it is a direct mirror. If one disk fails, the other already holds a complete, ready-to-use copy of everything.',
    useCases: ['Operating system / boot drives', 'Small servers needing simple redundancy', 'Anywhere write-capacity loss (50%) is acceptable for simplicity'],
    pros: ['Simple, well understood, easy to recover', 'Surviving disk keeps working with zero data loss', 'Rebuild is just a straight copy — fast and low-risk'],
    cons: ['Only 50% of raw capacity is usable', 'Does not improve write speed', 'Only protects against a single disk failure at a time'],
    teachingNotes: [
      'A mirror rebuild is the simplest of all RAID rebuilds: the controller just copies every block from the surviving disk to the replacement, in order.',
      'While the rebuild is happening the array is in a "degraded" state — it still works, but a second failure before the rebuild finishes would be unrecoverable.',
      'RAID 1 trades capacity for simplicity and recovery speed: you pay for 2 disks but only keep the data of 1.',
    ],
  },
  {
    id: 'raid5',
    name: 'RAID 5',
    tagline: 'Striping with parity — redundancy without the 50% cost',
    minDisks: 3,
    redundancy: 'parity-1',
    layout: layoutRaid5,
    capacityFormula: '(N − 1) × disk size',
    faultTolerance: '1 disk out of N',
    performance: 'Good read; writes are slower (parity must be recalculated)',
    description:
      'RAID 5 stripes data across all disks like RAID 0, but for every stripe it also calculates a parity block (using XOR) and stores it on one of the disks. The disk holding parity rotates row by row so no single disk becomes a bottleneck. If one disk fails, every missing block can be recalculated on the fly from the remaining data and parity blocks in that row.',
    useCases: ['File and application servers', 'General-purpose business storage where capacity matters', 'Workloads that are read-heavy'],
    pros: ['Only loses the capacity of one disk, however many disks are in the array', 'Survives any single disk failure', 'Good balance of capacity, performance and protection'],
    cons: ['Write performance penalty from parity calculation ("write penalty")', 'Rebuild requires reading every remaining disk in full — stresses older/larger disks', 'Cannot survive a second failure during rebuild'],
    teachingNotes: [
      'Parity is computed with XOR: if a stripe has data blocks A and B, the parity block P = A ⊕ B. If a disk holding A fails, A can be recovered as P ⊕ B.',
      'Because parity rotates across every disk, there is no single "parity disk" — this avoids a bottleneck and spreads wear evenly.',
      'Rebuilding RAID 5 means reading every block from every surviving disk to recompute the missing one — on large modern disks this can take many hours, during which the array has NO redundancy left.',
    ],
  },
  {
    id: 'raid6',
    name: 'RAID 6',
    tagline: 'Striping with double parity — survives two failures',
    minDisks: 4,
    redundancy: 'parity-2',
    layout: layoutRaid6,
    capacityFormula: '(N − 2) × disk size',
    faultTolerance: '2 disks out of N (any two)',
    performance: 'Good read; write penalty is larger than RAID 5 (two parity blocks to update)',
    description:
      'RAID 6 extends RAID 5 by calculating a second, independent parity value (often called Q) for every stripe, using a different mathematical method to the first (P). This means any two disks can fail simultaneously and the array can still reconstruct everything.',
    useCases: ['Large-capacity arrays (more disks = higher chance of a second failure during rebuild)', 'Archival and backup-target storage', 'Anywhere RAID 5’s single-failure tolerance is not enough'],
    pros: ['Survives two simultaneous disk failures', 'Much safer than RAID 5 for large arrays with long rebuild times', 'Still only loses 2 disks’ worth of capacity, whatever the array size'],
    cons: ['Higher write penalty than RAID 5 (two parity blocks to maintain)', 'Needs at least 4 disks', 'Rebuild is slower than RAID 5 due to the extra parity calculation'],
    teachingNotes: [
      'RAID 6 exists because of the "rebuild window" problem: on very large disks a RAID 5 rebuild can take so long that a second disk failing during that window is a real risk. A second parity block closes that gap.',
      'The two parity values (P and Q) are calculated differently so that the maths still works no matter which two disks are missing.',
      'You "pay" for this extra safety with two disks’ worth of capacity and a bigger write penalty — a classic RAID trade-off between protection, capacity and speed.',
    ],
  },
  {
    id: 'raid10',
    name: 'RAID 10',
    tagline: 'Mirrored pairs, striped together — speed and redundancy',
    minDisks: 4,
    redundancy: 'mirror-stripe',
    layout: layoutRaid10,
    capacityFormula: '(N / 2) × disk size (50% usable)',
    faultTolerance: 'At least 1 disk per mirrored pair — can survive multiple failures as long as no pair loses both disks',
    performance: 'Excellent read & write performance — no parity calculation at all',
    description:
      'RAID 10 (also written RAID 1+0) combines mirroring and striping: disks are first paired up into mirrors (like RAID 1), and then data is striped across those mirrored pairs (like RAID 0). It gets the speed benefits of striping with the safety of mirroring, without any parity maths.',
    useCases: ['Busy databases needing both speed and safety', 'Virtualisation hosts', 'Anywhere budget allows 50% capacity overhead for top performance + protection'],
    pros: ['Very fast — no parity to calculate on writes', 'Rebuild is a simple mirror copy, so it is fast and low-risk', 'Can survive multiple disk failures, as long as they are not in the same pair'],
    cons: ['Only 50% of raw capacity usable, same as RAID 1', 'Needs a minimum of 4 disks', 'Losing BOTH disks in the same mirrored pair still loses all data'],
    teachingNotes: [
      'Think of RAID 10 as "several small RAID 1 mirrors, striped together like RAID 0" — it inherits RAID 0’s speed and RAID 1’s simple, fast rebuild.',
      'The critical rule to teach: RAID 10 tolerates multiple disk failures, but only if they are not the two disks that make up the same mirrored pair.',
      'Because rebuilding a mirror is just a copy (not a recalculation), RAID 10 rebuilds are much faster and less risky than RAID 5/6 rebuilds — an important real-world reason it is preferred for critical, busy systems.',
    ],
  },
];

export function getRaidLevel(id) {
  return raidLevels.find((level) => level.id === id);
}
