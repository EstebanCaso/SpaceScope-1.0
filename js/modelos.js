import * as THREE from './three.module.js';
import { GLTFLoader } from './GLTFLoader.js';

// Función para cargar modelos y añadirlos al OutlinePass
export function loadModel(scene, outlinePass) {
  const loader = new GLTFLoader();
  
  const cargarModelo = (ruta, nombre, posicion, escala) => {
    loader.setPath(ruta);
    loader.load(
      'scene.gltf',
      (gltf) => {
        const mesh = gltf.scene;
  
        mesh.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
  
            // Asignar datos adicionales al objeto
            child.userData = {
              nombre: nombre,
              ...satelliteInfo[nombre],
            };
          }
        });
  
        mesh.position.set(...posicion);
        mesh.scale.set(...escala);
  
        scene.add(mesh);
  
        if (outlinePass) {
          outlinePass.selectedObjects.push(mesh);
        }
  
        console.log(`Modelo "${nombre}" cargado correctamente.`);
      },
      undefined,
      (error) => {
        console.error(`Error al cargar el modelo "${nombre}"`, error);
      }
    );
  };
  

  cargarModelo('./Modelos/sputnik/', 'Sputnik', [0, 0, -20000], [20, 20, 20]);
  cargarModelo('./Modelos/ISS/', 'Estación Espacial Internacional (ISS)', [40000, 6000, 0], [20, 20, 20]);
  cargarModelo('./Modelos/hubble/', 'Telescopio Espacial Hubble', [-30000, -4500, 0], [20, 20, 20]);
  cargarModelo('./Modelos/voyager/', 'Voyager 1', [0, 5000, 35000], [25, 25, 25]); 
  cargarModelo('./Modelos/voyager/', 'Voyager 2', [0, 6000, 40000], [25, 25, 25]);
  cargarModelo('./Modelos/starlink/', 'Starlink', [5000, -1000, -1000], [20, 20, 20]);
  cargarModelo('./Modelos/gps/', 'GPS Satellite', [3000, 3000, 5000], [20, 20, 20]);
  cargarModelo('./Modelos/chandra/', 'Chandra X-ray Observatory', [-2000, 6500, 20000], [20, 20, 20]);
  cargarModelo('./Modelos/spitzer/', 'Spitzer Space Telescope', [20000, -4000, 1500], [.5, .5, .5]);
  cargarModelo('./Modelos/webb/', 'James Webb Telescope', [-50000, -3000, 1800], [24, 24, 24]);
  cargarModelo('./Modelos/inmarsat/', 'Inmarsat', [10000, 6000, -2000], [27, 27, 27]);
  cargarModelo('./Modelos/tianlian/', 'Tianlian', [-40000, 3000, -2200], [27, 27, 27]);
  cargarModelo('./Modelos/gamma/', 'Compton Gamma Ray Observatory', [20000, 4000, -7600], [25, 25, 25]);
}



// Función para cargar el SkyBox y el Sol
export function loadSky(scene) {
  const loader = new GLTFLoader();

  // Cargar el SkyBox
  loader.setPath('Modelos/SkyBox/');
  loader.load(
    'scene.gltf',
    (gltf) => {
      const mesh = gltf.scene;
      mesh.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      mesh.position.set(0, 0, 0);
      mesh.scale.set(80000, 80000, 80000);
      scene.add(mesh);
      console.log('SkyBox cargado.');
    },
    undefined,
    (error) => {
      console.error('Error al cargar el SkyBox:', error);
    }
  );

  // Cargar el Sol
  loader.setPath('Modelos/sun/');
  loader.load(
    'scene.gltf',
    (gltf) => {
      const mesh = gltf.scene;
      mesh.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = new THREE.MeshStandardMaterial({
            emissive: new THREE.Color(0xffff00),
            emissiveIntensity: 1, // Intensidad de la emisión
          });
        }
      });
      mesh.position.set(82000, 8000, 50000);
      mesh.scale.set(60, 60, 60);
      scene.add(mesh);

      // Agregar luz direccional que simule la luz solar
      const sunLight = new THREE.DirectionalLight(0xffffff, 10); // Luz blanca con intensidad
      sunLight.position.copy(mesh.position); 
      sunLight.castShadow = true; 
      sunLight.shadow.mapSize.width = 1024; 
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.camera.near = 0.5;
      sunLight.shadow.camera.far = 100000;

      scene.add(sunLight);
      console.log('Sol cargado y luz solar añadida.');
    },
    undefined,
    (error) => {
      console.error('Error al cargar el Sol:', error);
    }
  );

  // Cargar la Luna
  loader.setPath('Modelos/Moon/');
