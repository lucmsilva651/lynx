const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');

const downloadDir = path.resolve(__dirname, 'yt-dlp');

const urls = {
  win32: 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe',
  darwin: 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos',
};

function getDownloadUrl() {
  const platform = os.platform();
  return urls[platform];
};

async function downloadYtDlp() {
  if (os.platform() === 'linux') {
    console.log('Skipping yt-dlp download on Linux. It should be installed via pip.');
    return;
  }

  const url = getDownloadUrl();
  if (!url) {
    console.error('Unsupported platform for yt-dlp download.');
    return;
  }

  const fileName = url.split('/').pop();
  const filePath = path.join(downloadDir, fileName);

  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  };

  if (!fs.existsSync(filePath)) {
    try {
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
      });

      const writer = fs.createWriteStream(filePath);

      response.data.pipe(writer);

      writer.on('finish', () => {
        if (os.platform() !== 'win32') {
          fs.chmodSync(filePath, '-x');
        }
      });

      writer.on('error', (err) => {
        console.error('WARN: yt-dlp download failed:', err);
      });
    } catch (err) {
      console.error('WARN: yt-dlp download failed:', err.message);
    };
  };
};

downloadYtDlp();