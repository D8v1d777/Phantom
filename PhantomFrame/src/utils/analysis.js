// src/utils/analysis.js

function generateHistogram(imageData) {
  const data = imageData.data;

  const histR = new Array(256).fill(0);
  const histG = new Array(256).fill(0);
  const histB = new Array(256).fill(0);

  for (let i = 0; i < data.length; i += 4) {
    histR[data[i]]++;
    histG[data[i + 1]]++;
    histB[data[i + 2]]++;
  }

  return { histR, histG, histB };
}

function drawHistogram(canvas, histogram) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  const max = Math.max(
    ...histogram.histR,
    ...histogram.histG,
    ...histogram.histB
  );

  for (let i = 0; i < 256; i++) {
    const x = (i / 256) * width;

    const rHeight = (histogram.histR[i] / max) * height;
    const gHeight = (histogram.histG[i] / max) * height;
    const bHeight = (histogram.histB[i] / max) * height;

    ctx.fillStyle = "red";
    ctx.fillRect(x, height - rHeight, 1, rHeight);

    ctx.fillStyle = "green";
    ctx.fillRect(x, height - gHeight, 1, gHeight);

    ctx.fillStyle = "blue";
    ctx.fillRect(x, height - bHeight, 1, bHeight);
  }
}

function generateLSBPlane(imageData, bit = 0) {
  const width = imageData.width;
  const height = imageData.height;

  const output = new ImageData(width, height);
  const src = imageData.data;
  const out = output.data;

  for (let i = 0; i < src.length; i += 4) {
    const r = (src[i] >> bit) & 1;
    const g = (src[i + 1] >> bit) & 1;
    const b = (src[i + 2] >> bit) & 1;

    const value = (r + g + b) * 85; // scale to 0–255

    out[i] = value;
    out[i + 1] = value;
    out[i + 2] = value;
    out[i + 3] = 255;
  }

  return output;
}
