# Location data

This directory is the app's temporary "database". It replaced the Sanity CMS
and is meant to be easy to move into another CMS (or a homegrown solution)
later.

- `locations/<country-slug>.json` — one file per country. The file name is the
  country name lower-cased with non-alphanumerics replaced by `-`; the app
  matches on the `name` field inside the file, not on the file name.
- The app only reads this data through `app/data/db.ts`.

## Schema

```jsonc
{
  "name": "United States",
  // Optional. How the child levels are labelled in the UI for this country.
  "labels": {
    "administrativeAreaLevel1": { "singular": "State", "plural": "States" },
    "administrativeAreaLevel2": { "singular": "County", "plural": "Counties" },
    "locality": { "singular": "City", "plural": "Cities" }
  },
  "isWeedLegalHere": { /* see below */ },
  // Optional. US states, Canadian provinces, etc.
  "administrativeAreaLevel1": [
    {
      "name": "California",
      "isWeedLegalHere": { /* see below */ },
      // Optional. US counties.
      "administrativeAreaLevel2": [
        { "name": "Los Angeles County", "isWeedLegalHere": { /* … */ } }
      ],
      // Optional. Cities.
      "locality": [
        { "name": "Los Angeles", "isWeedLegalHere": { /* … */ } }
      ]
    }
  ]
}
```

The level names (`administrativeAreaLevel1`, `administrativeAreaLevel2`,
`locality`) mirror the Google Maps address component types the app resolves a
visitor's location into.

### `isWeedLegalHere`

Every key is optional.

```jsonc
{
  // Rich text in Portable Text format (https://portabletext.org). Only
  // "normal" paragraphs and the "strong" mark are used today.
  "overview": [
    {
      "_key": "a1b2c3",
      "_type": "block",
      "style": "normal",
      "markDefs": [],
      "children": [
        { "_key": "d4e5f6", "_type": "span", "marks": [], "text": "Recreational cannabis is " },
        { "_key": "g7h8i9", "_type": "span", "marks": ["strong"], "text": "legal" }
      ]
    }
  ],
  "medicinal":    { "legalStatus": "legal" },                          // legal | illegal | unknown
  "recreational": { "legalStatus": "decriminalized", "quantity": "1 oz" },
  "thca":         { "legalStatus": "legal", "quantity": "…" },
  "delta9":       { "legalStatus": "unclear" },
  "delta8":       { "legalStatus": "illegal" },
  "cbd":          { "legalStatus": "legal" }
}
```

`legalStatus` for everything except `medicinal` is one of
`legal | illegal | decriminalized | unclear | unknown`.

## Notes

- The medicinal + recreational statuses drive the headline, background colour
  and image on a location page. The other statuses only appear in the
  "Legality Status" table.
- The order of entries in each array is preserved on the `/admin` page; the
  public browse pages sort children alphabetically at render time.
