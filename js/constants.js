// Cấu trúc mới hỗ trợ hội thoại cho từng ảnh
export const STORY_DATA = {
    gameIntro: {
        scenes: [
            { image: 'assets/story/intro_1.png' },
            { image: 'assets/story/intro_2.png' },
            { image: 'assets/story/intro_3.png' }
        ]
    },
    level_1: {
        scenes: [
            { image: 'assets/story/l1_1.png' },
            { 
                image: 'assets/story/l1_2.png',
                dialogue: { 
                    name: 'Cú Thông Thái', 
                    text: "Nè chú cáo kia, ta vừa thấy tên Lửng Mật cầm theo 1 chiếc lồng hình pha lê chứa 1 chú sóc con đi về phía khu rừng thông đã bị khai phá kia, giờ chỉ còn là những gốc cây!"
                }
            },
            {
                image: 'assets/story/l1_2.png',
                dialogue: {
                    name: 'Cú Thông Thái',
                    text: "Để tăng cường sức mạnh hãy cố gắng ăn những trái tim phát sáng, ngoài ra có những vật phẩm hỗ trợ cậu trong quá trình đó, hãy cố gắng tận dụng chúng, à đừng quên coi chừng những tên lính canh là bọn Nhím của tên Lửng đó nhé, động vào là sẽ bị tê liệt ngay!."
                }
            }
        ]
    },
    level_2: {
        scenes: [
            { image: 'assets/story/l2_1.png' },
            { 
                image: 'assets/story/l2_2.png',
                dialogue: { 
                    name: 'Thú Mỏ Vịt Lập Dị', 
                    text: "Trời ơi! Ly nước thơm ngon của ta! Lão Lửng đi qua đã làm nó rơi xuống dòng suối mất rồi!"
                }
            },
            {
                image: 'assets/story/l2_2.png',
                dialogue: {
                    name: 'Thú Mỏ Vịt Lập Dị',
                    text: "Nếu cậu tìm lại được ly nước thơm ngon đang ẩn dưới kia giúp ta, ta sẽ cho cậu biết lão ta đã đi đâu."
                }
            }
        ]
    },
    level_3: {
        scenes: [
            { image: 'assets/story/l3_1.png' },
            { 
                image: 'assets/story/l3_2.png',
                dialogue: { 
                    name: 'Gấu Trúc Đỏ Lém Lỉnh', 
                    text: "Hehe, người lạ mặt! Thấy ta không? Ta biết lão Lửng đi đâu đấy."
                }
            },
            {
                image: 'assets/story/l3_2.png',
                dialogue: {
                    name: 'Gấu Trúc Đỏ Lém Lỉnh',
                    text: "Nhưng ta chỉ nói cho những người nhanh nhẹn thôi! Hãy chứng tỏ bản thân bằng cách vượt qua khu rừng trúc này đi!"
                }
            }
        ]
    },
    level_4: {
        scenes: [
            { image: 'assets/story/l4_1.png' },
            {
                image: 'assets/story/l4_2.png',
                dialogue: {
                    name: 'Tiếng vọng trong hang',
                    text: "Cẩn thận... cỗ máy của lão ta được vận hành bởi năng lượng của những viên pha lê này..."
                }
            },
            {
                image: 'assets/story/l4_2.png',
                dialogue: {
                    name: 'Tiếng vọng trong hang',
                    text: "Hãy tìm đến sào huyệt chính của lão ở phía bắc ngọn núi... đó là cơ hội duy nhất của cậu..."
                }
            }
        ]
    },
    level_5: {
        scenes: [
            { image: 'assets/story/l5_1.png' },
            { 
                image: 'assets/story/l5_2.png',
                dialogue: { 
                    name: 'Cáo Anh Hùng (tự nhủ)', 
                    text: "Cục dàngggg ... tui tới ngay thui!"
                }
            }
        ]
    },
    gameOutro: {
        scenes: [
            { image: 'assets/story/outro_1.png' },
            { image: 'assets/story/outro_2.png' },
            { image: 'assets/story/outro_3.png' }
        ]
    }
};

