# STEP-050 Changelog

## Files Modified
- `frontend/screens/today.js`
- `frontend/components/jobcard.js`
- `frontend/css/style.css`

## Features Added
- Live search across Job Card No, Registration No, Model, Supervisor, and Mechanic.
- Live counter showing total jobs and filtered jobs without any backend call.
- Horizontal status filter chips for ALL, NEW, ASSIGNED, STARTED, COMPLETED, and DELIVERED.
- Improved workshop card layout with clearer typography, spacing, and delivery-date display.
- Preserved existing service-type color coding and current API usage.

## Testing Checklist
- Confirm the Today screen loads job cards from the existing API.
- Type in the search field and verify cards filter instantly.
- Click each status chip and confirm only visible cards change.
- Verify the counters update when search text or filters change.
- Confirm cards still render service color accents for FSC, Paid Service, and General Repair.
- Confirm estimated delivery displays only when a value exists.

## Future Improvements
- Add a dedicated job-details screen to support card click-through.
- Add live status actions from the workshop view.
- Add pagination or virtual scrolling for larger workloads.
- Add empty-state guidance and refresh controls for faster operator use.
