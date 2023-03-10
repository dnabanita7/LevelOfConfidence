function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiFaceLandmarks) {
    
    for (const landmarks of results.multiFaceLandmarks) {
      drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {color: PARAMS['FACE_COLOR'], lineWidth: 0.5});
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {color: PARAMS['FACE_COLOR']});
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {color: PARAMS['FACE_COLOR']});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {color: PARAMS['FACE_COLOR']});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {color: PARAMS['FACE_COLOR']});
      drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {color: PARAMS['FACE_COLOR']});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, {color: PARAMS['FACE_COLOR']});
    }
    // TODO: After drawing to the canvas we can send the detected face markings to the backend
    // console.log(results.multiFaceLandmarks)
  }
  canvasCtx.restore();
}

// Grab relevant HTML elements
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

// Loading models
async () => {
await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
await faceapi.loadFaceLandmarkModel(MODEL_URL)
await faceapi.loadFaceRecognitionModel(MODEL_URL)
}

// Initiate face mesh and set the options based on the params file
const faceMesh = new FaceMesh({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
}});

faceMesh.setOptions({
  maxNumFaces: PARAMS['MAX_NUMBER_OF_FACES'],
  refineLandmarks: PARAMS['REFINE_LANDMARKS'],
  minDetectionConfidence: PARAMS['MIN_DETECTION_CONFIDENCE'],
  minTrackingConfidence: PARAMS['MIN_TRACKING_CONFIDENCE']
});
faceMesh.onResults(onResults);
  
// Initiate camera
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceMesh.send({image: videoElement});
    // video camera input
  const results = await faceapi.detectAllFaces(video).withFaceLandmarks(true).withFaceDescriptors()
  }
});

camera.start()
