import { _decorator, Component, Node, UITransform, Vec3, director, Canvas } from 'cc';
const { ccclass, property } = _decorator;
import { GameControl } from './GameControl';

@ccclass('Ground')
export class Ground extends Component {
    @property({
        type: Node,
        tooltip: 'Ground 1 is here'
    })

    public ground1: Node;

    @property({
        type: Node,
        tooltip: 'Ground 2 is here'
    })

    public ground2: Node;

    // Create ground width with variables
    public groundWidth1: number;
    public groundWidth2: number;
    public tempStartLocation1 = new Vec3; 
    public tempStartLocation2 = new Vec3; 

    public gameCtrlSpeed = new GameControl;
    public gameSpeed: number = 400;

    onLoad(){
        this.startUp();
    }

    startUp(){
        this.groundWidth1 = this.ground1.getComponent(UITransform).width;
        this.groundWidth2 = this.ground2.getComponent(UITransform).width;

        this.tempStartLocation1.x = 0;
        this.tempStartLocation2.x = this.groundWidth1;

        this.ground1.setPosition(this.tempStartLocation1);
        this.ground2.setPosition(this.tempStartLocation2);

    }

    update(deltaTime: number) {
        this.gameSpeed = this.gameCtrlSpeed.speed;
        this.tempStartLocation1 = this.ground1.position.clone();
        this.tempStartLocation2 = this.ground2.position.clone();

        // Di chuyển 2 ground
        this.tempStartLocation1.x -= this.gameSpeed * deltaTime;
        this.tempStartLocation2.x -= this.gameSpeed * deltaTime;

        // Khi ground1 ra khỏi màn hình => đặt nó ngay sau ground2
        if (this.tempStartLocation1.x <= -this.groundWidth1) {
            this.tempStartLocation1.x = this.tempStartLocation2.x + this.groundWidth2;
        }

        // Khi ground2 ra khỏi màn hình => đặt nó ngay sau ground1
        if (this.tempStartLocation2.x <= -this.groundWidth2) {
            this.tempStartLocation2.x = this.tempStartLocation1.x + this.groundWidth1;
        }

        this.ground1.setPosition(this.tempStartLocation1);
        this.ground2.setPosition(this.tempStartLocation2);
    }
}