loader.load(
  'scene.gltf',
  (gltf) => {
    const mesh = gltf.scene;
    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material = new THREE.MeshStandardMaterial({
          emissive: new THREE.Color(0xaaaaaa), // Cambiar a un color más brillante
          emissiveIntensity: 1, // Aumentar la intensidad de la emisión
        });
      }
    });
    mesh.position.set(-102000, 10000, -45000);
    mesh.scale.set(10, 10, 10);
    scene.add(mesh);

    // Agregar luz direccional que simule la luz lunar
    const moonLight = new THREE.DirectionalLight(0xffffff, 2); // Luz blanca con intensidad
    moonLight.position.copy(mesh.position); 
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 1024; 
    moonLight.shadow.mapSize.height = 1024;
    moonLight.shadow.camera.near = 0.5;
    moonLight.shadow.camera.far = 100000;

    scene.add(moonLight); 
    console.log('Luna cargada y luz lunar añadida.');
  },
  undefined,
  (error) => {
    console.error('Error al cargar la luna:', error);
  }
);


  // Cargar la Tierra
  loader.setPath('Modelos/tierra/');
  loader.load(
    'scene.gltf',
    (gltf) => {
      const mesh = gltf.scene;
      mesh.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      mesh.position.set(0, 0, 0);
      mesh.scale.set(3000, 3000, 3000);
      scene.add(mesh);
      console.log('Tierra cargada.');
    },
    undefined,
    (error) => {
      console.error('Error al cargar la Tierra:', error);
    }
  );
}

