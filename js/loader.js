// js/loader.js

// Nơi lưu trữ tất cả hình ảnh đã tải, có thể truy cập từ mọi nơi
export const images = {};

// Hàm chuyên để tải tài nguyên
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
            images[key] = img; // Lưu vào biến images được export
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