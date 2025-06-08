// js/constants.js (Cập nhật cuối cùng)

export const STORY_DATA = {
    gameIntro: {
        images: ['assets/story/intro_1.png', 'assets/story/intro_2.png', 'assets/story/intro_3.png'],
    },
    level_1: {
        images: ['assets/story/l1_1.png', 'assets/story/l1_2.png'],
        npc: { 
            name: 'Cú Thông Thái', 
            dialogue: [
                "Hỡi Cáo Anh Hùng, Lửng Gắt Gỏng đã đi về phía bờ suối...",
                "Hãy cho ta thấy lòng dũng cảm của cậu bằng cách thu thập đủ những Dấu Vết Tình Yêu mà Sóc để lại. Chúng sẽ tiếp thêm sức mạnh cho cậu."
            ]
        }
    },
    level_2: {
        images: ['assets/story/l2_1.png', 'assets/story/l2_2.png'],
        npc: { 
            name: 'Thú Mỏ Vịt Lập Dị', 
            dialogue: [
                "Trời ơi! Cái huy hiệu hải quân cổ của ta! Lão Lửng đi qua đã làm nó rơi xuống dòng suối mất rồi!",
                "Nếu cậu tìm lại đủ những 'Viên Sỏi Ký Ức' lấp lánh dưới kia giúp ta, ta sẽ cho cậu biết lão ta đã đi đâu."
            ]
        }
    },
    level_3: {
        images: ['assets/story/l3_1.png', 'assets/story/l3_2.png'],
        npc: { 
            name: 'Gấu Trúc Đỏ Lém Lỉnh', 
            dialogue: [
                "Hehe, người lạ mặt! Thấy ta không? Ta biết lão Lửng đi đâu đấy.",
                "Nhưng ta chỉ nói cho những người nhanh nhẹn thôi! Hãy chứng tỏ bản thân bằng cách vượt qua khu rừng trúc này đi!"
            ]
        }
    },
    level_4: {
        images: ['assets/story/l4_1.png', 'assets/story/l4_2.png'],
        npc: { 
            name: 'Tiếng vọng trong hang', 
            dialogue: [
                "Cẩn thận... cỗ máy của lão ta được vận hành bởi năng lượng của những viên pha lê này...",
                "Hãy tìm đến sào huyệt chính của lão ở phía bắc ngọn núi... đó là cơ hội duy nhất của cậu..."
            ]
        }
    },
    level_5: {
        images: ['assets/story/l5_1.png', 'assets/story/l5_2.png'],
        npc: { 
            name: 'Cáo Anh Hùng (tự nhủ)', 
            dialogue: ["Sóc yêu... mình đến đây!"] 
        }
    },
    gameOutro: {
        images: ['assets/story/outro_1.png', 'assets/story/outro_2.png', 'assets/story/outro_3.png'],
    }
};

