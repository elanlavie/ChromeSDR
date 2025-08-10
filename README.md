# RTL-SDR Chrome Uploader MVP

This MVP allows students to connect an RTL-SDR USB device to a Chromebook via a Chrome extension, capture raw SDR data, and upload it to a remote server for processing with GNU Radio Companion.

## Project Structure

- `extension/`: Chrome extension code (Manifest V3, WebUSB, UI)
- `server/`: Python Flask server to receive SDR data uploads

---

## 1. Chrome Extension Setup

1. Open Chrome and go to `chrome://extensions/`.
2. Enable "Developer mode" (top right).
3. Click "Load unpacked" and select the `extension/` folder.
4. The extension will appear in your toolbar.

### Usage
- Click the extension icon.
- Click "Connect RTL-SDR" and select your RTL-SDR device.
- Click "Start Capture" to read a few chunks of SDR data (proof-of-concept).
- Click "Stop Capture" if needed.
- Click "Upload Data" to send the captured data to the server.

> Note: For a full IQ stream, further development is needed. This MVP reads a small amount of data for demonstration.

---

## 2. Server Setup (Hetzner or Local)

1. Install Python 3.8+.
2. Install Flask:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   python app.py
   ```
4. The server listens on port 5000 by default and saves uploads to the `uploads/` directory.

---

## 3. Using Uploaded Data in GNU Radio Companion

- After uploading, the SDR data file will be saved in the `uploads/` folder on your server.
- Open GNU Radio Companion (GRC) on your server.
- Use a "File Source" block in your flow graph to read the uploaded file (e.g., `rtlsdr_capture.bin`).
- Build and run your flow graph as desired.

---

## 4. Customizing for Production
- Update the upload URL in `popup.js` to match your Hetzner server's public address.
- For full IQ streaming, further development is needed to implement the full RTL-SDR protocol over WebUSB.
- Secure the server endpoint as needed for your deployment.

---

## Credits
- Chrome extension uses the WebUSB API (see Chrome and MDN docs).
- Flask server for simple file uploads.
