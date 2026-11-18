# Geaux Auto Glass site: Nov 17 revision round

Source: "Geaux Auto Glass: Website To-Do List (Nov 17 Call)".

## Pages in this build

| File | Purpose |
|---|---|
| index.html | Homepage |
| services.html | Six services, one row each, footer links land on each row |
| insurance.html | Claim steps, carriers, links to Enterprise and student pages |
| enterprise.html | Enterprise claim routes: form, photo upload, text, email |
| student-discount.html | Student discount, varsity theme |
| reviews.html | Ratings, review quotes, Google links for both shops |
| new-orleans.html | New Orleans location page with live map and LocalBusiness schema |
| merchandise.html | All 41 store items in one filterable grid |

## Asset drop-ins

Save each file under the same name. No code change needed unless noted.

| Item from the list | File to replace | Format |
|---|---|---|
| "We come to you" banner, roller shot of the van | assets/svc-mobile.jpg | Landscape, 1420 px wide or more, sharpened |
| ADAS card, client photo | assets/svc-adas.jpg | Square, 1200 px |
| Chip repair card, client photo | assets/svc-chip.jpg | Square, 1200 px |
| Windshield card, second client photo | assets/svc-windshield.jpg | Square, 1200 px |
| Door glass card, client photo | assets/svc-door.jpg | Square, 1200 px |
| New Orleans card, 504 van photo after edits | assets/loc-kenner.jpg | Landscape, 1240 px wide. Update the alt text in index.html and new-orleans.html |
| Hero, full fleet photo | assets/hero.jpg | Landscape, 2000 px wide or more |
| Glass out, glass in video | assets/glass-out-glass-in.mp4 | Then set data-video="assets/glass-out-glass-in.mp4" on the figure with class "ba" in index.html. Plays muted, loops, replaces the wipe |

## Social counts

Every follower and like number reads from social-counts.js.
Edit that one file and all pages update.
For automatic updates, point GEAUX_SOCIAL_FEED in that file at a JSON endpoint with the same three keys, or have a scheduled job overwrite the file.
The endpoint needs API access to the client's Instagram, TikTok and Facebook accounts. Not connected yet.

## Merch grid

The grid is a snapshot of the store catalog taken 2026-11-17: 41 products, lowest variant price shown.
On the Shopify theme this becomes a live collection loop.

## Open with the client

- Baton Rouge block: own block, phone number, Google Business Profile.
- Enterprise block: phone number, email (site shows erac1120@gmail.com, call notes say erack1120@gmail.com), logo.
- Story copy still reads "serving all of Acadiana".
- Services heading without "ADAS calibration": applied, confirm.
- Porsche to Tesla video swap: no video exists in this build. Confirm the section.
- Insurance photo: red SUV with sky behind it is in place. Confirm the file.
- Other sites that promote the brand, for the footer list.
