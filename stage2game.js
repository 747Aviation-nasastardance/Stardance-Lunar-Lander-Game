console.log("STAGE 2 FILE LOADED");
function startStage2() {

    stage1Running = false;
    flightPath.length = 0;
    missionTime = 0;
    orbitScreen.style.display = "none";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    console.log("stage-2 started");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < stars.length; i++) {
    
    ctx.fillStyle = "white";
    ctx.fillRect(
        stars[i].x - camera.x,
        stars[i].y - camera.y,
        stars[i].size,
        stars[i].size

    );


}


requestAnimationFrame(gameLoop2);
}
ctx.clearRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);


const stage2Spacecraft = {
    x: worldWidth / 2,
    y: worldHeight / 2,
    velocityX: 0,
    velocityY: 0,
    angle: 0,
    accelerationX: 0,
    accelerationY: 0,
    angularVelocity: 0,
    angularAcceleration: 0
}

const stage2Moon = {
    x: worldWidth / 2,
    y: worldHeight / 2 + 2200,
    radius: 2000
}


document.addEventListener("keydown", function(event) {
if (!stage1Running && event.key === "r")
    if(confirm("Are You Sure That You Want To Reset The Flight?")) {
        stage2Spacecraft.x = worldWidth / 2;
        stage2Spacecraft.y = worldHeight / 2;

        stage2Spacecraft.accelerationX = 0; 
        stage2Spacecraft.accelerationY = 0;

        stage2Spacecraft.velocityX = 0;
        stage2Spacecraft.velocityY = 0;

        stage2Spacecraft.angularVelocity = 0;
        stage2Spacecraft.angularAcceleration = 0;

        stage2Spacecraft.angle = 0;

        flightPath.length = 0;
        missionTime = 0;

        missionTimeDisplay.textContent = `MISSION ELAPSED : 00:00:00`;
        inOrbitNotification.style.display = "none";
        for (let key in keys) {
            keys[key] = false;
        }

        
    }
});

function gameLoop2() {
ctx.clearRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

for (let i = 0; i < stars.length; i++) {
    
    ctx.fillStyle = "white";
    ctx.fillRect(
        stars[i].x - camera.x,
        stars[i].y - camera.y,
        stars[i].size,
        stars[i].size

    );


}

//Moon//
ctx.fillStyle = "grey";
ctx.beginPath();
ctx.arc(stage2Moon.x - camera.x,
        stage2Moon.y - camera.y,
        stage2Moon.radius, 0,
        Math.PI * 2);
ctx.fill();

drawMoonSpot(stage2Moon.x - camera.x - 240, stage2Moon.y - camera.y - 200, 64, "#888888");
drawMoonSpot(stage2Moon.x - camera.x + 280, stage2Moon.y - camera.y + 160, 96, "#7c7c7c");
drawMoonSpot(stage2Moon.x - camera.x - 440, stage2Moon.y - camera.y - 40, 40, "#949494");
drawMoonSpot(stage2Moon.x - camera.x + 80, stage2Moon.y - camera.y - 360, 56, "#858585");
drawMoonSpot(stage2Moon.x - camera.x - 120, stage2Moon.y - camera.y + 240, 88, "#8c8c8c");
drawMoonSpot(stage2Moon.x - camera.x + 400, stage2Moon.y - camera.y - 80, 48, "#7c7c7c");
drawMoonSpot(stage2Moon.x - camera.x - 560, stage2Moon.y - camera.y - 120, 32, "#888888");
drawMoonSpot(stage2Moon.x - camera.x - 720, stage2Moon.y - camera.y, 48, "#949494");
drawMoonSpot(stage2Moon.x - camera.x + 480, stage2Moon.y - camera.y + 480, 56, "#808080");

const moonScreenX = stage2Moon.x - camera.x;
const moonScreenY = stage2Moon.y - camera.y;

ctx.beginPath();

ctx.fillStyle = "rgba(200, 200, 200, 0.15)";
ctx.fill();

ctx.beginPath();
ctx.arc(
    moonScreenX,
    moonScreenY,
    stage2Moon.gravityWindowOuter,
    0,
    Math.PI * 2
);
ctx.strokeStyle = "rgba(200, 200, 200, 0.7)";
ctx.lineWidth = 2;
ctx.stroke();

ctx.beginPath();
ctx.arc(
    moonScreenX,
    moonScreenY,
    stage2Moon.gravityWindowInner,
    0,
    Math.PI * 2
);
ctx.strokeStyle = "rgba(200, 200, 200, 0.7)";
ctx.lineWidth = 2;
ctx.stroke();

ctx.beginPath();
ctx.arc(
    stage2Moon.x - camera.x,
    stage2Moon.y - camera.y,
    stage2Moon.radius,
    0,
    Math.PI * 2
);


const currentTime = performance.now();
const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.05);
lastTime = currentTime;

