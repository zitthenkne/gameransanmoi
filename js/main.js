// js/main.js (Đã sửa lỗi)

import { STORY_DATA, LEVELS } from './constants.js';
import { setDirection, startGame } from './game.js';
import { hideAllScreens, showMainView, showWorldMap, advanceImage, advanceDialogue, showLetter } from './ui.js';
import { state } from './state.js'; // <-- THÊM DÒNG NÀY

// Nơi lưu trữ tất cả hình ảnh đã tải
export const images = {};

function preloadAssets(assets, onReady) {
    const assetKeys = Object.keys(assets);
    let loadCounter = assetKeys.length;
    const totalAssets = assetKeys.length;

    if (loadCounter === 0) {
        onReady();
        return;
    }

    const newGameBtn = document.getElementById('new-game-btn');

    assetKeys.forEach(key => {
        const img = new Image();
        img.onload = () => {
            loadCounter--;
            images[key] = img;
            if (newGameBtn) newGameBtn.textContent = `Đang tải... (${totalAssets - loadCounter}/${totalAssets})`;
            if (loadCounter === 0) onReady();
        };
        img.onerror = () => {
            console.error(`Lỗi không tải được hình ảnh: ${assets[key]}`);
            loadCounter--;
            if (newGameBtn) newGameBtn.textContent = `Đang tải... (${totalAssets - loadCounter}/${totalAssets})`;
            if (loadCounter === 0) onReady();
        };
        img.src = assets[key];
    });
}

document.addEventListener('DOMContentLoaded', function() {
    
    const assetsToLoad = {
        foxHead: 'assets/fox_head.png',
        foxBody: 'assets/fox_body.png',
        foxTailTip: 'assets/fox_tail_tip.png',
        loveTrace: 'assets/love_trace.png',
        hedgehog: 'assets/hedgehog.png',
        obstacle_tree: 'assets/obstacle.png'
    };

    let imageCounter = 0;
    for (const key in STORY_DATA) {
        if (STORY_DATA[key].images) {
            STORY_DATA[key].images.forEach(imgPath => {
                assetsToLoad[`story_img_${imageCounter++}`] = imgPath;
            });
        }
    }
    LEVELS.forEach((level) => {
        if (level.keepsake && level.keepsake.image) {
            assetsToLoad[`keepsake_img_${level.level}`] = level.keepsake.image;
        }
    });
    
    const newGameBtn = document.getElementById('new-game-btn');
    newGameBtn.disabled = true;
    newGameBtn.textContent = "Đang chuẩn bị...";

    preloadAssets(assetsToLoad, () => {
        console.log("Tất cả tài nguyên đã được tải. Game sẵn sàng!");
        newGameBtn.disabled = false;
        newGameBtn.textContent = "Bắt Đầu Hành Trình";

        document.addEventListener('keydown', (event) => setDirection(event.key));
        document.getElementById('ctrl-up').addEventListener('click', () => setDirection('ArrowUp'));
        document.getElementById('ctrl-down').addEventListener('click', () => setDirection('ArrowDown'));
        document.getElementById('ctrl-left').addEventListener('click', () => setDirection('ArrowLeft'));
        document.getElementById('ctrl-right').addEventListener('click', () => setDirection('ArrowRight'));
        document.getElementById('story-next-image-btn').addEventListener('click', advanceImage);
        document.getElementById('dialogue-next-btn').addEventListener('click', advanceDialogue);

        newGameBtn.addEventListener('click', () => {
            localStorage.clear();
            showStoryScene('gameIntro', () => showWorldMap());
        });

        document.getElementById('map-back-to-menu-btn').addEventListener('click', () => {
            hidePopup('world-map-screen');
            showMainView('main-menu');
        });

        document.getElementById('retry-btn').addEventListener('click', () => {
            hidePopup('game-over-screen');
            startGame();
        });
        
        document.getElementById('next-level-btn').addEventListener('click', () => {
            hidePopup('level-complete-screen');
            showWorldMap();
        });

        document.getElementById('close-letter-btn').addEventListener('click', () => hidePopup('letter-screen'));
        document.getElementById('view-keepsake-btn').addEventListener('click', showLetter);

        hideAllScreens();
        showMainView('main-menu');
    });
});