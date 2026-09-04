import jsPDF from 'jspdf';

function formatPercent(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return 'N/A';
  }

  return `${(number * 100).toFixed(2)}%`;
}

function formatDate() {
  return new Date().toLocaleString();
}

function safe(value, fallback = 'N/A') {
  return value === undefined || value === null || value === ''
    ? fallback
    : String(value);
}

function addPageNumber(doc, pageNumber) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFontSize(8);
  doc.setTextColor(130, 138, 150);

  doc.text(
    `VoxShield · Voice Security Intelligence`,
    18,
    pageHeight - 10
  );

  doc.text(
    `Page ${pageNumber}`,
    pageWidth - 18,
    pageHeight - 10,
    { align: 'right' }
  );
}

function addSectionTitle(doc, title, y) {
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setDrawColor(220, 225, 232);
  doc.line(18, y - 5, pageWidth - 18, y - 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(25, 32, 42);
  doc.text(title, 18, y + 5);

  return y + 16;
}

function addLabelValue(doc, label, value, x, y, width = 80) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(90, 98, 110);
  doc.text(label, x, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(30, 36, 45);

  const lines = doc.splitTextToSize(
    safe(value),
    width
  );

  doc.text(lines, x, y + 7);

  return y + Math.max(16, lines.length * 5 + 5);
}

function addWrappedText(doc, text, x, y, width, fontSize = 10) {
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSize);
  doc.setTextColor(55, 62, 72);

  const lines = doc.splitTextToSize(
    safe(text),
    width
  );

  doc.text(lines, x, y);

  return y + lines.length * (fontSize * 0.5 + 3);
}

function ensureSpace(doc, y, required = 30) {
  const pageHeight = doc.internal.pageSize.getHeight();

  if (y + required > pageHeight - 20) {
    doc.addPage();
    return 22;
  }

  return y;
}

