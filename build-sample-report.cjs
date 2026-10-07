const fs = require('fs');
const path = require('path');
const report = require('./report-docx.js');

function parseCsv(text) {
  const rows = [];
  let row = [], value = '', quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { value += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else value += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(value); value = ''; }
    else if (ch === '\n') { row.push(value.replace(/\r$/, '')); rows.push(row); row = []; value = ''; }
    else value += ch;
  }
  if (value || row.length) { row.push(value.replace(/\r$/, '')); rows.push(row); }
  return rows;
}

async function main() {
  const input = process.argv[2] || path.join(__dirname, '..', 'report01.csv');
  const output = process.argv[3] || path.join(__dirname, '..', 'Course_Plan_Audit_Dashboard_Redesigned.docx');
  const rows = parseCsv(fs.readFileSync(input, 'utf8').replace(/^\uFEFF/, ''));
  const headers = rows.shift();
  const records = rows.map(values => Object.fromEntries(headers.map((h, i) => [h, values[i] || ''])));
  const summaries = records.filter(r => r['Record Type'] === 'Summary');
  const audits = summaries.map(summary => {
    const fileNo = summary['File Number'];
    const checks = records.filter(r => r['Record Type'] === 'Detail' && r['File Number'] === fileNo).map(r => ({
      section: r.Section,
      criterion: r.Criterion,
      pageRef: r['Page Number'] || 'Upload PDF for exact page',
      finalStatus: r.Status,
      evidence: r['Evidence / Remark']
    }));
    const counts = checks.reduce((o, x) => { o[x.finalStatus] = (o[x.finalStatus] || 0) + 1; return o; }, {Pass:0, Fail:0, Review:0, 'N/A':0});
    return {
      file: summary['Source File'],
      overall: summary.Status,
      counts,
      checks,
      meta: {
        faculty: summary.Faculty,
        detectedCourse: summary['Course Name'],
        code: summary['Course Code'],
        referenceCode: summary['Reference Course Code'],
        courseType: summary['Course Type'],
        semester: summary.Semester,
        year: summary['Student Year'],
        session: 'July - December 2026',
        academicYear: '2026-2027'
      }
    };
  });
  fs.writeFileSync(output, await report.buildBuffer(audits, {institution:'UPES', academicSession:'July - December 2026', academicYear:'2026-2027'}));
  console.log(`Created ${output} with ${audits.length} file dossiers.`);
}

main().catch(error => { console.error(error); process.exitCode = 1; });
