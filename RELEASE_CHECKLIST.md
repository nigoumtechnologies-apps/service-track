# MotoFlow Release Checklist

## Database
- No schema changes required.
- Verify the production dataset still matches the existing Workshop payload shape.

## API
- No API contract changes required.
- Confirm `getTodayJobCards`, `saveJobCard`, and `updateStatus` still return the expected payloads.

## Workshop
- Confirm live search works without API calls.
- Confirm role-based action visibility still behaves as expected.
- Confirm status updates refresh only the Workshop data.

## Dashboard
- Confirm dashboard cards render live counts from the workshop cache.
- Confirm dashboard cards open Workshop and apply the matching filter.
- Confirm no hardcoded dashboard numbers remain.

## Role Engine
- Confirm Supervisor, Mechanic, Customer Care, and Owner permissions still match the matrix.
- Confirm the temporary localStorage role selector persists after refresh.

## Search
- Confirm the search input filters by Job Card No, Registration No, Model, Supervisor, and Mechanic.
- Confirm clearing search restores the full filtered view without a backend call.

## Bottom Sheet
- Confirm the Workshop detail panel opens, closes, and locks background scrolling correctly.
- Confirm ESC and outside-tap close still work.

## Status Engine
- Confirm the smart action button still follows the current job state.
- Confirm Delivered jobs show no update button.

## Testing
- Run `node --check frontend/screens/dashboard.js`.
- Run `node --check frontend/screens/today.js`.
- Run `node --check frontend/screens/newJobCard.js`.
- Review the dashboard and workshop on mobile and desktop widths.
- Verify one job creation and one status update flow end-to-end.

## Git Status
- Current working tree:
  - `frontend/css/style.css`
  - `frontend/screens/dashboard.js`
  - `frontend/screens/today.js`
  - `frontend/screens/newJobCard.js`
  - `CHANGELOG_STEP054.md`
  - `RELEASE_CHECKLIST.md`

## Known Bugs
- Overdue and efficiency metrics are computed on the client from the current cache.
- The dashboard uses the existing workshop payload, so external data changes require a fresh workshop fetch.

## Release Notes
- STEP-054 completes the live Dashboard surface for the RC workflow.
- Dashboard and Workshop now share the same cached job data path.

## Remaining Nice-to-Have Features
- Manual dashboard refresh control.
- Dedicated overdue workshop filter.
- Richer performance analytics when backend metrics become available.
