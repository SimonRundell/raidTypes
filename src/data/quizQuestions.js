export const quizQuestions = [
  {
    question: 'What does RAID stand for?',
    options: [
      'Redundant Array of Independent Disks',
      'Rapid Access Integrated Database',
      'Recoverable Array of Internal Drives',
      'Random Access Indexed Data',
    ],
    answer: 0,
    explanation: 'RAID = Redundant Array of Independent Disks (originally "Inexpensive"). It combines multiple physical disks into one logical unit.',
  },
  {
    question: 'Which RAID level offers no fault tolerance at all?',
    options: ['RAID 1', 'RAID 5', 'RAID 0', 'RAID 10'],
    answer: 2,
    explanation: 'RAID 0 only stripes data for speed — there is no duplication or parity, so any single disk failure loses data.',
  },
  {
    question: 'In RAID 1, if you have two 1 TB disks, how much usable storage do you get?',
    options: ['2 TB', '1 TB', '1.5 TB', '0.5 TB'],
    answer: 1,
    explanation: 'RAID 1 mirrors every block onto a second disk, so you only get the capacity of ONE disk (1 TB), not the sum of both.',
  },
  {
    question: 'What is stored in a RAID 5 parity block?',
    options: [
      'A full duplicate copy of one of the data blocks',
      'A value calculated (via XOR) from the other data blocks in the same stripe',
      'A compressed version of the whole disk',
      'An encryption key for the stripe',
    ],
    answer: 1,
    explanation: 'RAID 5 parity is the XOR of the other data blocks in that stripe. If one block goes missing, XOR-ing the parity with the surviving blocks recovers it.',
  },
  {
    question: 'How many simultaneous disk failures can a RAID 5 array survive?',
    options: ['0', '1', '2', 'As many as you like'],
    answer: 1,
    explanation: 'RAID 5 keeps a single parity block per stripe, so it can tolerate exactly one failed disk at a time. A second failure before rebuild = data loss.',
  },
  {
    question: 'What makes RAID 6 different from RAID 5?',
    options: [
      'RAID 6 uses faster disks',
      'RAID 6 stripes data across twice as many disks',
      'RAID 6 keeps a second, independent parity block per stripe, surviving two failures',
      'RAID 6 does not use striping',
    ],
    answer: 2,
    explanation: 'RAID 6 adds a second parity calculation (commonly called Q) per stripe, so it can reconstruct data even if two disks fail at once.',
  },
  {
    question: 'Why might large, high-capacity disks make RAID 6 preferable to RAID 5?',
    options: [
      'Big disks are always unreliable',
      'A RAID 5 rebuild on very large disks can take so long that a second failure during that window becomes a real risk',
      'RAID 6 is cheaper than RAID 5',
      'RAID 5 cannot be used with large disks at all',
    ],
    answer: 1,
    explanation: 'The longer a rebuild takes, the longer the array runs without full redundancy. On large disks, RAID 5’s single-parity protection can be too thin — RAID 6’s double parity closes that gap.',
  },
  {
    question: 'RAID 10 is built by combining which two techniques?',
    options: [
      'Mirroring and parity',
      'Mirroring and striping',
      'Striping and compression',
      'Double parity and encryption',
    ],
    answer: 1,
    explanation: 'RAID 10 (1+0) mirrors disks in pairs (RAID 1) and then stripes data across those mirrored pairs (RAID 0).',
  },
  {
    question: 'In a 4-disk RAID 10 array (two mirrored pairs), when is data actually lost?',
    options: [
      'As soon as any one disk fails',
      'Only if any two disks fail, regardless of which ones',
      'Only if both disks in the SAME mirrored pair fail',
      'RAID 10 can never lose data',
    ],
    answer: 2,
    explanation: 'RAID 10 can survive multiple disk failures as long as no mirrored pair loses both of its disks. Losing one disk from each of two different pairs is fine; losing both disks in one pair is not.',
  },
  {
    question: 'Why is a RAID 1 (mirror) rebuild generally faster and lower-risk than a RAID 5 rebuild?',
    options: [
      'Mirrors use smaller disks',
      'A mirror rebuild is a straight block-by-block copy, with no calculation involved',
      'RAID 1 does not actually need to rebuild',
      'RAID 5 rebuilds happen instantly',
    ],
    answer: 1,
    explanation: 'Rebuilding a mirror just copies the surviving disk’s data to the replacement disk. A RAID 5 rebuild instead has to read every remaining disk and recompute the missing data via parity, which takes longer and stresses every disk in the array.',
  },
  {
    question: 'Which of these is the best description of RAID’s relationship to backups?',
    options: [
      'RAID makes backups unnecessary',
      'RAID protects against disk failure; backups protect against deletion, corruption, ransomware and disaster — you need both',
      'Backups are only needed for RAID 0',
      'RAID and backups do the same job',
    ],
    answer: 1,
    explanation: 'RAID keeps an array running when a disk fails. It does nothing for accidental deletion, corruption, ransomware, fire or theft — that is what backups (ideally offsite/offline) are for.',
  },
  {
    question: 'An array needs (N − 2) disks worth of usable capacity and must survive two simultaneous disk failures. Which RAID level is this?',
    options: ['RAID 0', 'RAID 1', 'RAID 5', 'RAID 6'],
    answer: 3,
    explanation: 'Losing exactly 2 disks’ worth of capacity to parity, while surviving 2 simultaneous failures, is the signature of RAID 6 (double parity).',
  },
];
