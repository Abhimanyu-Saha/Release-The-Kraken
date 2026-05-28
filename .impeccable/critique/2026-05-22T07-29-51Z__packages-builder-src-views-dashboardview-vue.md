---
target: All Releases page
total_score: 20
p0_count: 0
p1_count: 1
p2_count: 4
timestamp: 2026-05-22T07-29-51Z
slug: packages-builder-src-views-dashboardview-vue
---
## Critique: All Releases Page

**Target:** packages/builder/src/views/DashboardView.vue + ReleaseTable.vue + ReleaseRow.vue + layout shell

### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3/4 | Loading skeleton solid; no toast on archive, no total count |
| 2 | Match System / Real World | 2/4 | "Template A/B/C" opaque; date shown is created_at not published_at |
| 3 | User Control and Freedom | 2/4 | No undo on archive; no filter, sort, or search |
| 4 | Consistency and Standards | 2/4 | indigo-600 throughout; violates Retirement Rule in DESIGN.md |
| 5 | Error Prevention | 3/4 | Hover-only actions reduce accidental triggers; no archive confirmation |
| 6 | Recognition Rather Than Recall | 2/4 | Template values and hover-only actions require discovery |
| 7 | Flexibility and Efficiency | 1/4 | No search, filter, sort, keyboard shortcuts, or bulk actions |
| 8 | Aesthetic and Minimalist Design | 2/4 | Redundant heading; priority badges conflict with status badges |
| 9 | Error Recovery | 2/4 | No error state for failed fetch or failed archive |
| 10 | Help and Documentation | 1/4 | No tooltips; Template unexplained; empty state barely teaches |
| **Total** | | **20/40** | **Acceptable — significant improvements needed** |

### Priority Issues

[P1] Indigo accent violates design system — replace all indigo-* with violet tokens across AppSidebar, DashboardView, ReleaseRow
[P2] Hover-only actions are keyboard-inaccessible — WCAG 2.1 SC 2.4.7 violation on Edit link (opacity-0 when focused)
[P2] Doubled heading (topbar "All Releases" + h2 "Releases") — remove h2 label from DashboardView
[P2] Priority amber collides with status amber — differentiate priority visual system from status badge system
[P2] Template A/B/C unexplained — replace single-character mono labels with descriptive names
