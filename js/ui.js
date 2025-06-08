// js/ui.js

import { STORY_DATA, LEVELS } from './constants.js';
import { startGame } from './game.js';
import { state } from './state.js';

let storyImages = [];
let storyNpc = null;
let storyImageIndex = 0;
let storyDialogueIndex = 0;
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
    // Ẩn tất cả các màn hình chính khác trước
    ALL_SCREENS.forEach(id => {
        if (id !== screenId) {
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

// Hàm showPopup và hidePopup để hiện/ẩn các pop-up nhỏ mà không ẩn toàn bộ màn hình game
export function showPopup(popupId) {
    const popupElement = document.getElementById(popupId);
    if (popupElement) popupElement.classList.remove('hidden');
}

export function hidePopup(popupId) {
    const popupElement = document.getElementById(popupId);
    if (popupElement) popupElement.classList.add('hidden');
}

function endStoryScene() {
    hidePopup('story-screen');
    if (onStoryComplete) {
        onStoryComplete();
    }
}

export function advanceDialogue() {
    const dialogueName = document.getElementById('dialogue-npc-name');
    const dialogueText = document.getElementById('dialogue-text');

    if (storyNpc && storyDialogueIndex < storyNpc.dialogue.length) {
        dialogueName.textContent = storyNpc.name;
        dialogueText.textContent = storyNpc.dialogue[storyDialogueIndex];
        storyDialogueIndex++;
    } else {
        endStoryScene();
    }
}

export function advanceImage() {
    const storyImageEl = document.getElementById('story-image');
    const dialogueBox = document.getElementById('dialogue-box');
    const nextImageBtn = document.getElementById('story-next-image-btn');

    if (storyImageIndex < storyImages.length) {
        storyImageEl.src = storyImages[storyImageIndex];
        dialogueBox.classList.add('hidden');
        nextImageBtn.classList.remove('hidden');
        storyImageIndex++;
    } else {
        nextImageBtn.classList.add('hidden');
        if (storyNpc) {
            dialogueBox.classList.remove('hidden');
            advanceDialogue();
        } else {
            endStoryScene();
        }
    }
}

export function showStoryScene(storyKey, onCompleteCallback) {
    const storyData = STORY_DATA[storyKey];
    if (!storyData) {
        if (onCompleteCallback) onCompleteCallback();
        return;
    }
    storyImages = storyData.images || [];
    storyNpc = storyData.npc || null;
    storyImageIndex = 0;
    storyDialogueIndex = 0;
    onStoryComplete = onCompleteCallback;
    showScreen('story-screen');
    advanceImage();
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
    document.getElementById('letter-title').textContent = keepsakeData.title;
    document.getElementById('letter-text').textContent = keepsakeData.text;
    const letterImage = document.getElementById('letter-image');
    if (keepsakeData.image) {
        letterImage.src = keepsakeData.image;
        letterImage.classList.remove('hidden');
    } else {
        letterImage.classList.add('hidden');
    }
    showPopup('letter-screen');
}