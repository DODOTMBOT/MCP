# MCP Architecture Audit (2025-10-24)

## 1. Executive summary

- **Scope.** Reviewed the full Next.js 15 monorepo for module structure, dependency health, and architectural guardrails across `app/`, `components/`, `lib/`, `reui/`, and supporting infrastructure.
- **Key findings.** Routing code mixes transport, orchestration, and persistence concerns; reUI widgets dominate shared layers without clear owners; several feature islands (`marketplace`, `_template`) ship local `lib/` trees that are not imported anywhere else; 12 orphaned entry points and helpers; a single component (`components/ui/filters.tsx`) concentrates over 18 % of the front-end lines of code.
- **Tooling.** Added `dependency-cruiser` configuration, generation script, and GitHub Actions dry-run workflow to surface import rule violations and keep the dependency graph current.
- **Risk posture.** No circular imports today, but the lack of enforced module boundaries and the use of beta dependencies (`next-auth@5`, `next@15.0.0`) produce elevated maintenance and security risk (current `next` version carries a critical advisory).
- **Outcome.** Produced import graph artefacts (`diagrams/dep-graph.json`, `diagrams/dep-graph.svg`) and a staged refactoring roadmap that prioritises guardrails, domain boundaries, and gradual decomposition of hotspots.

## 2. Methodology

1. Generated an up-to-date file inventory via `glob`/Node scripts and manual review of top-level directories.
2. Used `dependency-cruiser` (new config `dependency-cruiser.config.cjs`) to build the dependency graph, detect cycles, orphaned modules, and boundary violations.
3. Converted the DOT graph to SVG with `@aduh95/viz.js` (`scripts/create-dependency-graph.cjs`) and stored raw JSON for further analysis.
4. Measured file sizes/complexity (lines of code per module) to locate hotspots.
5. Audited package health with `npm audit` and manual inspection of `package.json`.
6. Documented gaps and defined the target architecture plus supporting enforcement workflow.

## 3. Repository inventory

| Path | Description | Notable observations |
| --- | --- | --- |
| `app/` | Next.js App Router entry points. Auth flows under `(auth)`, protected dashboards under `(protected)`, legacy `simple-login`, catch-all `[...slug]`. | Routings blend UI, data loading, and side effects; no separation between public and admin concerns beyond folder names. |
| `app/(protected)/admin` | Admin pages for menus, users, roles, etc. | Screens rely on giant monolithic route files (up to 500+ LOC) and perform direct Prisma/service calls inline. |
| `app/(protected)/marketplace` | Feature prototype with local `api/` and `lib/` folders. | Local services are orphaned (not consumed anywhere) and duplicate infrastructure concerns from `lib/`. |
| `app/(protected)/_template` | Sample CRUD scaffolding. | Intended as boilerplate but shares no exports; can be factored into reusable module templates. |
| `components/` | Shared UI, layout, navigation, and reUI wrappers. | `components/ui/filters.tsx` (2 138 LOC) is a catch-all of filter widgets; several components invoke business logic directly. |
| `lib/` | Server-side utilities (`auth`, `db`, `api-client`, `types`, `utils`). | `api-client.ts` and `types/` are currently unused (orphans). `lib` functions are imported directly from UI layers, bypassing domain orchestration. |
| `prisma/` | Database schema and migrations. | Only `schema.prisma` present; migrations directory empty. Routes call Prisma helpers indirectly via `lib/db`. |
| `reui/` | Configuration for the reUI component library. | Global theme tokens only; no explicit reexports used by features. |
| `docs/` | Existing documentation (style guide, requirements, component research). | No prior architecture overview before this audit. |
| `scripts/` | Seed and maintenance scripts. | New `create-dependency-graph.cjs` added for reproducible dependency artefacts. |

Total TypeScript codebase: **94 files / 11 401 LOC** across `app/`, `components/`, and `lib`.

## 4. Dependency graph findings

