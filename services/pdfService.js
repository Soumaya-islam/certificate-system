const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function generateCertificatePDF(data) {
  const { studentName, courseName, certificateNumber, issueDate, qrDataUrl } = data;

  const pdfDoc = await PDFDocument.create();
  
  const templatePath = path.join(__dirname, '../assets/certificate-template.jpg');
  const templateImageBytes = fs.readFileSync(templatePath);
  const templateImage = await pdfDoc.embedJpg(templateImageBytes);

  const pageWidth = templateImage.width;
  const pageHeight = templateImage.height;
  const page = pdfDoc.addPage([pageWidth, pageHeight]);

  // 1. Draw the JPG template
  page.drawImage(templateImage, {
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
  });

  const font = await pdfDoc.embedFont('Helvetica');
  const boldFont = await pdfDoc.embedFont('Helvetica-Bold');

  // 2. Coordinates for dynamic fields (Adjust these based on your image's exact X,Y pixels!)
  // To test: Open image in Paint, hover over the spot, note X,Y at bottom.
  // PDF Y coordinate = ImageHeight - PaintY
  
  // Certificate ID (Top Center)
  page.drawText(`Certificate ID: ${certificateNumber}`, {
    x: pageWidth / 2 - 80, // Center offset
    y: pageHeight - 80,    // 80 pixels from top
    size: 18,
    font: font,
    color: rgb(0, 0, 0),
  });

  // Issue Date (Top Center, slightly below ID)
  const dateStr = new Date(issueDate).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  page.drawText(`Issue Date: ${dateStr}`, {
    x: pageWidth / 2 - 80,
    y: pageHeight - 110,
    size: 18,
    font: font,
    color: rgb(0, 0, 0),
  });

  // STUDENT NAME (Middle Center, Large Text)
  page.drawText(studentName.toUpperCase(), {
    x: pageWidth / 2 - 100,
    y: pageHeight - 450, // Adjust based on your template
    size: 38,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  // PROGRAM NAME (Inside the paragraph text)
  page.drawText(courseName, {
    x: pageWidth / 2 - 150, // Positioned at the placeholder in the text block
    y: pageHeight - 530,    // Adjust Y to align with paragraph
    size: 16,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  // QR CODE (Bottom Center / Replacing the central logo circle)
  try {
    const qrBytes = Buffer.from(qrDataUrl.split(',')[1], 'base64');
    const qrImage = await pdfDoc.embedPng(qrBytes);
    page.drawImage(qrImage, {
      x: pageWidth / 2 - 80, // Centers it
      y: 120,                // 120 pixels from bottom
      width: 160,
      height: 160,
    });
  } catch (err) {
    console.warn('⚠️ QR Code skipped');
  }

  return Buffer.from(await pdfDoc.save());
}

module.exports = { generateCertificatePDF };