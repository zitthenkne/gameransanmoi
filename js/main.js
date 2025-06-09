// js/main.js (Phiên bản cuối cùng, đã sửa lỗi import)

import { STORY_DATA, LEVELS } from './constants.js';
import { setDirection, startGame } from './game.js';
// SỬA LỖI: Xóa "advanceDialogue" và "advanceImage" khỏi danh sách import vì chúng đã được xử lý bên trong ui.js
import { hideAllScreens, showScreen, showWorldMap, showLetter, showPopup, hidePopup, showStoryScene } from './ui.js';
import { preloadAssets } from './loader.js';

document.addEventListener('DOMContentLoaded', function() {
    
    const assetsToLoad = {
        foxHead: 'assets/fox_head.png',
        foxBody: 'assets/fox_body.png',
        foxTailTip: 'assets/fox_tail_tip.png',
        loveTrace: 'assets/love_trace.png',
        hedgehog: 'assets/hedgehog.png',
        obstacle_tree: 'assets/goc_cay.png',
        obstacle_rock: 'assets/suoi_da.png',
        obstacle_bamboo: 'assets/than_tre.png',
        obstacle_crystal: 'assets/pha_le.png',
        shield_powerup: 'assets/shield_powerup.png',
        slowmo_powerup: 'assets/slowmo_powerup.png',
        bg_level_1: 'assets/background_level_1.png',
        bg_level_2: 'assets/background_level_2.png',
        bg_level_3: 'assets/background_level_3.png',
        bg_level_4: 'assets/background_level_4.png',
        bg_level_5: 'assets/background_level_5.png'
    };

    let imageCounter = 0;
    for (const key in STORY_DATA) {
        if (STORY_DATA[key].scenes) { // Cập nhật để đọc cấu trúc "scenes" mới
            STORY_DATA[key].scenes.forEach(scene => {
                assetsToLoad[`story_img_${imageCounter++}`] = scene.image;
            });
        }
    }
    LEVELS.forEach((level) => {
        if (level.keepsake && level.keepsake.image) {
            assetsToLoad[`keepsake_img_${level.level}`] = level.keepsake.image;
        }
        if (level.keepsake && level.keepsake.imageKey) {
            assetsToLoad[level.keepsake.imageKey] = level.keepsake.image;
        }
    });
    
    const newGameBtn = document.getElementById('new-game-btn');
    newGameBtn.disabled = true;
    newGameBtn.textContent = "Đang chuẩn bị...";

    preloadAssets(assetsToLoad, () => {
        console.log("Tất cả tài nguyên đã được tải. Game sẵn sàng!");
        newGameBtn.disabled = false;
        newGameBtn.textContent = "Bắt Đầu Hành Trình";

        // Gán sự kiện cho các nút điều khiển game
        document.addEventListener('keydown', (event) => setDirection(event.key));
        document.getElementById('ctrl-up').addEventListener('click', () => setDirection('ArrowUp'));
        document.getElementById('ctrl-down').addEventListener('click', () => setDirection('ArrowDown'));
        document.getElementById('ctrl-left').addEventListener('click', () => setDirection('ArrowLeft'));
        document.getElementById('ctrl-right').addEventListener('click', () => setDirection('ArrowRight'));
        
        // SỬA LỖI: Xóa các dòng gán sự kiện cho nút trong story-screen vì ui.js đã tự quản lý
        // document.getElementById('story-next-image-btn').addEventListener('click', advanceImage);
        // document.getElementById('dialogue-next-btn').addEventListener('click', advanceDialogue);

        // Gán sự kiện cho các nút menu và pop-up khác
        newGameBtn.addEventListener('click', () => {
            localStorage.clear();
            showStoryScene('gameIntro', () => showWorldMap());
        });

        document.getElementById('map-back-to-menu-btn').addEventListener('click', () => {
            showScreen('main-menu');
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
        
        document.getElementById('letter-next-level-btn').addEventListener('click', () => {
            hidePopup('letter-screen');
            hidePopup('level-complete-screen'); 
            showWorldMap();
        });

        // Thiết lập trạng thái ban đầu
        showScreen('main-menu');
    });
});