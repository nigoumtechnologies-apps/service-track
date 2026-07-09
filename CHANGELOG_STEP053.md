# STEP-053 Changelog

## Files Modified
- `frontend/screens/today.js`
- `frontend/components/jobcard.js`
- `frontend/css/style.css`

## Permission Matrix
- `Supervisor`: full workshop actions, including Assign, Start, Complete, and Deliver.
- `Mechanic`: can view assigned jobs and can Start or Complete when the current state allows it.
- `Customer Care`: can Deliver completed jobs only.
- `Owner`: read-only, no update buttons.

## Features Added
- Temporary role selector stored in `localStorage`.
- Role-aware action visibility in the workshop panel.
- Role-aware top action controls on the workshop screen.
- Mechanic role hides new jobs from the workshop list.
- Customer Care and Owner roles respect read-only or limited-action behavior.

## Testing Checklist
- Select each role and confirm the active role persists after refresh.
- Confirm Supervisor sees the full action set.
- Confirm Mechanic only sees the permitted status actions.
- Confirm Customer Care only sees Deliver when a job is completed.
- Confirm Owner sees no update buttons.
- Confirm the workshop list and counters refresh without API changes.

## Validation Completed
- `node --check frontend/screens/today.js`
- `node --check frontend/components/jobcard.js`

## Future Improvements
- Add a small role description helper near the selector.
- Add a dedicated role reset control for workshop debugging.
- Persist the last selected panel job while switching roles.
