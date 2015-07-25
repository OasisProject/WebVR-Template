//THREEJS INIT    
window.THREE = require('three')
window.keycontrols = require('../src/VRKeyControls.js')
window.vrcontrols = require('../src/VRControls.js')
window.VREffect = require('../src/VREffect.js')
window.polyfill = require('webvr-polyfill')
window.webvrmanager = require('../src/webvr-manager')
                       
  
window.renderer = undefined
var scene = undefined
var camera = undefined
var orbitcontrols = undefined
var fakeCamera = undefined
var vrControls = undefined
window.effect = undefined
var manager = undefined


module.exports = VRTemplate = { 
    init: function() {
//Setup three.js WebGL renderer
    window.renderer = new window.THREE.WebGLRenderer({ antialias: true })
    window.renderer.setPixelRatio(window.devicePixelRatio);

    // Append the canvas element created by the renderer to document body element.
    document.body.appendChild(renderer.domElement);

    // Create a three.js scene.
    scene = new window.THREE.Scene();

    // Create a three.js camera.
    camera = new window.THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.3, 10000);
       
    // VR INIT
    // Apply VR headset positional data to camera.
    orbitcontrols = new window.keycontrols.VRKeyControls(camera);    

    // Store the position of the VR HMD in a dummy camera to allow for panning and junk
    fakeCamera = new window.THREE.Object3D();
    vrControls = new window.vrcontrols.VRControls(fakeCamera);
    // Apply VR stereo rendering to renderer.
    effect = new window.VREffect.VREffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);
    // Create a VR manager helper to enter and exit VR mode.
    manager = new window.webvrmanager.WebVRManager(window.renderer, window.effect, {hideButton: false});

    },


    // MAIN ANIMATION LOOP. CALL ANY UPDATES ON OBJECTS HERE
    animate: function() {

        if (window.renderer === undefined) {
            console.log('must run .Init() before animating.')
            return
        }

     // WORLD UPDATE STEP

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
     requestAnimationFrame(module.exports.animate);
    },
    
    addToScene: function (object3D) {
        
        scene.add(object3D);   
    },
}

document.addEventListener("onDOMReady", function() {
    init();
})