# Course Plan Audit Studio — GitHub Pages Edition

A static, privacy-first batch auditor for Course Plan DOCX and PDF files. It can be hosted directly on GitHub Pages; no server, database, API key or upload backend is required. The default Academic Year is **2026-2027**.

## Main capabilities

- Select multiple DOCX/PDF files
- Select a complete device folder with the browser folder chooser
- Drag and drop a batch of files
- Process all supported files locally in the browser
- Match faculty/course assignments against the embedded reference data
- Apply the Course Plan validation rules
- Run the browser-converted trained classifier for Pass/Fail/Review/N/A recommendations
- Show rule/model agreement and confidence
- Search and filter file results
- Explain every failed and review check
- Download one consolidated CSV report
- Download one professionally formatted Microsoft Word `.docx` dashboard report with a populated contents index, file-wise validation dossiers and the closing note “A little help from Brijmohan”
- Show page references beside every validation result. PDF page numbers are exact; DOCX page references use embedded Word pagination markers when available and otherwise request a PDF for exact navigation.
- Print/save the dashboard as PDF
- Edit academic session/year and import/export reference data

## Privacy

Selected documents never leave the browser. The application has no upload endpoint. All libraries, the reference data and the converted trained model are included in the repository.

Browser security does not permit a website to read a typed local folder path. Users must select the folder through **Select folder**. Chrome, Edge and other Chromium-based browsers provide the best folder-selection support.

## GitHub Pages deployment

### Option 1: automatic workflow

1. Create a GitHub repository.
2. Upload all files and folders from this package to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **GitHub Actions**.
5. Push to the `main` branch. The included workflow publishes the site.

### Option 2: deploy directly from a branch

1. Upload this package to the root of the `main` branch.
2. Open **Settings → Pages**.
3. Select **Deploy from a branch**.
4. Choose `main` and `/ (root)`.

## Local testing

Opening ES modules directly through `file://` may be blocked by browsers. Start a local server:

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Included data

- Course catalogue: 157 records
- Faculty/course assignments: 110 records
- Academic-session settings are stored in the user's browser
- Converted classifier source fingerprint: `23e0dfd5f73e236a3d804ac62d97a30c8857193dd1729df039b0b598444d6035`

## Limitations

- Scanned PDFs without a text layer require OCR before automatic validation.
- PDF highlight colours and signatures require manual visual confirmation.
- Browser folder access requires an explicit user selection; a web page cannot silently read a local path.
- The explainable audit rules remain authoritative. Model predictions are advisory and disagreements are highlighted.
