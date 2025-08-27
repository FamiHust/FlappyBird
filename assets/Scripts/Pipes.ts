import { _decorator, Component, Node, Vec3, screen, find, UITransform} from 'cc';
const { ccclass, property } = _decorator;

const random = (min, max) => {
    return Math.random() * (max - min) + min;
}
@ccclass('Pipes')
export class Pipes extends Component {
    
    @property({
        type: Node,
        tooltip: 'Top Pipe'
    })
    public topPipe: Node;

    @property({
        type: Node,
        tooltip: 'Bottom Pipe'
    })
    public bottomPipe: Node;

    public tempStartLocationUp: Vec3 = new Vec3(0,0,0);
    public tempStartLocationDown: Vec3 = new Vec3(0,0,0);
    public scene = screen.windowSize;

    public game;
    public pipeSpeed: number;

    isPass: boolean;

    onLoad() {
        this.game = find("GameControl").getComponent("GameControl");
        this.pipeSpeed = this.game.pipeSpeed;
        this.initPos();
        this.isPass = false;
    }

    initPos() {
        this.tempStartLocationUp.x = (this.topPipe.getComponent(UITransform).width + this.scene.width);
        this.tempStartLocationDown.x = (this.bottomPipe.getComponent(UITransform).width + this.scene.width);

        let gap = random(90, 100);
        let topHeight = random(0, 80);

        this.tempStartLocationUp.y = topHeight;
        this.tempStartLocationDown.y = (topHeight - (gap*9.5));

        this.bottomPipe.setPosition(this.tempStartLocationDown);
        this.topPipe.setPosition(this.tempStartLocationUp);
        
        // Reset isPass khi pipe mới được tạo
        this.isPass = false;
        console.log("New pipe created, isPass reset to false");
    }

    update(deltaTime: number) {
        this.tempStartLocationDown = this.bottomPipe.position;
        this.tempStartLocationUp = this.topPipe.position;
        
        // Debug: hiển thị vị trí chim mỗi 60 frames (khoảng 1 giây)
        if (Math.floor(Date.now() / 1000) % 2 === 0) {
            console.log("Bird position: x=" + this.game.bird.node.position.x + ", y=" + this.game.bird.node.position.y);
        }

        // Sử dụng pipeSpeed từ GameControl với deltaTime để di chuyển mượt mà
        this.tempStartLocationDown.x -= this.pipeSpeed * deltaTime;
        this.tempStartLocationUp.x -= this.pipeSpeed * deltaTime;

        this.bottomPipe.setPosition(this.tempStartLocationDown);
        this.topPipe.setPosition(this.tempStartLocationUp);


        // Debug: luôn hiển thị vị trí pipe để kiểm tra
        if (this.topPipe.position.x % 100 < 5) { // Hiển thị mỗi 100px
            console.log("Pipe position: x=" + this.topPipe.position.x + ", isPass=" + this.isPass);
        }
        
        // Debug chi tiết scoring
        console.log("Scoring check: isPass=" + this.isPass + ", pipe.x=" + this.topPipe.position.x + ", condition=" + (this.isPass == false && this.topPipe.position.x <= 50));
        
        // Tính điểm khi chim vượt qua pipe (khi pipe đi qua vị trí chim)
        if (this.isPass == false && this.topPipe.position.x <= 0) {
            this.isPass = true;
            console.log("Score! Pipe passed bird at x=" + this.topPipe.position.x);
            console.log("Bird position should be around x=0, pipe is at x=" + this.topPipe.position.x);
            this.game.passPipe();
        }

        if (this.topPipe.position.x < this.scene.width / 2 && this.isPass == false) {
            this.isPass = true;
            this.game.createPipe();
        }

        // Để pipes ra ngoài màn hình một đoạn rồi mới dừng
        if (this.topPipe.position.x < (0 - this.scene.width * 1.5)) {
            this.destroy();
        }
    }
}


