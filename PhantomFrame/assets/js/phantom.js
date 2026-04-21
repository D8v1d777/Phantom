let originalImageData = null;
let stegoResult = null;
let decodeImageData = null;

// HANDLE IMAGE LOAD
function loadImage(file, callback) {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = e => {
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            callback(ctx.getImageData(0, 0, canvas.width, canvas.height), canvas);
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}

// DRAG & DROP
function setupDropzone(id, setter) {
    const zone = document.getElementById(id);

    zone.addEventListener("dragover", e => {
        e.preventDefault();
        zone.classList.add("dragover");
    });

    zone.addEventListener("dragleave", () => {
        zone.classList.remove("dragover");
    });

    zone.addEventListener("drop", e => {
        e.preventDefault();
        zone.classList.remove("dragover");

        const file = e.dataTransfer.files[0];
        loadImage(file, setter);
    });
}

// SETUP
setupDropzone("encodeDrop", (imgData) => {
    // Clone image data so we have a pure original for the heatmap
    originalImageData = new ImageData(
        new Uint8ClampedArray(imgData.data),
        imgData.width,
        imgData.height
    );
    stegoResult = imgData;
});

setupDropzone("decodeDrop", (imgData) => {
    decodeImageData = imgData;
    document.getElementById("lsbContainer").style.display = "block";
    document.getElementById("lsbBit").dispatchEvent(new Event('change'));
});

// ENCODE
document.getElementById("encodeBtn").onclick = async () => {
    if (!originalImageData) return alert("Drop an image first!");

    const text = document.getElementById("secretInput").value;
    const password = document.getElementById("encodePassword").value;
    const bitDepth = parseInt(document.getElementById("bitDepth").value);

    const encoder = new TextEncoder();
    let data = encoder.encode(text);

    if (password) {
        const encrypted = await CryptoModule.encrypt(data, password);
        data = new Uint8Array([
            ...encrypted.salt,
            ...encrypted.iv,
            ...encrypted.data
        ]);
    }

    const payload = SteganographyEngine.buildPayload(data);

    // Reset stegoResult to the original before embedding, so we can re-encode
    stegoResult = new ImageData(
        new Uint8ClampedArray(originalImageData.data),
        originalImageData.width,
        originalImageData.height
    );

    const result = SteganographyEngine.embedData(stegoResult, payload, bitDepth, password);

    // Fake progress animation
    const bar = document.getElementById("encodeProgress");
    bar.style.width = "100%";

    // Show heatmap button
    const heatmapBtn = document.getElementById("heatmapBtn");
    if (heatmapBtn) {
        heatmapBtn.style.display = "inline-block";
    }

    // Download
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = result.width;
    canvas.height = result.height;

    ctx.putImageData(result, 0, 0);

    // Show comparison slider
    const compareContainer = document.getElementById("compareContainer");
    if (compareContainer) {
        compareContainer.style.display = "block";
        document.getElementById("originalPreview").src = imageDataToDataURL(originalImageData);
        document.getElementById("stegoPreview").src = canvas.toDataURL();
    }

    // Run Histogram Analysis
    const histContainer = document.getElementById("histContainer");
    if (histContainer) {
        histContainer.style.display = "block";
        runHistogramAnalysis(originalImageData, result);
    }

    // Run LSB Analysis
    const lsbContainer = document.getElementById("lsbContainer");
    if (lsbContainer) {
        lsbContainer.style.display = "block";
        runLSBAnalysis(result);
    }

    const link = document.createElement("a");
    link.download = "stego.png";
    link.href = canvas.toDataURL();
    link.click();
};

// HEATMAP
document.getElementById("heatmapBtn").onclick = () => {
    if (!originalImageData || !stegoResult) {
        alert("Encode an image first.");
        return;
    }

    const heatmap = generateHeatmap(originalImageData, stegoResult);

    const canvas = document.getElementById("heatmapCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = heatmap.width;
    canvas.height = heatmap.height;
    canvas.style.display = "block";

    ctx.putImageData(heatmap, 0, 0);
};

// SLIDER
document.getElementById("compareSlider").oninput = function () {
    const value = this.value;
    document.getElementById("stegoPreview").style.clipPath =
        `inset(0 ${100 - value}% 0 0)`;
};

document.getElementById("lsbBit").onchange = function () {
  if (!decodeImageData) return;

  const bit = parseInt(this.value);

  const plane = generateLSBPlane(decodeImageData, bit);

  const canvas = document.getElementById("lsbCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = plane.width;
  canvas.height = plane.height;

  ctx.putImageData(plane, 0, 0);

  document.getElementById("lsbExplain").innerText =
    bit === 0
      ? "LSB plane reveals hidden patterns. Noise here may indicate embedded data."
      : "Higher bit planes show more natural image structure.";
};

function imageDataToDataURL(imageData) {
    const canvas = document.createElement("canvas");
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    canvas.getContext("2d").putImageData(imageData, 0, 0);
    return canvas.toDataURL();
}

// DECODE
document.getElementById("decodeBtn").onclick = async () => {
    if (!decodeImageData) return alert("Drop an image first!");

    const password = document.getElementById("decodePassword").value;
    const bitDepth = parseInt(document.getElementById("decodeBitDepth").value);

    const result = await decodeImage(decodeImageData, {
        bitDepth,
        password
    });

    const output = document.getElementById("output");

    if (result.success) {
        output.value = new TextDecoder().decode(result.data);
    } else {
        output.value = "❌ " + result.error;
    }
};

// DETECT
document.getElementById("detectBtn").onclick = () => {
    if (!decodeImageData) {
        alert("Upload image first.");
        return;
    }

    const score = detectSteganography(decodeImageData);

    document.getElementById("detectResult").innerText =
        `Hidden Data Probability: ${score}%`;
};

// ==========================================
// DECODER MASTER FUNCTIONS
// ==========================================

async function handleDecryption(payload, password) {
    if (!password) return payload;

    try {
        const salt = payload.slice(0, 16);
        const iv = payload.slice(16, 28);
        const encryptedData = payload.slice(28);

        const decrypted = await CryptoModule.decrypt(
            encryptedData,
            password,
            salt,
            iv
        );

        return decrypted;
    } catch (e) {
        throw new Error("Decryption failed. Incorrect password or corrupted data.");
    }
}

async function decodeImage(imageData, options = {}) {
    const {
        bitDepth = 2,
        password = ""
    } = options;

    try {
        // Step 1: Extract raw bytes
        const rawBytes = SteganographyEngine.extractData(imageData, bitDepth, password);

        // Step 2: Parse structured payload
        const { payload } = SteganographyEngine.parsePayload(rawBytes);

        // Step 3: Decrypt if needed
        const finalData = await handleDecryption(payload, password);

        return {
            success: true,
            data: finalData
        };

    } catch (err) {
        return {
            success: false,
            error: err.message
        };
    }
}

function runHistogramAnalysis(original, stego) {
  const h1 = generateHistogram(original);
  const h2 = generateHistogram(stego);

  drawHistogram(document.getElementById("histOriginal"), h1);
  drawHistogram(document.getElementById("histStego"), h2);

  document.getElementById("histExplain").innerText =
    "Steganography introduces subtle distribution shifts. Look for smoothing or uniformity in the stego histogram.";
}

function runLSBAnalysis(imageData) {
    const bit = parseInt(document.getElementById("lsbBit").value);
    const plane = generateLSBPlane(imageData, bit);
    const canvas = document.getElementById("lsbCanvas");
    
    canvas.width = plane.width;
    canvas.height = plane.height;
    
    const ctx = canvas.getContext("2d");
    ctx.putImageData(plane, 0, 0);
    
    document.getElementById("lsbExplain").innerText = 
        `Visualizing bit plane ${bit}. Hidden data usually appears as random white noise.`;
}