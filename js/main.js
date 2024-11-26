import * as THREE from './three.module.js';
import { FirstPersonControls } from './FirstPersonControls.js';
import { loadModel, loadSky } from './modelos.js'; 
import { satelliteInfo } from './modelos.js';
import { EffectComposer } from './EffectComposer.js';
import { RenderPass } from './RenderPass.js';
import { OutlinePass } from './OutlinePass.js';
import { ShaderPass } from './ShaderPass.js';
import { FXAAShader } from './FXAAShader.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';



// Inicialización básica
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
const raycasterObjects = [];
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000000);
camera.position.set(30000, 0, 6000);

const clock = new THREE.Clock();

// Ajustar luces
const ambientLight = new THREE.AmbientLight(0xFFFFFF , 0.5); // Baja la intensidad de la luz ambiental
scene.add(ambientLight);

// Controles
const controls = new FirstPersonControls(camera, renderer.domElement);
controls.movementSpeed = 1800;
controls.lookSpeed = 0.20;

// Configuración de EffectComposer
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
renderPass.clear = true;  // Asegurarse de que el frame buffer se limpie correctamente
composer.addPass(renderPass);

const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
outlinePass.edgeStrength = 3.0;
outlinePass.edgeGlow = 1.0;
outlinePass.edgeThickness = 2.0;
outlinePass.pulsePeriod = 0;
outlinePass.visibleEdgeColor.set('#ffffff');
outlinePass.hiddenEdgeColor.set('#190a05');
composer.addPass(outlinePass);

const fxaaPass = new ShaderPass(FXAAShader);
fxaaPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
composer.addPass(fxaaPass);

const listaSatelites=[
  { nombre:'Estación Espacial Internacional (ISS)'},
  { nombre:'Sputnik' },
  { nombre:'Telescopio Espacial Hubble'},
  { nombre:'Voyager 1'},
  { nombre:'Voyager 2'},
  { nombre:'Starlink'},
  { nombre:'GPS Satellite'},
  { nombre:'Chandra X-ray Observatory'},
  { nombre:'Spitzer Space Telescope'},
  { nombre:'James Webb Telescope'},
  { nombre:'Inmarsat'},
  { nombre:'Tianlian'},
  { nombre:'Compton Gamma Ray Observatory'},
  { nombre:'James Webb Telescope'},
];

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', onClick, false);

function onClick(event) {
  // Calcula las coordenadas normalizadas del mouse en la pantalla
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Actualiza el raycaster según la posición de la cámara y la dirección del mouse
  raycaster.setFromCamera(mouse, camera);

  // Intersecta los objetos en la escena
  const intersects = raycaster.intersectObjects(outlinePass.selectedObjects, true);

  if (intersects.length > 0) {
    const selectedObject = intersects[0].object;

    // Verifica si `userData.nombre` está en el objeto o sus hijos
    const nombreObjeto = selectedObject.userData?.nombre;
    if (nombreObjeto) {
      console.log("Nombre del objeto clicado:", nombreObjeto); // Verificar el valor del nombre
      const info = satelliteInfo[nombreObjeto];
    
      if (info) {
        animateCameraToObject(selectedObject);
        mostrarMenuInformacion(info);
      } else {
        console.warn("No se encontró información para el satélite:", nombreObjeto);
      }
    } else {
      console.warn("El objeto seleccionado no tiene nombre en userData.");
    }
    
  }
}


function animateCameraToObject(object) {
  if (object) { // Check if the object exists
    const targetPosition = object.getWorldPosition(new THREE.Vector3());
    gsap.to(camera.position, {
      duration: 2,  // Duración de la animación en segundos
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z + 400, // Ajusta la distancia final
      onUpdate: () => {
        camera.lookAt(targetPosition); // La cámara sigue mirando al objeto
        
      }
    });
  }else {
    console.error("Object is null. Cannot animate camera.");
  }
  
  
}
function mostrarMenuInformacion(info) {
  const menu = document.createElement('div');

  // Estilos para el contenedor del menú
  menu.style.position = 'absolute';
  menu.style.top = '20px';
  menu.style.right = '20px';
  menu.style.padding = '20px';
  menu.style.backgroundColor = 'rgba(15, 15, 20, 0.95)';
  menu.style.color = '#00ffcc';
  menu.style.borderRadius = '10px';
  menu.style.width = '320px';
  menu.style.boxShadow = '0 0 15px rgba(0, 255, 204, 0.7), 0 0 30px rgba(0, 255, 204, 0.5)';
  menu.style.fontFamily = 'Verdana, sans-serif';
  menu.style.zIndex = '10';
  menu.style.border = '1px solid rgba(0, 255, 204, 0.5)';

  // Contenido HTML del menú
  menu.innerHTML = `
    <h2 style="margin-top: 0; color: #00e6e6; font-size: 1.6em; text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff;">${info.nombre}</h2>
    <p style="font-size: 0.9em; line-height: 1.6; color: #b3ffff;">Fecha de lanzamiento: <strong>${info.fechaLanzamiento}</strong></p>
    <p style="line-height: 1.6; font-size: 0.9em; color: #99ffee;">${info.descripcion}</p>
    <button id="closeMenu" style="
      margin-top: 15px;
      padding: 10px 20px;
      background: linear-gradient(45deg, #00ffcc, #006666);
      color: #ffffff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.9em;
      box-shadow: 0 0 8px rgba(0, 255, 204, 0.7);
      transition: background 0.3s, transform 0.2s;
    ">Cerrar</button>
  `;

  // Aplicar efectos al botón de cerrar
  const closeButton = menu.querySelector("#closeMenu");
  closeButton.addEventListener("mouseover", () => closeButton.style.background = 'linear-gradient(45deg, #00cccc, #004d4d)');
  closeButton.addEventListener("mouseout", () => closeButton.style.background = 'linear-gradient(45deg, #00ffcc, #006666)');
  closeButton.addEventListener("mousedown", () => closeButton.style.transform = 'scale(0.95)');
  closeButton.addEventListener("mouseup", () => closeButton.style.transform = 'scale(1)');

  // Agregar el menú al cuerpo del documento
  document.body.appendChild(menu);

  // Cerrar el menú al hacer clic en el botón "Cerrar"
  closeButton.addEventListener('click', () => {
    document.body.removeChild(menu);
   
  });
}