// Sử dụng lời thoại mới của bạn cho các kỷ vật
export const LEVELS = [
    { 
        level: 1, 
        winScore: 50,
        startPos: { x: 10, y: 10 },
        obstacleImageKey: "obstacle_tree", 
        backgroundImageKey: "bg_level_1",
        obstacles: [ {x: 3, y: 3}, {x: 3, y: 4}, {x: 16, y: 11}, {x: 10, y: 2}, {x: 12, y: 8} ],
        hedgehogs: [ { x: 2, y: 8, dx: 0, dy: 1, range: 4, moved: 0 }, { x: 13, y: 4, dx: 1, dy: 0, range: 5, moved: 0 } ],
        powerups: [ { x: 15, y: 2, type: 'shield' }, { x: 5, y: 12, type: 'slowmo' } ],
        keepsake: {
            imageKey: "keepsake_1_item",
            title: "Đi off clb tại Vũng Tàu",
            text: "Hôm đó là một ngày rất đáng nhớ, tui quài hỏng có quên hôm đó tui tỉnh tò nhà mik mà nhà mik lại từ chúi, bùn quớ lun á.",
            image: "assets/keepsake_1.png"
        }
    },
    {
        level: 2, winScore: 70,
        startPos: { x: 5, y: 7 },
        obstacleImageKey: "obstacle_rock",
        backgroundImageKey: "bg_level_2",
        obstacles: [ {x: 9, y: 4}, {x: 10, y: 4}, {x: 11, y: 4}, {x: 9, y: 10}, {x: 10, y: 10}, {x: 11, y: 10} ],
        hedgehogs: [ { x: 1, y: 1, dx: 1, dy: 0, range: 17, moved: 0 }, { x: 18, y: 13, dx: -1, dy: 0, range: 17, moved: 0 } ],
        powerups: [ { x: 1, y: 7, type: 'shield' } ],
        keepsake: {
            imageKey: "keepsake_2_item",
            title: "Sinh tố 606 ạaaa",
            text: "Eeeee bà ưi, chắc là sau buổi hum đó bà mứi thấy có cảm tình với tui nhìu hơn phải hem, dù dì sau bữa đó nhà mik mới gọi tui là chú Sóc màaaaaa, mà tui nói thiệt hôm đó nghe nhà mik rủ mà tui nôn nao cả ngày lun á, bữa hôm đó quả là 1 buổi firstdate thành công mòoooo",
            image: "assets/keepsake_2.png"
        }
    },
    {
        level: 3, winScore: 80,
        startPos: { x: 7, y: 3 },
        obstacleImageKey: "obstacle_bamboo",
        backgroundImageKey: "bg_level_3",
        obstacles: [ {x: 4, y: 0}, {x: 4, y: 1}, {x: 4, y: 2}, {x: 4, y: 3}, {x: 4, y: 4}, {x: 4, y: 5}, {x: 15, y: 9}, {x: 15, y: 10}, {x: 15, y: 11}, {x: 15, y: 12}, {x: 15, y: 13}, {x: 15, y: 14}, {x: 8, y: 7}, {x: 9, y: 7}, {x: 10, y: 7}, {x: 11, y: 7} ],
        hedgehogs: [ { x: 1, y: 1, dx: 1, dy: 0, range: 3, moved: 0 }, { x: 15, y: 12, dx: 0, dy: -1, range: 3, moved: 0 }],
        powerups: [ { x: 10, y: 10, type: 'slowmo' } ],
        keepsake: {
            imageKey: "keepsake_3_item",
            title: "Đêm hội trăng rằm",
            text: "Hjhj tui biết là nhà mik lên TBTC rất nà áp lực lun ớ, kiểu chịu đủ thứ chuyện, rồi điều hành quá chời chời lun, lúc đó tui cũng bị áp lực dữ khi mò nhà mik mãi hem có tỏ tình tui để 2 mik chính thức quen nhau dì hớt chơn á, người ta nói tui cũng ovtk nhắmmm",
            image: "assets/keepsake_3.png"
        }
    },
    {
        level: 4, winScore: 100,
        startPos: { x: 10, y: 10 },
        obstacleImageKey: "obstacle_crystal",
        backgroundImageKey: "bg_level_4",
        obstacles: [ {x: 3, y: 11}, {x: 4, y: 10}, {x: 5, y: 9}, {x: 6, y: 8}, {x: 13, y: 6}, {x: 14, y: 5}, {x: 15, y: 4}, {x: 16, y: 3} ],
        hedgehogs: [ { x: 1, y: 1, dx: 1, dy: 1, range: 5, moved: 0 }, { x: 18, y: 1, dx: -1, dy: 1, range: 5, moved: 0 } ],
        powerups: [ { x: 1, y: 13, type: 'shield' }, { x: 18, y: 13, type: 'slowmo' } ],
        keepsake: {
            imageKey: "keepsake_4_item",
            title: "Liên Quân Mô Baiiii",
            text: "Hehe, nhà mik là người con trai đầu tiên tui chơi LQ chung á, cũng nhiều cung bậc cảm xúc dới cái game nì quá ha, cãi nhau gòi cừi khà khà nì, nhà mik cứ cay cú tui chơi con Ishar quài hehe",
            image: "assets/keepsake_4.png"
        }
    },
    {
        level: 5, winScore: 120,
        startPos: { x: 10, y: 10 },
        obstacleImageKey: null,
        backgroundImageKey: "bg_level_5",
        obstacles: [],
        hedgehogs: [ { x: 1, y: 1, dx: 1, dy: 0, range: 17, moved: 0 }, { x: 18, y: 3, dx: -1, dy: 0, range: 17, moved: 0 }, { x: 1, y: 5, dx: 1, dy: 0, range: 17, moved: 0 }, { x: 18, y: 7, dx: -1, dy: 0, range: 17, moved: 0 }, { x: 1, y: 9, dx: 1, dy: 0, range: 17, moved: 0 }, { x: 18, y: 11, dx: -1, dy: 0, range: 17, moved: 0 } ],
        powerups: [],
        keepsake: {
            imageKey: "keepsake_5_item",
            title: "Valentineeeeeeeeee",
            text: "Ei bà ui, tui gất nà thích hôm đó lun á, mặc dù vừa qua 14/2 thì mik cãi nhau khà khà, nhưng mà kiểu tâm tư tui dành dô món quà hay gì đó, kiểu ngày hôm đó tui thấy siu hạnh phúc lun ớ, đặc biệt là hôm đó tui có bà là người đón valentine dới tuiiiii",
            image: "assets/keepsake_5.png"
        }
    }
];