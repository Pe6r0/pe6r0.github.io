const footerheight = 50;

// Set the scene size
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight - footerheight;

///////////////////////////////////////////////////////////////////

// Set some camera attributes.
var ASPECT = WIDTH / HEIGHT;
const VIEW_ANGLE = 45;
const NEAR = 0.1;
const FAR = 10000;

// Get the DOM element to attach to
const canvas = document.getElementById('backgroundCanvas');
// Create a WebGL renderer, camera and a scene
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
});
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight; // ?
renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight);

function updateScreenSize() {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight - footerheight;
  ASPECT = WIDTH / HEIGHT;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  CAMERA.aspect = ASPECT;
  CAMERA.updateProjectionMatrix();
  renderer.setSize(WIDTH, HEIGHT);
}

const SCENE = new THREE.Scene();
// Start the renderer.
renderer.setSize(WIDTH, HEIGHT, true);
renderer.alpha = true;
renderer.antialias = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const CAMERA =
  new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR
  );

// Add the camera to the scene.
CAMERA.position.z += 400;
//CAMERA.position.y = 5;
SCENE.add(CAMERA);

// create a point light
const pointLight =
  new THREE.PointLight(0xFFFFFF);

// set its position
pointLight.position.x = 0;
pointLight.position.y = 0;
pointLight.position.z = 0;

pointLight.castShadow = true;
// add to the scene
SCENE.add(pointLight);

var ambientLight = new THREE.AmbientLight(0x1D171C, 1);
SCENE.add(ambientLight);

var material = new THREE.MeshPhongMaterial( { color: 0xAAAAAA, specular: 0x111111, shininess: 200 , transparent: true, opacity: 0.01} );
var loader = new THREE.STLLoader();
loader.load( './assets/models/trajan_print.stl', function ( geometry ) {
  var mesh = new THREE.Mesh( geometry, material );
  mesh.name = "target";
  mesh.position.set( 0, - 300, - 400 );
  mesh.rotation.set( - Math.PI / 2, 0, Math.PI );
  mesh.scale.set( 5, 5, 5 );
  //mesh.castShadow = true;
  //mesh.receiveShadow = true;
  mesh.visible = false;
  SCENE.add( mesh );
  model.setTargets(mesh);
} );

///////////////////////////////////////////////////////////////////
var model = new KRModel();
var performanceMetrics;

var lastLoop = Date.now();

var rotation = 0;
var center = new THREE.Vector3( 0, - 300, - 400 );

function update() {
  //performance
  var thisLoop = Date.now();
  var fps = 1000 / (thisLoop - lastLoop);
  lastLoop = thisLoop;
  if(fps < 40){
    model.decreasePerformance();
  }else{
    model.increasePerformance();
  }


  rotation += 0.02;
  CAMERA.position.x = Math.sin(rotation) * 700 + center.x;
  CAMERA.position.y = 500 + center.y;
  CAMERA.position.z = Math.cos(rotation) * 700 + center.y;
  CAMERA.lookAt( new THREE.Vector3( 0, 0, - 400 )); // the origin

  //logic
  model.update();

  // Draw!
  //renderer.setClearColor(0xffffff, 0);
  renderer.render(SCENE, CAMERA);

  // Schedule the next frame.
  requestAnimationFrame(update);
}

///////////////////////////////////////////////////////////////////

//IO

document.onmousedown = function (event) {
  // Compensate for IE<9's non-standard event model
  //
  if (event === undefined) event = window.event;
  var target = 'target' in event ? event.target : event.srcElement;

  model.click();
};

document.onmouseup = function (event) {
  // Compensate for IE<9's non-standard event model
  //
  if (event === undefined) event = window.event;
  var target = 'target' in event ? event.target : event.srcElement;

  model.declick();
};

///////////////////////////////////////////////////////////////////

// Linkers
window.addEventListener('resize', updateScreenSize);
requestAnimationFrame(update);

