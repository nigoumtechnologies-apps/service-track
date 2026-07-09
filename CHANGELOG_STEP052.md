# STEP-052 Changelog

## Package Name
- `STEP-052` Workshop Bottom Sheet & Smart Status Engine

## Files Modified
- `frontend/screens/today.js`
- `frontend/components/jobcard.js`
- `frontend/css/style.css`

## Features Added
- Workshop bottom sheet on mobile and right-side panel behavior on desktop.
- Job details view for Job Card Number, Registration Number, Model, Service Type, Supervisor, Mechanic, Estimated Delivery, Current Status, Remarks, and Timeline.
- Smart status engine with one visible action button per job state.
- Status update flow using the existing `API.updateStatus()` contract only.
- Background scroll lock, outside-tap close, ESC close, and in-panel Cancel/Close actions.
- Workshop refresh after status update without reloading the full application.

## Testing Checklist
- Click a job card and confirm the workshop panel opens instead of leaving the screen.
- Verify the panel shows the expected job details and timeline.
- Verify the timeline marks completed stages green, the current stage blue, and future stages gray.
- Confirm only one action button appears for NEW, ASSIGNED, STARTED, and COMPLETED.
- Confirm no action button appears for DELIVERED and the panel shows `Vehicle Delivered`.
- Press ESC, tap outside, and use Close/Cancel to confirm the panel closes.
- Run a status update and confirm the workshop list refreshes without reloading the app shell.

## Known Limitations
- Overdue and timeline states are computed in the browser from the current workshop payload.
- The right-side panel is an acceptable desktop fallback rather than a separate routed screen.

## Future Improvements
- Add inline loading states for status updates.
- Add richer remarks formatting and quick notes in the panel.
- Add panel persistence when searching/filtering during an open detail view.

## Validation Completed
- `node --check frontend/screens/today.js`
- `node --check frontend/components/jobcard.js`
