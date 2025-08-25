import { _decorator, Component, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainControl')
export class MainControl extends Component {

    @property([Sprite])
    spBg: Sprite[] = [];

    update (dt: number) {
        for (let i = 0; i < this.spBg.length; i++) {
            this.spBg[i].node.setPosition(this.spBg[i].node.position.x - 100 * dt, 0);
            if (this.spBg[i].node.position.x <= -1276) {
                this.spBg[i].node.setPosition(1276, 0);
            }
        }
    }
}
