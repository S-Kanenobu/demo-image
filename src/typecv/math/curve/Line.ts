import Curve from "./Curve";

// 直線
export default class Line extends Curve {

    // コンストラクタ
    constructor() {
        super();
    }

    // 長さを返す
    public calculateLength() {
        return this.start.distance(this.end);
    }

}