// Objeto que almacena la información de cada satélite
export const satelliteInfo = {
  'Sputnik': {
    nombre: 'Sputnik',
    fechaLanzamiento: '4 de octubre de 1957',
    descripcion: 'Creado y desplegado por la Unión Soviética, Sputnik 1 fue el primer satélite artificial puesto en órbita en la historia. Estuvo orbitando la tierra desde su lanzamiento en Octubre 4 de 1957 hasta Enero 4 de 1958, cuando se desintegró durante su reingreso a la atmósfera de la tierra. Sputnik 1 es recordado no solo por ser el primer objeto puesto en órbita por la humanidad, si no porque comenzó lo que hoy se conoce como la “Carrera Espacial” entre la Unión Soviética y Estados Unidos.',
   
  },
  'Estación Espacial Internacional (ISS)': {
    nombre: 'Estación Espacial Internacional (ISS)',
    fechaLanzamiento: '20 de noviembre de 1998',
    descripcion: 'ISS (International Space Station por sus siglas en inglés) es una estación espacial localizada en la órbita baja de la tierra que lleva albergando astronautas continuamente desde Noviembre 2 del 2000. La estación espacial está conformada por estaciones espaciales independientes de Estados Unidos y Rusia que fueron unidas a partir de módulos y a lo largo de su historia se le han añadido módulos especializados para realizar distintos experimentos en gravedad cero.',
  },
  'Telescopio Espacial Hubble': {
    nombre: 'Telescopio Espacial Hubble',
    fechaLanzamiento: '24 de abril de 1990',
    descripcion: 'Hubble Space Telescope es un telescopio espacial ubicado en la órbita baja (515 km sobre la superficie) de la Tierra. Desarrollado por NASA y desplegado en Abril 24 de 1990, Hubble Space Telescope permite observar el universo sin las distorsiones y obstrucciones que la atmósfera de la tierra provoca en telescopios convencionales. Desde su despliegue en órbita hasta el día de hoy, Hubble Space Telescope ha sido responsable del descubrimiento de la “energía oscura” y del análisis de la composición de la atmósfera de planetas alrededor de estrellas distantes',
  },
  'Voyager 1': {
    nombre: 'Voyager 1',
    fechaLanzamiento: '5 de septiembre de 1977',
    descripcion: 'La sonda espacial Voyager 1, lanzada en septiembre 5 de 1977 como parte del programa Voyager de NASA, tiene el objetivo de estudiar el sistema solar exterior y el espacio interestelar más allá de la heliosfera del sol. Es el objeto creado por humanos más distante de la tierra, a una distancia de 24.7 millones de kilómetros. Hasta el día de hoy se sigue comunicando con la tierra a través del NASA Deep Space Network.',
  },
  'Voyager 2': {
    nombre: 'Voyager 2',
    fechaLanzamiento: '20 de agosto de 1977',
    descripcion: 'Sonda espacial hermana del Voyager 1, Voyager 2 fue lanzada en Agosto 20 de 1977 (16 días antes que Voyager 1) con dirección a los gigantes de gas Júpiter y Saturno. Subsecuentemente visitó Urano y Neptuno, hasta el día es la única sonda que ha visitado los gigantes de hielo (Urano y Neptuno). Al igual que su sonda hermana, Voyager 2 ha alcanzado la velocidad de escape solar y está encaminada a abandonar el sistema solar. Sigue manteniendo comunicación con la tierra a través del NASA Deep Space Network.',
  },
  'GPS Satellite': {
    nombre: 'GPS Satellite',
    fechaLanzamiento: 'Fecha desconocida',
    descripcion: 'GPS (Global Positioning System) es una constelación de 24 satélites que orbitan a la tierra proporcionando información de geolocalización en tiempo real. Creada por el Departamento de Defensa de los Estados Unidos, la constelación de satélites comenzó a ser funcional en 1993. Actualmente es controlado y mantenido por la Fuerza Espacial de Estados Unidos y este le permite acceso libre a cualquiera con un receptor de GPS.',
  },
  'Starlink': {
    nombre: 'Starlink',
    fechaLanzamiento: 'Mayo de 2019',
    descripcion: 'Starlink es una constelación de satélites de internet desarrollados por la empresa privada SpaceX, consiste en 7,000 pequeños satélites que crean distintas constelaciones alrededor de la tierra para cubrir alrededor de 100 países y territorios. Estos satélites están ubicados en la órbita baja de la tierra y cuentan con un sistema de propulsión que les permite ascender en la órbita o descender para desintegrarse en la atmósfera de la tierra. El servicio de internet provee velocidades de 50 - 150 Mbits/s. SpaceX planea poner 12,000 satélites en órbita e incluso una posible extensión a 34,400 satélites.',
  },
  'Chandra X-ray Observatory': {
    nombre: 'Chandra X-ray Observatory',
    fechaLanzamiento: '23 de julio de 1999',
    descripcion: 'Desarrollado por NASA como parte de la constelación de “Grandes Observatorios” (junto Hubble Space Telescope, Spitizer Space Telescope), Chandra X-Ray Observatory es un telescopio espacial que, como su nombre lo dice, está diseñado para detectar rayos X en el universo. Debido a que la atmósfera de la tierra absorbe la gran cantidad de rayos X que recibe, la observación de este fenómeno desde la superficie no es factible. ',
  },
  'Compton Gamma Ray Observatory': {
    nombre: 'Compton Gamma Ray Observatory',
    fechaLanzamiento: '7 de abril de 1991',
    descripcion: 'Parte de la constelación de “Grandes Observatorios”, el Compton Gamma Ray Observatory fue diseñado para detectar fotones con energía de 20 keV a 30 GeV (electronvolt) para así cubrir gran parte del espectro electromagnético. ',
  },
  'Spitzer Space Telescope': {
    nombre: 'Spitzer Space Telescope',
    fechaLanzamiento: '25 de agosto de 2003',
    descripcion: 'Lanzado a la órbita baja de la tierra el 25 de Agosto de 2003, El Spitzer Space Telescope tuvo como tarea observar las ondas infrarrojas del espacio para visualizar los cuerpos celestes que están ocultos a simple vista. La necesidad de este observatorio espacial se debe a que dentro de la atmósfera de la tierra, las visualizaciones se ven distorsionadas por el mismo brillo de la superficie. Spitzer Space Telescope es el único de los “Grandes Observatorios” que no fue lanzado por el Space Shuttle.',
  },
  'Inmarsat': {
    nombre: 'Inmarsat',
    fechaLanzamiento: '1979',
    descripcion: 'Lanzado en 1979, el sistema de satélites INMARSAT fue diseñado para proporcionar comunicaciones móviles globales, especialmente en áreas remotas o en alta mar donde las conexiones terrestres son limitadas o inexistentes. Este sistema satelital es crucial para la seguridad marítima, la aviación y otros sectores industriales, ofreciendo servicios de voz, datos y rastreo. INMARSAT, a diferencia de otros sistemas satelitales de comunicación, opera en la órbita geoestacionaria, lo que le permite mantener una cobertura constante sobre áreas específicas del planeta.',
  },
  'James Webb Telescope': {
    nombre: 'James Webb Telescope',
    fechaLanzamiento: '25 de diciembre de 2021',
    descripcion: 'El Telescopio Espacial James Webb (JWST) es un telescopio espacial desarrollado por la NASA, en colaboración con la Agencia Espacial Europea (ESA) y la Agencia Espacial Canadiense (CSA). Fue lanzado el 25 de diciembre de 2021 desde la Guayana Francesa y comenzó sus operaciones científicas en julio de 2022. Su diseño y capacidades lo convierten en el telescopio más avanzado de la historia, sucediendo al famoso Telescopio Espacial Hubble.',
  },
  'Tianlian': {
    nombre: 'Tianlian',
    fechaLanzamiento: '2008',
    descripcion: 'El sistema de satélites Tianlian, lanzado por primera vez en 2008, es la red de satélites de retransmisión de datos de China, diseñada para brindar soporte de comunicación en tiempo real a sus misiones espaciales tripuladas y a otros satélites en órbita. Similar a la red de satélites TDRS de Estados Unidos, Tianlian permite que los satélites de observación y las misiones espaciales chinas mantengan una comunicación constante con las estaciones de control en tierra, incluso cuando no están en línea de visión directa.',
  },
};


