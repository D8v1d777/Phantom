/**
    * PhantomFrame File Handler
        * Drag - drop, reading, and download utilities
            */

class FileHandler {
    /**
     * Read file as DataURL (for images)
     * @param {File} file 
     * @returns {Promise<string>} DataURL
     */
    static readAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(file);
        });
    }

    /**
     * Read file as ArrayBuffer (for binary files)
     * @param {File} file 
     * @returns {Promise<ArrayBuffer>}
     */
    static readAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Read file as Uint8Array
     * @param {File} file 
     * @returns {Promise<Uint8Array>}
     */
    static async readAsUint8Array(file) {
        const buffer = await this.readAsArrayBuffer(file);
        return new Uint8Array(buffer);
    }

    /**
     * Download blob as file
     * @param {Blob} blob 
     * @param {string} filename 
     */
    static downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Download canvas as PNG
     * @param {HTMLCanvasElement} canvas 
     * @param {string} filename 
     */
    static downloadCanvas(canvas, filename = 'phantom-stego.png') {
        canvas.toBlob((blob) => {
            if (blob) this.downloadBlob(blob, filename);
        }, 'image/png');
    }

    /**
     * Setup drag and drop zone
     * @param {HTMLElement} zone 
     * @param {Function} onDrop 
     */
    static setupDropZone(zone, onDrop) {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('dragover');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('dragover');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) onDrop(files[0]);
        });
    }

    /**
     * Get file extension
     * @param {string} filename 
     * @returns {string}
     */
    static getExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    /**
     * Check if file is lossless image
     * @param {File} file 
     * @returns {boolean}
     */
    static isLosslessImage(file) {
        const ext = this.getExtension(file.name);
        return ['png', 'bmp'].includes(ext);
    }
}
