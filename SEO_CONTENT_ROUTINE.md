# SEO Content Build Routine — KOR Cycling

**⚠️ MACHINE-READABLE — Agent reads this to determine next action**

**Working Directory:** `kor-react/` only  
**Source of Truth:** `kor-react/seo-content-plan.md` (sections 1–7)  

---

## CURRENT STATUS (Agent checks here)

```
ROUTINE_VERSION: 2026-06-10
AUTOMATION_MODE: true
WORKING_DIRECTORY: kor-react
PR_CADENCE: per-article
CURRENT_PHASE: 5
CURRENT_ARTICLE: none
ARTICLES_COMPLETED_THIS_PHASE: 0
PHASE_STATUS: complete
NEXT_ACTION: none
```

> **PR_CADENCE: per-article** — After every article build, set `NEXT_ACTION: create-pr` regardless of batch size. The `BATCH_SIZES` check is skipped. Each PR covers exactly one article. Branch naming: `feature/seo-article-[slug]`.

**What the agent does next:** Nothing — SEO content build is complete. Phase 5 (post-launch measurement) code verification finished: GA4 confirmed tracking all route changes via `GoogleAnalytics.tsx`; PostHog was found only capturing a pageview on initial load (missed SPA route changes) and was fixed via `capture_pageview: 'history_change'` in `src/lib/posthog.ts`, PR `feature/seo-post-launch-setup`. Google Search Console sitemap submission, indexing monitoring, and keyword rank tracking remain manual, human-side follow-ups (see Post-Launch section) — no further agent action pending.

---

## Phase 1: Article Infrastructure
*Build the foundation for all future articles. Do this once, first.*

**Reference:** `seo-content-plan.md`, Section 1 (Sections 1.1–1.9)

- [ ] **1.1–1.2** Create content directories and schema  
- [ ] **1.3** Install dependencies (`react-markdown`, `remark-gfm`)
- [ ] **1.4** Create React components (`ArticlesIndex.tsx`, `Article.tsx`, `ArticleSeo.tsx`)
- [ ] **1.5** Register routes in `src/App.tsx`
- [ ] **1.6** Update navigation (`Header.tsx`, `Footer.tsx`)
- [ ] **1.7** Add article styles to `src/styles/styles.css`
- [ ] **1.8** Update `public/sitemap.xml`
- [ ] **1.9** Verify Phase 1 (`npm run build`, routes work, Helmet output correct)

**Phase 1 Complete → Create PR:**
- [ ] `git checkout -b feature/seo-phase-1-infrastructure`
- [ ] Stage specific files (never `git add .`) and `git commit -m "feat: Phase 1 — Article Infrastructure"`
- [ ] `npm run build` passes
- [ ] Create PR: `feature/seo-phase-1-infrastructure` → `main` with title `feat: SEO Phase 1 — Article Infrastructure`
- [ ] **STOP — do NOT merge. User reviews and merges per Checkpoints section.**
- [ ] Update CURRENT STATUS block above: change `CURRENT_PHASE: 2`, `CURRENT_ARTICLE: A0`, `ARTICLES_COMPLETED_THIS_PHASE: 0`, `PHASE_STATUS: in_progress`, `NEXT_ACTION: build-article`
- [ ] Commit and push the CURRENT STATUS update to the feature branch

---

## ARTICLE QUEUE

Agent uses this to determine which article to build next. Briefs are in `seo-content-plan.md` Section 4.

### Phase 2: Maintenance Cluster (12 articles)

**Reference:** `seo-content-plan.md`, Section 4 (Phase 2)

**Sequence:**
```
2a: A0, A1, A2, A3
2b: A4, A5, A6, A7, A8
2c: A9, A10, A11, A12
```

**Marker:** When all articles in a batch are complete (☑️ below), agent creates PR and moves to next batch.

#### Phase 2a: A0, A1, A2, A3 (Drivetrain Core)

- [x] A0 (pillar)
- [x] A1
- [x] A2
- [x] A3

**Batch Complete → PR:** `feature/seo-phase-2a-drivetrain`

---

#### Phase 2b: A4, A5, A6, A7, A8 (Brakes & Tires)

- [x] A4
- [x] A5
- [x] A6
- [x] A7
- [x] A8

**Batch Complete → PR:** `feature/seo-phase-2b-brakes-tires`

---

#### Phase 2c: A9, A10, A11, A12 (Suspension, BB, Hub)

- [x] A9
- [x] A10
- [x] A11
- [x] A12

**Batch Complete → PR:** `feature/seo-phase-2c-suspension-bb` (final 2a merge: update CURRENT_PHASE to 3, CURRENT_ARTICLE to B0)

### Phase 3: Ride Planning Cluster (7 articles)

**Reference:** `seo-content-plan.md`, Section 4 (Phase 3)

**Sequence:**
```
3: B0, B1, B2, B3, B4, B5, B6, B7
```

#### Phase 3: B0–B7

- [x] B0 (pillar)
- [x] B1
- [x] B2
- [x] B3
- [x] B4
- [x] B5
- [x] B6
- [x] B7

**Phase Complete → PR:** `feature/seo-phase-3-ride-planning` (final merge: update CURRENT_PHASE to 4, CURRENT_ARTICLE to C8)

---

### Phase 4: Cycling Basics (8 articles)

**Reference:** `seo-content-plan.md`, Section 4 (Phase 4)

**Sequence:**
```
4: C8, C1, C3, C2, C4, C5, C6, C7
```

#### Phase 4: C8, C1, C3, C2, C4, C5, C6, C7

- [x] C8 (on-ramp)
- [x] C1
- [x] C3
- [x] C2
- [x] C4
- [x] C5
- [x] C6
- [x] C7

**Phase Complete → PR:** `feature/seo-phase-4-cycling-basics` (final merge: update CURRENT_PHASE to 5, CURRENT_ARTICLE to none, PHASE_STATUS to complete_measurement)

---

### Post-Launch (Phase 5)

**Reference:** `seo-content-plan.md`, Section 7

- [x] GA: Confirm article pageviews tracked — `GoogleAnalytics.tsx` renders inside `<Router>` globally and fires `pageview()` on every `useLocation` change, so `/articles` and `/articles/:slug` are covered like any other route.
- [x] PostHog: Confirm events firing — gap found: `posthog.init()` used the default `capture_pageview: true`, which only captures a pageview on the initial hard load, not on react-router client-side navigation. Fixed by setting `capture_pageview: 'history_change'` in `src/lib/posthog.ts` (PR `feature/seo-post-launch-setup`).
- [ ] Google Search Console: Submit updated `public/sitemap.xml`, monitor indexing — **manual, human action required** (agent has no GSC access)
- [ ] Keyword rankings: Track pillar articles + A1, A4, A7, B1, C8 — **manual, human action required** (agent has no rank-tracking tool access)
- [ ] If indexing lags >4–6 weeks: propose pre-rendering (react-snap) in separate PR — deferred until indexing data is available

**All Complete:** Update CURRENT STATUS to `PHASE_STATUS: complete`
