import { STORY_DATA, LEVELS } from './constants.js';
import { startGame } from './game.js';
import { state } from './state.js';
import { allAudio, stopAllSounds } from './audio.js';

// Các biến quản lý trạng thái của màn hình câu chuyện
let typingInterval = null;
let currentScenes = [];
let currentSceneIndex = 0;
let onStoryComplete = null;

const ALL_SCREENS = ['main-menu', 'game-area', 'world-map-screen', 'game-over-screen', 'level-complete-screen', 'letter-screen', 'story-screen'];

// --- CÁC HÀM ẨN/HIỆN MÀN HÌNH ---

export function hideAllScreens() {
    ALL_SCREENS.forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.classList.contains('hidden')) {
             el.classList.add('hidden');
        }
    });
}

export function showScreen(screenId) {
    // Ẩn các màn hình chính khác trước, nhưng không ẩn các pop-up nhỏ
    ALL_SCREENS.forEach(id => {
        if (id !== screenId && !id.includes('popup') && !id.includes('screen')) {
             const el = document.getElementById(id);
             if (el && !el.classList.contains('hidden')) {
                  el.classList.add('hidden');
             }
        }
    });
    // Hiện màn hình được yêu cầu
    const screenElement = document.getElementById(screenId);
    if (screenElement) {
        screenElement.classList.remove('hidden');
    }
}

export function showPopup(popupId) {
    const popupElement = document.getElementById(popupId);
    if (popupElement) {
        popupElement.classList.remove('hidden');
    }
}

export function hidePopup(popupId) {
    const popupElement = document.getElementById(popupId);
    if (popupElement) {
        popupElement.classList.add('hidden');
    }
}


// --- LOGIC KỂ CHUYỆN VÀ HIỆU ỨNG MÁY CHỮ ---

function typewriter(element, text) {
    // Dừng và xóa hiệu ứng cũ (nếu có)
    if (typingInterval) {
        clearInterval(typingInterval);
    }
    allAudio.typing.pause();
    allAudio.typing.currentTime = 0;

    let i = 0;
    element.innerHTML = ''; // Xóa văn bản cũ
    const dialogueNextBtn = document.getElementById('dialogue-next-btn');
    dialogueNextBtn.classList.add('hidden'); // Ẩn nút "Tiếp theo" khi đang gõ chữ

    allAudio.typing.play().catch(() => {}); // Bắt đầu phát âm thanh gõ chữ (lặp lại)

    typingInterval = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
            typingInterval = null;
            allAudio.typing.pause(); // Dừng âm thanh khi gõ xong
            allAudio.typing.currentTime = 0;
            dialogueNextBtn.classList.remove('hidden'); // Hiện lại nút "Tiếp theo"
        }
    }, 50); // Tốc độ gõ chữ (50ms mỗi ký tự)
}

function finishTyping() {
    // Hàm này được gọi khi người dùng muốn bỏ qua hiệu ứng gõ chữ
    if (typingInterval) {
        clearInterval(typingInterval);
        typingInterval = null;
        allAudio.typing.pause();
        allAudio.typing.currentTime = 0;
        
        // Hiển thị đầy đủ câu thoại hiện tại
        const currentScene = currentScenes[currentSceneIndex -1];
        if (currentScene && currentScene.dialogue) {
            document.getElementById('dialogue-text').innerHTML = currentScene.dialogue.text;
        }
        document.getElementById('dialogue-next-btn').classList.remove('hidden');
    }
}

function advanceScene() {
    // Nếu đang gõ chữ, bấm nút sẽ hiện đầy đủ chữ ngay lập tức
    if (typingInterval) {
        finishTyping();
        return;
    }

    // Nếu không, chuyển sang cảnh tiếp theo
    if (currentSceneIndex < currentScenes.length) {
        const scene = currentScenes[currentSceneIndex];
        document.getElementById('story-image').src = scene.image;
        const dialogueBox = document.getElementById('dialogue-box');
        
        if (scene.dialogue) {
            dialogueBox.classList.remove('hidden');
            document.getElementById('dialogue-npc-name').textContent = scene.dialogue.name;
            typewriter(document.getElementById('dialogue-text'), scene.dialogue.text);
        } else {
            dialogueBox.classList.add('hidden');
            document.getElementById('dialogue-text').innerHTML = ''; // Xóa text cũ
        }
        currentSceneIndex++;
    } else {
        // Kết thúc chuỗi câu chuyện
        hidePopup('story-screen');
        if (onStoryComplete) {
            onStoryComplete();
        }
    }
}

export function showStoryScene(storyKey, onCompleteCallback) {
    stopAllSounds(); // Dừng các âm thanh khác khi vào kể chuyện
    const storyData = STORY_DATA[storyKey];
    if (!storyData || !storyData.scenes) {
        if (onCompleteCallback) onCompleteCallback();
        return;
    }

    currentScenes = storyData.scenes;
    currentSceneIndex = 0;
    onStoryComplete = onCompleteCallback;

    // Gán sự kiện cho các nút trong màn hình kể chuyện
    document.getElementById('dialogue-next-btn').onclick = advanceScene;
    document.getElementById('story-skip-btn').onclick = () => {
        finishTyping(); // Hoàn thành việc gõ chữ
        hidePopup('story-screen'); // Đóng màn hình
        if (onStoryComplete) onCompleteCallback(); // Chạy hàm tiếp theo (vào bản đồ)
    };

    showScreen('story-screen');
    advanceScene(); // Bắt đầu cảnh đầu tiên
}


// --- CÁC HÀM UI KHÁC ---

export function showWorldMap() {
    const container = document.getElementById('level-selection-container');
    container.innerHTML = '';
    LEVELS.forEach((level, index) => {
        const button = document.createElement('button');
        button.className = 'level-button';
        button.textContent = level.level;
        const isUnlocked = (index === 0) || localStorage.getItem(`level_unlocked_${index + 1}`);
        if (isUnlocked) {
            button.addEventListener('click', () => {
                state.currentLevelIndex = index;
                startGame();
            });
        } else {
            button.classList.add('locked');
        }
        container.appendChild(button);
    });
    showScreen('world-map-screen');
}

export function showLetter() {
    const keepsakeData = LEVELS[state.currentLevelIndex].keepsake;
    const letterScreen = document.getElementById('letter-screen');
    const letterTitle = document.getElementById('letter-title');
    const letterText = document.getElementById('letter-text');
    const letterImage = document.getElementById('letter-image');

    if (letterScreen && letterTitle && letterText && letterImage) {
        letterTitle.textContent = keepsakeData.title;
        letterText.textContent = keepsakeData.text;

        if (keepsakeData.image) {
            letterImage.src = keepsakeData.image;
            letterImage.classList.remove('hidden');
        } else {
            letterImage.classList.add('hidden');
        }
        showPopup('letter-screen');
    } else {
        console.error("Không tìm thấy các thành phần của màn hình kỷ vật.");
    }
}