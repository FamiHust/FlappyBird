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
    public tempSpeed: number = 8.5;

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
    }

    update() {
        this.tempStartLocationDown = this.bottomPipe.position;
        this.tempStartLocationUp = this.topPipe.position;

        this.tempStartLocationDown.x -= this.tempSpeed;
        this.tempStartLocationUp.x -= this.tempSpeed;

        this.bottomPipe.setPosition(this.tempStartLocationDown);
        this.topPipe.setPosition(this.tempStartLocationUp);


        if (this.isPass == false && this.topPipe.position.x <= 0) {
            this.isPass = true;
            this.game.passPipe();
        }

        if (this.topPipe.position.x < this.scene.width / 2 && this.isPass == false) {
            this.isPass = true;
            this.game.createPipe();
        }

        if (this.topPipe.position.x < (0 - this.scene.width)) {
            this.destroy();
        }
    }
}


