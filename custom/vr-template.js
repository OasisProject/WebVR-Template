//THREEJS INIT    
var three = require('three')
var keycontrols = require('../src/VRKeyControls.js')
var vrcontrols = require('../src/VRControls.js')
var VREffect = require('../src/VREffect.js')
var polyfill = require('webvr-polyfill')
var webvrmanager = require('../src/webvr-manager')
                       
  
var renderer = undefined
var scene = undefined
var camera = undefined
var orbitcontrols = undefined
var fakeCamera = undefined
var vrControls = undefined
var effect = undefined
var manager = undefined


module.exports = { 
    init: function() {
//Setup three.js WebGL renderer
    renderer = new three.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio);

    // Append the canvas element created by the renderer to document body element.
    document.body.appendChild(renderer.domElement);

    // Create a three.js scene.
    scene = new three.Scene();4

    //var bodyObject = new THREE.Object3D();

    // Create a three.js camera.
    camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.3, 10000);
    //bodyObject.add(camera);    

    // VR INIT
    // Apply VR headset positional data to camera.
    orbitcontrols = new keycontrols.VRKeyControls(camera);    

    // Store the position of the VR HMD in a dummy camera to allow for panning and junk
    fakeCamera = new three.Object3D();
    vrControls = new three.VRControls(fakeCamera);
    // Apply VR stereo rendering to renderer.
    effect = new three.VREffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);
    // Create a VR manager helper to enter and exit VR mode.
    manager = new webvrmanager.WebVRManager(renderer, effect, {hideButton: false});

    },



    // MAIN ANIMATION LOOP. CALL ANY UPDATES ON OBJECTS HERE
    animate: function() {

        if (renderer === undefined) {
            console.log('must run .Init() before animating.')
            return
        }

     // WORLD UPDATE STEP

      //rotate one row of planes
     for(var i = 0; i < planes.length; i++) {
       planes[i].plane.rotation.y += 0.1;
     }

     //  bodyObject.translateZ(-0.05);
     // Update VR headset position and apply to camera.
     orbitcontrols.update();
     vrControls.update();

      // Temporarily save the orbited camera position
      var orbitPos = camera.position.clone();

      //APPLY HEADSET TRACKING TO CAMERA POSITION


     // Apply the VR HMD camera position and rotation
     // on top of the orbited camera.
     var rotatedPosition = fakeCamera.position.applyQuaternion(camera.quaternion);
     camera.position.add(rotatedPosition);
     camera.quaternion.multiply(fakeCamera.quaternion);



     // Render the scene through the VR manager.
     manager.render(scene, camera);

     camera.position.copy(orbitPos);

     //REQUEST THE NEXT FRAME OF ANIMATION, CREATES THE LOOP
     requestAnimationFrame(animate);
    },
}
