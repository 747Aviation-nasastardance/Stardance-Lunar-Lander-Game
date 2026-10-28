console.log("JavaScript connected!");
const canvas = document.getElementById('gamecanvas');
const ctx = canvas.getContext('2d');
const worldWidth = canvas.width * 3;
const worldHeight = canvas.height * 3;

const fpsCounter = document.getElementById('fps-Counter');

function drawMoonSpot(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();}
    const stars = [];

for (let i = 0; i < 900; i++) {
    stars.push({
        x: Math.random() * worldWidth,
        y: Math.random() * worldHeight,
        size: 2
    });
}


const camera = {
    x: 0,
    y: 0
};

const mainThrust = 20;
const reverseThrust = -12;
const spacecraft ={
    x: worldWidth / 2 + 300,
    y: worldHeight / 2,
    velocityX: 0,
    velocityY: 5,
    accelerationX:0,
    accelerationY: 0,
    angularVelocity: 0,
    angularAcceleration: 0,
    angle: 0
};
const moon = {
    x: worldWidth / 2 + 700,
    y: worldHeight / 2,
    radius: 100,
    gravity: 16200,
};

const earth = {
    x: worldWidth / 2 - 900,
    y: worldHeight / 2,
    radius: 400
};
const flightPath = [];
const keys = {};
window.addEventListener('keydown', function (event) {
    keys[event.key] = true;
        if (event.key === "r") {
        if (confirm("Are You Sure That You Want To Reset The Flight?")) {
            spacecraft.x = worldWidth / 2;
            spacecraft.y = worldHeight / 2;
            spacecraft.velocityX = 0;
            spacecraft.velocityY = 0;
            spacecraft.accelerationX = 0;
            spacecraft.accelerationY = 0;
            spacecraft.angularVelocity = 0;
            spacecraft.angularAcceleration = 0;
            spacecraft.angle = 0;
            flightPath.length = 0;
            for (let key in keys) {
    keys[key] = false;
}
        }
    }
});
window.addEventListener('keyup', function (event)  {
    keys[event.key] = false;
    
});
let fps = 0;
let frameCount = 0;
let fpsStartTime = performance.now();
let lastTime = performance.now();


function gameLoop() {console.log('Game loop running');
const currentTime = performance.now();
const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.05);
lastTime = currentTime;


frameCount++;

if (performance.now() - fpsStartTime >= 1000) {
    fps = frameCount;
    frameCount = 0;
    fpsStartTime = performance.now();
    fpsCounter.textContent = `FPS: ${fps}`;
}

spacecraft.accelerationX = 0;
spacecraft.accelerationY = 0;
spacecraft.angularAcceleration = 0;


const dx = moon.x - spacecraft.x;
const dy = moon.y - spacecraft.y;
const distance = Math.sqrt(dx * dx + dy * dy);
const directionX = dx / distance;
const directionY = dy / distance;

const gravityStrength = moon.gravity / (distance * distance);
spacecraft.accelerationX += directionX * gravityStrength;
spacecraft.accelerationY += directionY * gravityStrength;
spacecraft.angularVelocity *= Math.pow(0.98, deltaTime);

if (keys["ArrowRight"]) {
    spacecraft.angularAcceleration +=0.8
  
}
if (keys["ArrowLeft"]) {
    spacecraft.angularAcceleration +=-0.8
}
if (keys["ArrowUp"]) {
    spacecraft.accelerationX = Math.cos(spacecraft.angle) * mainThrust;
    spacecraft.accelerationY = Math.sin(spacecraft.angle) * mainThrust;
}
if (keys["ArrowDown"]) {
    spacecraft.accelerationX = Math.cos(spacecraft.angle) * reverseThrust;
    spacecraft.accelerationY = Math.sin(spacecraft.angle) * reverseThrust;
}

spacecraft.velocityX += spacecraft.accelerationX * deltaTime;
spacecraft.velocityY += spacecraft.accelerationY * deltaTime;
spacecraft.x += spacecraft.velocityX * deltaTime;
spacecraft.y += spacecraft.velocityY * deltaTime;
spacecraft.angularVelocity += spacecraft.angularAcceleration * deltaTime;
spacecraft.angle += spacecraft.angularVelocity * deltaTime;

flightPath.push({
    x: spacecraft.x,
    y: spacecraft.y
});

if (spacecraft.x < 0) {
    spacecraft.x = 0;
    spacecraft.velocityX = 0;
}

if (spacecraft.x > worldWidth) {
    spacecraft.x = worldWidth;
    spacecraft.velocityX = 0;
}

if (spacecraft.y < 0) {
    spacecraft.y = 0;
    spacecraft.velocityY = 0;
}

if (spacecraft.y > worldHeight) {
    spacecraft.y = worldHeight;
    spacecraft.velocityY = 0;
}

camera.x = spacecraft.x - canvas.width / 2;
camera.y = spacecraft.y - canvas.height / 2;
camera.x = Math.max(0, Math.min(camera.x, worldWidth - canvas.width));
camera.y = Math.max(0, Math.min(camera.y, worldHeight - canvas.height));


ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = 'white';

for (let i = 0; i < stars.length; i++) {

    ctx.fillRect(
        stars[i].x - camera.x,
        stars[i].y - camera.y,
        stars[i].size,
        stars[i].size
    );

}

ctx.beginPath();
ctx.arc(earth.x - camera.x,
     earth.y - camera.y,
     earth.radius,
     0, Math.PI * 2);
ctx.fillStyle = '#3f78a3';
ctx.fill();


ctx.beginPath();
ctx.arc(
    moon.x - camera.x,
    moon.y - camera.y,
    moon.radius,
    0,
    Math.PI * 2
);
ctx.fillStyle = '#a6a6a6';
ctx.fill();
drawMoonSpot(moon.x - camera.x - 30, moon.y - camera.y - 25, 8, '#888888');
drawMoonSpot(moon.x - camera.x + 35, moon.y - camera.y + 20, 12, '#7c7c7c');
drawMoonSpot(moon.x - camera.x - 55, moon.y - camera.y - 5, 5, '#949494');
drawMoonSpot(moon.x - camera.x + 10, moon.y - camera.y - 45, 7, '#858585');
drawMoonSpot(moon.x - camera.x - 15, moon.y - camera.y + 30, 11, '#8c8c8c');
drawMoonSpot(moon.x - camera.x + 50, moon.y - camera.y - 10, 6, '#7c7c7c');
drawMoonSpot(moon.x - camera.x - 70, moon.y - camera.y - 15, 4, '#888888');
drawMoonSpot(moon.x - camera.x - 90, moon.y - camera.y + 0, 6, '#949494');
drawMoonSpot(moon.x - camera.x + 60, moon.y - camera.y + 60, 7, '#808080');

ctx.beginPath();

for (let i = 0; i < flightPath.length; i++) {
    const screenX = flightPath[i].x - camera.x;
    const screenY = flightPath[i].y - camera.y;

    if (i === 0) {
        ctx.moveTo(screenX, screenY);
    } else {
        ctx.lineTo(screenX, screenY);
    }
}

ctx.strokeStyle = 'yellow';
ctx.lineWidth = 1;
ctx.stroke();

ctx.save();
ctx.translate(spacecraft.x - camera.x, spacecraft.y - camera.y);
ctx.rotate(spacecraft.angle);
ctx.fillStyle = 'red';
ctx.beginPath();
ctx.moveTo(15, 0);
ctx.lineTo(-10, -10);
ctx.lineTo(-10, 10);
ctx.closePath();
ctx.fill();
ctx.restore();
requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);