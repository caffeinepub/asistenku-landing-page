# Specification

## Summary
**Goal:** Overhaul the internal dashboard UI in `frontend/src/pages/dashboard/internal.tsx` with collapsible sections, ticket action buttons, an enhanced Asistenmu layout, updated GMV cards, and an autocomplete client search.

**Planned changes:**
- Wrap each sub-dashboard (AdminUser, AdminFinance, Asistenmu, Concierge) in a Collapsible component (defaultOpen) with a CardTitle trigger in the Superadmin view
- Add Progress and Resolve action buttons to ticket rows in AdminUser, AdminFinance, and Asistenmu dashboards; Progress requires a mandatory notes textarea, Resolve opens a modal with a mandatory notes textarea and a disabled-until-filled "Resolve Tiket" button
- In the Asistenmu dashboard, add a "Client Terkait" collapsible section (defaultOpen) below summary cards showing a table with columns: ID Layanan, Tipe Layanan, Nama Client, Status Layanan, Unit Aktif, Share Layanan (mock data)
- In the Asistenmu dashboard, consolidate the six task status cards (Permintaan Baru, QA Asistenmu, Revisi Client, Ditolak Partner, Review Client, Selesai) into a single "Task Management" collapsible section; tasks in "Ditolak Partner" get a "Delegasikan Ulang" button that opens a modal with all fields pre-filled and read-only except the Partner selection field
- In the AdminFinance dashboard, replace the existing GMV summary cards with five per-service-type cards: Tenang, Rapi, Fokus, Jaga, Efisien
- In the AdminFinance Aktivasi Layanan form, replace the client dropdown with an autocomplete search input that filters by name, user ID, or principal ID

**User-visible outcome:** Internal dashboard users will see collapsible sub-dashboards in the Superadmin view, ticket rows with Progress/Resolve actions across AdminUser, AdminFinance, and Asistenmu dashboards, an enriched Asistenmu layout with a client list and unified Task Management section, updated GMV cards by service type, and a smarter client search in the Aktivasi Layanan form.
