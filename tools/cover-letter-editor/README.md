# Cover Letter Editor

A small, offline page for tailoring my internship cover letter: type the company's name and
address, check the A4 preview, and download a one-page PDF (or a Word file).

It is not part of the published portfolio site; it runs on your own computer.

## Open it

- With XAMPP running: http://localhost/digital-portfolio/abigail-portfolio/tools/cover-letter-editor/
- Or double-click `index.html`.

## Private details (not on GitHub)

Your home address, phone number and signature are kept out of this repository. Put them in two
files next to `index.html`; both are listed in `.gitignore`:

`personal.local.js`

```js
window.PERSONAL_DEFAULTS = {
  senderAddress: 'Line 1,\nLine 2,\nPostcode City,\nState',
  phone: '012-345 6789',
};
```

`signature.local.js`

```js
window.DEFAULT_SIGNATURE = 'data:image/png;base64,...'; // a transparent PNG of your signature
```

Without these files the editor still works: enter your details once under
**Greeting, your details and signature** (and upload a signature image); they are remembered in
your browser.

## How it works

- Everything runs in the browser; nothing is uploaded.
- PDFs are created with [jsPDF](https://github.com/parallax/jsPDF) 2.5.1 (bundled in `lib/`, MIT licence),
  shrinking the text slightly when needed so the letter fits on one page.
- Edits to the letter text are saved in the browser's local storage.
