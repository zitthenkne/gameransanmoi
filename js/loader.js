export const images = {};

export function preloadAssets(assets, onReady) {
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