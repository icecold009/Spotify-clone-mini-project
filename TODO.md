# Final Luna plan — NextSound

Repository: `C:\Users\91829\OneDrive\Documents\GitHub\nextsound`
Reviewed: clean `main` at `a20c140` on 2026-08-25
Feature branch: `codex/luna-nextsound-build-contract`

## Current verified baseline

- `npm.cmd run build` fails before application compilation.
- `tsconfig.json` and `src/declaration.d.ts` reference `@testing-library/jest-dom` and `vitest/globals`, but neither package appears in `package.json`; there is no test or lint script.
- Accessible player/queue work is present, but cannot be treated as release-ready while the build is red.

## Code-review conclusion

Fix the project contract before feature work. The best path is to add and use a coherent Vitest/Testing Library setup, not merely delete the stale type references, because player/queue behavior needs tests. Keep app and test TypeScript configuration separate so production compilation does not depend on accidental globals.

## Build checklist

- [ ] **1. Restore a reproducible TypeScript build**
  Files: `package.json`, lockfile, `tsconfig*.json`, `src/declaration.d.ts`.
  What to build: Add the chosen test dependencies and scripts, split app/test types where appropriate, and align TypeScript/Vite compatibility deliberately.
  Acceptance: `npm ci`, typecheck, and build work from a clean checkout; no unused global test types leak into production.
  Verify: `npm.cmd ci`; `npm.cmd run typecheck`; `npm.cmd run build`.

- [ ] **2. Add player state-transition tests**
  Files: audio context/hook, MiniPlayer, tests.
  What to build: Cover play/pause, next/previous, shuffle/repeat, unavailable media, autoplay rejection, interrupted playback, track change, and stable focus.
  Acceptance: Async media failures settle visibly and no late event overwrites a newer track.
  Verify: Vitest with mocked HTMLMediaElement plus component assertions.

- [ ] **3. Complete seek/volume accessibility**
  Files: MiniPlayer and styles.
  What to build: Ensure pointer/touch/keyboard scrubbing, slider semantics, labels, current/duration values, mute, and live announcements that exclude frequent time updates.
  Acceptance: Every icon control has an explicit accessible name/state, not only a tooltip/title.
  Verify: Keyboard component tests and browser accessibility tree.

- [ ] **4. Harden the queue dialog and mutations**
  Files: QueuePanel, audio context, tests.
  What to build: Test initial focus, Tab containment, Escape, return focus, hidden-state focusability, body/background interaction, reorder/remove/clear, empty state, and mutation failure/duplication.
  Acceptance: Current track remains identifiable; keyboard and touch can reorder; failed mutations preserve queue state.
  Verify: Testing Library user-event tests and mobile browser flow.

- [ ] **5. Add search/provider request ordering**
  Files: search hooks/API client, command palette, server routes.
  What to build: Add AbortController/request identity, last-good-result behavior, safe payload validation, and distinct no-result/offline/rate-limit/provider states.
  Acceptance: Rapid queries and navigation never apply stale results; repeated command navigation stays unanimated.
  Verify: Reordered-response tests and server contract tests.

- [ ] **6. Audit provider and secret boundaries**
  Files: server config/routes, env example, bundle inspection.
  What to build: Fail closed for required server secrets, validate provider payload/model/redirect values, bound retries/time/output, and keep demo/account/provider modes explicit.
  Acceptance: No secret or refresh token reaches the browser bundle, logs, screenshots, or public docs.
  Verify: server tests, production bundle search, malformed/provider-failure tests.

- [ ] **7. Finish motion, cache, and browser proof**
  Files: styles, cache/persistence, browser suite.
  What to build: Gate hover, remove broad transitions, preserve reduced motion, and test cache freshness, queue/history recovery, mobile, offline, slow network, and autoplay block.
  Acceptance: Demo, cache, authenticated provider, and real playback are visibly distinct.
  Verify: lint, typecheck, tests, build, browser suite, `git diff --check`.

## Commit checkpoints

1. `build(nextsound): restore typecheck test and build contract`
2. `test(player): cover media queue and focus recovery`
3. `feat(nextsound): harden search cache and provider states`

## Definition of done

- [ ] Clean install, typecheck, lint, tests, and build pass.
- [ ] Player, seek, queue, search, and provider failures are recoverable and tested.
- [ ] Keyboard, touch, screen reader, reduced motion, and mobile paths pass.
- [ ] No client/provider secret boundary is ambiguous.
- [ ] Feature branch is pushed and clean; `main` is untouched and unmerged.
