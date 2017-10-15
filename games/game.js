var game = (function() {

  var hasShot = false;
  var isShooting = false;
  var currentPosition = new CANNON.Vec3(0, 0, 0);
  var lastPosition = new CANNON.Vec3(0, 0, 0);
  var isOverlapping = false;
  var shotTimer = null;
  var basket = null;
  var ball = null;
  var score = 0;
  var scoreText = null;

  var SHOT_VELOCITY_X = 0;
  var SHOT_VELOCITY_Y = 40;
  var SHOT_VELOCITY_Z = -20;
  var SHOT_TIMER = 3000;

  function shootBall(ballElem) {
    ballElem.body.applyLocalImpulse(new CANNON.Vec3(SHOT_VELOCITY_X, SHOT_VELOCITY_Y, SHOT_VELOCITY_Z), new CANNON.Vec3(0, 0, 0));
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function checkOverlap(overlapper) {
    if(
      lastPosition.x <= overlapper.body.position.x + 0.2 && lastPosition.x >= overlapper.body.position.x - 0.2 &&
      lastPosition.y <= overlapper.body.position.y + 0.2 && lastPosition.y >= overlapper.body.position.y - 0.2 &&
      lastPosition.z <= overlapper.body.position.z + 0.2 && lastPosition.z >= overlapper.body.position.z - 0.2
    ) {
      return true;
    } else {
      return false;
    }
  }

  function scorePoint() {
    isOverlapping = true;
    score += 3;
    scoreText.setAttribute('value', score.toString());
  }

  AFRAME.registerComponent('ball', {
    init() {
      // this.geometry = new THREE.SphereBufferGeometry(this.data.radius);
      // this.material = new THREE.MeshStandardMaterial({color: this.data.color});
      // this.mesh = new THREE.Mesh(this.geometry, this.material);
      // this.el.setObject3D('mesh', this.mesh);
    },

    tick: function(time, timeDelta) {
      var cameraPos = this.el.sceneEl.camera.el.getAttribute('position');

      if(this.el.hasOwnProperty('body')) {
        if(!hasShot && !isShooting) {
          this.el.body.velocity.set(0, 0, 0);
          this.el.body.angularVelocity.set(0, 0, 0);
          this.el.body.quaternion.set(0, 0, 0, 1);
          this.el.body.position.set(cameraPos.x, cameraPos.y - 0.25, cameraPos.z - 0.5);
        }

        if(hasShot && !isShooting) {
          currentPosition.copy(this.el.body.position);
          shootBall(this.el);
          isShooting = true;
        }

        if(hasShot && isShooting) {
          if(shotTimer < Date.now()) {
            hasShot = false;
            isShooting = false;
            isOverlapping = false;
            var rndInt = getRandomInt(0, 3);
            switch(rndInt) {
              case 0:
                console.log('money');
                ball.setAttribute('collada-model', '#money-model');
                ball.setAttribute('scale', '1 1 1');
                break;
              case 1:
                console.log('google');
                ball.setAttribute('collada-model', '#google-model');
                ball.setAttribute('scale', '0.1 0.1 0.1');
                break;
              case 2:
                console.log('amazon');
                ball.setAttribute('collada-model', '#amazon-model');
                ball.setAttribute('scale', '1 1 1');
                break;
              case 3:
                console.log('microsoft');
                ball.setAttribute('collada-model', '#microsoft-model');
                ball.setAttribute('scale', '0.05 0.05 0.05');
                break;
              default:
                console.log('default');
                ball.setAttribute('collada-model', '#money-model');
                ball.setAttribute('scale', '0.1 0.1 0.1');
                break;
            }
            shotTimer = Date.now() + SHOT_TIMER;
          }
        }

        lastPosition.copy(this.el.body.position);

        if(checkOverlap(basket)) {
          if(!isOverlapping) {
            scorePoint();
          }
        }
      }
    }
  });

  document.addEventListener("DOMContentLoaded", function() {
    var camera = document.querySelector('[camera]');
    var scene = document.querySelector('a-scene');
    ball = document.querySelector('[ball]');
    basket = document.querySelector('#basket');
    scoreText = document.querySelector('#scoreText');

    scene.addEventListener('click', function(e) {
      if(!hasShot) {
        hasShot = true;
        shotTimer = Date.now() + SHOT_TIMER;
      }
    });
  });
})()
