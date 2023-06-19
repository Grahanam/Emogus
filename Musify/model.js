const init = function () {
  let file = document.getElementById('file')
  let audio = document.getElementById('audio')
  file.onchange = function () {
      let files = this.files;
      // console.log(files)
      displayname=files[0].name
      textMesh.geometry.dispose();
      textMesh.geometry=new THREE.TextGeometry(displayname,textOptions)
      audio.src = URL.createObjectURL(files[0])
      audio.load()
      // audio.play()
      // playbtn.innerHTML='Pause'
  }
};


let displayname=''
let playbtn=document.getElementById('play')

//Play/Pause Button event listener
playbtn.addEventListener('click',function(){
  if(playbtn.innerHTML==='Play'){
     playbtn.innerHTML='Pause'
     audio.play()
  }
  else{
    audio.pause()
    playbtn.innerHTML='Play'
  }
})

var		
	intersects,
	mouseXOnMouseDown = 0,
	mouseYOnMouseDown = 0,
	windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2;

  
//Music Analysis
var audio=document.getElementById('audio')
var context=new AudioContext();
var src=context.createMediaElementSource(audio)
var analyser = context.createAnalyser();
src.connect(analyser);
analyser.connect(context.destination);
analyser.fftSize = 512;
var bufferLength = analyser.frequencyBinCount || 125;
var frequencyData = new Uint8Array(bufferLength);

//Scene,Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const control = new THREE.OrbitControls(camera, renderer.domElement)
control.enableDamping = true

var raycaster=new THREE.Raycaster()
var raycasterCheck=false
var mouseVectors = new THREE.Vector2()

// Speaker
var icosahedronGeometry = new THREE.IcosahedronGeometry(4, 2);
const lambermaterial = new THREE.MeshLambertMaterial({
  color: 0x000000,
  wireframe: false
})
const speakermaterial = new THREE.MeshPhongMaterial({
  color: new THREE.Color('#000000'),  
})
const speaker1 = new THREE.Mesh(icosahedronGeometry, speakermaterial);
const speaker2 = speaker1.clone()

//Outer box
const length = 10, width = 2.3
const shape = new THREE.Shape()
shape.moveTo(0, 0)
shape.lineTo(0, width)
shape.lineTo(length, width)
shape.lineTo(length, 0)
shape.lineTo(0, 0)

const extrudeSettings = {
  steps: 2,
  depth: 3,
  bevelEnabled: true,
  bevelThickness: 1,
  bevelSize: 1,
  bevelOffset: 0,
  bevelSegments: 5
}

const extrudegeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
const extrudematerial = new THREE.MeshPhongMaterial({
  color: new THREE.Color('#273a4b'),
})
const mesh = new THREE.Mesh(extrudegeometry, extrudematerial)
mesh.position.z = -3.6
mesh.position.x=-5
mesh.position.y=-1

//Button
const loader = new THREE.FontLoader();
const buttongeometry=new THREE.BoxGeometry(2,1,0.5)
const buttonmaterial=new THREE.MeshBasicMaterial({color:0x000000})
const button=new THREE.Mesh(buttongeometry,buttonmaterial)
button.name='button'
button.position.z=0.2
button.position.y=-1.1
button.position.x=0

//Text
//Song label
let textMesh,textOptions;
loader.load('/ThreeJs-Examples/Musify/Roboto.json', function(font) {
  textOptions = {
    font: font,
    size: 0.07, // Size of the text
    height: 0.01, // Thickness of the text
    curveSegments: 12,
    bevelEnabled: false
  };
  
  const textGeometry = new THREE.TextGeometry(`${displayname}`, textOptions);
    
  // Create a material for the text
  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  
  // Create a mesh using the text geometry and material
  textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.z=0.25
  textMesh.position.x=-0.9  
  textMesh.position.y=-0.1
  // Add the text mesh to the scene
  button.add(textMesh);
  
  })
