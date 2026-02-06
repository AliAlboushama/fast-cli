# Fast-CLI Premium 🚀

> A robust, professional command-line tool to test your internet speed using [fast.com](https://fast.com).

[![Build Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Node Version](https://img.shields.io/badge/node-%3E%3D20-blue.svg)]()

<div align="center">
    <img src="https://vault.secretdata.org/f/0fe6f3a1c995facc/Screenshot_805.png?v=16" alt="Fast-CLI Premium Web Dashboard" width="800">
    <p><i>Experience sleek, real-time analytics with the new Premium Web Dashboard.</i></p>
</div>

---

## ✨ Features

- ⚡ **High Accuracy**: Powered by Netflix's Fast.com infrastructure.
- 🎨 **Premium UI**: Experience a sleek Discord-inspired interactive web dashboard.
- 📊 **Real-time Metrics**: Track Download, Upload, Latency, and Data Transferred.
- 🛠️ **Professional Toolkit**: JSON output, Verbose metadata, and timeout controls.
- 🛡️ **Fail-Safe**: Built-in watchdog for stuck tests and automatic retry mechanism.

---

## 📦 Install

Ensure you have [Node.js](https://nodejs.org) 20+ installed.

```bash
npm install --global fast-cli
```

*Note: This project uses Puppeteer. If you encounter issues, please check the [troubleshooting guide](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md).*

---

## 🚀 Usage

### 🖥️ CLI Quick Start
Run the basic speed test directly in your terminal:
```bash
fast
```

### 🌐 Premium Dashboard (GUI)
Launch the interactive web-based dashboard:
```bash
fast --gui
```

### ⏱️ Timed Test
Get a reading in a specific amount of time (e.g., 10 seconds):
```bash
fast --timeout 10
```

---

## ⚙️ Commands & Options

| Command | Description |
| :--- | :--- |
| `fast` | Standard terminal test (Download only). |
| `--gui` | Opens the premium browser-based dashboard. |
| `--upload, -u` | Include Upload speed in terminal measurement. |
| `--verbose` | Show detailed latency, IP, and server info. |
| `--timeout, -t` | Set a max runtime for the test in seconds. |
| `--json` | Output machine-readable JSON data. |
| `--single-line` | Compact output for automation/scripts. |

---

## 📖 Examples

### Professional Metadata
Get a deep-dive into your connection health:
```bash
fast --verbose
```
```text
72 Mbps
8 Mbps

Latency: 8 ms (unloaded) / 16 ms (loaded)
Client: Helsinki, FI • 84.251.53.175
```

### Machine Readable (JSON)
Perfect for logs or custom dashboards:
```bash
fast --upload --json
```

```json
{
  "downloadSpeed": 970,
  "uploadSpeed": 450,
  "downloadUnit": "Mbps",
  "uploadUnit": "Mbps",
  "downloaded": 810,
  "uploaded": 420,
  "latency": 1,
  "userLocation": "Helsinki, FI",
  "userIp": "84.251.53.175"
}
```

---

## 🛠️ Related
- [speed-test](https://github.com/sindresorhus/speed-test) - Speedtest.net powered CLI.

---

<p align="center">
  Developed with ❤️ for the community.
</p>