- **Coverage.** 95 modules and 166 dependencies cruised. Artefacts live in `diagrams/dep-graph.json` (raw data) and `diagrams/dep-graph.svg` (visual graph).
- **Cycles.** 0 circular dependencies detected ✅.
- **Orphans.** 12 modules have no inbound edges. Warnings surface for:
  - `middleware.ts`
  - Core helpers: `lib/api-client.ts`, `lib/types/index.ts`
  - Feature-local utilities: `app/(protected)/marketplace/lib/{services,types}/*`, `_template/lib/*`
  - Unwired pages: `app/simple-login/page.tsx`, `app/(protected)/(dashboard|haccp|labeling|payroll)/page.tsx`
- **Outgoing “hotspots”.** Highest fan-out modules:
  - `app/(protected)/admin/pages/page.tsx` — 7 imports
  - `app/(protected)/marketplace/page.tsx` — 7 imports
  - `app/profile/page.tsx` — 7 imports
  - Template route files (`_template/features/*/page.tsx`) — 5–6 imports each
  - `components/ui/filters.tsx` — 6 imports (plus massive internal complexity)
- **Incoming “hotspots”.** Shared utilities with the most dependents:
  - `components/ui/button.tsx` — imported by 23 modules
  - `lib/utils.ts` — 21 dependents (primary Tailwind helper)
  - `lib/db.ts` — 18 dependents (data access entry point)
  - `components/ui/card.tsx`, `components/ui/input.tsx`, `components/layout-wrapper.tsx`, `components/access-guard.tsx` — 10+ dependents
- **Rule violations.** New `dependency-cruiser` rules currently emit only **warn-level** messages for orphans, keeping the build green while surfacing clean-up targets.

## 5. Complexity hotspots & maintainability concerns

| File | Lines | Issue |
| --- | --- | --- |
| `components/ui/filters.tsx` | 2 138 | Centralises dozens of filter widgets with conditional logic; hard to test and extend. |
| `app/(protected)/admin/users/page.tsx` | 503 | Blends data fetching, authorization, rendering, and form logic in one file. |
| `app/profile/page.tsx` | 402 | Profile orchestration plus UI handled inline. |
| `app/(protected)/admin/pages/page.tsx` | 382 | Similar all-in-one route file. |
| `components/ui/menubar.tsx` | 244 | UI wrapper containing business conditionals. |

Other findings:
- Routes often import `reUI` wrappers directly and duplicate layout logic instead of composing dedicated feature components.
- Domain logic (e.g., authorization, partner lookups) lives inside React components rather than dedicated services/use-cases.
- No automated tests (`__tests__`, `*.test.*`) exist, so refactors currently have zero safety net.

## 6. Public API & boundary assessment

- **UI ↔ domain leakage.** Components under `components/ui` can reach directly into `lib/utils.ts` and other helpers; `app` routes call Prisma-backed functions without abstraction. Proposed layer boundaries (see §8) will invert these dependencies.
- **Ghost modules.** Marketplace and template sub-libraries are not wired into the main app, suggesting either dead code or unfinished integrations.
- **Middleware.** `middleware.ts` is not referenced elsewhere (expected for Next), but it should be documented in guardrails to avoid false positives.
- **Auth / session management.** NextAuth credential provider configured in `lib/auth.ts` but reused as individual utils; no central session service.

## 7. Dependencies & platform health

- **Key runtime deps.** `next@15.0.0`, `next-auth@5.0.0-beta.25`, `@prisma/client@5.22.0`, `react@18`, `tailwindcss@3.3`.
- **Security.** `npm audit` flags **one critical advisory** (GHSA-f82v-jwr5-mffw) affecting `next@15.0.0`. Upgrade path: `next@15.5.6` or newer.
- **Stability.** `next-auth@5` remains in beta; consider locking to a stable release (v4) or planning for breaking changes.
- **Tooling.** No lint extensions beyond `next lint`; compile-time guardrails were absent prior to this PR.

## 8. Target architecture (proposed)

