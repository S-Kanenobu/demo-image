import CVImage from "../image/CVImage";

// ビデオから取得したフレームクラス
export default class CVReadFrame {

    // フレーム画像
    private _frameImage: CVImage;
    // 読み込み時間
    private _readTime: number;
    // フレーム番号
    private frameNumber: number

    // コンストラクタ
    constructor(img: CVImage, time: number, frameNumber: number) {
        this._frameImage = img;
        this._readTime = time;
        this.frameNumber = frameNumber
    }

    public get readTime(): number {
        return this._readTime;
    }

    public get frameImage(): CVImage {
        return this._frameImage;
    }

    public setFrameImage(img: CVImage) {
        this._frameImage = img;
    }

    // フレーム番号を設定する
    public getFrameNumber(): number {
        return this.frameNumber;
    }
    
}