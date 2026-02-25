# Specification

## Summary
**Goal:** Remove the admin-only access-control guard from user registration functions in the backend so that any authenticated principal can register.

**Planned changes:**
- In `backend/main.mo`, remove the caller-role check that restricts registration functions (for internal, partner, and client users) to admin-only callers
- Leave all other logic intact, including approval/reject functions, data structures, and stable var storage

**User-visible outcome:** Any authenticated Internet Identity principal can call the registration functions without receiving an authorization error, without requiring admin privileges.
