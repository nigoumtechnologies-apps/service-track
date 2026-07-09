# STEP-054 Changelog

## Package Name
- `STEP-054` Live Dashboard + Production Stabilization

## Files Modified
- `frontend/screens/dashboard.js`
- `frontend/screens/today.js`
- `frontend/screens/newJobCard.js`
- `frontend/css/style.css`
- `CHANGELOG_STEP054.md`
- `RELEASE_CHECKLIST.md`

## Features Added
- Live dashboard cards backed by the current workshop cache.
- Clickable dashboard cards that open the Workshop screen and apply the matching filter.
- Live counters for total jobs, status totals, overdue jobs, deliveries, mechanics working, pending jobs, completion percentage, and workshop efficiency percentage.
- Cache reuse through `Today.jobs` to avoid unnecessary API calls.
- Dashboard live sync hook for workshop state changes without reloading the app shell.
- Responsive, color-coded dashboard card layout for mobile, tablet, and desktop.

## Testing Checklist
- Open the app and confirm the Dashboard renders live values instead of hardcoded numbers.
- Confirm dashboard cards open Workshop and apply the expected status filter.
- Confirm dashboard values change after a job is created or a status update is completed.
- Confirm Workshop navigation reuses cached data when available.
- Confirm mobile and desktop layouts remain usable and readable.
- Run `node --check` on the modified JavaScript files.

## Known Limitations
- Dashboard metrics are derived from the current in-memory workshop cache.
- Overdue detection still depends on the estimated delivery timestamp provided by the existing payload.
- The Workshop screen still owns the detailed workflow; Dashboard remains an overview surface.

## Future Improvements
- Add a manual refresh indicator for long-running workshop sessions.
- Add a dedicated overdue view in Workshop if the product later needs it.
- Add richer efficiency formulas if backend metrics become available later.

## Validation Completed
- `node --check frontend/screens/dashboard.js`
- `node --check frontend/screens/today.js`
- `node --check frontend/screens/newJobCard.js`