export const LEVELS = [
    { 
        level: 1, 
        winScore: 50,
        startPos: { x: 10, y: 10 },
        // KHÔI PHỤC: Chướng ngại vật riêng
        obstacleImageKey: "obstacle_tree", 
        obstacles: [ {x: 3, y: 3}, {x: 3, y: 4}, {x: 16, y: 11}, {x: 10, y: 2}, {x: 12, y: 8} ],
        hedgehogs: [ { x: 2, y: 8, dx: 0, dy: 1, range: 4, moved: 0 }, { x: 13, y: 4, dx: 1, dy: 0, range: 5, moved: 0 } ],
        // KHÔI PHỤC: Vật phẩm tăng sức mạnh
        powerups: [
            { x: 15, y: 2, type: 'shield' },
            { x: 5, y: 12, type: 'slowmo' }
        ],
        keepsake: {
            title: "Đi off clb tại Vũng Tàu",
            text: "Hôm đó là một ngày rất đáng nhớ, tui quài hỏng có quên hôm đó tui tỉnh tò nhà mik mà nhà mik lại từ chúi, bùn quớ lun á.",
            image: "assets/keepsake_1.png"
        }
    },
    {
        level: 2, winScore: 70,
        startPos: { x: 5, y: 7 },
        obstacleImageKey: "obstacle_rock",
        obstacles: [ {x: 9, y: 4}, {x: 10, y: 4}, {x: 11, y: 4}, {x: 9, y: 10}, {x: 10, y: 10}, {x: 11, y: 10} ],
        hedgehogs: [ { x: 1, y: 1, dx: 1, dy: 0, range: 17, moved: 0 }, { x: 18, y: 13, dx: -1, dy: 0, range: 17, moved: 0 } ],
        powerups: [
            { x: 1, y: 7, type: 'shield' }
        ],
        keepsake: {
            title: "Ly Sinh Tố Mát Lạnh",
            text: "Trời nóng mà có một ly sinh tố mát lạnh như thế này thì thật tuyệt. Nhưng sẽ còn tuyệt hơn nữa nếu có em ở bên, cùng nhau thưởng thức, cùng nhau nói những câu chuyện không đầu không cuối.",
            image: "assets/keepsake_2.png"
        }
    },
    {
        level: 3, winScore: 80,
        startPos: { x: 7, y: 3 },
        obstacleImageKey: "obstacle_bamboo",
        obstacles: [ {x: 4, y: 0}, {x: 4, y: 1}, {x: 4, y: 2}, {x: 4, y: 3}, {x: 4, y: 4}, {x: 4, y: 5}, {x: 15, y: 9}, {x: 15, y: 10}, {x: 15, y: 11}, {x: 15, y: 12}, {x: 15, y: 13}, {x: 15, y: 14}, {x: 8, y: 7}, {x: 9, y: 7}, {x: 10, y: 7}, {x: 11, y: 7} ],
        hedgehogs: [ { x: 1, y: 1, dx: 1, dy: 0, range: 3, moved: 0 }, { x: 15, y: 12, dx: 0, dy: -1, range: 3, moved: 0 }],
        powerups: [
            { x: 10, y: 10, type: 'slowmo' }
        ],
        keepsake: {
            title: "Đêm hội trăng rằm",
            text: "Hjhj tui biết là nhà mik lên TBTC rất nà áp lực lun ớ, kiểu chịu đủ thứ chuyện, rồi điều hành quá chời chời lun, lúc đó tui cũng bị áp lực dữ khi mò nhà mik mãi hem có tỏ tình tui để 2 mik chính thức quen nhau dì hớt chơn á, người ta nói tui cũng ovtk nhắmmm",
            image: "assets/keepsake_3.png"
        }
    },
    {
        level: 4, winScore: 100,
        startPos: { x: 10, y: 10 },
        obstacleImageKey: "obstacle_crystal",
        obstacles: [ {x: 3, y: 11}, {x: 4, y: 10}, {x: 5, y: 9}, {x: 6, y: 8}, {x: 13, y: 6}, {x: 14, y: 5}, {x: 15, y: 4}, {x: 16, y: 3} ],
        hedgehogs: [ { x: 1, y: 1, dx: 1, dy: 1, range: 5, moved: 0 }, { x: 18, y: 1, dx: -1, dy: 1, range: 5, moved: 0 } ],
        powerups: [
            { x: 1, y: 13, type: 'shield' },
            { x: 18, y: 13, type: 'slowmo' }
        ],
        keepsake: {
            title: "Đồng Đội Chơi Game",
            text: "Hehe, nhà mik là người con trai đầu tiên tui chơi LQ chung á, cũng nhiều cung bậc cảm xúc dới cái game nì quá ha, cãi nhau gòi cừi khà khà nì, nhà mik cứ cay cú tui chơi con Ishar quài hehe",
            image: "assets/keepsake_4.png"
        }
    },
    {
        level: 5, winScore: 120,
        startPos: { x: 10, y: 10 },
        obstacles: [],
        hedgehogs: [ { x: 1, y: 1, dx: 1, dy: 0, range: 17, moved: 0 }, { x: 18, y: 3, dx: -1, dy: 0, range: 17, moved: 0 }, { x: 1, y: 5, dx: 1, dy: 0, range: 17, moved: 0 }, { x: 18, y: 7, dx: -1, dy: 0, range: 17, moved: 0 }, { x: 1, y: 9, dx: 1, dy: 0, range: 17, moved: 0 }, { x: 18, y: 11, dx: -1, dy: 0, range: 17, moved: 0 } ],
        powerups: [],
        keepsake: {
            title: "Valentine của chúng ta",
            text: "Ei bà ui, tui gất nà thích hôm đó lun á, mặc dù vừa qua 14/2 thì mik cãi nhau khà khà, nhưng mà kiểu tâm tư tui dành dô món quà hay gì đó, kiểu ngày hôm đó tui thấy siu hạnh phúc lun ớ, đặc biệt là hôm đó tui có bà là người đó valentine dới tuiiiii",
            image: "assets/keepsake_5.png"
        }
    }
];