function drawVerdictBox(doc, result, y) {
  const pageWidth = doc.internal.pageSize.getWidth();

  const prediction =
    String(result.prediction || '').toUpperCase();

  const isSpoof = prediction === 'SPOOF';

  const boxHeight = 48;

  if (isSpoof) {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(248, 113, 113);
  } else {
    doc.setFillColor(240, 253, 250);
    doc.setDrawColor(52, 211, 153);
  }

  doc.roundedRect(
    18,
    y,
    pageWidth - 36,
    boxHeight,
    4,
    4,
    'FD'
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(
    isSpoof ? 185 : 5,
    isSpoof ? 28 : 150,
    isSpoof ? 28 : 105
  );

  doc.text(
    'AUTHENTICITY VERDICT',
    28,
    y + 12
  );

  doc.setFontSize(22);
  doc.setTextColor(
    isSpoof ? 185 : 5,
    isSpoof ? 28 : 150,
    isSpoof ? 28 : 105
  );

  doc.text(
    prediction || 'UNKNOWN',
    28,
    y + 31
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(90, 98, 110);

  doc.text(
    `Risk level: ${safe(result.risk_level, 'N/A')}`,
    pageWidth - 28,
    y + 15,
    { align: 'right' }
  );

  doc.text(
    `Spoof probability: ${formatPercent(result.spoof_probability)}`,
    pageWidth - 28,
    y + 28,
    { align: 'right' }
  );

  return y + boxHeight + 14;
}

function drawProbabilityBar(doc, label, value, y) {
  const pageWidth = doc.internal.pageSize.getWidth();

  const barX = 18;
  const barY = y + 6;
  const barWidth = pageWidth - 36;
  const barHeight = 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(60, 68, 78);

  doc.text(label, barX, y);

  doc.setFont('helvetica', 'normal');
  doc.text(
    formatPercent(value),
    pageWidth - 18,
    y,
    { align: 'right' }
  );

  doc.setFillColor(235, 238, 242);

  doc.roundedRect(
    barX,
    barY,
    barWidth,
    barHeight,
    2,
    2,
    'F'
  );

  const percentage = Math.max(
    0,
    Math.min(1, Number(value) || 0)
  );

  doc.setFillColor(16, 185, 129);

  doc.roundedRect(
    barX,
    barY,
    barWidth * percentage,
    barHeight,
    2,
    2,
    'F'
  );

  return y + 19;
}

export function exportAnalysisReport(result) {
  if (!result) {
    throw new Error('No analysis result is available for export.');
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  let y = 22;

  /*
   * =========================================================
   * HEADER
   * =========================================================
   */

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42);
  doc.text('VOXSHIELD', 18, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 108, 120);

  doc.text(
    'VOICE SECURITY INTELLIGENCE',
    18,
    y + 6
  );

  doc.text(
    formatDate(),
    pageWidth - 18,
    y,
    { align: 'right' }
  );

  y += 24;

  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(1.2);
  doc.line(18, y, pageWidth - 18, y);

  y += 14;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(20, 27, 38);
  doc.text('Voice Authenticity Analysis Report', 18, y);

  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 108, 120);

  doc.text(
    'AI-assisted analysis of synthetic speech and voice impersonation risk.',
    18,
    y
  );

  y += 16;

  /*
   * =========================================================
   * VERDICT
   * =========================================================
   */

  y = addSectionTitle(
    doc,
    '1. Analysis Verdict',
    y
  );

  y = drawVerdictBox(doc, result, y);

  /*
   * =========================================================
   * FILE / ANALYSIS INFORMATION
   * =========================================================
   */

  y = addSectionTitle(
    doc,
    '2. Analysis Information',
    y
  );

  y = addLabelValue(
    doc,
    'Audio file',
    result.fileName || result.filename,
    18,
    y,
    75
  );

  y = addLabelValue(
    doc,
    'Windows analyzed',
    result.windows_analyzed,
    110,
    y - 16,
    55
  );

  y = addLabelValue(
    doc,
    'Prediction',
    result.prediction,
    18,
    y
  );

  y = addLabelValue(
    doc,
    'Risk level',
    result.risk_level,
    110,
    y - 16,
    55
  );

  y += 2;

  /*
   * =========================================================
   * PROBABILITIES
   * =========================================================
   */

  y = ensureSpace(doc, y, 65);

  y = addSectionTitle(
    doc,
    '3. Detection Confidence',
    y
  );

  y = drawProbabilityBar(
    doc,
    'Synthetic / spoof probability',
    result.spoof_probability,
    y
  );

  y = drawProbabilityBar(
    doc,
    'Real / bona fide probability',
    result.real_probability,
    y
  );

  y += 8;

  /*
   * =========================================================
   * SECURITY ASSESSMENT
   * =========================================================
   */

  y = ensureSpace(doc, y, 70);

  y = addSectionTitle(
    doc,
    '4. Security Assessment',
    y
  );

  const prediction =
    String(result.prediction || '').toUpperCase();

  let assessment;

  if (prediction === 'SPOOF') {
    assessment =
      'The detection model found evidence consistent with synthetic or manipulated speech. The interaction should be treated as potentially impersonated. The result should not be used as the sole basis for a high-impact decision.';
  } else {
    assessment =
      'The detection model found stronger evidence consistent with genuine speech. This does not guarantee speaker identity or eliminate the possibility of other forms of fraud.';
  }

  y = addWrappedText(
    doc,
    assessment,
    18,
    y,
    pageWidth - 36,
    10
  );

  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(35, 42, 52);

  doc.text(
    'Recommended action',
    18,
    y
  );

  y += 7;

  y = addWrappedText(
    doc,
    result.recommendation,
    18,
    y,
    pageWidth - 36,
    10
  );

  /*
   * =========================================================
   * WINDOW ANALYSIS
   * =========================================================
   */

  if (
    Array.isArray(result.windows) &&
    result.windows.length > 0
  ) {
    y += 12;

    y = ensureSpace(doc, y, 65);

    y = addSectionTitle(
      doc,
      '5. Window-by-Window Detection',
      y
    );

    const tableX = 18;
    const tableWidth = pageWidth - 36;

    const col1 = tableX;
    const col2 = tableX + 38;
    const col3 = tableX + 91;

    doc.setFillColor(245, 247, 249);
    doc.rect(
      tableX,
      y,
      tableWidth,
      9,
      'F'
    );

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(75, 82, 92);

    doc.text('Window', col1 + 3, y + 6);
    doc.text('Spoof probability', col2 + 3, y + 6);
    doc.text('Real probability', col3 + 3, y + 6);

    y += 12;

    result.windows.forEach((windowResult, index) => {
      y = ensureSpace(doc, y, 14);

      if (index % 2 === 0) {
        doc.setFillColor(250, 251, 252);

        doc.rect(
          tableX,
          y - 4,
          tableWidth,
          8,
          'F'
        );
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(45, 52, 62);

      doc.text(
        safe(windowResult.window, index + 1),
        col1 + 3,
        y
      );

      doc.text(
        formatPercent(windowResult.fake_probability),
        col2 + 3,
        y
      );

      doc.text(
        formatPercent(windowResult.real_probability),
        col3 + 3,
        y
      );

      y += 9;
    });
  }

  /*
   * =========================================================
   * TECHNICAL DETAILS
   * =========================================================
   */

  y += 8;

  y = ensureSpace(doc, y, 90);

  y = addSectionTitle(
    doc,
    '6. Technical Details',
    y
  );

  const technicalDetails = [
    ['System', 'VoxShield Voice Security Intelligence'],
    ['Analysis type', 'Voice authenticity / synthetic speech detection'],
    ['Input', 'Audio recording'],
    ['Sampling rate', '16 kHz mono processing'],
    ['Analysis strategy', 'Overlapping multi-window inference'],
    ['Detection model', 'Wav2Vec2-based deepfake voice detector'],
    ['Decision output', 'REAL or SPOOF'],
    ['Risk output', 'LOW / SUSPICIOUS / HIGH / CRITICAL'],
  ];

  technicalDetails.forEach(([label, value]) => {
    y = ensureSpace(doc, y, 13);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(90, 98, 110);

    doc.text(label, 18, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(45, 52, 62);

    doc.text(
      value,
      70,
      y
    );

    y += 9;
  });

  /*
   * =========================================================
   * RAW JSON
   * =========================================================
   */

  y += 8;

  y = ensureSpace(doc, y, 55);

  y = addSectionTitle(
    doc,
    '7. Raw Analysis Data',
    y
  );

  const rawJson = JSON.stringify(
    result,
    null,
    2
  );

  doc.setFont('courier', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(55, 62, 72);

  const jsonLines = rawJson.split('\n');

  jsonLines.forEach((line) => {
    y = ensureSpace(doc, y, 8);

    const wrapped = doc.splitTextToSize(
      line,
      pageWidth - 36
    );

    wrapped.forEach((wrappedLine) => {
      y = ensureSpace(doc, y, 6);

      doc.text(
        wrappedLine,
        18,
        y
      );

      y += 3.8;
    });
  });

  /*
   * =========================================================
   * FINAL NOTE
   * =========================================================
   */

  y += 8;

  y = ensureSpace(doc, y, 35);

  doc.setDrawColor(220, 225, 232);
  doc.line(
    18,
    y,
    pageWidth - 18,
    y
  );

  y += 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(40, 48, 58);

  doc.text(
    'Important',
    18,
    y
  );

  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 108, 120);

  const note =
    'This report represents the output of an AI-assisted voice authenticity detector. Detection probability is not proof of speaker identity and should be combined with independent verification for sensitive decisions.';

  const noteLines = doc.splitTextToSize(
    note,
    pageWidth - 36
  );

  doc.text(
    noteLines,
    18,
    y
  );

  /*
   * =========================================================
   * PAGE NUMBERS
   * =========================================================
   */

  const pageCount =
    doc.internal.getNumberOfPages();

  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page);
    addPageNumber(doc, page);
  }

  /*
   * =========================================================
   * DOWNLOAD
   * =========================================================
   */

  const originalName =
    result.fileName ||
    result.filename ||
    'voice-analysis';

  const cleanName = originalName
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-z0-9-_]/gi, '_');

  doc.save(
    `VoxShield_${cleanName}_Report.pdf`
  );
}