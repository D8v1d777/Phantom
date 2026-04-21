// src/utils/imageProcessor.js

function generateHeatmap(originalImageData, stegoImageData) {
    const width = originalImageData.width;
    const height = originalImageData.height;

    const heatmap = new ImageData(width, height);

    const orig = originalImageData.data;
    const stego = stegoImageData.data;
    const out = heatmap.data;

    for (let i = 0; i < orig.length; i += 4) {
        const diff =
            Math.abs(orig[i] - stego[i]) +
            Math.abs(orig[i + 1] - stego[i + 1]) +
            Math.abs(orig[i + 2] - stego[i + 2]);

        const intensity = Math.min(diff * 40, 255);

        // red heat
        out[i] = intensity;
        out[i + 1] = 0;
        out[i + 2] = 0;
        out[i + 3] = 255;
    }

    return heatmap;
}