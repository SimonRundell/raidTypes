# Understanding RAID

An interactive teaching app covering RAID 0, 1, 5, 6 and 10: what each level does, how it uses disks, and — most
importantly — what actually happens when a disk fails and when the array rebuilds. Built with Vite + React
(JavaScript).

Live in the app you get:

- An **Overview** page comparing all five levels side by side.
- A page per RAID level with a plain-English explanation, key stats (minimum disks, usable capacity, fault
  tolerance, performance), pros/cons, typical use cases, and a block of **teaching notes**.
- An interactive **disk-fail/rebuild simulator** on every level page — click a disk to fail it, watch the array
  status change (healthy → degraded → data lost), then trigger a rebuild and watch it animate block-by-block.
- A 12-question **recap quiz** with instant feedback, explanations, and a final score/review screen.

---

## Installation & running locally

### Requirements

- [Node.js](https://nodejs.org/) 18 or later (tested with Node 24) and npm.

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (hot-reloads as you edit)
npm run dev
```

Vite will print a local URL (typically `http://localhost:5173`) — open it in a browser.

### Other useful commands

```bash
npm run build     # Production build, output to dist/
npm run preview   # Serve the production build locally, to sanity-check it
npm run lint       # Run oxlint over the source
```

### Deploying for a class

The app is a static site once built (`npm run build` → `dist/`). You can:

- Copy the `dist/` folder onto a school web server, VLE/LMS file area, or shared drive and open `index.html`.
- Deploy `dist/` to any static host (GitHub Pages, Netlify, Vercel, an internal web server, etc.).
- Or just run `npm run dev` on a classroom machine/projector and use it live — no backend or database is required;
  everything runs client-side in the browser.

No student data is collected or stored anywhere — the quiz score lives only in the browser tab's memory and
disappears on refresh.

---

## Teaching resources

### Who this is for

Designed to support a lesson (or self-study) on RAID for courses that include storage/data resilience topics, e.g.
GCSE/A-level Computer Science, T Level Digital, or introductory infrastructure/cybersecurity units.

### Suggested lesson flow (single period, ~45-60 minutes)

1. **Hook (5 min)** — Ask: "If a hard disk in a server fails, what happens to the data on it?" Let misconceptions
   surface (many students assume RAID = backup).
2. **Overview tab (10 min)** — Walk through the Overview page as a class. Use the comparison table to introduce the
   recurring trade-off: *capacity vs. speed vs. protection*.
3. **Guided exploration (20 min)** — Work through RAID 0, 1 and 5 together (these are the three concepts most specs
   require). For each:
   - Read the description and stats as a class.
   - Predict what will happen before failing a disk, then test the prediction in the simulator.
   - Run the rebuild animation and ask students to narrate what's happening ("why is it reading from the other
     disks?").
4. **Independent/paired exploration (10 min)** — Let students explore RAID 6 and RAID 10 themselves, using the
   teaching notes box on each page as scaffolding, then compare in pairs: "Why would you pick RAID 6 over RAID 5 for
   a huge array?"
5. **Recap quiz (10 min)** — Students complete the quiz individually. Discuss any question most of the class got
   wrong before moving on.

### Key misconception to correct explicitly

**RAID is not a backup.** It protects against a disk *failing*, not against accidental deletion, ransomware,
corruption, theft, or fire. The RAID 0 "Restore from backup" button exists specifically to make this point: even
the most basic RAID level gives you no way to recover data after a failure — only a separate backup can. Raise this
again when discussing RAID 1/5/6/10, so students don't walk away thinking "with RAID I don't need backups."

### Questions to pose while using each simulator

- **RAID 0** — "If I have 4 disks striped together, and 1 fails, how much of my data is actually safe?" (Answer:
  effectively none — every file is likely to have a chunk on the failed disk.)
- **RAID 1** — "Why does the rebuild just copy data, with no calculation?" (It's a mirror — nothing needs to be
  worked out, only duplicated.)
- **RAID 5** — "I've failed one disk and the array still works — where is the missing data actually coming from
  right now?" (It's being reconstructed on the fly via XOR, not stored anywhere directly.) Then: "What happens if I
  fail a second disk before I rebuild?" (Total loss — try it.)
- **RAID 6** — "Why would a very large RAID 5 array be risky, and how does RAID 6 fix that?" (Long rebuild times on
  big disks widen the window in which a second failure is catastrophic; the second parity block buys protection
  against exactly that.)
- **RAID 10** — "I have 4 disks in two mirrored pairs. Fail one disk from each pair — does the array survive? Now
  fail both disks in the *same* pair — what happens?" Let them discover the pair-based rule for themselves.

### Extension / homework ideas

- Ask students to calculate usable capacity for a given disk size and RAID level (the "Usable capacity" stat on
  each page gives the formula; set numeric examples using real disk sizes).
- Ask "Which RAID level would you recommend for [scenario]?" for a few scenarios (a school's file server, a
  video-editing scratch disk, a hospital database, a home NAS) and justify the answer using capacity, performance
  and fault-tolerance trade-offs.
- Stretch: research how RAID 6's second parity value (Q) differs mathematically from simple XOR, for students doing
  a more technical/further maths-adjacent course.

### Accessibility notes

- All simulator controls are plain HTML buttons, reachable and operable by keyboard (Tab + Enter/Space) and
  exposed to screen readers via `aria-pressed`/titles on each disk.
- Animations are short (under a second per step) and do not rely on colour alone — failed disks also show a text
  badge ("✕ FAILED"), and the status banner above the simulator always restates what's happening in words.
- The quiz works fully via keyboard and announces correct/incorrect state in text, not just colour.

---

## License

This project is licensed under **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
(CC BY-NC-SA 4.0)** — free to use, share and adapt for teaching (non-commercial use), with attribution, as long as
any adaptation is shared under the same license. See [`LICENSE.md`](./LICENSE.md) for the full summary and a link
to the official license text.