//Button label
loader.load('/ThreeJs-Examples/Musify/Roboto.json', function(font) {
const textoptions = {
  font: font,
  size: 0.1, // Size of the text
  height: 0.02, // Thickness of the text
  curveSegments: 12,
  bevelEnabled: false
};

const textGeometry = new THREE.TextGeometry('Select Music', textoptions);
  
// Create a material for the text
const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

// Create a mesh using the text geometry and material
const textmesh = new THREE.Mesh(textGeometry, textMaterial);
textmesh.position.z=0.25
textmesh.position.x=-0.4  
textmesh.position.y=0.3
// Add the text mesh to the scene
button.add(textmesh);

})

scene.add(button)

    
//Display
const displaygeometry = new THREE.BoxGeometry(3, 2, 1)
const displaymaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
const display = new THREE.Mesh(displaygeometry, displaymaterial)

//Bars
const geometry = new THREE.BoxGeometry(0.5, 0.4, 0.1);
const color = new THREE.Color("rgb(50%,70%,0%)")
const material = new THREE.MeshBasicMaterial({ color: color});
const  bar= new THREE.Mesh(geometry, material)
const bars=new THREE.Object3D()
for (let i = 0; i < bufferLength; i++) {
  //creating bars
  let duplicate = bar.clone()
  bars.add(duplicate)
  duplicate.position.x += i
} 
display.add(bars)
bars.position.x = -1.3
bars.position.z = 0.5
bars.scale.set(0.01, 0.0001, 0.01)
display.position.y=1.5
display.position.z=3.6
display.position.x=5

//Add display to Mesh
mesh.add(display)
    
//Add speakers to Mesh
mesh.add(speaker1)
mesh.add(speaker2)

//Setting speaker position
speaker2.position.x = 1.5
speaker2.position.y=1
speaker1.position.x = 8.5
speaker2.position.z=4
speaker1.position.z=4
speaker1.position.y=1

//Adding scene to Mesh
scene.add(mesh)

//PointLight
const pointLight = new THREE.PointLight(0xFFFFFF, 1, 100000);
pointLight.position.set(0, 0, 10)
scene.add(pointLight)
camera.position.z = 6
    
//AmbientLight
var ambientLight = new THREE.AmbientLight(0xaaaaaa);
ambientLight.position.set(0, 0, 10)
scene.add(ambientLight);
    
//Mouse-click event function
function onDocumentMouseDown(event) {
  event.preventDefault();
  mouseXOnMouseDown = event.clientX - windowHalfX;
  mouseYOnMouseDown = event.clientY - windowHalfY;
  mouseVectors.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseVectors.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycasterCheck = true;
}

//3d object check hit function for button
function checkHit(intersects){
  var i=0
  var l=intersects.length
  //console.log(intersects)
  if(l>0){
    if(intersects[0].object.parent && intersects[i].object.name === 'button'){
    //console.log('button clicked success!')
        file.click()
    }
  }
}

//Mouse-click event listener
renderer.domElement.addEventListener('pointerdown', onDocumentMouseDown, false);


function animate() {
  requestAnimationFrame(animate);
  
  //if raycastercheck:true
  if(raycasterCheck){
  raycaster.setFromCamera(mouseVectors,camera)
  intersects=raycaster.intersectObjects(scene.children,true)
  if(intersects.length>0){
    checkHit(intersects)
  }
  raycasterCheck=false
  }
  
  
  analyser.getByteFrequencyData(frequencyData);
  
  //bar animation
  x=0
  bars.traverse((bar) => {
  bar.scale.y = frequencyData[x] / 120
  //rgb color
  // let r = ((frequencyData[x] + (25 * (x / bufferLength))) / 255)
  // let g = (250 * (x / bufferLength)) / 255
  // let b = (50 / 255)
  // if (bar.material) {
  //   bar.material.color.setRGB(r, g, b)
  // }
  x++
  })
  
  //speaker animation
  const averageFrequency = getAverageFrequency(frequencyData);
  const scale = averageFrequency / 350; // Adjust the scaling factor as needed
  const maxvalue = Math.max(scale, 0.2)
  speaker1.scale.set(maxvalue, maxvalue, 0.2)
  speaker2.scale.set(maxvalue, maxvalue, 0.2)
  control.update()
  
  renderer.render(scene, camera);
}

animate();


function getAverageFrequency(frequencyData) {
  const sum = frequencyData.reduce((accumulator, currentValue) => accumulator + currentValue);
  return sum / frequencyData.length;
}

//onload call init
window.onload = init;