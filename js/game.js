import { allAudio, stopAllSounds } from './audio.js';
import { LEVELS } from './constants.js';
import { state, images } from './main.js';
import { showPopup, showStoryScene, showMainView } from './ui.js';

let gameInterval;
let dx = 1, dy = 0;
let changingDirection = false;

// --- LOGIC ĐIỀU KHIỂN GAME CHÍNH ---
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

export function startGame() {
    const levelIndex = state.currentLevelIndex;
    const storyKey = `level_${levelIndex + 1}`;
    showStoryScene(storyKey, () => {
        showMainView('game-area');
        initializeLevelGameplay(levelIndex);
    });
}

// --- LOGIC CỐT LÕI CỦA MÀN CHƠI (GAMEPLAY) ---
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
    const gridSize = 40, baseGameSpeed = 150;
    let score = 0;
    scoreElement.textContent = 0;
    const winScore = levelData.winScore;
    changingDirection = false;
    
    const startPos = levelData.startPos || { x: 10, y: 10 };
    const fox = { body: [{ x: startPos.x, y: startPos.y }, { x: startPos.x - 1, y: startPos.y }, { x: startPos.x - 2, y: startPos.y }]};
    let loveTrace = {};
    const obstacles = levelData.obstacles;
    const hedgehogs = JSON.parse(JSON.stringify(levelData.hedgehogs || []));
    let hedgehogMoveCounter = 0;

    function onLevelComplete() {
        stopAllSounds();
        allAudio.levelComplete.play();
        clearInterval(gameInterval); gameInterval = null;
        localStorage.setItem(`level_unlocked_${levelIndex + 2}`, 'true');
        
        const nextLevelIndex = state.currentLevelIndex + 1;
        if (nextLevelIndex >= LEVELS.length) {
            showStoryScene('gameOutro', () => {
                alert("BẠN ĐÃ GIẢI CỨU THÀNH CÔNG SÓC YÊU! CHÚC MỪNG!");
                showMainView('main-menu');
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
                            (obstacles || []).some(obs => obs.x === loveTrace.x && obs.y === loveTrace.y);
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
        if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) return true;
        for (let i = 1; i < fox.body.length; i++) if (head.x === fox.body[i].x && head.y === fox.body[i].y) return true;
        if ((obstacles || []).some(obs => obs.x === head.x && obs.y === head.y)) return true;
        if ((hedgehogs || []).some(h => h.x === head.x && h.y === head.y)) return true;
        return false;
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
        drawObstacles(); drawLoveTraceItem(); drawHedgehogs(); drawFox();
    }
    
    createLoveTrace();
    gameInterval = setInterval(gameLoop, baseGameSpeed);
}