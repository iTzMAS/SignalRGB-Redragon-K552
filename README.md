# ⌨️ Redragon K552- SignalRGB Plugin

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Platform: SignalRGB](https://img.shields.io/badge/Platform-SignalRGB-orange.svg)
![Status: Stable](https://img.shields.io/badge/Status-Stable-green.svg)

<p align="center">
  <img src="preview3.gif" alt="Redragon K557 Kala SignalRGB Animation" width="600">
</p>


This repository contains a high-performance JavaScript plugin developed to integrate the **Redragon K557 Kala V2** mechanical keyboard with **SignalRGB** software.

It addresses common issues found in generic drivers, such as incorrect mapping, LED ghosting, and misplaced Numpad keys.

## 🚀 Features

* **Precise 1:1 Mapping:** All keys, including the Numpad and media keys, are mapped to their correct physical positions.
* **Matrix Correction:** Solves the Redragon controller's "8-byte jump" logic, ensuring wave/visor effects flow perfectly from left to right without skipping keys.
* **High Performance (60 FPS):** Optimized code with coordinate pre-calculation and efficient memory management (Zero-Allocation Loop). Near-zero CPU usage during rendering.
* **Visual Layout:** Includes support for displaying the keyboard image within SignalRGB devices tab.
* **Hybrid Modes:** Supports "Canvas" mode (screen capture effects) and "Forced" mode (static single color).

## 📦 Automatic Installation (Recommended)

1.  Open SignalRGB.
2.  Go to Settings > Addons.
3.  Click the **+ Add-on** button.
4.  Paste the following URL: `https://github.com/vinemelo/SignalRGB-Redragon-K557-Kala-V2`
5.  Restart SignalRGB or go to **Devices** and click **Reload Plugins**
6.  The plugin will be automatically synced and updated.
7.  The keyboard should appear automatically in the **Devices** tab as **Redragon K557 Kala V2**.

## 📦 Manual Installation

1.  Download the `Redragon-K557-Kala-V2.js` file from this repository.
2.  Navigate to your SignalRGB plugins folder in Documents:
    * `C:\Users\YOUR_USER\Documents\WhirlwindFX\Plugins`
3.  Paste the `.js` file into this folder.
4.  Restart SignalRGB or go to **Devices** and click **Reload plugins**.
5.  The keyboard should appear automatically in the **Devices** tab as **Redragon K557 Kala V2**.

## 🔧 Technical Details

The K557 controller uses a specific protocol where LEDs are addressed in vertical columns with memory address jumps. This plugin implements:

* **Matrix Reverse Engineering:** Translates logical IDs (0-126) to Cartesian coordinates (X, Y) on the SignalRGB Canvas.
* **USB Protocol:** Handles 64-byte packets with real-time checksum calculation.
* **Optimized Buffer:** Uses static arrays to prevent constant JavaScript Garbage Collector triggering, ensuring smooth animations.

## 🤝 Contribution

Feel free to open **Issues** if you encounter bugs or want to suggest improvements. The goal is to keep this plugin as lightweight and compatible as possible.


Este projeto está licenciado sob a Licença MIT - consulte o ficheiro [LICENSE](LICENSE) para mais detalhes.

---
**Developed by / Desenvolvido por:** vinemelo  
