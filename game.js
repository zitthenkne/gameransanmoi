// Đợi cho toàn bộ nội dung HTML được tải xong rồi mới chạy code JavaScript
document.addEventListener('DOMContentLoaded', function() {

    // Lấy tham chiếu đến các phần tử HTML cần dùng
    const mainMenu = document.getElementById('main-menu');
    const gameArea = document.getElementById('game-area');
    const newGameButton = document.getElementById('new-game-btn');

    // (Chúng ta sẽ thêm các nút khác sau)
    // const continueButton = document.getElementById('continue-btn');
    // const keepsakeHouseButton = document.getElementById('keepsake-house-btn');
    // const exitButton = document.getElementById('exit-btn');

    // Kiểm tra xem các phần tử có tồn tại không (để tránh lỗi)
    if (mainMenu && gameArea && newGameButton) {

        // Thêm sự kiện "click" cho nút "Chơi Mới"
        newGameButton.addEventListener('click', function() {
            console.log("Nút Chơi Mới được nhấp!"); // Để kiểm tra trong console

            // Ẩn Màn Hình Chính
            mainMenu.style.display = 'none';

            // Hiện Khu Vực Chơi Game
            gameArea.style.display = 'block'; // Hoặc 'flex', 'grid' tùy theo cách bạn muốn bố cục sau này

            // (Sau này, ở đây sẽ là nơi bạn khởi tạo màn chơi đầu tiên)
            console.log("Khu vực game đã được hiển thị. Sẵn sàng để bắt đầu game!");
        });

    } else {
        console.error("Không tìm thấy một hoặc nhiều phần tử HTML cần thiết cho menu!");
    }

    // TODO: Thêm sự kiện cho các nút khác (Tiếp Tục, Ngôi Nhà Kỷ Niệm, Thoát)

});
