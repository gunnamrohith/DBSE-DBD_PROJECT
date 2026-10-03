# Project report

The generated submission is `Haven-Society-Management-Project-Report.pdf` (109 A4 pages).

## Personalize

Edit only the `meta` object at the top of `generate-report.mjs` to replace student names, roll numbers, guide name, academic year, departments, or university.

## Regenerate

```bash
node docs/report/generate-report.mjs
```

Open `docs/report/report.html` in Chrome and print with:

- Paper size: A4
- Margins: None
- Scale: 100%
- Background graphics: Enabled
- Headers and footers: Disabled

Command-line PDF generation on macOS:

```bash
'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$PWD/docs/report/Haven-Society-Management-Project-Report.pdf" \
  "file://$PWD/docs/report/report.html"
```

The generator fails if its explicit page model does not contain exactly 109 pages.
