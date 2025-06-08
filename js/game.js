// js/game.js (Cập nhật cuối cùng)

import { allAudio, stopAllSounds } from './audio.js';
import { LEVELS } from './constants.js';
import { state } from './state.js';
import { images } from './loader.js';
import { showPopup, hidePopup, showStoryScene, showScreen } from './ui.js';

let gameInterval;
let dx = 1, dy = 0;
let changingDirection = false;

export function setDirection(keyPressed) {
    if (changingDirection) return;
    changingDirection = true;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;
    if ((keyPressed === 'ArrowLeft' || keyPressed === 'a') && !goingRight) { dx = -1; dy = 0; }
    if ((keyPressed === 'ArrowRight' || keyPressed === 'd') && !goingLeft) { dx = 1; dy = 0; }
    if ((keyPressed === 'ArrowUp' || keyPressed === 'w') && !goingDown) { dx = 0; dy = -1; }
    if ((keyPressed === 'ArrowDown' || keyPressed === 's') && !goingUp) { dx = 0; dy = 1; }
}

// KHÔI PHỤC: Logic hiển thị câu chuyện đầu màn chơi
export function startGame() {
    const levelIndex = state.currentLevelIndex;
    const storyKey = `level_${levelIndex + 1}`;
    
    // Hiện câu chuyện của màn chơi trước, sau đó mới vào game
    showStoryScene(storyKey, () => {
        hidePopup('world-map-screen');
        showScreen('game-area');
        initializeLevelGameplay(levelIndex);
    });
}

