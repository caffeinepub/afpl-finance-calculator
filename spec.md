# Hostel Mess Control

## Current State
Empty workspace — no existing files.

## Requested Changes (Diff)

### Add
- Full Mess Management App with Dashboard, Members, Expenses, and Balance views
- Member management: add/edit/delete, track individual contributions
- Expense management: add/edit/delete with item name, amount, date, and who paid
- Contribution tracking: per-member and total
- Balance system: opening balance (editable) + contributions - expenses = closing balance
- Per-member net summary (contributed vs spent)
- Dashboard with 4 summary cards and recent activity
- LocalStorage persistence
- Mobile-friendly, clean UI

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: Members, Contributions, Expenses stable entities with CRUD
2. Frontend: Tab navigation (Dashboard, Members, Expenses, Balance)
3. LocalStorage for persistence
4. Auto-calculated closing balance
5. Per-member spending and contribution tracking
