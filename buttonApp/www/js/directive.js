buttonApp.directive( 'threeJsInsert', [
  function () {
    return {
      //restrict: "E",
      // scope: {
      //   mousePos: {x:"=threeMouseX", y:"=threeMouseY"},
      // },
      link: function (scope, elem, attr) {

        var winWidth = window.innerWidth;//elem.prop('offsetWidth');
        var winHeight = window.innerHeight;//elem.prop('offsetHeight');

        //SCENE:
        var scene = new THREE.Scene();

        var renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize( winWidth, winHeight );
        renderer.setClearColor( 0x000000, 0 );

        //PROPS:
        var canvas = document.createElement("canvas");

        canvas.width = 200; canvas.style.width = canvas.width+'px'
        canvas.height = 50; canvas.style.height = canvas.height+'px'

        var context = canvas.getContext("2d");
        context.drawButtonFace = function (strText){
            this.fillStyle="#f8f8f8"
            this.fillRect(0, 0, canvas.width, canvas.height);
            this.lineWidth="2";
            this.strokeStyle="#b2b2b2";
            this.rect(0,0,canvas.width, canvas.height);
            this.stroke();
            this.fillStyle = "#444";
            this.font = "16px Arial";

                var txtX = canvas.width / 2;
                var txtY = canvas.height / 2;
            this.textAlign = 'center';
            this.fillText(strText, txtX, txtY+5);
        }
        context.drawButtonFace(scope.buttonData.totalPresses + " Clicks")

        var xm = new THREE.MeshBasicMaterial({ map: new THREE.Texture(canvas), transparent: true });
        xm.map.needsUpdate = true;

        var button = new THREE.Mesh(new THREE.CubeGeometry(2, .5, 2), xm);
        button.doubleSided = true;
        button.geometry.dynamic = true;
        scene.add(button);

        //LIGHTS
        //not using any today :)

        //CAMERA:
        //(REFACTOR NOTE: OrthographicCamera may have been better for this application)
        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
        camera.position.z = 5;

        //ACTION
        renderer.render(scene, camera);
        elem.append(renderer.domElement)

        var mouseVector = new THREE.Vector3(0,0,0);

        var render = function () {
          requestAnimationFrame( render );
          if (scope.popoverData.isRemoved){
            context.drawButtonFace(scope.buttonData.totalPresses + " Clicks")
            button.material.map.needsUpdate = true;

            var Xr = ((Math.atan(mouseVector.x/ mouseVector.z)) ) * (180/Math.PI)
            button.rotation.y = Xr 
            
            var Yr = -((Math.atan(mouseVector.y/ mouseVector.z))) * (180/Math.PI)
            button.rotation.x = Yr

            renderer.render(scene, camera);
          }
          
        };
        render();

        // MOUSE MOVE EVENT HANDLER
        scope.$watchCollection('mouseData', function(newValues, oldValues) {
          // get the normalized mouse position and put it into a vector
          var vector = new THREE.Vector3(
            (newValues.Xpos / window.innerWidth ) * 2 - 1,
            - ( newValues.Ypos / window.innerHeight ) * 2 + 1,
            .5 );

          // transform it back into the 3d world
          vector.unproject( camera );

          //translate to position from 0 (at z=0) (REFACTOR NOTE: not 100% sure how this works - must look up)
          var dir = vector.sub( camera.position ).normalize();
          var distance = - camera.position.z / dir.z;
          mouseVector = camera.position.clone().add( dir.multiplyScalar( distance ) );
          // move back out as this finds position at z=0 (which will give infinite angles)
          mouseVector.z = 500;

          if (-1.36 < mouseVector.x && mouseVector.x < 1.36
            && -0.35 < mouseVector.y && mouseVector.y < 0.35 ){
            scope.mouseOverButton();

          }
          else{
            scope.mouseOutofButton();
          }
        });

      }
    }
  }
]);