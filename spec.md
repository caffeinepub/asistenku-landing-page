# Specification

## Summary
**Goal:** Fix the Partner Level field in the AdminUser Pending User list and add a full Asistenmu dashboard section to `/dashboard/internal`, while ensuring Superadmin can see all sections and AdminFinance remains untouched.

**Planned changes:**
- In the AdminUser Pending User list, replace the plain "Partner" text label with a dropdown (Junior / Senior / Expert) controlled by `partnerLevel` state, and add a "Verified Skill (pisahkan koma)" text input below it — both visible only when the pending user's role is `Partner`.
- Add an `AsistenmuDashboardSection` component rendered only when the logged-in role is `Asistenmu`, containing:
  - A summary grid with cards for List Client, Total Task, and per-status counts (PermintaanBaru, QAAsistenmu, RevisiClient, DitolakPartner, ReviewClient, Selesai).
  - Six collapsible task sections (one per status) each with a filter input and role-appropriate action buttons (Delegasikan Task, Kirim Review ke Client, Kirimkan Revisi ke Partner, Selesaikan Task, Delegasikan Ulang).
  - A delegation modal with fields: Partner (id/principalId/nama/skill), Jam Efektif, Unit Layanan Terpakai, Link GDrive Internal, Link GDrive Client, and Batal/Delegasikan buttons.
  - A collapsible Tiket section with filter and Resolve button for unresolved tickets.
  - A collapsible History section with filter input.
  - All data sourced from local mock state (no backend calls).
- Update role-based conditional rendering so that the `Superadmin` role sees all dashboard sections (AdminUser, Asistenmu, AdminFinance, and others) simultaneously with no restrictions.
- Leave the AdminFinance dashboard section completely unchanged.

**User-visible outcome:** Admins managing Partner users can now set a partner level and verified skills during approval. The Asistenmu role gets its own full-featured dashboard for task delegation, review, ticket resolution, and history. Superadmin can view all internal dashboard sections at once.
