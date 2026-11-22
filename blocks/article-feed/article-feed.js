function insertRowsAsDocTable() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();

  const jsonUrl = 'https://main--aemlocalproject--pritimohadikar91.aem.page/query-index.json';
  const response = UrlFetchApp.fetch(jsonUrl);
  const parsed = JSON.parse(response.getContentText());
  const rows = Array.isArray(parsed) ? parsed : (parsed.data || []);

  if (!rows.length) {
    body.appendParagraph('No rows found.');
    return;
  }

  const headers = ['path', 'title', 'description', 'image', 'lastModified'];
  const tableData = [
    headers,
    ...rows.map((item) => headers.map((col) => String(item[col] ?? ''))),
  ];

  body.appendParagraph('Spreadsheet Rows').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  const table = body.appendTable(tableData);

  // Bold header row for readability
  const headerRow = table.getRow(0);
  for (let i = 0; i < headerRow.getNumCells(); i += 1) {
    headerRow.getCell(i).editAsText().setBold(true);
  }

  doc.saveAndClose();
}