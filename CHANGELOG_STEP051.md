# STEP-051 Changelog

## Files Modified
- `frontend/screens/today.js`
- `frontend/components/jobcard.js`
- `frontend/css/style.css`

## Features Added
- Live status counter chips for ALL, NEW, ASSIGNED, STARTED, COMPLETED, and DELIVERED.
- Search-aware counters that update instantly from `Today.jobs` without API calls.
- Colored status badge inside each job card.
- Clear Search button for fast reset of the workshop list.
- Overdue detection with elapsed duration display when estimated delivery is in the past and status is not delivered.
- Better card spacing, typography, alignment, and mobile behavior.

## Testing Checklist
- Load the Today screen and confirm job cards render from the existing API.
- Type in the search box and confirm the list, counter chips, and filtered count update instantly.
- Click Clear Search and confirm the search resets and all cards return.
- Click each status chip and confirm only visible cards change.
- Verify the colored status badge displays correctly for each status.
- Verify overdue cards show an Overdue block and duration when estimated delivery is past due.
- Confirm delivered cards do not show overdue warnings.

## Known Limitations
- Overdue timing is computed only in the browser and updates when the view refreshes.
- Card click-through still depends on the existing `jobDetails` route behavior.

## Future Improvements
- Add a timed refresh loop for the overdue display.
- Add a job details screen for card-level actions.
- Add sort options for delivery date and status priority.
