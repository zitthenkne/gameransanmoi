export const allAudio = {
    eat: new Audio('audio/eat.wav'),
    gameOver: new Audio('audio/game_over.wav'),
    levelComplete: new Audio('audio/level_complete.wav'),
    bgm: new Audio('audio/bgm.mp3'),
    keepsakeFound: new Audio('audio/keepsake_found.wav'),
    slowmo: new Audio('audio/slowmo.wav')
};

allAudio.bgm.loop = true;

export function stopAllSounds() {
    for (const key in allAudio) {
        allAudio[key].pause();
        allAudio[key].currentTime = 0;
    }
}