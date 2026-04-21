# 2. PROJECT.md - Detailed Technical Specification
project_md = """# 📋 PhantomFrame — Technical Specification

## 1. Project Overview

**Name:** PhantomFrame  
**Version:** 1.0.0  
**Type:** Browser-based Steganography Tool  
**Stack:** HTML5, CSS3, JavaScript (ES6+), Canvas API, Web Crypto API  

---

## 2. Architecture

### 2.1 System Diagram

```
┌─────────────────────────────────────────┐
│           User Interface Layer          │
│  ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │  Encode  │ │  Decode  │ │ Analyze│ │
│  │  Panel   │ │  Panel   │ │  Panel │ │
│  └────┬─────┘ └────┬─────┘ └───┬────┘ │
│       └─────────────┴───────────┘       │
│              Event Bus                  │
└─────────────────────────────────────────┘
                   │
┌─────────────────────────────────────────┐
│         Application Logic Layer         │
│  ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ File     │ │ Image    │ │ Crypto │ │
│  │ Handler  │ │ Processor│ │ Engine │ │
│  └────┬─────┘ └────┬─────┘ └───┬────┘ │
│       └─────────────┴───────────┘       │
└─────────────────────────────────────────┘
                   │
┌─────────────────────────────────────────┐
│           Core Engine Layer             │
│  ┌───────────────────────────────────┐  │
│  │      Steganography Engine         │  │
│  │  • LSB Encoder/Decoder           │  │
│  │  • Bit Stream Manager              │  │
│  │  • Capacity Calculator           │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 2.2 Module Breakdown

| Module | File | Responsibility |
|--------|------|----------------|
| **Steganography** | `src/core/steganography.js` | LSB encode/decode algorithms |
| **Crypto** | `src/core/crypto.js` | Password-based encryption |
| **File Handler** | `src/utils/fileHandler.js` | Drag-drop, read, download |
| **Image Processor** | `src/utils/imageProcessor.js` | Canvas operations, format conversion |
| **UI Components** | `src/ui/components.js` | Panels, alerts, progress bars |
| **Animations** | `src/ui/animations.js` | Transitions, visual effects |

---

## 3. Data Flow

### 3.1 Encoding Flow

```
User Input
    │
    ▼
┌─────────────┐
│ Cover Image │ ──► Canvas API ──► ImageData (RGBA array)
└─────────────┘
    │
    ▼
┌─────────────┐
│ Secret Data │ ──► TextEncoder / FileReader ──► Uint8Array
└─────────────┘
    │
    ▼
┌─────────────┐     ┌─────────────┐
│  Password?  │ ──► │ XOR Encrypt │ ──► Encrypted Payload
└─────────────┘     └─────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ 4-byte Length Header + Payload  │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│ LSB Injection (RGB channels)    │
│ For each bit:                   │
│   pixel[channel] = (pixel & FE) │
│                    OR bit        │
└─────────────────────────────────┘
    │
    ▼
┌─────────────┐
│ Stego Image │ ──► Canvas.toBlob() ──► PNG Download
└─────────────┘
```

### 3.2 Decoding Flow

```
Stego Image
    │
    ▼
Canvas API ──► ImageData
    │
    ▼
Extract LSBs from RGB channels
    │
    ▼
Reconstruct bytes from bit stream
    │
    ▼
Read 4-byte length header
    │
    ▼
Extract N-byte payload
    │
    ▼
┌─────────────┐
│  Password?  │ ──► XOR Decrypt
└─────────────┘
    │
    ▼
Output: Text or Binary File
```

---

## 4. Technical Specifications

### 4.1 LSB Algorithm

**Input:** Cover ImageData, Payload Uint8Array  
**Output:** Modified ImageData  
**Capacity:** `floor(width × height × 3 / 8) - 4` bytes  

**Bit Allocation:**
- Channel 0 (Red):   bits 0, 3, 6
- Channel 1 (Green): bits 1, 4, 7
- Channel 2 (Blue):  bits 2, 5

**Header Format:**
```
Bytes 0-3:  uint32_be(payload_length)
Bytes 4-N:  payload_data
```

### 4.2 Encryption

**Algorithm:** XOR with password-derived key  
**Key Derivation:** Simple cyclic XOR (production: PBKDF2 + AES-GCM)  
**Security Level:** Obfuscation (not military-grade)  

---

## 5. UI/UX Design

### 5.1 Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#0f0c29` | Deep space background |
| `--bg-secondary` | `#302b63` | Panel backgrounds |
| `--accent-cyan` | `#00f2ff` | Primary actions, highlights |
| `--accent-green` | `#00ff88` | Success states, capacity |
| `--accent-magenta` | `#ff00ff` | Secondary actions, alerts |
| `--text-primary` | `#e0e0e0` | Main text |
| `--text-secondary` | `#a0a0a0` | Labels, hints |

### 5.2 Layout Grid

```
Desktop (≥968px):
┌─────────────────────────────────────────┐
│              Header (full)              │
├──────────────────┬────────────────────┤
│   Encode Panel   │   Decode Panel     │
│   (50%)          │   (50%)            │
├──────────────────┴────────────────────┤
│           Analysis Panel                │
│              (full)                     │
└─────────────────────────────────────────┘

Mobile (<968px):
┌─────────────────┐
│     Header      │
├─────────────────┤
│  Encode Panel   │
├─────────────────┤
│  Decode Panel   │
├─────────────────┤
│ Analysis Panel  │
└─────────────────┘
```

### 5.3 Component Hierarchy

```
App
├── Header
│   ├── Logo
│   ├── Title
│   └── Tech Badges
├── MainGrid (2-col)
│   ├── EncodePanel
│   │   ├── ModeTabs (Text | File)
│   │   ├── DropZone
│   │   ├── PreviewContainer
│   │   │   ├── OriginalPreview
│   │   │   └── ModifiedPreview
│   │   ├── InputArea (TextArea | FileInput)
│   │   ├── PasswordInput
│   │   ├── CapacityStats
│   │   │   ├── MaxCapacity
│   │   │   ├── UsedCapacity
│   │   │   └── Efficiency
│   │   ├── ProgressBar
│   │   ├── EncodeButton
│   │   └── DownloadSection
│   └── DecodePanel
│       ├── DropZone
│       ├── PreviewBox
│       ├── PasswordInput
│       ├── DecodeButton
│       └── ExtractedContent
└── AnalysisPanel
    ├── LSBVisualizer
    ├── HistogramChart
    └── BitDistribution
```

---

## 6. File Structure

```
PhantomFrame/
├── index.html              (15 KB)  ──► Entry point, loads all modules
├── assets/
│   ├── css/
│   │   └── phantom.css     (8 KB)   ──► Variables, layouts, animations
│   ├── js/
│   │   └── phantom.js      (12 KB)  ──► Main app controller
│   └── images/
│       └── logo.svg        (2 KB)   ──► PhantomFrame branding
├── src/
│   ├── core/
│   │   ├── steganography.js (4 KB)  ──► LSB engine
│   │   └── crypto.js        (3 KB)  ──► Encryption module
│   ├── ui/
│   │   ├── components.js    (5 KB)  ──► Reusable DOM builders
│   │   └── animations.js    (2 KB)  ──► CSS transitions
│   └── utils/
│       ├── fileHandler.js   (3 KB)  ──► File operations
│       └── imageProcessor.js (3 KB) ──► Canvas helpers
├── docs/
│   ├── ARCHITECTURE.md      (this file)
│   ├── API.md               ──► Function reference
│   └── EXPO_GUIDE.md        ──► Presentation tips
└── demo/
    └── sample-images/       ──► Test images
```

---

## 7. Performance Metrics

| Metric | Target | Notes |
|--------|--------|-------|
| Encode Time | <2s for 1MB | Depends on image size |
| Decode Time | <1s for 1MB | Linear scan |
| Memory Usage | ~3x image size | Original + Canvas + Output |
| Max Image Size | 4096x4096 | Browser memory limit |
| Supported Formats | PNG, BMP | Lossless only |

---

## 8. Future Enhancements

- [ ] **AES-256-GCM** encryption (Web Crypto API)
- [ ] **Audio steganography** (WAV files)
- [ ] **Video steganography** (frame injection)
- [ ] **Steganalysis detection** (chi-square attack)
- [ ] **Batch processing** (multiple images)
- [ ] **QR code generation** (stego image → QR)
- [ ] **Blockchain verification** (image hash on chain)

---

## 9. References

1. Johnson, N.F. & Jajodia, S. (1998). "Exploring Steganography"
2. Provos, N. & Honeyman, P. (2003). "Hide and Seek"
3. Fridrich, J. (2009). "Steganography in Digital Media"

---

*Document Version: 1.0.0*  
*Last Updated: April 2026*
"""

with open(f'{base_dir}/PROJECT.md', 'w', encoding='utf-8') as f:
    f.write(project_md)

print("✅ PROJECT.md created")