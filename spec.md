# Specification

## Summary
**Goal:** Connect the backend canister to the `/dashboard/client` page, replacing all mock data with live data, and add collapsible cards for task management including task creation, status tracking, and activity history.

**Planned changes:**
- Update the `Task` record type in `backend/main.mo` to include fields: `id`, `tipeLayanan`, `judulTask`, `detailTask`, `deadline`, `createdAt`
- Update `createTask` (shared) to validate that the selected layanan is active (`#aktif`) and owned by the calling principal
- Ensure `getMyLayanan` returns only layanan belonging to the calling principal
- Replace all mock/dummy data in `DashboardClient.tsx` with live data fetched via React Query using `getMyLayanan` and `getTaskByStatus`
- Add a collapsible Summary Card showing task counts per status (`#review`, `#revisi`, `#on_progress`, `#qa_asistenmu`, `#selesai`)
- Add a collapsible "Daftar Layanan" section showing the client's real layanan list
- Add a collapsible "Buat Task" form with: layanan dropdown (only if more than one active layanan), Judul Task input, Detail Task textarea, Deadline date picker, and submit button; form is hidden/disabled if no active layanan exists; on submit calls `createTask` on the backend
- Add a "Daftar Task Kamu" section with five collapsible status cards (Meminta Review, Task on Revisi, Task on Progress, Task QA Asistenmu, Task Selesai), each with individually collapsible task entries showing full details
- Add a collapsible History card at the bottom listing recent task-related activity derived from backend task data

**User-visible outcome:** Clients can view their real layanan and task data on the dashboard, create new tasks against active layanan, browse tasks grouped by status with collapsible detail views, and review recent activity — all backed by live canister data.
