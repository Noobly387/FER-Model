const imageUpload = document.getElementById('imageUpload');

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('./models')
]).then(start);


async function start() {
    
    const container = document.createElement('div');

    container.style.position = 'relative';
    container.style.maxHeight = '500px';

    document.body.append(container);

    let image, canvas;

    document.body.append('Loaded');

    imageUpload.addEventListener('change', async () => {
        
        if(image) image.remove();
        if(canvas) canvas.remove();

        image = await faceapi.bufferToImage(imageUpload.files[0]);
        container.append(image);
      
        canvas = faceapi.createCanvasFromMedia(image);
        container.append(canvas);
      
        const displaySize = { 
          width: image.width, 
          height: image.height 
        }
        
        faceapi.matchDimensions(canvas, displaySize);
        
        const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        resizedDetections.forEach(detection => {
            const box = detection.detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, {
                label: 'UwU' 
            });
            drawBox.draw(canvas);
        });
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        if(image) image.remove();
    })
  }