```
┌──────────────────────┐
│ Presentation layer   │  → `/app/**` — route handlers composed from feature UI packages
│  (react server/client)│
├──────────────────────┤
│ Feature modules       │  → `/modules/<feature>/{ui,services,queries}` shared between routes
├──────────────────────┤
│ Domain & services     │  → `/lib/server/{auth,partners,...}` exposes use-cases with pure inputs/outputs
├──────────────────────┤
│ Infrastructure        │  → `/lib/db`, `/prisma`, external clients (`api-client`)
└──────────────────────┘
```

Guiding principles:
- Presentation imports feature modules only; no direct access to Prisma or infrastructure.
- Feature modules encapsulate UI widgets plus hooks/services scoped to a business domain (e.g., `modules/admin`, `modules/marketplace`).
- Domain layer exposes explicit commands/queries; all Prisma access funnels through dedicated repositories/adapters.
- Cross-cutting utilities (`lib/utils`, `access-guard`) become shared packages with narrow public APIs.
- Shared design system remains under `reui/` with thin wrappers exposed via `components/ui`.

## 9. Guardrails & automation delivered

- **Dependency rules.** `dependency-cruiser.config.cjs` introduces warnings for circular imports, unresolved paths, forbidden edges (`lib → app`, `components → app`, `app → prisma`), and orphans (excluding Next entrypoints).
- **Graph generation.** `scripts/create-dependency-graph.cjs` exports JSON + SVG artefacts using the same config. Run with `npm run architecture:graph`.
- **CLI entrypoints.** Added npm scripts:`architecture:check` (rule dry-run) and `architecture:graph` (artefact regeneration).
- **CI workflow.** `.github/workflows/architecture-dry-run.yml` installs dependencies, executes the dependency check, and regenerates the graph in dry-run mode (differences reported via warnings, build kept green).

## 10. Refactoring roadmap (priority-ordered)

| Priority | Proposed PR | Goal & scope | Risk & dependencies | Est. size |
| --- | --- | --- | --- | --- |
| P0 | **Hardening guardrails** | Land dependency-cruiser config, graph script, workflow (this PR). Ensure the team adopts `architecture:check` in local CI. | Low – tooling only. | S |
| P0 | **Upgrade Next.js & lock runtimes** | Bump `next` to ≥15.5.6, validate breaking changes, pin `next-auth` to a stable release or document mitigation. | Medium – potential runtime regressions, requires regression testing. | M |
| P1 | **Extract feature modules** | Create `/modules/admin` and `/modules/marketplace` packages with `ui/` + `services/` folders; re-export to routes, move heavy logic (forms, tables) out of page files. | Medium – refactor of large route files; benefits from new guardrails. | L→M (split per domain) |
| P1 | **Decompose `components/ui/filters.tsx`** | Break into atomic filter components, provide index barrel with tree-shaking. Add stories or usage docs. | Medium – high churn but isolated to UI. | M |
| P1 | **Centralise domain services** | Introduce `/lib/server` (auth, partners, marketplace) with explicit inputs/outputs, migrate Prisma calls from pages to services. | Medium/High – touches data access; requires sequential rollout per feature. | M→L (split by service) |
| P2 | **Build automated tests** | Add integration tests for auth and admin flows using Playwright/Vitest. Establish coverage targets per module. | High lead time – needs fixtures, seeding. | M→H |
| P2 | **Audit dead code** | Decide on fate of `_template` and `simple-login`; either wire into demo paths or archive/remove. Update dependency rules accordingly. | Low risk; ensures clarity. | S |
| P3 | **Observability & metrics** | Introduce instrumentation (logging, analytics) once domain services exist. | Dependent on domain refactor. | M |

_Note:_ Larger refactors (P1/P2) should be broken into smaller feature PRs (per route or domain) to keep reviewable. Enforce guardrails after each merge to avoid regressions.

## 11. Usage instructions

- Generate updated graph artefacts after structural changes:
  ```bash
  npm run architecture:graph
  ```
- Run dependency guardrails locally or in CI:
  ```bash
  npm run architecture:check
  ```
- Consume the diagrams in `diagrams/` when planning refactors or onboarding contributors. Embed `diagrams/dep-graph.svg` into design docs if needed.

## 12. Next steps summary

1. Merge this audit to establish authoritative docs and guardrails.
2. Schedule `next` upgrade (P0) prior to major refactors to remove the outstanding critical advisory.
3. Kick off feature module extraction starting with the admin area (largest hotspot) while decomposing `components/ui/filters.tsx`.
4. After domain services are in place, invest in automated testing and observability.

---
_Last updated: 2025-10-24._
