
  $(function(){
    var camera, scene, renderer, mesh;
    var startTime  = Date.now();
    displaygui(); 
    var keyboard = {}; 
    astronaut = {}; 
    scene = new THREE.Scene();


    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true} );
    renderer.setClearColor(0x000000, 0); 
    renderer.setSize( 1280,720 );
    renderer.shadowMap.enabled = true; 
    renderer.shadowMapSoft = true; 
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;


    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, .1, 1500);
    camera.position.x = 0; 
    camera.position.y = 1; 
    camera.position.z = 8; 


    var ballGeometry = new THREE.SphereGeometry(.3, 28.8, 14.4);
    var ballTexture = new THREE.MeshPhongMaterial( { color: 0xFF0000 } ); 
    ball = new THREE.Mesh(ballGeometry, ballTexture );
    ball.position.z = -2;
    ball.position.x = 2;
    ball.position.y = 2;
    ball.receiveShadow = true; 
    ball.castShadow = true;    
    scene.add( ball );

    var geometry = new THREE.SphereGeometry(36, 28.8, 14.4);
    var textureLoader = new THREE.TextureLoader(); 
    earthTexture  = textureLoader.load('earthPics/earthmap1k.jpg'); 
    earthBump = textureLoader.load('earthPics/earthbump1k.jpg'); 
    earthSpec = textureLoader.load('earthPics/earthspec1k.jpg'); 
    var moonTexture = new THREE.MeshPhongMaterial( { map: earthTexture, bumpMap: earthBump, specularMap: earthSpec} ); 
    moon = new THREE.Mesh(geometry, moonTexture );
    moon.position.z = -450;
    moon.position.x = -170;
    moon.position.y = 120;
    moon.castShadow = true;    
    scene.add( moon );


    var cloudGeometry   = new THREE.SphereGeometry(37, 28.8, 14.4); 
    canvasCloud = textureLoader.load('earthPics/fair_clouds_4k.png'); 
    var cloudMaterial  = new THREE.MeshPhongMaterial( {map: canvasCloud, transparent: true, depthWrite: false, opacity: .7} ); 
    var cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial); 
    moon.add(cloudMesh); 



    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {

       console.log( item, loaded, total );

       };
       var onError = function(xhr) {

       }

       var imageMap = new THREE.Texture();
       var normalMap = new THREE.Texture();
       var specMap = new THREE.Texture();

       var loader = new THREE.ImageLoader(manager);
       loader.load('Astronaut/Astronaut_D.jpg', function(img) {
           imageMap.image = img;
           imageMap.needsUpdate = true;
       });

       var loader = new THREE.ImageLoader(manager);
       loader.load('Astronaut/Astronaut_N.jpg', function(img) {
           normalMap.image = img;
           normalMap.needsUpdate = true;
       });

       var loader = new THREE.ImageLoader(manager);
       loader.load('Astronaut/Astronaut_S.jpg', function(img) {
           specMap.image = img;
           specMap.needsUpdate = true;
       });



       var loader = new THREE.OBJLoader( manager );
       loader.load( 'Astronaut/Astronaut.OBJ', function ( object ) {
        
           object.traverse( function ( child ) {
           
           if ( child instanceof THREE.Mesh ) {
               // child.material.normalMap = decalNormal;
               child.material.map = imageMap;
               child.material.normalMap = normalMap;
               child.material.specualarMap = specMap;
               child.castShadow = true;
           }

       });
     
      object.position.y = -.22;
      object.position.x = 2;
       object.position.z = -3;
       object.scale.set(.5,.5,.5); 
       astronaut = object; 
       scene.add( object );
       
   });






  // var axis = new THREE.AxisHelper(100); 
  // scene.add(axis);  

  // var light = new THREE.DirectionalLight( 0xBDBDBD );
  // light.position.set( 0, 1, 1 ).normalize();
  // scene.add(light);

  // var ambientLight = new THREE.AmbientLight(0xD3D3D3);
  // scene.add(ambientLight);

  floorTexture = textureLoader.load( 'FinalMoonPics/FinalMoonMapTile.jpg' );
  floorNormal = textureLoader.load('FinalMoonPics/FinalMoonNormalTile.jpg'); 
  //floorBump = textureLoader.load( 'moonPics/cropBump.jpg' );
   // floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
   // floorTexture.repeat.set( 2 , 2 );
   // floorNormal.wrapS = floorNormal.wrapT = THREE.RepeatWrapping; 
   // floorNormal.repeat.set( 2 , 2 );
  var floorMaterial = new THREE.MeshPhongMaterial({ map: floorTexture, normalMap: floorNormal,  side: THREE.DoubleSide });
  var floorGeometry = new THREE.PlaneGeometry(12, 12)
  var floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -.5;
  floor.receiveShadow = true; 
  floor.rotation.x = Math.PI / 1.9;
  //scene.add(floor);


  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', render); 


  camera.lookAt(moon); 




 function displaygui(){
  var gui = new dat.GUI(); 
  var placement = 2.5; 
  var speed = 0.005;
  var jar; 

  parameters = {
    a: true, 
    x: -90, y: 20, z: 4, 
    bX: 0, bY: 20, bZ: -50, 
    rotateX: .000, rotateY: .002, rotateZ: .000, 
    cRotateX: .000, cRotateY: .001, 
    xLight: 85, yLight: 60, zLight: 60, 
    intensity: 0 
  }; 

  var posit = gui.addFolder('Earth Position'); 
  var xspot = posit.add(parameters, 'x').min(-80).max(10).step(placement).name('X Position');
  var yspot = posit.add(parameters, 'y').min(-30).max(60).step(placement).name('Y Position');
  var zspot = posit.add(parameters, 'z').min(-420).max(-100).step(placement).name('Z Position');
  xspot.onChange(function(jar){moon.position.x = jar;});
  yspot.onChange(function(jar){moon.position.y = jar;});
  zspot.onChange(function(jar){moon.position.z = jar;});


  var bPosit = gui.addFolder('Ball Position'); 
  var bXSpot = bPosit.add(parameters, 'bX').min(-6).max(6.5).step(speed).name('X Position');
  var bYSpot = bPosit.add(parameters, 'bY').min(0).max(4.5).step(speed).name('Y Position');
  var bZSpot = bPosit.add(parameters, 'bZ').min(-220).max(1).step(speed).name('Z Position');
  bXSpot.onChange(function(jar){ball.position.x = jar;});
  bYSpot.onChange(function(jar){ball.position.y = jar;});
  bZSpot.onChange(function(jar){ball.position.z = jar;});


  var rotate = gui.addFolder('Earth Rotation'); 
  var xspin = rotate.add(parameters, 'rotateX').min(0).max(.09).step(speed).name('Rotate Earth X ');
  var yspin = rotate.add(parameters, 'rotateY').min(0).max(.09).step(speed).name('Rotate Earth Y ');
  var zspin = rotate.add(parameters, 'rotateZ').min(0).max(.09).step(speed).name('Rotate Earth Z ');


  var cloudRotate = gui.addFolder('Cloud Rotation'); 
  var cxspin = cloudRotate.add(parameters, 'cRotateX').min(0).max(.09).step(speed).name('Rotate Clouds X ');
  var cyspin = cloudRotate.add(parameters, 'cRotateY').min(0).max(.09).step(speed).name('Rotate Clouds Y ');


  var show = gui.addFolder('Display'); 
  var model = show.add(parameters, 'a').name("Allow Existence");
  model.onChange(function(jar){moon.visible = jar;});  


  var light = gui.addFolder('Light'); 
  var xlight = light.add(parameters, 'x').min(-220).max(560).step(placement).name('X Position');
  var ylight = light.add(parameters, 'y').min(-220).max(560).step(placement).name('Y Position');
  var zlight = light.add(parameters, 'z').min(15).max(250).step(placement).name('Z Position');
  var intense = light.add(parameters, 'intensity').min(0.5).max(4).step(speed).name('Intensity');
  xlight.onChange(function(jar){spotLight.position.x = jar;});
  ylight.onChange(function(jar){spotLight.position.y = jar;});
  zlight.onChange(function(jar){spotLight.position.z = jar;});
  intense.onChange(function(jar){spotLight.intensity = jar;});




  gui.close(); 
} 

  var spotLight =  new THREE.SpotLight( 0xF0F0F0 );
  spotLight.intesity = parameters.intensity; 
  spotLight.castShadow = true; 
  spotLight.position.set(210, 218, 15);      
  scene.add( spotLight );
   
  var spotLight2 =  new THREE.SpotLight( 0xBDBDBD );
  spotLight2.position.set(8, 2, 1);  
  spotLight2.castShadow = true; 
  spotLight2.distance = 30; 
  spotLight2.fov = 15; 
  spotLight2.target.position.set( -.22, 2, -3.8 ); 

  scene.add( spotLight2 );
  
  // var helper = new THREE.SpotLightHelper( spotLight2 );
  // scene.add(helper);



  render();
  function render() {
    moon.rotation.x += parameters.rotateX; 
    moon.rotation.y -= parameters.rotateY; 
    moon.rotation.z += parameters.rotateZ; 

    cloudMesh.rotation.x -= parameters.cRotateX; 
    cloudMesh.rotation.y -= parameters.cRotateY; 

    //astronaut.rotation.y -= .001; 
    if (keyboard[37]){
      camera.rotation.y -= Math.PI * .001;
    }

     if (keyboard[39]){ 
      camera.rotation.y += Math.PI * .001;
    }

    if (keyboard[38]){
       
      camera.position.z += 5; 
    }
    //  if (keyboard[40]){
       
    //   camera.position.z += 5; 
    // }
    
     
    // var dtime   = Date.now() - startTime;
    // mesh.scale.x    = .5 + 0.3*Math.sin(dtime/1000);
    // mesh.scale.y    = .5 + 0.3*Math.sin(dtime/1000);
    // mesh.scale.z    = .5 + 0.3*Math.sin(dtime/1000);

    requestAnimationFrame( render );
    renderer.render( scene, camera );
    }
  

  function keyDown(event){
    keyboard[event.keyCode] = true; 
  }

  function keyUp(event){
    keyboard[event.keyCode] = false; 
  }

  window.addEventListener('keydown', keyDown); 
   window.addEventListener('keyup', keyUp); 


  $('#bg').append( renderer.domElement );
  renderer.render( scene, camera );



}); 


  //    function onWindowResize() {
  //        camera.aspect = window.innerWidth / window.innerHeight;
  //        camera.updateProjectionMatrix();
  //        renderer.setSize( window.innerWidth, window.innerHeight );
  //        render();

  // }