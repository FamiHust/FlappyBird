import { _decorator, Component, Node, EventTouch, input, Input, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BirdControl')
export class BirdControl extends Component {

    // Speed of bird
    private speed: number = 0;

    onLoad () {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    update (dt: number) {
        this.speed -= 0.05;
        
        let pos = this.node.getPosition();
        
        this.node.setPosition(pos.x, pos.y + this.speed, pos.z);
    }

    onTouchStart (event: EventTouch) {
        this.speed = 2;
    }
}
