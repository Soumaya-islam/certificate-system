/* services/qrService.js */
const QRCode = require('qrcode');
require('dotenv').config();

/**
 * Generates a QR code data URL for a given certificate number.
 * The QR code will point to the public verification page.
 * 
 * @param {string} certificateNumber - The unique ID of the certificate.
 * @returns {Promise<string>} - A base64 data URL string of the QR code image.
 */
async function generateQR(certificateNumber) {
  // 1. Determine the base URL (Use environment variable or default to localhost:5000)
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
  
  // 2. Construct the full verification URL pointing to your verify.html page
  // The frontend JavaScript on verify.html will grab the 'code' parameter from the URL
  const verifyUrl = `${baseUrl}/verify.html?code=${certificateNumber}`;

  // 3. Generate the QR code as a Data URL (PNG format)
  try {
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      errorCorrectionLevel: 'H', // High error correction (allows for logos/overlays if added later)
      margin: 1,                 // Minimal margin
      width: 300                 // High resolution for printing on certificates
    });
    
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

module.exports = { generateQR };