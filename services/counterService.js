const Certificate = require('../models/Certificate');

async function generateCertificateNumber(courseCode) {
  const prefix = 'USH';
  const year = new Date().getFullYear();
  
  // Count certificates issued in the current year for sequence
  const startOfYear = new Date(year, 0, 1);
  const count = await Certificate.countDocuments({
    issueDate: { $gte: startOfYear }
  });
  
  const number = (count + 1).toString().padStart(6, '0'); // 000001
  return `${prefix}-${year}-${courseCode.toUpperCase()}-${number}`;
}

module.exports = { generateCertificateNumber };