import { _decorator, CCInteger, Component, Node, input, Input, EventKeyboard, KeyCode, director } from 'cc';
const { ccclass, property } = _decorator;
import { Ground } from './Ground';
import { Results } from './Results';
import { BirdControl } from './BirdControl';

@ccclass('GameControl')
export class GameControl extends Component {
    @property({
        type: Ground,
        tooltip: 'This is ground'
    })
    public ground: Ground;

    @property({
        type: BirdControl,
    })
    public bird: BirdControl;

    @property({
        type: Results,
        tooltip: 'Results go here'
    })
    public result: Results;

    @property({
        type: CCInteger
    })
    public speed: number = 500;

    @property({
        type: CCInteger
    })
    public pipeSpeed: number = 200;

    onLoad(){
        this.initListener();

        this.result.resetScore();

        director.pause();
    }

    initListener(){
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);

        this.node.on(Node.EventType.TOUCH_START, () =>{
            this.bird.fly();
        })
    }

    onKeyDown(event: EventKeyboard){
        switch(event.keyCode) {
            case KeyCode.KEY_A:
                this.gameOver();
            break;
            case KeyCode.KEY_P:
                this.result.addScore();
            break;
            case KeyCode.KEY_Q:
                this.resetGame();
                this.bird.resetBird();
        }
    }

    startGame(){
        this.result.hideResults();

        director.resume();
    }

    gameOver(){
        this.result.showResults();

        director.pause();
    }

    resetGame(){
        this.result.resetScore();

        this.startGame();
    }
}


