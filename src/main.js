
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//gltf model loader
let face=''

const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );
const Pointlight = new THREE.PointLight( 0xff0000, 1, 100 );
Pointlight.position.set( 10, 10, 10 );
scene.add( Pointlight );

//call function
loadbirds()


camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
}

animate();

document.addEventListener('mousemove',onMouseMove)

function onMouseMove(event){
    const mousePosition={
        x:(event.clientX/window.innerWidth)*2-1,
        y:-(event.clientY/window.innerHeight)*2+1,
    };

    face.rotation.x=(-mousePosition.y)+5;
    face.rotation.z=(mousePosition.x);
}

async function loadbirds(){
    const loader=new THREE.GLTFLoader();
    const data=await loader.loadAsync('angry_octopus.glb')
    
    //Once model loaded remove title
    document.getElementById('loading').innerHTML=''
    face=data.scene.children[0]
    scene.add(face)
}

