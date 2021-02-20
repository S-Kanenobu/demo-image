import Vector from "../Vector";

// 曲線
export default class Curve {

    // 始点
    private _start: Vector;

    // 終点
    private _end: Vector;

    // コンストラクタ
    constructor() {
        this._start = new Vector()
        this._end = new Vector()
    }

    // パラメータtで評価する
    public evaluate(t: number) {}

    // 長さを返す
    public calculateLength() {}

    // 始点を取得する
    public get start(): Vector {
        return this._start;
    }

    // 始点を設定する
    public set start(value: Vector) {
        this._start = value;
    }

    // 終点を取得する
    public get end(): Vector {
        return this._end;
    }

    // 終点を設定する
    public set end(value: Vector) {
        this._end = value;
    }
}