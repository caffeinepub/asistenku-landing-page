# Specification

## Summary
**Goal:** Create a client registration page with UI-only form and dummy login functionality.

**Planned changes:**
- Add new route /client-register with ClientRegister.tsx page component
- Update Header.tsx to route "Daftar" link to /client-register
- Implement centered card layout with form containing Nama, Email, WhatsApp, and Company fields
- Add disabled Submit button and Login Internet Identity button
- Implement dummy UI state toggle: clicking Login II button enables/disables form inputs and Submit button
- Apply mobile-first responsive layout

**User-visible outcome:** Users can navigate to the client registration page via the "Daftar" link, see a registration form that is initially disabled, click the "Login Internet Identity (Login II)" button to toggle the form's enabled state (UI-only, no real authentication), and interact with the form fields when enabled.
