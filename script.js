let originalImage = null;

document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            originalImage = new Image();
            originalImage.src = e.target.result;
            originalImage.onload = function() {
                document.getElementById('originalImage').src = originalImage.src;
                document.getElementById('result').style.display = 'block';
            };
        };
        reader.readAsDataURL(file);
    }
});

function convertToGrayscale() {
    if (!originalImage) return;

    const canvas = document.getElementById('processedCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    
    ctx.drawImage(originalImage, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;     // Red
        data[i + 1] = avg; // Green
        data[i + 2] = avg; // Blue
        // Alpha (data[i + 3]) remains unchanged
    }

    ctx.putImageData(imageData, 0, 0);
}

function applyBlur() {
    if (!originalImage) return;

    const canvas = document.getElementById('processedCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    
    ctx.drawImage(originalImage, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const width = imageData.width;
    const height = imageData.height;
    
    const tempData = new Uint8ClampedArray(data);

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let rTotal = 0, gTotal = 0, bTotal = 0;

            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const index = ((y + dy) * width + (x + dx)) * 4;
                    rTotal += tempData[index];     // Red
                    gTotal += tempData[index + 1]; // Green
                    bTotal += tempData[index + 2]; // Blue
                }
            }

            const avgR = rTotal / 9;
            const avgG = gTotal / 9;
            const avgB = bTotal / 9;

            const currentIndex = (y * width + x) * 4;
            data[currentIndex]     = avgR;   // Red
            data[currentIndex + 1] = avgG;   // Green
            data[currentIndex + 2] = avgB;   // Blue
        }
    }

    ctx.putImageData(imageData, 0, 0);
}