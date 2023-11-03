let net;

const imgEl = document.getElementById('img');
const descEl = document.getElementById('descripcion_img');

imgEl.onload = async function() {
    displayImagePrediction();
}

async function displayImagePrediction(){
    try{
        result = await net.classify(imgEl);
        descEl.innerHTML = JSON.stringify(result);
    }catch(e){
        console.log(e);
    }
}

count = 0;
async function changeImg(){
    count = count + 1;
    imgEl.src = "https://picsum.photos/200/300?random=" + count;
    await displayImagePrediction();
}

async function app() {
  console.log('Loading mobilenet..');

  // Load the model.
  net = await mobilenet.load();
  console.log('Successfully loaded model');

  // Make a prediction through the model on our image.
  const result = await net.classify(imgEl);
  console.log(result);
}

app();