# Quick Start: Admin Pet Inventory

## Getting Started

### Prerequisites
- Admin user account with custom claims set (use `setCustomClaims.js` to set admin role)
- Local development: Run `vercel dev` to enable API functions

### Accessing the Admin Panel

1. Log in as an admin user
2. Navigate to `/admin` route
3. You'll see three tabs: Dashboard, Requests, Pet Inventory

## Dashboard Tab

The dashboard shows real-time statistics:

**Main Metrics (Large Cards):**
- 🐾 Total Pets - Blue card
- ⏰ Pending Requests - Orange/Amber card  
- ✓ Approved Requests - Cyan card
- ❤️ Fulfilled Adoptions - Green card

**Detailed Stats (Bottom Panels):**
- Left panel: Request breakdown (visits vs adoptions vs rejected)
- Right panel: All-time totals and active user count

Statistics update automatically as data changes in Firestore.

## Pet Inventory Tab

### Adding a New Pet

1. Click **"Add New Pet"** button (top right)
2. Fill in all required fields:
   - **Basic Info**: Name, Breed, Gender, Birth Date
   - **Physical**: Weight, Coat Color, Image URL
   - **Behavior**: Temperament, Activity Level, Grooming Needs
   - **Health**: Health Condition
   - **Preferences**: Food Flavor, Toy Type
3. Click **"Create"** to save

**Tips:**
- All fields are required (marked with *)
- Use a valid image URL for the pet photo
- Birth Date uses a date picker
- Gender, Activity, Grooming, and Health have dropdown options

### Editing a Pet

1. Find the pet in the table
2. Click the **pencil icon** (✏️) in the Actions column
3. Modify any fields
4. Click **"Update"** to save changes

### Deleting a Pet

1. Find the pet in the table
2. Click the **trash icon** (🗑️) in the Actions column
3. Confirm deletion in the popup dialog
4. Pet is permanently removed

**Warning:** Deletion cannot be undone!

### Searching/Filtering

- Use the search box at the top of the table
- Search works across all fields (name, breed, etc.)
- Results filter in real-time as you type
- Click the **X** icon to clear search

### Sorting

- Click any column header to sort by that field
- Click again to reverse sort order
- Useful for organizing by name, breed, birth date, etc.

## Requests Tab

This tab contains the existing request management functionality:
- Two sub-tabs: Visit Requests and Adoption Requests
- Each shows active requests and archived requests
- Admin actions: Approve, Reject, Fulfill, Unfulfill

(This functionality remains unchanged from the original implementation)

## Common Tasks

### Task: Add 10 New Pets
1. Go to Pet Inventory tab
2. Click "Add New Pet"
3. Fill form and click "Create"
4. Repeat 9 more times
5. All pets appear in table immediately

### Task: Update Pet Information
1. Search for the pet by name
2. Click edit icon
3. Update necessary fields
4. Click "Update"
5. Changes reflect immediately

### Task: Remove Adopted Pets
1. Sort by name or use search
2. Click delete icon for each adopted pet
3. Confirm each deletion
4. Pets removed from system

### Task: View Statistics
1. Go to Dashboard tab
2. Check metrics at a glance
3. Use for reporting or monitoring

## Keyboard Shortcuts

While no custom shortcuts are implemented, standard browser shortcuts work:
- `Tab` - Navigate between form fields
- `Enter` - Submit forms
- `Esc` - Close dialogs
- `Ctrl/Cmd + F` - Browser find (can use instead of table search)

## Troubleshooting

### "Forbidden: User is not an admin" Error
**Solution:** Ensure your user has admin custom claims set.
```bash
# Run this script with your user's UID
node setCustomClaims.js YOUR_USER_UID
```

### API Functions Not Working Locally
**Solution:** Use `vercel dev` instead of `npm run dev`
```bash
vercel dev
```

### Form Won't Submit / "This field is required"
**Solution:** All fields in the pet form are required. Fill in every field.

### Pet Image Not Showing
**Solution:** Verify the image URL is valid and publicly accessible. Try the URL in a browser.

### Statistics Not Updating
**Solution:** 
- Refresh the page (Firestore real-time subscription should auto-reconnect)
- Check browser console for errors
- Verify Firebase connection

### Can't Delete Pet
**Solution:**
- Ensure you're clicking the correct delete button
- If confirmation dialog doesn't appear, check for JavaScript errors
- Backend may be preventing deletion (check console)

## Development Tips

### Testing Locally
```bash
# Terminal 1: Start Vercel dev server (includes frontend + API)
vercel dev

# Terminal 2: Watch for TypeScript errors (optional)
npm run type-check -- --watch
```

### Checking API Responses
Open browser DevTools → Network tab to see API calls:
- `/api/createPet` - POST requests when creating
- `/api/updatePet` - POST requests when editing  
- `/api/deletePet` - POST requests when deleting

### Viewing Firestore Data
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Check `paws` collection
4. You'll see all pets with their IDs

### Setting Admin Claims
```bash
# From project root
node setCustomClaims.js <USER_UID>
```
Get USER_UID from Firebase Console → Authentication → Users

## Best Practices

1. **Always use search** - Don't scroll through hundreds of pets; search instead
2. **Verify before deleting** - Double-check you're deleting the correct pet
3. **Use consistent naming** - Keep pet names formatted consistently (capitalization)
4. **Valid image URLs** - Use reliable image hosting (not temporary URLs)
5. **Check dashboard first** - Start sessions by reviewing dashboard metrics

## Next Steps

- Explore the Requests tab to manage user requests
- Set up additional admin users if needed
- Consider implementing suggested future enhancements
- Monitor dashboard regularly for trends

For detailed technical documentation, see:
- `docs/features/admin-pet-inventory.md` - Full feature documentation
- `IMPLEMENTATION_SUMMARY.md` - Implementation details and deployment guide
