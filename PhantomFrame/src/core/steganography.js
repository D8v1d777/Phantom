// src/core/steganography.js

function seededPRNG(seed) {
    let value = seed % 2147483647;
    return () => {
        value = (value * 16807) % 2147483647;
        return value / 2147483647;
    };
}

function stringToSeed(str) {
    return Array.from(str).reduce((acc, c) => acc + c.charCodeAt(0), 0);
}

function generatePixelOrder(length, password) {
    const order = Array.from({ length }, (_, i) => i);

    if (!password) return order;

    const rand = seededPRNG(stringToSeed(password));

    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }

    return order;
}

function buildPayload(dataBytes, meta) {
  const header = new TextEncoder().encode("PHNT"); // magic

  const length = new Uint32Array([dataBytes.length]);
  const version = new Uint8Array([1]);

  return new Uint8Array([
    ...header,
    ...version,
    ...new Uint8Array(length.buffer),
    ...dataBytes
  ]);
}

function embedData(imageData, payload, bitDepth = 2, password = "") {
    const data = imageData.data;
    const totalPixels = data.length / 4;

    const pixelOrder = generatePixelOrder(totalPixels, password);

    let bitIndex = 0;

    for (let i = 0; i < pixelOrder.length && bitIndex < payload.length * 8; i++) {
        const pixelIndex = pixelOrder[i] * 4;

        for (let channel = 0; channel < 3; channel++) {
            for (let b = 0; b < bitDepth; b++) {
                if (bitIndex >= payload.length * 8) break;

                const byte = payload[Math.floor(bitIndex / 8)];
                const bit = (byte >> (7 - (bitIndex % 8))) & 1;

                data[pixelIndex + channel] =
                    (data[pixelIndex + channel] & ~(1 << b)) | (bit << b);

                bitIndex++;
            }
        }
    }

    return imageData;
}

function extractData(imageData, bitDepth = 2, password = "") {
  const data = imageData.data;
  const totalPixels = data.length / 4;

  const pixelOrder = generatePixelOrder(totalPixels, password);

  let bits = [];

  for (let i = 0; i < pixelOrder.length; i++) {
    const pixelIndex = pixelOrder[i] * 4;

    for (let channel = 0; channel < 3; channel++) {
      for (let b = 0; b < bitDepth; b++) {
        const bit = (data[pixelIndex + channel] >> b) & 1;
        bits.push(bit);
      }
    }
  }

  // Convert bits → bytes
  const bytes = new Uint8Array(Math.floor(bits.length / 8));

  for (let i = 0; i < bytes.length; i++) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | bits[i * 8 + j];
    }
    bytes[i] = byte;
  }

  return bytes;
}

function parsePayload(bytes) {
  if (bytes.length < 9) throw new Error("Payload too short");
  const headerStr = new TextDecoder().decode(bytes.slice(0, 4));
  if (headerStr !== "PHNT") throw new Error("Invalid magic header");
  
  const version = bytes[4];
  
  // Create a new buffer for the length part just to be safe with offsets
  const lengthBytes = bytes.slice(5, 9);
  const lengthView = new DataView(lengthBytes.buffer, lengthBytes.byteOffset, 4);
  const length = lengthView.getUint32(0, true); // little-endian
  
  if (9 + length > bytes.length) throw new Error("Corrupted payload length");
  
  return {
    version,
    payload: bytes.slice(9, 9 + length)
  };
}

function calculateCapacity(imageData, bitDepth = 2) {
    const totalPixels = imageData.width * imageData.height;
    return Math.floor((totalPixels * 3 * bitDepth) / 8) - 9; // 9 bytes header
}

const SteganographyEngine = {
    embedData,
    extractData,
    buildPayload,
    parsePayload,
    calculateCapacity
};