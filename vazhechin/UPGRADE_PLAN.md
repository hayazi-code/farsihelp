# واژه‌چین — production upgrade plan

## Guardrails

- Keep all ten existing boards, every currently accepted word, and the `150 points + one هفت‌نشان` win rule.
- Never ship directly from `main`; all work is on `codex/vazhechin-production-polish`.
- Preserve legacy `vazhechin-v01` browser saves through a tested migration.

## Phase 1 — dependable game state

1. Version and validate the saved state; gracefully retain a user's existing discoveries.
2. Remember the last active board and isolate one board's reset from every other board.
3. Make a storage failure visible but non-destructive.

## Phase 2 — interaction and accessibility

1. Improve the small-screen and desktop visual hierarchy without changing game rules.
2. Add a compact board summary, keyboard shortcuts, dialog focus management, and predictable Escape behavior.
3. Respect reduced motion and provide clear status feedback without layout shifts.

## Phase 3 — dictionary stewardship

1. Retain the upstream candidate list and all legacy accepts.
2. Document the editorial policy, source limitations, and review queue so future changes are reviewable.
3. Add automatic structural checks: every entry must use only that board's letters, include the center letter, and be at least four letters long.

## Phase 4 — verification and review

1. Add unit checks for scoring, normalization, save migration, and the ten board invariants.
2. Add Playwright browser regression coverage for a phone and desktop viewport, keyboard input, dialogs, focus mode, and save persistence.
3. Show a local preview and test evidence before requesting publication.
