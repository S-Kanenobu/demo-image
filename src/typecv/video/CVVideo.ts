import MatConstructError from "../error/MatConstructError"
import MatCopyError from "../error/MatCopyError"


import CVState from "../CVState"
import CVImage from "../image/CVImage";
import CVReadFrame from "./CVReadFrame";

export default class CVVideo {

    protected DEFAULT_FPS = 30;

    // ビデオモジュール
    protected video: any;
    // 高さ
    protected height: number;
    // 幅
    protected width: number;

    // コンストラクタ
    constructor(videoElement: HTMLMediaElement) {
        let cv = CVState.instance;
        this.video = new cv.VideoCapture(videoElement);
        this.width = this.video.video.clientWidth;
        this.height = this.video.video.clientHeight;
    }


    // ビデオフレームを処理する
    private processFrame = (cv: any, src: any, dstId: string) => {
        try {
            let begin = Date.now();
            this.video.read(src);
            cv.imshow(dstId, src);
            let delay = 1000 / this.DEFAULT_FPS - (Date.now() - begin);

            // 読み込み時間ずらして再度読み込み
            setTimeout( () => { 
                this.processFrame(cv, src, dstId)
            }, delay);
          } catch (err) {
            console.error(err);
          }
    }

    // 再生する
    public play(dstId: string) {
        let cv = CVState.instance;
        let src = new cv.Mat(this.height, this.width, cv.CV_8UC4);
        setTimeout(() => {
            this.processFrame(cv, src, dstId);
        }, 0);
    }

    // ビデオを処理する
    public processVideo(delay: number, frameCount: number): Promise<CVReadFrame> {
        let time = 1000 / this.DEFAULT_FPS - delay;
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // ビデオフレームの読み込み
                let cv = CVState.instance;
                let src = null;
                try{
                    src = new cv.Mat(this.height, this.width, cv.CV_8UC4)
                } catch(error) {
                    console.log("【CVVideo.processVideo()】 Mat construct failed. ")
                    let mcError = new MatConstructError(error);
                    reject(mcError);
                }

                let begin = Date.now();
                
                this.video.read(src);
                let time = Date.now() - begin

                // CVImageにして返却
                let img = new CVImage();
                try {
                    img.copyFrom(src);
                } catch(error) {
                    console.log("【CVVideo.processVideo()】 copy failed ")
                    let mcError = new MatCopyError(error);
                    console.log("【CVVideo.processVideo()】" + frameCount + "frames catched")
                    src.delete();
                    reject(mcError);
                }
                let frame = new CVReadFrame(img, time, frameCount);
                // src.delete()
                resolve(frame);
            }, time);
        })
    }

     // ビデオの全フレームを取得する
    public async readAllFrame(): Promise<CVImage[]> {
        let frames: CVImage[] = [];
        let delay = 0;   
        let count = 0;
        let canCaptured = true // 正常にフレームが取れているか
        while(this.isStreaming() && canCaptured) {
            let frame = await this.processVideo(delay, count).catch((rejected) => {
                canCaptured = false;
                return frames;
            })

            if (frame instanceof CVReadFrame) { // フレーム情報であるとき
                frames.push(frame.frameImage);
                delay = frame.readTime;
                count++;     
            }
        }
        return frames;
    }

    // ビデオからフレームを読む
    // @param frameCount 読み込むフレーム数
    public async readFrame(frameCount: number): Promise<CVImage[]> {
        let ret: CVImage[] = []
        let delay = 0;
        for (var i = 0; i < frameCount; i++) {
            let frame = await this.processVideo(delay, i);
            ret.push(frame.frameImage);
            delay = frame.readTime;
        }
        return ret
    }

    // ビデオからフレーム情報を取得する
    public async readCVReadFrame(frameCount: number): Promise<CVReadFrame[]> {
        let ret: CVReadFrame[] = []
        let delay = 0;
        for (var i = 0; i < frameCount; i++) {
            let frame = await this.processVideo(delay, i);
            ret.push(frame);
            delay = frame.readTime;
        }
        return ret
    }

    // ストリーミング中か
    public isStreaming(): boolean {
        let velm = this.video.video;
        return velm.currentTime < velm.duration
    }

    // CVImageの表示処理を行う
    // @param frameNumber フレーム番号
    // @param images 再生するCVImage配列
    // @param dstId CVImageの出力先の HTMLCanvasElementのid
    private processImage(frameNumber: number, images: CVImage[],
         dstId: string) : Promise<void> {
        return new Promise((resolve) => {
            images[frameNumber].show(dstId);

            // 1FPS待つ
            setTimeout(() => {
                resolve();
            }, 1000 / this.DEFAULT_FPS);
        })
    }

    // 取得したCVImage配列を動画として再生する
    public async playImages(images: CVImage[], dstId: string) {
        for (let i = 0; i < images.length; i ++) {
            await this.processImage(i, images, dstId);
        }
    }    

    // フレームを再生する
    public playFrames(frames: CVReadFrame[], dstId: string) {
        let images: CVImage[] = [];
        for (let i = 0; i < frames.length; i++) {
            images.push(frames[i].frameImage);
        }
        this.playImages(images, dstId);
    }    
}