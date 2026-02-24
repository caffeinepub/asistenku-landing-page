# Specification

## Summary
**Goal:** Add role-based rendering logic to the internal dashboard page so that Admin/Superadmin users see all roles in toggleable accordions, while other roles see only their own dashboard section.

**Planned changes:**
- Update `frontend/src/pages/dashboard/internal.tsx` to determine `isSuperAdmin` (role is `'Admin'` or `'Superadmin'`) and set `rolesToRender` accordingly (all roles vs. current role only)
- Render each role in an accordion section with a clickable header (showing role name) toggled via `toggleRoleAccordion`; non-admin users see their section without an accordion header
- Within each role section, render: a 4-column Summary Cards grid via `renderSummaryCards(r)`, a toggleable Middle Section ("Details / List Section") via `toggleSection(r, 'middle')`, and a toggleable Bottom Section ("History / Tickets Section") via `toggleSection(r, 'bottom')`
- Manage accordion open/close state with an `openRoles` map and section toggle state with a `sections` map keyed by role name
- Update `frontend/src/App.tsx` route for `/dashboard/internal` to pass a valid role prop (e.g., `'Admin'`) to `InternalDashboard` for end-to-end testing

**User-visible outcome:** Admin and Superadmin users visiting `/dashboard/internal` will see all role dashboards as collapsible accordion sections, while non-admin users see only their own role's dashboard with toggleable detail sections.
