// js/ui.js (Đã sửa lỗi)

import { STORY_DATA, LEVELS } from './constants.js';
import { startGame } from './game.js';
import { state } from './state.js'; // <-- THAY ĐỔI DÒNG NÀY

let storyImages = [];
let storyNpc = null;
let storyImageIndex = 0;
let storyDialogueIndex = 0;
let onStoryComplete = null;

const MAIN_VIEWS = ['main-menu', 'game-area'];
const ALL_POPUPS = ['world-map-screen', 'game-over-screen', 'level-complete-screen', 'letter-screen', 'story-screen'];

export function hideAllScreens() {
    [...MAIN_VIEWS, ...ALL_POPUPS].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
}

export function showMainView(viewIdToShow) {
    MAIN_VIEWS.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    if (viewIdToShow) {
        const viewElement = document.getElementById(viewIdToShow);
        if (viewElement) viewElement.style.display = 'block';
    }
}

export function showPopup(popupId) {
    const popupElement = document.getElementById(popupId);
    if (popupElement) popupElement.style.display = 'flex';
}

export function hidePopup(popupId) {
    const popupElement = document.getElementById(popupId);
    if (popupElement) popupElement.style.display = 'none';
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
    showPopup('story-screen');
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
                hidePopup('world-map-screen');
                state.currentLevelIndex = index;
                startGame();
            });
        } else {
            button.classList.add('locked');
        }
        container.appendChild(button);
    });
    showMainView(null);
    showPopup('world-map-screen');
}

export function showLetter() {
    const keepsakeData = LEVELS[state.currentLevelIndex].keepsake;
    document.getElementById('letter-title').textContent = keepsakeData.title;
    document.getElementById('letter-text').textContent = keepsakeData.text;
    const letterImage = document.getElementById('letter-image');
    if (keepsakeData.image) {
        letterImage.src = keepsakeData.image;
        letterImage.style.display = 'block';
    } else {
        letterImage.style.display = 'none';
    }
    showPopup('letter-screen');
}