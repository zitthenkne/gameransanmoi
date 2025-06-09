import { STORY_DATA, LEVELS } from './constants.js';
import { startGame } from './game.js';
import { state } from './state.js';
import { allAudio, stopAllSounds } from './audio.js';

let typingInterval = null;
let currentScenes = [];
let currentSceneIndex = 0;
let onStoryComplete = null;

const ALL_SCREENS = ['main-menu', 'game-area', 'world-map-screen', 'game-over-screen', 'level-complete-screen', 'letter-screen', 'story-screen'];

export function hideAllScreens() {
    ALL_SCREENS.forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.classList.contains('hidden')) {
             el.classList.add('hidden');
        }
    });
}
export function showScreen(screenId) {
    ALL_SCREENS.forEach(id => {
        if (id !== screenId && !id.includes('popup') && !id.includes('screen')) {
             const el = document.getElementById(id);
             if (el && !el.classList.contains('hidden')) {
                  el.classList.add('hidden');
             }
        }
    });
    const screenElement = document.getElementById(screenId);
    if (screenElement) {
        screenElement.classList.remove('hidden');
    }
}
export function showPopup(popupId) {
    const popupElement = document.getElementById(popupId);
    if (popupElement) {
        popupElement.classList.remove('hidden');
    } else {
        console.error(`KHÔNG TÌM THẤY POPUP với ID: #${popupId}.`);
    }
}
export function hidePopup(popupId) {
    const popupElement = document.getElementById(popupId);
    if (popupElement) {
        popupElement.classList.add('hidden');
    }
}

function typewriter(element, text, onComplete) {
    if (typingInterval) clearInterval(typingInterval);
    allAudio.typing.pause();
    allAudio.typing.currentTime = 0;

    let i = 0;
    element.innerHTML = '';
    
    allAudio.typing.play().catch(() => {});

    typingInterval = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
            typingInterval = null;
            allAudio.typing.pause();
            allAudio.typing.currentTime = 0;
            if (onComplete) onComplete();
        }
    }, 50);
}

function finishTyping(fullText, element, onComplete) {
    if (typingInterval) {
        clearInterval(typingInterval);
        typingInterval = null;
        allAudio.typing.pause();
        allAudio.typing.currentTime = 0;
        element.innerHTML = fullText;
        if (onComplete) onComplete();
    }
}

function advanceScene() {
    const dialogueNextBtn = document.getElementById('dialogue-next-btn');
    const storyControls = document.getElementById('story-controls-overlay');
    const dialogueTextEl = document.getElementById('dialogue-text');
    const narrativeTextEl = document.getElementById('narrative-text');

    if (typingInterval) {
        const scene = currentScenes[currentSceneIndex - 1];
        if (scene.dialogue) {
            finishTyping(scene.dialogue.text, dialogueTextEl, () => dialogueNextBtn.classList.remove('hidden'));
        } else if (scene.narrativeText) {
            finishTyping(scene.narrativeText, narrativeTextEl, () => storyControls.classList.remove('hidden'));
        }
        return;
    }

    if (currentSceneIndex < currentScenes.length) {
        const scene = currentScenes[currentSceneIndex];
        document.getElementById('story-image').src = scene.image;
        
        const dialogueBox = document.getElementById('dialogue-box');
        const narrativeBox = document.getElementById('narrative-box');
        
        dialogueBox.classList.add('hidden');
        narrativeBox.classList.add('hidden');
        storyControls.classList.add('hidden');
        dialogueNextBtn.classList.add('hidden');
        
        if (scene.dialogue) {
            dialogueBox.classList.remove('hidden');
            document.getElementById('dialogue-npc-name').textContent = scene.dialogue.name;
            typewriter(dialogueTextEl, scene.dialogue.text, () => {
                dialogueNextBtn.classList.remove('hidden');
            });
        } else if (scene.narrativeText) {
            narrativeBox.classList.remove('hidden');
            typewriter(narrativeTextEl, scene.narrativeText, () => {
                storyControls.classList.remove('hidden');
            });
        } else {
            storyControls.classList.remove('hidden');
        }
        
        currentSceneIndex++;
    } else {
        hidePopup('story-screen');
        if (onStoryComplete) {
            onStoryComplete();
        }
    }
}

export function showStoryScene(storyKey, onCompleteCallback) {
    stopAllSounds();
    const storyData = STORY_DATA[storyKey];
    if (!storyData || !storyData.scenes) {
        if (onCompleteCallback) onCompleteCallback();
        return;
    }

    currentScenes = storyData.scenes;
    currentSceneIndex = 0;
    onStoryComplete = onCompleteCallback;

    document.getElementById('dialogue-next-btn').onclick = advanceScene;
    document.getElementById('story-next-btn').onclick = advanceScene;
    document.getElementById('story-skip-btn').onclick = () => {
        finishTyping(null, null, null); // Dừng mọi hiệu ứng đang chạy
        hidePopup('story-screen');
        if (onStoryComplete) onCompleteCallback();
    };

    showScreen('story-screen');
    advanceScene();
}

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
    const letterTitle = document.getElementById('letter-title');
    const letterText = document.getElementById('letter-text');
    const letterImage = document.getElementById('letter-image');

    if (letterTitle && letterText && letterImage) {
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