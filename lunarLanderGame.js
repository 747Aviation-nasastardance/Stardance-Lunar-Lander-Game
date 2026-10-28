                console.log("JavaScript connected!");
                const canvas = document.getElementById('gamecanvas');
                const lunarModuleEagle = new Image();
                lunarModuleEagle.src = 'images/Apollo-Lunar-Module-measured.png';
                const lunarSurface = new Image();
                lunarSurface.onload = function() {
                console.log("Moon surface loaded!");
                };
                lunarSurface.src = 'images/moon-surface.png';
                const apolloHud = document.getElementById('apollo-hud');
                const velocityDisplay = document.getElementById('velocity');
                const altitudeDisplay = document.getElementById('altitude');
                const descentRateDisplay = document.getElementById('descent-rate');
                const fuelBar = document.getElementById('fuel-bar');
                const csmStatusCanvas = document.getElementById('lm-status-canvas');
                const csmStatusctx = csmStatusCanvas.getContext('2d');
                const ctx = canvas.getContext('2d');
                let gameRunning = false;
                let crashed = false;
                let landed = false;
                const fpsCounter = document.getElementById('fps-Counter');
                const crashScreen = document.getElementById('crash-screen');
                const landedScreen = document.getElementById('landed-screen');
                
                document.getElementById('briefing-next-1').addEventListener('click', function() {
                    document.getElementById('briefing-page-1').style.display = 'none';
                    document.getElementById('briefing-page-2').style.display = 'block';
                });
                document.getElementById('briefing-back-2').addEventListener('click', function() {
                    document.getElementById('briefing-page-2').style.display = 'none';
                    document.getElementById('briefing-page-1').style.display = 'block';
                });
                document.getElementById('begin-mission-button').addEventListener('click', function() {
                    document.getElementById('mission-briefing').style.display = 'none';
                    lunarModuleEagle.style.display = 'block';
                    document.getElementById('lunar-module').style.display = 'none';
                    gameRunning = true;
                });
                landedScreen.style.display = 'none';
                const stars = [];
                for (let i = 0; i < 400; i++) {
                    stars.push({
                        x: Math.random() *canvas.width,
                        y: Math.random() * canvas.height,
                        size: 2
                    });
                }

                const moon = { 
                    x: canvas.width / 2,
                    y: canvas.height / 2 -100,
                    radius: 500
                }
                const moonGravity = 1.62;

                const lander = {
                    x: canvas.width / 2,
                    y: canvas.height / 5 - 100,
                    velocityX: 0,
                    velocityY: 80,
                    rotation: -0.05,
                    accelerationX: 0,
                    accelerationY: 0,
                    angularVelocity: 0,
                    angularAcceleration: 0
                }

                const kmPerUnit = 0.058;
                const mainThrust = 3.5;
                const reverseThrust = -2.1;
                const lateralThrust = 20;
                const maximumSpeed = 60;
                const maximumRotationSpeed = 2;
                let fuel = 100;

                let fps = 0;
                let frameCount = 0;
                let fpsStartTime = performance.now();
                let lastTime = performance.now();

                let leftTopRcsFiring = false;
                let rightTopRcsFiring = false;
                let leftBottomRcsFiring = false;
                let rightBottomRcsFiring = false;
                let leftCenterRcsFiring = false;
                let rightCenterRcsFiring = false;
                let mainEngineFiring = false;

                const lunarSurfaceTerrainPoints = [
                { x: 0,    y: 351 },
                { x: 57,   y: 356 },
                { x: 170,  y: 430 },
                { x: 229,  y: 440 },
                { x: 421,  y: 452 },
                { x: 479,  y: 452 },
                { x: 1280, y: 452 },
                ]


                const landingZoneStartX = 665;
                const landingZoneEndX = 756;
                const landingZoneY = 452;


                const keys = {};
                window.addEventListener('keyup', function (event)  {
                    keys[event.key] = false;
                });
                window.addEventListener('keydown', function (event)  {
                    keys[event.key] = true;
                });

            window.addEventListener('keydown', function (event) {
            keys[event.key] = true;
                if (event.key === 'r') {
                if (confirm('Are You Sure That You Want To Reset The Flight?')) {
                    lander.x = canvas.width / 2,
                    lander.y = canvas.height / 5 - 100,           
                    lander.velocityX = 0;
                    lander.velocityY = 100;
                    lander.accelerationX = 0;
                    lander.accelerationY = 0;
                    lander.angularVelocity = 0;
                    lander.angularAcceleration = 0;
                    lander.rotation = -0.05;         
                    crashed = false;   
                    fuel = 100;
                    leftTopRcsFiring = false;
                    rightTopRcsFiring = false;
                    leftBottomRcsFiring = false;
                    rightBottomRcsFiring = false;
                    leftCenterRcsFiring = false;
                    rightCenterRcsFiring = false;
                    mainEngineFiring = false;
                    crashScreen.style.display = 'none';
                    landedScreen.style.display = 'none';

                }
            }

        });

            console.log('Game running!');
            function gameloop() {
                if (!gameRunning) {
                requestAnimationFrame(gameloop);
                return;
                }
                frameCount++;

                if (performance.now() - fpsStartTime >= 1000) {
                    fps = frameCount;
                    frameCount = 0;
                    fpsStartTime = performance.now();
                    fpsCounter.textContent = `FPS: ${fps}`;
                }

                const currentTime = performance.now();
                const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.05);
                lastTime = currentTime;

                lander.accelerationX = 0;
                lander.accelerationY = 0;
                lander.angularAcceleration = 0;
                lander.accelerationY += moonGravity;

                leftTopRcsFiring = false;
                rightTopRcsFiring = false;
                leftBottomRcsFiring = false;
                rightBottomRcsFiring = false;
                leftCenterRcsFiring = false;
                rightCenterRcsFiring = false;
                mainEngineFiring = false;


                if (keys['ArrowRight']) {
                    lander.angularAcceleration +=0.8
                    lander.accelerationX += lateralThrust * Math.cos(lander.rotation);
                    lander.accelerationY += lateralThrust * Math.sin(lander.rotation);
                    leftCenterRcsFiring = true;
                    leftBottomRcsFiring = true;
                    rightTopRcsFiring = true;
                    
                }
                if (keys['ArrowLeft']) {
                    lander.angularAcceleration +=-0.8
                    lander.accelerationX += -lateralThrust * Math.cos(lander.rotation);
                    lander.accelerationY += -lateralThrust * Math.sin(lander.rotation);
                    rightCenterRcsFiring = true;
                    rightBottomRcsFiring = true;
                    leftTopRcsFiring = true;
                }
                if (keys['ArrowUp']) {
                    
                    if (fuel > 0){
                    lander.accelerationX = Math.sin(lander.rotation) * mainThrust;
                    lander.accelerationY += -Math.cos(lander.rotation) * mainThrust;
                    mainEngineFiring = true;

                    fuel -= 10 * deltaTime;
                    }                
                }
                if (keys['ArrowDown']) {
                    lander.accelerationX = Math.sin(lander.rotation) * reverseThrust;
                    lander.accelerationY += -Math.cos(lander.rotation) * reverseThrust;
                    leftTopRcsFiring = true;
                    rightTopRcsFiring = true;
                }


                lander.velocityX += lander.accelerationX * deltaTime;
                lander.velocityY += lander.accelerationY * deltaTime;
                const speed = Math.sqrt(
                    lander.velocityX ** 2 + lander.velocityY ** 2
                );

                const gameUnitsToFeet = 1.4044;

                const velocityKms = speed * kmPerUnit;
                velocityDisplay.textContent = `Velocity : ${velocityKms.toFixed(1)} km/h`;
                const descentRate = (-lander.velocityY) * gameUnitsToFeet;

                const surfaceY = 500;
                const altitude = (surfaceY- lander.y) * gameUnitsToFeet;
                altitudeDisplay.textContent = `Altitude : ${altitude.toFixed(1)} feet`;

                descentRateDisplay.textContent = `Descent Rate : ${descentRate.toFixed(1)} fpm`;

                fuelBar.style.width = `${Math.max(0, fuel)}%`;

                if (speed > maximumSpeed) {
                    lander.velocityX = (lander.velocityX / speed) * (maximumSpeed);
                    lander.velocityY = (lander.velocityY / speed) * (maximumSpeed);
                }

                lander.x += lander.velocityX * deltaTime;
                lander.y += lander.velocityY * deltaTime;
                lander.angularVelocity += lander.angularAcceleration * deltaTime;
                
                if (lander.angularVelocity > maximumRotationSpeed) {
                    lander.angularVelocity = maximumRotationSpeed;
                }

                if (lander.angularVelocity < -maximumRotationSpeed) {
                    lander.angularVelocity = -maximumRotationSpeed;
                }
                lander.rotation += lander.angularVelocity * deltaTime;    
                lander.angularVelocity *= Math.pow(0.50, deltaTime);
                lander.velocityX *= Math.pow(0.90, deltaTime);
                lander.velocityY *= Math.pow(0.90, deltaTime);

                if (crashed === true) {
                    lander.velocityY = 0;
                    lander.velocityX = 0;
                    lander.angularVelocity = 0;
                    lander.angularAcceleration = 0;
                    leftBottomRcsFiring = false;
                    rightBottomRcsFiring = false;
                    leftTopRcsFiring = false;
                    rightTopRcsFiring = false;
                    leftCenterRcsFiring = false;
                    rightCenterRcsFiring = false;
                    mainEngineFiring = false;
                    ArrowLeft = false;
                    ArrowRight = false;
                    ArrowUp = false;
                    ArrowDown = false;
                    }

                if (landed === true) {
                    lander.velocityY = 0;
                    lander.velocityX = 0;
                    lander.angularVelocity = 0;
                    lander.angularAcceleration = 0;
                    leftBottomRcsFiring = false;
                    rightBottomRcsFiring = false;
                    leftTopRcsFiring = false;
                    rightTopRcsFiring = false;
                    leftCenterRcsFiring = false;
                    rightCenterRcsFiring = false;
                    mainEngineFiring = false;
                    ArrowLeft = false;
                    ArrowRight = false;
                    ArrowUp = false;
                    ArrowDown = false;
                    }                

                if (lander.x < 0) {
                    lander.x = 0;
                    lander.velocityX = 0;
                }

                if (lander.x > canvas.width) {
                    lander.x = canvas.width;
                    lander.velocityX = 0;
                }

                if (lander.y < 0) {
                    lander.y = 0;
                    lander.velocityY = 0;
                }

                if (lander.y > canvas.height) {
                    lander.y = canvas.height;
                    lander.velocityY = 0;
                }


                ctx.fillStyle = '#050B1a';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'white';

                for (let i = 0; i < stars.length; i++) {

                    ctx.fillRect(
                        stars[i].x,
                        stars[i].y,
                        stars[i].size,
                        stars[i].size
                    );

                }

                ctx.drawImage(lunarSurface, 0, 0, canvas.width, canvas.height);

                ctx.save();

                const landingAreaGlow = ctx.createLinearGradient(
                    0, landingZoneY + 30,
                    0, landingZoneY + 46,
                )

                landingAreaGlow.addColorStop(0, "rgba(255, 255, 255, 0.30)");
                landingAreaGlow.addColorStop(1, "rgb(255, 255, 255)");

                ctx.fillStyle = landingAreaGlow;

                ctx.beginPath();
                ctx.moveTo(landingZoneStartX - 15, landingZoneY + 30);
                ctx.lineTo(landingZoneStartX, landingZoneY + 46);
                ctx.lineTo(landingZoneEndX, landingZoneY + 46);
                ctx.lineTo(landingZoneEndX + 15, landingZoneY + 30);
                ctx.closePath();
                ctx.fill();


                ctx.strokeStyle = "white"
                ctx.beginPath();
                ctx.moveTo(landingZoneStartX - 15, landingZoneY + 25);
                ctx.lineTo(landingZoneStartX, landingZoneY + 46);
                ctx.lineTo(landingZoneEndX, landingZoneY + 46);
                ctx.lineTo(landingZoneEndX + 15, landingZoneY + 25);
                ctx.stroke();
            
                ctx.restore();

                const terrainY = getTerrainY(lander.x);
                
                if (lander.y >= terrainY) {
                    
                    if (!landed && descentRate < - 10) {
                        crashed = true
                        crashScreen.style.display = 'flex';
                    }
                    
                    if (lander.x >= landingZoneStartX && lander.x <= landingZoneEndX && descentRate >= -10 && crashed === false) {
                        landed = true;
                        landedScreen.style.display = 'flex';
                        
                    }
                    lander.y = terrainY;
                    lander.velocityY = -0.2 * lander.velocityY;
                    lander.angularVelocity = 0; 
                
                    
                }


            ctx.save();

                ctx.translate(lander.x, lander.y);
                ctx.rotate(lander.rotation);
                ctx.drawImage(lunarModuleEagle, -50, -50, 100, 100,)

                
                
                if (mainEngineFiring) {

                const flameLength = Math.random() * 4 + 3;
                ctx.fillStyle = "rgba(255, 246, 184, 0.9)";
                ctx.beginPath();
                ctx.moveTo(-7, 34);
                ctx.lineTo(-13, 45 + flameLength);
                ctx.lineTo(6, 45 + flameLength);
                ctx.lineTo(0, 34)
                ctx.closePath();
                ctx.fill();
                }


                if (leftTopRcsFiring) {
                
                ctx.fillStyle = "white"

                ctx.beginPath();
                ctx.moveTo(-32, -16)
                ctx.lineTo(-31, - 25)
                ctx.lineTo(-33, - 25)
                ctx.closePath();
                ctx.fill();
                }

                if (leftBottomRcsFiring) {
                
                ctx.fillStyle = "white"

                ctx.beginPath();
                ctx.moveTo(-32, -16)
                ctx.lineTo(-31, - 7)
                ctx.lineTo(-33, - 7)
                ctx.closePath();
                ctx.fill();
                }

                if (leftCenterRcsFiring) {
                
                ctx.fillStyle = "white"

                ctx.beginPath();
                ctx.moveTo(-32, -16)
                ctx.lineTo(-42, - 15)
                ctx.lineTo(-42, - 17)
                ctx.closePath();
                ctx.fill();
                }
                
                if (rightTopRcsFiring) {
                
                ctx.fillStyle = "white"

                ctx.beginPath();
                ctx.moveTo(25, - 16)
                ctx.lineTo(24, - 25)
                ctx.lineTo(26, - 25)
                ctx.closePath();
                ctx.fill();
                }

                if (rightBottomRcsFiring) {
                
                ctx.fillStyle = "white"

                ctx.beginPath();
                ctx.moveTo(25, - 16)
                ctx.lineTo(24, - 7)
                ctx.lineTo(26, - 7)
                ctx.closePath();
                ctx.fill();
                }

                if (rightCenterRcsFiring) {
                
                ctx.fillStyle = "white"

                ctx.beginPath();
                ctx.moveTo(25, - 15)
                ctx.lineTo(35, - 14)
                ctx.lineTo(35, - 16)
                ctx.closePath();
                ctx.fill();
                }
            ctx.restore();

                            
            ctx.save();
            if (crashed) {

                ctx.translate(lander.x + 10, lander.y);
                ctx.fillStyle = "rgba(255, 212, 111, 0.85)";
                const flameLength = Math.random() * 15 + 3;



            ctx.fillStyle = "rgba(233, 128, 0, 0.77)";
            ctx.beginPath();

            ctx.moveTo(-45, 45);

            ctx.quadraticCurveTo(-65, 25, -55, 5);
            ctx.quadraticCurveTo(-65, -15, -48, -30);

            ctx.quadraticCurveTo(-50, -50, -35, -65);
            ctx.quadraticCurveTo(-34, -45, -25, -35);

            ctx.quadraticCurveTo(-28, -65, -15, -85 - flameLength);
            ctx.quadraticCurveTo(-10, -58, -2, -45);

            ctx.quadraticCurveTo(5, -75, 18, -92 - flameLength * 0.7);
            ctx.quadraticCurveTo(17, -55, 25, -40);

            ctx.quadraticCurveTo(40, -58, 48, -70);
            ctx.quadraticCurveTo(45, -40, 37, -20);

            ctx.quadraticCurveTo(55, -30, 62, -45);
            ctx.quadraticCurveTo(65, -15, 50, 5);

            ctx.quadraticCurveTo(62, 25, 42, 45);

            ctx.quadraticCurveTo(15, 58, -10, 55);
            ctx.quadraticCurveTo(-32, 58, -45, 45);

            ctx.closePath();
            ctx.fill();



            ctx.fillStyle = "rgba(255, 122, 22, 0.8)";
            ctx.beginPath();

            ctx.moveTo(-34, 42);

            ctx.quadraticCurveTo(-50, 25, -40, 5);
            ctx.quadraticCurveTo(-47, -12, -34, -25);

            ctx.quadraticCurveTo(-35, -42, -25, -55);
            ctx.quadraticCurveTo(-23, -35, -15, -25);

            ctx.quadraticCurveTo(-18, -55, -7, -70 - flameLength * 0.7);
            ctx.quadraticCurveTo(-3, -42, 4, -30);

            ctx.quadraticCurveTo(10, -55, 19, -68 - flameLength * 0.5);
            ctx.quadraticCurveTo(19, -38, 26, -25);

            ctx.quadraticCurveTo(37, -42, 43, -50);
            ctx.quadraticCurveTo(42, -25, 34, -8);

            ctx.quadraticCurveTo(45, 8, 34, 25);

            ctx.quadraticCurveTo(22, 43, 5, 45);
            ctx.quadraticCurveTo(-18, 48, -34, 42);

            ctx.closePath();
            ctx.fill();



            ctx.fillStyle = "rgba(255, 216, 61, 0.9)";
            ctx.beginPath();

            ctx.moveTo(-22, 38);

            ctx.quadraticCurveTo(-34, 22, -25, 5);
            ctx.quadraticCurveTo(-31, -8, -21, -20);

            ctx.quadraticCurveTo(-20, -35, -13, -45);
            ctx.quadraticCurveTo(-11, -25, -5, -15);

            ctx.quadraticCurveTo(-7, -40, 2, -52 - flameLength * 0.4);
            ctx.quadraticCurveTo(5, -27, 10, -15);

            ctx.quadraticCurveTo(17, -35, 23, -42);
            ctx.quadraticCurveTo(23, -20, 18, -5);

            ctx.quadraticCurveTo(30, 10, 20, 25);

            ctx.quadraticCurveTo(10, 40, -5, 42);
            ctx.quadraticCurveTo(-16, 43, -22, 38);

            ctx.closePath();
            ctx.fill();
            }

            ctx.restore();
            requestAnimationFrame(gameloop);
                }
            requestAnimationFrame(gameloop);

            function getTerrainY(x) {
            for (let pointIndex = 0; pointIndex < lunarSurfaceTerrainPoints.length - 1; pointIndex++) {
                const p1 = lunarSurfaceTerrainPoints[pointIndex];
                const p2 = lunarSurfaceTerrainPoints[pointIndex + 1];

            if (x >= p1.x && x <= p2.x) {
                const terrainY = p1.y + ((x - p1.x) / (p2.x - p1.x)) * (p2.y - p1.y);
                return terrainY;
                }
            }

        }