function setupSatelliteMenu(listaSatelites) {
  // Crear el contenedor del menú
  const sideMenu = document.createElement('div');
  sideMenu.style.position = 'absolute';
  sideMenu.style.top = '50px';
  sideMenu.style.left = '20px';
  sideMenu.style.width = '250px';
  sideMenu.style.backgroundColor = 'rgba(20, 20, 30, 0.95)';
  sideMenu.style.color = '#ffffff';
  sideMenu.style.padding = '15px';
  sideMenu.style.borderRadius = '10px';
  sideMenu.style.boxShadow = '0 0 15px rgba(0, 255, 204, 0.5)';
  sideMenu.style.display = 'none'; // Inicialmente oculto
  sideMenu.style.zIndex = '10';
  sideMenu.style.overflowY = 'auto';
  sideMenu.style.maxHeight = '90%'; // Evitar que exceda el alto de la pantalla
  sideMenu.style.fontFamily = 'Verdana, sans-serif';
  document.body.appendChild(sideMenu);

  // Botón para mostrar/ocultar el menú
  const toggleButton = document.createElement('button');
  toggleButton.innerText = 'Información Lista de Satélites';
  toggleButton.style.position = 'absolute';
  toggleButton.style.top = '10px';
  toggleButton.style.left = '20px';
  toggleButton.style.padding = '10px 20px';
  toggleButton.style.background = 'linear-gradient(45deg, #00ffcc, #006666)';
  toggleButton.style.color = '#ffffff';
  toggleButton.style.border = 'none';
  toggleButton.style.borderRadius = '5px';
  toggleButton.style.cursor = 'pointer';
  toggleButton.style.boxShadow = '0 0 8px rgba(0, 255, 204, 0.7)';
  toggleButton.style.zIndex = '10';
  document.body.appendChild(toggleButton);

  // Abrir/Cerrar menú
  toggleButton.addEventListener('click', () => {
    sideMenu.style.display = sideMenu.style.display === 'none' ? 'block' : 'none';
    if(controls.enabled == false){
      controls.enabled = true;
    }else{
      controls.enabled = false;
    }
    
  });

  // Poblar el menú con los satélites
  listaSatelites.forEach((sat) => {
    const button = document.createElement('button');
    button.innerText = sat.nombre;
    button.style.display = 'block';
    button.style.marginBottom = '10px';
    button.style.width = '100%';
    button.style.padding = '10px';
    button.style.background = 'linear-gradient(45deg, #00ffcc, #006666)';
    button.style.color = '#ffffff';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '0.9em';
    button.style.boxShadow = '0 0 8px rgba(0, 255, 204, 0.7)';

    button.addEventListener('mouseover', () => {
      button.style.background = 'linear-gradient(45deg, #00cccc, #004d4d)';
    });
    button.addEventListener('mouseout', () => {
      button.style.background = 'linear-gradient(45deg, #00ffcc, #006666)';
    });

    // Función al hacer clic en un satélite
    button.addEventListener('click', () => {
      const satelite = scene.getObjectByName(sat.nombre); // Supongamos que el modelo tiene el nombre del satélite
      console.warn('nombre del satelite:', sat.nombre);
      
        
        const info = satelliteInfo[sat.nombre];
        
        if (info) {
          mostrarMenuInformacion(info);
        } else {
          console.warn('Información del satélite no encontrada:', sat.nombre);
        }
       
    });
    
    sideMenu.appendChild(button);
  });
}

// Cargar modelos
loadModel(scene, outlinePass)
loadSky(scene);
setupSatelliteMenu(listaSatelites);

// Manejar redimensionamiento de la ventana
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  controls.handleResize();
  fxaaPass.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
});


// Ciclo de animación
function animate() {
  requestAnimationFrame(animate);
 const delta = clock.getDelta();
  controls.update(delta);
  composer.render(); 
}



animate();
  