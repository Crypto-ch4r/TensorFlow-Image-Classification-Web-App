let net;
let modelLoaded = false;

const imgEl = document.getElementById('img');
const resultEl = document.getElementById('result');
const imageInput = document.getElementById('imageInput');
const progressBar = document.getElementById('progressBar');

imageInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        imgEl.src = URL.createObjectURL(file);
    }
});

async function loadModel() {
    try {
        net = await mobilenet.load();
        modelLoaded = true;
    } catch (e) {
        console.error('Failed to load the model:', e);
    }
}

async function displayImagePrediction() {
    try {
        resultEl.innerHTML = '';
        progressBar.style.width = '0%';
        progressBar.innerHTML = '0%';
        resultEl.innerHTML = 'Classifying...';

        result = await net.classify(imgEl, 3); // Classify the image, showing top 3 predictions.
        progressBar.style.width = '100%';
        progressBar.innerHTML = '100%';
        resultEl.innerHTML = '';

        const predictionsContainer = document.createElement('div');
        predictionsContainer.classList.add('predictions-container');

        result.forEach((item, index) => {
            const predictionCard = document.createElement('div');
            predictionCard.classList.add('prediction-card');

            const predictionText = document.createElement('p');
            predictionText.innerHTML = `<strong>Prediction ${index + 1}:</strong> ${item.className}`;
            predictionCard.appendChild(predictionText);

            const probabilityText = document.createElement('p');
            probabilityText.innerHTML = `<strong>Probability:</strong> ${(item.probability * 100).toFixed(2)}%`;
            predictionCard.appendChild(probabilityText);

            predictionsContainer.appendChild(predictionCard);
        });

        resultEl.appendChild(predictionsContainer);
    } catch (e) {
        console.error(e);
        resultEl.innerHTML = 'An error occurred. Please try again.';
    }
}



async function classifyImage() {
    if (imgEl.src) {
        await displayImagePrediction();
    } else {
        resultEl.innerHTML = 'Please select an image first.';
    }
}

function resetImage() {
    imgEl.src = ''; // Limpia la imagen
    resultEl.innerHTML = ''; // Limpia las predicciones
    progressBar.style.width = '0%'; // Restablece la barra de progreso
    progressBar.innerHTML = '0%';
}

function showInstructions() {
    // Crear un elemento modal
    const modal = document.createElement('div');
    modal.classList.add('modal');

    // Contenido de las instrucciones
    const instructionsContent = `
        <h2>Instrucciones de Uso</h2>
        <p>1. Haga clic en "Subir imagen" para cargar una imagen desde su dispositivo.</p>
        <p>2. Una vez cargada la imagen, haga clic en "Clasificar imagen" para obtener predicciones.</p>
        <p>3. Puede ver las predicciones en la parte inferior de la página.</p>
        <p>4. Si necesita volver a cargar la imagen, haga clic en "Reiniciar".</p>
        <p>5. En caso de error, reinicia la página o comprueba tu conectividad a internet :)</p>
        <p>6. ¡Disfrute de la clasificación de imágenes!</p>
    `;

    modal.innerHTML = instructionsContent;

    // Agregar el modal a la página
    document.body.appendChild(modal);

    // Agregar un botón para cerrar el modal
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Cerrar';
    closeButton.onclick = function () {
        document.body.removeChild(modal);
    };

    modal.appendChild(closeButton);
}



// Llama a la función para cargar el modelo al cargar la página.
loadModel();
