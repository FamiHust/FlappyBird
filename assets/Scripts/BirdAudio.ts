import { _decorator, Component, AudioClip, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BirdAudio')
export class BirdAudio extends Component {

    private static _instance: BirdAudio;

    @property({ type: [AudioClip] })
    public clips: AudioClip[] = [];

    @property({ type: AudioSource })
    public audioSource: AudioSource = null!;

    onLoad() {
        if (BirdAudio._instance) {
            this.destroy(); 
            return;
        }
        BirdAudio._instance = this;
    }

    public static get instance(): BirdAudio {
        return this._instance;
    }

    public onAudioQueue(index: number) {
        if (!this.audioSource || !this.clips[index]) return;
        this.audioSource.playOneShot(this.clips[index]);
    }
}
