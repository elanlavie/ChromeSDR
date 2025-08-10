let device;
let dataChunks = [];
let capturing = false;

const connectBtn = document.getElementById('connectBtn');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const uploadBtn = document.getElementById('uploadBtn');
const statusDiv = document.getElementById('status');

connectBtn.onclick = async () => {
  try {
    device = await navigator.usb.requestDevice({
      filters: [
        { vendorId: 0x0bda, productId: 0x2838 }, // common for v4
        { vendorId: 0x0bda, productId: 0x2832 }, // some variants
        { vendorId: 0x0bda }                      // fallback: any Realtek
      ]
    });
    await device.open();
    statusDiv.textContent = 'Status: RTL-SDR connected';
    startBtn.disabled = false;
  } catch (e) {
    statusDiv.textContent = 'Status: Failed to connect: ' + e;
  }
};

startBtn.onclick = async () => {
  if (!device) return;
  try {
    // Claim interface 0 by default (may need to adjust for your RTL-SDR)
    await device.selectConfiguration(1);
    await device.claimInterface(0);
    capturing = true;
    dataChunks = [];
    statusDiv.textContent = 'Status: Capturing data...';
    startBtn.disabled = true;
    stopBtn.disabled = false;
    uploadBtn.disabled = true;
    // Simple proof-of-concept: read a few chunks (not real IQ stream)
    for (let i = 0; i < 10 && capturing; i++) {
      const result = await device.transferIn(1, 512); // endpoint 1, 512 bytes
      if (result && result.data) {
        dataChunks.push(new Uint8Array(result.data.buffer));
      }
    }
    statusDiv.textContent = 'Status: Capture complete';
    stopBtn.disabled = true;
    uploadBtn.disabled = false;
  } catch (e) {
    statusDiv.textContent = 'Status: Capture error: ' + e;
    capturing = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    uploadBtn.disabled = true;
  }
};

stopBtn.onclick = () => {
  capturing = false;
  stopBtn.disabled = true;
  startBtn.disabled = false;
  statusDiv.textContent = 'Status: Capture stopped';
};

uploadBtn.onclick = async () => {
  if (dataChunks.length === 0) {
    statusDiv.textContent = 'Status: No data to upload';
    return;
  }
  statusDiv.textContent = 'Status: Uploading...';
  const blob = new Blob(dataChunks);
  const formData = new FormData();
  formData.append('file', blob, 'rtlsdr_capture.bin');
  try {
    // Change URL to your Hetzner server endpoint
    const response = await fetch('http://157.180.43.9/upload', {
      method: 'POST',
      body: formData
    });
    if (response.ok) {
      statusDiv.textContent = 'Status: Upload successful!';
    } else {
      statusDiv.textContent = 'Status: Upload failed: ' + response.statusText;
    }
  } catch (e) {
    statusDiv.textContent = 'Status: Upload error: ' + e;
  }
};
