function detectSteganography(imageData) {
    const data = imageData.data;

    let suspicious = 0;
    let total = 0;

    for (let i = 0; i < data.length; i += 4) {
        for (let c = 0; c < 3; c++) {
            const lsb = data[i + c] & 1;

            if (lsb === 1) suspicious++;

            total++;
        }
    }

    const probability = (suspicious / total) * 100;

    return probability.toFixed(2);
}