function initializeLevelGameplay(levelIndex) {
    dx = 1; dy = 0;
    stopAllSounds();
    allAudio.bgm.play().catch(e => console.error("Lỗi bật nhạc:", e));
    
    clearInterval(gameInterval);
    gameInterval = null;

    const canvas = document.getElementById('game-canvas');
    const scoreElement = document.getElementById('score');
    const ctx = canvas.getContext('2d');
    
    const levelData = LEVELS[levelIndex];
    const gridSize = 40;
    const baseGameSpeed = 150;
    let currentGameSpeed = baseGameSpeed;

    let score = 0;
    scoreElement.textContent = 0;
    const winScore = levelData.winScore;
    changingDirection = false;
    
    // KHÔI PHỤC: Logic vật phẩm
    let isShieldActive = false;

    const startPos = levelData.startPos || { x: 10, y: 10 };
    const fox = { body: [{ x: startPos.x, y: startPos.y }, { x: startPos.x - 1, y: startPos.y }, { x: startPos.x - 2, y: startPos.y }]};
    let loveTrace = {};
    const obstacles = levelData.obstacles;
    const hedgehogs = JSON.parse(JSON.stringify(levelData.hedgehogs || []));
    // KHÔI PHỤC: Sao chép mảng powerups để có thể xóa vật phẩm đã ăn
    let powerups = JSON.parse(JSON.stringify(levelData.powerups || [])); 
    let hedgehogMoveCounter = 0;

    function onLevelComplete() {
        stopAllSounds();
        allAudio.levelComplete.play();
        clearInterval(gameInterval);
        gameInterval = null;
        localStorage.setItem(`level_unlocked_${levelIndex + 2}`, 'true');
        
        const nextLevelIndex = state.currentLevelIndex + 1;
        if (nextLevelIndex >= LEVELS.length) {
            showStoryScene('gameOutro', () => {
                alert("BẠN ĐÃ GIẢI CỨU THÀNH CÔNG SÓC YÊU! CHÚC MỪNG!");
                showScreen('main-menu');
            });
        } else {
            showPopup('level-complete-screen');
        }
    }

    function createLoveTrace() {
        const gridWidth = canvas.width / gridSize;
        const gridHeight = canvas.height / gridSize;
        let isOverlapping;
        do {
            loveTrace.x = Math.floor(Math.random() * gridWidth);
            loveTrace.y = Math.floor(Math.random() * gridHeight);
            isOverlapping = fox.body.some(part => part.x === loveTrace.x && part.y === loveTrace.y) ||
                            (obstacles || []).some(obs => obs.x === loveTrace.x && obs.y === loveTrace.y) ||
                            (powerups || []).some(p => p.x === loveTrace.x && p.y === loveTrace.y);
        } while (isOverlapping);
    }
    
    function drawPart(image, part, rotation = 0) {
        if (!image || !image.complete || image.naturalHeight === 0) return;
        ctx.save();
        ctx.translate(part.x * gridSize + gridSize / 2, part.y * gridSize + gridSize / 2);
        ctx.rotate(rotation);
        ctx.drawImage(image, -gridSize / 2, -gridSize / 2, gridSize, gridSize);
        ctx.restore();
    }
    
    function getRotation(fromPart, toPart) {
        if (toPart.x > fromPart.x) return Math.PI / 2;
        if (toPart.x < fromPart.x) return -Math.PI / 2;
        if (toPart.y > fromPart.y) return Math.PI;
        return 0;
    }
    
    function drawFox() {
        const foxHeadImg = images.foxHead;
        const foxBodyImg = images.foxBody;
        const foxTailImg = images.foxTailTip;
        
        let headRotation = 0;
        if (dx === 1) headRotation = Math.PI / 2; else if (dx === -1) headRotation = -Math.PI / 2; else if (dy === 1) headRotation = Math.PI;
        drawPart(foxHeadImg, fox.body[0], headRotation);

        for (let i = 1; i < fox.body.length; i++) {
            const part = fox.body[i];
            const prevPart = fox.body[i - 1];
            const rotation = getRotation(part, prevPart);
            const imageToDraw = (i === fox.body.length - 1) ? foxTailImg : foxBodyImg;
            drawPart(imageToDraw, part, rotation);
        }
        // KHÔI PHỤC: Vẽ hiệu ứng khiên
        if (isShieldActive) {
            ctx.beginPath();
            ctx.arc(fox.body[0].x * gridSize + gridSize / 2, fox.body[0].y * gridSize + gridSize / 2, gridSize * 0.7, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(135, 206, 250, 0.5)";
            ctx.fill();
            ctx.strokeStyle = "rgba(30, 144, 255, 0.8)";
            ctx.stroke();
        }
    }
    
    // KHÔI PHỤC: Hàm vẽ các vật phẩm
    function drawPowerups() {
        powerups.forEach(p => {
            const imgKey = p.type === 'shield' ? 'shield_powerup' : 'slowmo_powerup';
            const powerupImg = images[imgKey];
            if (powerupImg) {
                drawPart(powerupImg, p);
            }
        });
    }

    function drawObstacles() {
        const obsImgKey = levelData.obstacleImageKey || 'obstacle_tree';
        const obsImg = images[obsImgKey];
        if (!obsImg || !obstacles) return;
        obstacles.forEach(obs => drawPart(obsImg, obs));
    }

    function drawHedgehogs() {
        const hedgehogImg = images.hedgehog;
        if (!hedgehogImg || !hedgehogs) return;
        hedgehogs.forEach(h => drawPart(hedgehogImg, h));
    }
    
    function drawLoveTraceItem() {
        if(images.loveTrace && loveTrace.x !== undefined) {
            drawPart(images.loveTrace, loveTrace);
        }
    }

    function updateHedgehogs() {
        if (!hedgehogs) return;
        hedgehogMoveCounter++;
        if (hedgehogMoveCounter < 2) return;
        hedgehogMoveCounter = 0;
        
        hedgehogs.forEach(h => {
            h.x += h.dx; h.y += h.dy; h.moved++;
            if (h.moved >= h.range) {
                h.dx *= -1; h.dy *= -1; h.moved = 0;
            }
        });
    }

    function isGameOver(head) {
        const gridWidth = canvas.width / gridSize;
        const gridHeight = canvas.height / gridSize;
        let collided = false;
        
        if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) collided = true;
        for (let i = 1; i < fox.body.length; i++) if (head.x === fox.body[i].x && head.y === fox.body[i].y) collided = true;
        if ((obstacles || []).some(obs => obs.x === head.x && obs.y === head.y)) collided = true;
        if ((hedgehogs || []).some(h => h.x === head.x && h.y === head.y)) collided = true;
        
        // KHÔI PHỤC: Logic khiên
        if (collided) {
            if (isShieldActive) {
                isShieldActive = false; // Khiên chỉ dùng 1 lần
                return false; // Không Game Over
            }
            return true; // Game Over
        }
        return false;
    }
    
    function applySlowmo() {
        clearInterval(gameInterval);
        currentGameSpeed = baseGameSpeed * 2; // Làm chậm lại
        gameInterval = setInterval(gameLoop, currentGameSpeed);
        
        setTimeout(() => {
            clearInterval(gameInterval);
            currentGameSpeed = baseGameSpeed; // Trở lại tốc độ bình thường
            gameInterval = setInterval(gameLoop, currentGameSpeed);
        }, 5000); // 5 giây
    }

    function gameLoop() {
        changingDirection = false;
        updateHedgehogs();
        const head = {x: fox.body[0].x + dx, y: fox.body[0].y + dy};
        
        if (isGameOver(head)) {
            stopAllSounds(); allAudio.gameOver.play();
            clearInterval(gameInterval); gameInterval = null;
            document.getElementById('final-score').textContent = score;
            showPopup('game-over-screen');
            return;
        }
        
        fox.body.unshift(head);
        
        // KHÔI PHỤC: Xử lý ăn vật phẩm
        const powerupIndex = powerups.findIndex(p => p.x === head.x && p.y === head.y);
        if (powerupIndex > -1) {
            const powerup = powerups[powerupIndex];
            if (powerup.type === 'shield') {
                isShieldActive = true;
                allAudio.keepsakeFound.play(); // Dùng tạm âm thanh này
            } else if (powerup.type === 'slowmo') {
                applySlowmo();
                allAudio.slowmo.play();
            }
            powerups.splice(powerupIndex, 1); // Xóa vật phẩm đã ăn
        }

        if (head.x === loveTrace.x && head.y === loveTrace.y) {
            score += 10;
            scoreElement.textContent = score;
            allAudio.eat.currentTime = 0; allAudio.eat.play();
            if (score >= winScore) { onLevelComplete(); return; } 
            else { createLoveTrace(); }
        } else {
            fox.body.pop();
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawObstacles(); 
        drawLoveTraceItem(); 
        drawHedgehogs(); 
        drawPowerups(); // KHÔI PHỤC: Vẽ vật phẩm
        drawFox();
    }
    
    // Khởi tạo vòng lặp game
    createLoveTrace();
    gameInterval = setInterval(gameLoop, currentGameSpeed);
}