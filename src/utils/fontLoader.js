import { loadNepaliFont } from '../utils/fontLoader';

// In the exportToPDF function:
if (exportLanguage === 'ne') {
  const fontLoaded = loadNepaliFont(pdf);
  pdf.setFont(fontLoaded ? 'NepaliFont' : 'helvetica');
}
