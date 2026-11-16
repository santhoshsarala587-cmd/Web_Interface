# Rolodex Rebuild Handoff

This version adds a management layer on top of the original local-first contact manager.

## Rebuilt features

- Management dashboard with data health, follow-up queue, recent activity, and actionable metrics
- Contact lifecycle fields: status, priority, owner, tags, source, preferred channel, last contacted, and next follow-up
- Advanced filters for lifecycle fields and owners
- Follow-up sorting
- Bulk contact selection and bulk status updates
- Bulk archive workflow
- Saved views persisted in localStorage
- Activity history persisted in localStorage for create, update, import, archive, and restore actions
- Lifecycle badges on contact cards, tables, and detail pages
- Expanded contact form and detail view
- Backward-compatible normalization for the existing 320 seed contacts
- Formatting and TypeScript fixes required for a clean build

## Run locally

```bash
npm install
npm run dev
```

## Validate locally

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The app remains local-first. The service abstraction in `src/services/contactService.ts` is still the recommended seam for replacing LocalStorage with a real API later.

## Notes

The lint command exits successfully but reports 10 pre-existing Fast Refresh warnings from component files that also export helper values/functions. They do not block the build.

## Contact action bar enhancement

- The Call action now uses a normalized `tel:` URI so phones/tablets open the native dial pad with the contact number ready.
- The Email action now uses a `mailto:` URI with a prefilled subject and editable greeting draft.
- Both actions have accessible labels and tooltips.
- The action bar is responsive: full-width two-column controls on small screens and compact wrapping controls on larger screens.
- Missing phone/email values are handled with disabled fallback buttons instead of broken links.

## Gmail compose behavior

All contact email actions now open Gmail Compose in a new tab using a prefilled draft URL. The recipient, subject, and message body are populated automatically, while the sender account is supplied by the user’s active Gmail session. The alternate email link uses the same behavior. If the user is not signed in to Gmail, Gmail will prompt for sign-in before opening the compose draft.
