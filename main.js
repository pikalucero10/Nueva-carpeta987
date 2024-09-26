const searchButton = document.getElementById('searchButton');
const imageGrid = document.getElementById('imageGrid');
const moveButton = document.getElementById('moveButton');
const progressBar = document.getElementById('progressBar');
const progress = progressBar.querySelector('.progress');

let selectedFiles = [];

searchButton.addEventListener('click', async () => {
    try {
        // Verificar si la API de File System Access está disponible
        if ('showOpenFilePicker' in window) {
            const fileHandles = await window.showOpenFilePicker({
                multiple: true,
                types: [{
                    description: 'Images',
                    accept: {
                        'image/*': ['.png', '.jpg', '.jpeg', '.gif']
                    }
                }]
            });

            selectedFiles = await Promise.all(fileHandles.map(handle => handle.getFile()));
            displaySelectedImages(selectedFiles);
        } else {
            // Fallback para navegadores que no soportan File System Access API
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = 'image/*';

            input.onchange = (event) => {
                selectedFiles = Array.from(event.target.files);
                displaySelectedImages(selectedFiles);
            };

            input.click();
        }
    } catch (error) {
        console.error('Error al seleccionar archivos:', error);
        alert('Hubo un error al seleccionar las imágenes. Por favor, inténtalo de nuevo.');
    }
});

function displaySelectedImages(files) {
    imageGrid.innerHTML = '';
    files.forEach((file, index) => {
        const div = document.createElement('div');
        div.className = 'image-item';
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = file.name;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `img${index}`;
        checkbox.name = `img${index}`;
        div.appendChild(img);
        div.appendChild(checkbox);
        imageGrid.appendChild(div);
    });
    moveButton.style.display = 'block';
}

moveButton.addEventListener('click', () => {
    const selectedImages = Array.from(imageGrid.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => parseInt(checkbox.id.replace('img', '')));
    if (selectedImages.length === 0) {
        alert('Por favor, selecciona al menos una imagen para mover.');
        return;
    }
    simulateImageTransfer(selectedImages);
});

function simulateImageTransfer(selectedIndices) {
    progressBar.style.display = 'block';
    let transferred = 0;
    const totalImages = selectedIndices.length;

    const transferInterval = setInterval(() => {
        transferred++;
        const percentage = (transferred / totalImages) * 100;
        progress.style.width = `${percentage}%`;
        progress.textContent = `${Math.round(percentage)}%`;

        if (transferred === totalImages) {
            clearInterval(transferInterval);
            setTimeout(() => {
                alert(`¡Transferencia simulada completa! Se "movieron" ${totalImages} imágenes.`);
                progressBar.style.display = 'none';
            }, 500);
        }
    }, 500);
}