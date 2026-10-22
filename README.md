# PhantomFrame
<!-- VICTORIAN-MOURNING-GALLERY -->

<p align="center">
  <strong>THE MOURNING GALLERY</strong><br />
  <em>Victorian veils · Renaissance shadows · antique oil portraits</em>
</p>

<p align="center">
  <a href="https://commons.wikimedia.org/wiki/Special:FilePath/Jacob_Adriaensz_Backer_-_Tronie_of_a_woman_with_a_black_veil,_l19038-b3vt9-1.jpg"><img src="https://commons.wikimedia.org/wiki/Special:FilePath/Jacob_Adriaensz_Backer_-_Tronie_of_a_woman_with_a_black_veil,_l19038-b3vt9-1.jpg" alt="A woman in a black veil" width="30%" /></a>
  <a href="https://commons.wikimedia.org/wiki/Special:FilePath/Malarz_francuski_XIX_wiek_-_Portrait_of_a_woman_with_a_veil_-_M.Ob.1273_MNW_-_National_Museum_in_Warsaw.jpg"><img src="https://commons.wikimedia.org/wiki/Special:FilePath/Malarz_francuski_XIX_wiek_-_Portrait_of_a_woman_with_a_veil_-_M.Ob.1273_MNW_-_National_Museum_in_Warsaw.jpg" alt="Portrait of a woman with a veil" width="30%" /></a>
  <a href="https://commons.wikimedia.org/wiki/Special:FilePath/Boldini_-_lady-with-a-black-hat.jpg"><img src="https://commons.wikimedia.org/wiki/Special:FilePath/Boldini_-_lady-with-a-black-hat.jpg" alt="Lady in a black hat and veil" width="30%" /></a>
</p>

---
<!-- /VICTORIAN-MOURNING-GALLERY -->


> **Advanced LSB Steganography & Encryption Platform**

PhantomFrame is a browser-based steganography tool that hides secret messages and files inside images using **Least Significant Bit (LSB)** encoding with optional **password-based encryption**.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🖼️ **LSB Encoding** | Hides data in the 3 least significant bits (RGB channels) |
| 🔐 **Password Protection** | XOR encryption layer with PBKDF2 key derivation |
| 📝 **Text & File Support** | Hide messages or any binary file type |
| 📊 **Visual Analysis** | LSB plane viewer, histogram comparison, bit distribution |
| 🎯 **Real-time Capacity** | Live byte counter with efficiency meter |
| 📁 **Drag & Drop** | Modern UX with intuitive file handling |
| 🌐 **Zero Dependencies** | Pure HTML5 Canvas + Vanilla JavaScript |
| 🔒 **Client-side Only** | No server, no data leaves your browser |

---

## 🏗️ Project Structure

```
PhantomFrame/
├── 📄 README.md              # Project documentation
├── 📄 PROJECT.md             # Detailed technical specification
├── 📄 index.html             # Main application entry point
├── 📁 assets/
│   ├── css/
│   │   └── phantom.css       # Core styles & themes
│   ├── js/
│   │   └── phantom.js        # Main application logic
│   └── images/
│       └── logo.svg          # Project branding
├── 📁 src/
│   ├── core/
│   │   ├── steganography.js  # LSB encode/decode engine
│   │   └── crypto.js         # Encryption/decryption module
│   ├── ui/
│   │   ├── components.js     # Reusable UI components
│   │   └── animations.js     # Visual effects & transitions
│   └── utils/
│       ├── fileHandler.js    # File I/O utilities
│       └── imageProcessor.js # Canvas & image manipulation
├── 📁 docs/
│   ├── ARCHITECTURE.md       # System architecture
│   ├── API.md                # Internal API reference
│   └── EXPO_GUIDE.md         # Presentation手に presentation guide for judges
└── 📁 demo/
    └── sample-images/        # Demo images for testing
```

---

## 🚀 Quick Start

1. **Clone or download** the project
2. **Open** `index.html` in any modern browser
3. **Drag & drop** a PNG/BMP image into the Encode panel
4. **Type** a secret message or upload a file
5. **Click** "Hide Data" and download your stego image
6. **Use** the Decode panel to extract hidden data later

---

## 🧠 How It Works

### LSB Encoding Process

```
Original Pixel:  [R: 10101100] [G: 11010011] [B: 00111101]
Secret Byte:      0 1 1 0 1 0 0 1
                  ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓
Modified Pixel:   [R: 10101100] [G: 11010011] [B: 00111101]
                      ↑     ↑     ↑     ↑     ↑     ↑
                    LSBs replaced with secret bits
```

### Data Format

```
[4 bytes: payload length] + [N bytes: encrypted payload] + [padding]
```

---

## 🛡️ Security Notes

- **Use PNG/BMP only** — JPEG compression destroys hidden data
- **Password is optional** — without it, data is hidden but not encrypted
- **XOR encryption** is lightweight; for production, upgrade to AES-GCM
- **Stego images** are statistically detectable by advanced analysis

---

## 📊 Capacity Calculator

| Image Size | Max Text | Max File |
|------------|----------|----------|
| 800x600    | ~180 KB  | ~180 KB  |
| 1920x1080  | ~778 KB  | ~778 KB  |
| 4K (3840x2160) | ~3.1 MB | ~3.1 MB |

---

## 🎓 For Project Expo

- **Category**: Cybersecurity / Information Hiding
- **Concept**: Demonstrates difference between **cryptography** (hides content) and **steganography** (hides existence)
- **Live Demo**: Encode a message → show judges the image looks identical → decode to reveal secret

---

## 👨‍💻 Author

David

---

## 📜 License

MIT License — Free for educational and personal use.