missionTime += deltaTime;
const hours = Math.floor(missionTime/3600);
const minutes = Math.floor((missionTime % 3600) / 60);
const seconds = Math.floor (missionTime % 60)

missionTimeDisplay.textContent =
`MISSION ELAPSED : ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

stage2Spacecraft.accelerationX = 0;
stage2Spacecraft.accelerationY = 0;
stage2Spacecraft.angularAcceleration = 0;

if (keys["ArrowRight"]) {
    stage2Spacecraft.angularAcceleration +=0.8
  
}
if (keys["ArrowLeft"]) {
    stage2Spacecraft.angularAcceleration +=-0.8
}
if (keys["ArrowUp"]) {
    stage2Spacecraft.accelerationX = Math.cos(stage2Spacecraft.angle) * mainThrust;
    stage2Spacecraft.accelerationY = Math.sin(stage2Spacecraft.angle) * mainThrust;
}
if (keys["ArrowDown"]) {
    stage2Spacecraft.accelerationX = Math.cos(stage2Spacecraft.angle) * reverseThrust;
    stage2Spacecraft.accelerationY = Math.sin(stage2Spacecraft.angle) * reverseThrust;
}

stage2Spacecraft.angularVelocity *= Math.pow(0.60, deltaTime);
stage2Spacecraft.velocityX *= Math.pow(0.95, deltaTime);
stage2Spacecraft.velocityY *= Math.pow(0.95, deltaTime);

const deltaX = stage2Moon.x - stage2Spacecraft.x;
const deltaY = stage2Moon.y - stage2Spacecraft.y;
const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
 
        
stage2Spacecraft.velocityX += stage2Spacecraft.accelerationX * deltaTime;
stage2Spacecraft.velocityY += stage2Spacecraft.accelerationY * deltaTime;
stage2Spacecraft.angularVelocity += stage2Spacecraft.angularAcceleration * deltaTime;
stage2Spacecraft.angle += stage2Spacecraft.angularVelocity * deltaTime;
stage2Spacecraft.x += stage2Spacecraft.velocityX * deltaTime;
stage2Spacecraft.y += stage2Spacecraft.velocityY * deltaTime;

const speed = Math.sqrt(
    stage2Spacecraft.velocityX ** 2 + stage2Spacecraft.velocityY ** 2
);

const velocityKms = speed * kmPerUnit;
velocityDisplay.textContent = `VELOCITY : ${velocityKms.toFixed(1)} km/s`;

if (speed > maximumSpeed) {
    stage2Spacecraft.velocityX = (stage2Spacecraft.velocityX / speed) * (maximumSpeed);
    stage2Spacecraft.velocityY = (stage2Spacecraft.velocityY / speed) * (maximumSpeed);
}
camera.x = stage2Spacecraft.x - canvas.width / 2;
camera.y = stage2Spacecraft.y - canvas.height / 2;
camera.x = Math.max(0, Math.min(camera.x, worldWidth - canvas.width));
camera.y = Math.max(0, Math.min(camera.y, worldHeight - canvas.height));


frameCount++;

if (performance.now() - fpsStartTime >= 1000) {
    fps = frameCount;
    frameCount = 0;
    fpsStartTime = performance.now();
    fpsCounter.textContent = `FPS: ${fps}`;
}

if (stage2Spacecraft.x < 0) {
    stage2Spacecraft.x = 0;
    stage2Spacecraft.velocityX = 0;
}

if (stage2Spacecraft.x > worldWidth) {
    stage2Spacecraft.x = worldWidth;
    stage2Spacecraft.velocityX = 0;
}

if (stage2Spacecraft.y < 0) {
    stage2Spacecraft.y = 0;
    stage2Spacecraft.velocityY = 0;
}

if (stage2Spacecraft.y > worldHeight) {
    stage2Spacecraft.y = worldHeight;
    stage2Spacecraft.velocityY = 0;
}

flightPath.push({
    x: stage2Spacecraft.x,
    y: stage2Spacecraft.y
});
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

ctx.translate(
    stage2Spacecraft.x - camera.x,
    stage2Spacecraft.y - camera.y
);

ctx.rotate(stage2Spacecraft.angle);


// ========================
// SERVICE MODULE
// ========================

ctx.fillStyle = '#b3b2bc';

ctx.beginPath();
ctx.rect(-18, -12, 30, 24);
ctx.fill();

// ========================
// S-BAND HIGH-GAIN ANTENNA
// ========================

// Antenna boom
ctx.strokeStyle = '#777777';
ctx.lineWidth = 1;

ctx.beginPath();
ctx.moveTo(-15, 12);
ctx.lineTo(-15, 19);
ctx.stroke();

// ========================
// S-BAND HIGH-GAIN ANTENNA
// ========================

// ========================
// S-BAND HIGH-GAIN ANTENNA
// ========================

// Vertical boom
ctx.strokeStyle = '#2c2c2c';
ctx.lineWidth = 1;

ctx.beginPath();
ctx.moveTo(-15, 12);
ctx.lineTo(-15, 19);
ctx.stroke();

// Two S-band antenna elements
ctx.fillStyle = '#222222';

// Upper element
ctx.beginPath();
ctx.moveTo(-15, 14);
ctx.quadraticCurveTo(-12, 14.5, -12, 15.2);
ctx.quadraticCurveTo(-12, 16, -15, 16.2);
ctx.quadraticCurveTo(-13, 15.6, -13, 15);
ctx.closePath();
ctx.fill();

// Lower element
ctx.beginPath();
ctx.moveTo(-15, 16.5);
ctx.quadraticCurveTo(-12, 17, -12, 17.7);
ctx.quadraticCurveTo(-12, 18.5, -15, 18.7);
ctx.quadraticCurveTo(-13, 18, -13, 17.5);
ctx.closePath();
ctx.fill();

// ========================
// TOP RCS CLUSTER
// ========================

ctx.fillStyle = '#2d2c2c';

// Central meeting point
const rcsTopX = -2;
const rcsTopY = -13;

// Top nozzle
ctx.beginPath();
ctx.moveTo(rcsTopX, rcsTopY);
ctx.lineTo(rcsTopX - 1.2, rcsTopY - 2.4);
ctx.lineTo(rcsTopX + 1.2, rcsTopY - 2.4);
ctx.closePath();
ctx.fill();

// Left nozzle
ctx.beginPath();
ctx.moveTo(rcsTopX, rcsTopY);
ctx.lineTo(rcsTopX - 2.4, rcsTopY - 1.2);
ctx.lineTo(rcsTopX - 2.4, rcsTopY + 1.2);

ctx.closePath();
ctx.fill();

// Right nozzle
ctx.beginPath();
ctx.moveTo(rcsTopX, rcsTopY);
ctx.lineTo(rcsTopX + 2.4, rcsTopY - 1.2);
ctx.lineTo(rcsTopX + 2.4, rcsTopY + 1.2);
ctx.closePath();
ctx.fill();

// ========================
// BOTTOM RCS CLUSTER
// ========================

ctx.fillStyle = '#2d2c2c';

// Central meeting point
const rcsBottomX = -2;
const rcsBottomY = 13;

// Bottom nozzle
ctx.beginPath();
ctx.moveTo(rcsBottomX, rcsBottomY);
ctx.lineTo(rcsBottomX - 1.2, rcsBottomY - 2.4);
ctx.lineTo(rcsBottomX + 1.2, rcsBottomY - 2.4);
ctx.closePath();
ctx.fill();

// Left nozzle
ctx.beginPath();
ctx.moveTo(rcsBottomX, rcsBottomY);
ctx.lineTo(rcsBottomX - 2.4, rcsBottomY - 1.2);
ctx.lineTo(rcsBottomX - 2.4, rcsBottomY + 1.2);
ctx.closePath();
ctx.fill();

// Right nozzle
ctx.beginPath();
ctx.moveTo(rcsBottomX, rcsBottomY);
ctx.lineTo(rcsBottomX + 2.4, rcsBottomY - 1.2);
ctx.lineTo(rcsBottomX + 2.4, rcsBottomY + 1.2);
ctx.closePath();
ctx.fill();

// ========================
// COMMAND MODULE
// ========================

ctx.fillStyle = '#787777';

ctx.beginPath();

ctx.moveTo(11, -12);
ctx.lineTo(23.5, -4.2);

// tiny rounded upper corner
ctx.quadraticCurveTo(25, -4, 25, -2.5);

ctx.lineTo(25, 2.5);

// tiny rounded lower corner
ctx.quadraticCurveTo(25, 4, 23.5, 4.2);

ctx.lineTo(11, 12);

ctx.closePath();
ctx.fill();


// ========================
// ENGINE / NOZZLE
// ========================

ctx.fillStyle = '#2d2c2c';

ctx.beginPath();
ctx.moveTo(-18, -5);
ctx.lineTo(-34, -9);
ctx.lineTo(-34, 9);
ctx.lineTo(-18, 5);
ctx.closePath();
ctx.fill();

// ========================
// LUNAR MODULE
// ========================

// ASCENT STAGE
ctx.fillStyle = '#9b9b96';

ctx.beginPath();
ctx.rect(23, -12, 20, 25);
ctx.fill();


// DESCENT STAGE
ctx.fillStyle = '#b58a3c';

ctx.beginPath();
ctx.rect(43, -14, 20, 29);
ctx.fill();


// LM LEGS
ctx.strokeStyle = '#777777';
ctx.lineWidth = 3;

ctx.beginPath();

// Top-right leg
ctx.moveTo(63, -14);
ctx.lineTo(73, -24);

// Bottom-right leg
ctx.moveTo(63, 15);
ctx.lineTo(73, 25);

ctx.strokeStyle = '#b58a3c';
ctx.stroke();

// MAIN ENGINE FLAME

if (keys["ArrowUp"]) {
    
    const flameLength = Math.random() * 6 + 8;
    ctx.fillStyle = "rgba(255, 230, 129, 0.8)";

    ctx.beginPath();
    ctx.moveTo(-34, -4);
    ctx.lineTo(-46 - flameLength, 0);
    ctx.lineTo(-34, 4);
    ctx.closePath();
    ctx.fill();
}

// REVERSE RCS TOP
if (keys["ArrowDown"]) {
    const flameLength = Math.random() * 2 + 2;

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.beginPath();

    ctx.moveTo(0.4, -13);
    ctx.lineTo(5.8 + flameLength, -13.2);
    ctx.lineTo(5.8 + flameLength, -11.8);

    ctx.closePath();
    ctx.fill();
}


// REVERSE RCS BOTTOM //
if (keys["ArrowDown"]) {
    const flameLength = Math.random() * 2 + 2;

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.beginPath();

    ctx.moveTo(0.4, 13);
    ctx.lineTo(5.8 + flameLength, 12.8);
    ctx.lineTo(5.8 + flameLength, 14.2);

    ctx.closePath();
    ctx.fill();
}

// ROTATIONAL RCS FLAMES //

// TOP-RIGHT — LEFT ROTATION → plume RIGHT //
if (keys["ArrowLeft"]) {
    const flameLength = Math.random() * 2 + 2;

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.beginPath();

    ctx.moveTo(0.4, -13);
    ctx.lineTo(5.8 + flameLength, -13.2);
    ctx.lineTo(5.8 + flameLength, -11.8);

    ctx.closePath();
    ctx.fill();
}


// BOTTOM-LEFT — LEFT ROTATION → plume LEFT //
if (keys["ArrowLeft"]) {
    const flameLength = Math.random() * 2 + 2;

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.beginPath();

    ctx.moveTo(-4.4, 13);
    ctx.lineTo(-9.8 - flameLength, 12.8);
    ctx.lineTo(-9.8 - flameLength, 14.2);

    ctx.closePath();
    ctx.fill();
}


// BOTTOM-RIGHT — RIGHT ROTATION → plume RIGHT //
if (keys["ArrowRight"]) {
    const flameLength = Math.random() * 2 + 2;

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.beginPath();

    ctx.moveTo(0.4, 13);
    ctx.lineTo(5.8 + flameLength, 12.8);
    ctx.lineTo(5.8 + flameLength, 14.2);

    ctx.closePath();
    ctx.fill();
}


// TOP-LEFT — RIGHT ROTATION → plume LEFT //
if (keys["ArrowRight"]) {
    const flameLength = Math.random() * 2 + 2;

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.beginPath();

    ctx.moveTo(-4.4, -13);
    ctx.lineTo(-9.8 - flameLength, -13.2);
    ctx.lineTo(-9.8 - flameLength, -11.8);

    ctx.closePath();
    ctx.fill();
}

ctx.restore();     
requestAnimationFrame(gameLoop2);
}
