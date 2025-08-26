import { _decorator, CCInteger, Component, Node, input, Input, EventKeyboard, KeyCode, director, Contact2DType, Collider2D, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;
import { Ground } from './Ground';
import { Results } from './Results';
import { BirdControl } from './BirdControl';
import { PipePool } from './PipePool';
import { BirdAudio } from './BirdAudio';

@ccclass('GameControl')
export class GameControl extends Component {
    @property({
        type: Ground,
    })
    public ground: Ground;

    @property({
        type: BirdControl
    })
    public bird: BirdControl;

    @property({
        type: PipePool
    })
    public pipeQueue: PipePool;

    @property({
        type: BirdAudio
    })
    public clip: BirdAudio;

    @property({
        type: Results,
    })
    public result: Results;

    @property({
        type: CCInteger
    })
    public speed: number = 500;

    @property({
        type: CCInteger
    })
    public pipeSpeed: number = 500;

    public isOver: boolean;

    onLoad(){
        this.initListener();

        this.result.resetScore();
        this.isOver = true;

        director.pause();
    }

    initListener(){

        this.node.on(Node.EventType.TOUCH_START, () =>{
            if (this.isOver == true){
                this.resetGame();
                this.bird.resetBird();
                this.startGame();
            }
            if (this.isOver == false){
                this.bird.fly();
                BirdAudio.instance.onAudioQueue(0);
            }
        })
    }

    startGame(){
        this.result.hideResults();
        director.resume();
    }

    gameOver(){
        this.result.showResults();
        this.isOver = true;
        BirdAudio.instance.onAudioQueue(3);
        director.pause();
    }

    resetGame(){
        this.result.resetScore();
        this.pipeQueue.reset();
        this.isOver = false;
        this.startGame();
    }

    passPipe() {
        this.result.addScore();
        BirdAudio.instance.onAudioQueue(1);
    }

    createPipe(){
        this.pipeQueue.addPool();
    }

    contactGroundPipe(){
        let collider = this.bird.getComponent(Collider2D);

        if (collider){
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null){
        this.bird.hitSomething = true;
        BirdAudio.instance.onAudioQueue(2);
    }

    birdStruck() {
        this.contactGroundPipe();

        if (this.bird.hitSomething == true)
        {
            this.gameOver();
        }
    }

    update(){
        if (this.isOver == false){
            this.birdStruck();
        }
    }
}


