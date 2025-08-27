import { _decorator, Component, Node, CCFloat, Vec3, Animation, tween, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BirdControl')
export class BirdControl extends Component {

    @property({
        type: CCFloat,
    })
    public jumpHeight: number = 3.5;

    @property({
        type: CCFloat,
    })
    public jumpDuration: number = 3.5;

    public birdAnimation: Animation;
    public birdLocation: Vec3;
    public hitSomething: boolean;
    
    @property({
        type: CCFloat,
    })
    public upTiltAngle: number = 25;

    @property({
        type: CCFloat,
    })
    public downTiltAngle: number = -25; // Góc nghiêng xuống nhỏ hơn, không cắm thẳng

    @property({
        type: CCFloat,
    })
    public hopDuration: number = 0.22; // thời gian vút lên (mượt mà hơn để tránh giật)

    @property({
        type: CCFloat,
    })
    public fallDuration: number = 1.0; // thời gian rơi xuống (nhanh hơn)

    onLoad(){
        this.resetBird();

        this.birdAnimation = this.getComponent(Animation);
    }

    resetBird(){
       this.birdLocation = new Vec3(0,0,0); 
       this.node.setPosition(this.birdLocation);
       this.hitSomething = false;
    }

    fly(){
        if (!this.node) return;

        // Ngắt tween trước đó để cú nhảy mới phản hồi ngay
        Tween.stopAllByTarget(this.node);

        this.birdAnimation.stop();

        const current = this.node.position.clone();
        const upTargetY = current.y + this.jumpHeight; // kept for reference, now using relative hop

        // Không cần đẩy lên trước, để chim nhảy ngay từ vị trí hiện tại

        // Chuỗi tween: vút lên + nghiêng lên, sau đó nghiêng xuống và rơi
        tween(this.node)
            // Vút lên smooth và nghiêng lên một chút (đồng thời)
            .parallel(
                tween<Node>().to(this.hopDuration, { angle: this.upTiltAngle }, { easing: 'cubicOut' }),
                // Dịch chuyển tương đối để tránh khựng khi đang rơi
                tween<Node>().by(this.hopDuration, { position: new Vec3(0, this.jumpHeight, 0) }, { easing: 'cubicOut' })
            )
            // Ngay sau khi đạt đỉnh: bắt đầu RƠI và XOAY XUỐNG cùng lúc (không delay)
            .parallel(
                tween<Node>().to(this.fallDuration, { angle: this.downTiltAngle }, { easing: 'cubicOut' }),
                tween<Node>().by(this.fallDuration, { position: new Vec3(0, -this.jumpHeight * 2.35, 0) }, { easing: 'linear' })
            )
            .start();

        this.birdAnimation.play();
    }
}
