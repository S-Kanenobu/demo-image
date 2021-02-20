import Vector from "./Vector";
import { workerData } from "worker_threads";

// 矩形クラス
export default class Rectangle {

    // 位置
    private position: Vector = new Vector();
    // サイズ
    private size: Vector = new Vector();

    // デフォルトコンストラクタ
    constructor();
    // コンストラクタ(要素指定)
    constructor(x: number, y: number, width: number, height: number);
    // コンストラクタ(位置、サイズ指定)
    constructor(pos: Vector, size: Vector);
    // コピーコンストラクタ
    constructor(r: Rectangle);
    // コンストラクタの実体
    constructor(a?: any, b?: any, c?: number, d?: number) {
        if (a === null) { // デフォルトデフォルトコンストラクタの呼び出し
            this.position = new Vector()
            this.size = new Vector()
        }
        if (a instanceof Rectangle) {
            this.position.setXY(a.getX(), a.getY());
            this.size.setXY(a.getWidth(), a.getHeight());    
        }

        if (a instanceof Vector && b instanceof Vector) { // Vector指定コンストラクタの呼び出し
            this.position.set(a)
            this.size.set(b)
        } 

        if (typeof a === 'number' && typeof b === 'number' && c !== null 
            && c !== undefined && d !== null && d !== undefined) {  // 要素指定コンストラクたの呼び出し
            this.position.setXY(a, b)
            this.size.setXY(c, d)
        }
    }

    // コピーする
    public copy(r: Rectangle) {
        this.position.setXY(r.getX(), r.getY());
        this.size.setXY(r.getWidth(), r.getHeight());    
    }

    // 位置を返す
    public getPosition(): Vector {
        return this.position
    }

    // x位置を返す
    public getX(): number {
        return this.position.getX();
    }

    // y位置を返す
    public getY(): number {
        return this.position.getY();
    }

    // 幅を返す
    public getWidth(): number {
        return this.size.getX();
    }
    
    // 高さを返す
    public getHeight(): number {
        return this.size.getY();
    }

    // 重心座標を返す
    public getCenter(): Vector {
        let cx = this.position.getX() + (this.size.getX()/2);
        let cy = this.position.getY() + (this.size.getY()/2);
        let vc = new Vector();
        vc.setXY(cx, cy)
        return vc;
    }

    //空か
    public isEmpty(): boolean {
        if (this.position.getX() == 0 && this.position.getY() == 0 
            && this.size.getX() == 0 && this.size.getY() == 0) {
            return true;
        }
        return false;
    }

    // 面積を返す
    public getArea(): number {
        return this.size.getX() * this.size.getY()
    }

    // 拡大する
    public expand(top: number, bottom: number, left: number, right: number): void {
        // y座標
        let oy = this.position.getY();
        let dy = oy - top
        let y = dy < 0 ? 0: dy
        this.position.setY(y);

        // x座標
        let ox = this.position.getX();
        let dx = ox - left
        let x = dx < 0 ? 0: dx
        this.position.setX(x);

        // 幅
        let ow = this.size.getX();
        let dw = ow + left + right
        this.size.setX(dw)

        // 高さ
        let oh = this.size.getY();
        let dh = oh + top + bottom;
        this.size.setY(dh);
    }

    // 指定の矩形を含むか
    public isContain(r: Rectangle): boolean {
        if (r.getX() >= this.position.getX() &&
            r.getY() >= this.position.getY() &&
            r.getX() + r.getWidth() <= this.position.getX() + this.size.getX() &&
            r.getY() + r.getHeight() <= this.position.getY() + this.size.getY()) {
            return true;
        }
        return false
    }

    // 矩形内に丸め込む
    public round(r: Rectangle): Rectangle {
        let maxX = r.getX() + r.getWidth();
        let dx = 0;
        if (maxX > this.size.getX()) {
            dx = maxX - this.size.getX()
        } 

        let maxY = r.getY() + r.getHeight();
        let dy = 0;
        if (maxY > this.size.getY()) {
            dy = maxY - this.size.getY()
        } 

        let ret = new Rectangle(r)
        ret.expand(0, -dy, 0, -dx);
        return ret;
    }

    // クラスの情報を出力する
    public showInfo(): void {
        console.log(
            'x: ' + this.position.getX() + '\n' +
            'y: ' + this.position.getY() + '\n' +
            'width: ' + this.size.getX() + '\n' +
            'height: ' + this.size.getY() + '\n');
    }  

    // 指定の矩形が重なっているか
    public isOverlapped(r: Rectangle): boolean {
        // 重心座標を取得
        let srcCenter:Vector = this.getCenter();
        // 捜査矩形の重心座標を取得
        let center: Vector = r.getCenter();
        if(
            // 横幅の判定
            Math.abs(srcCenter.getX() - center.getX()) <= this.size.getX()/2 + r.getWidth()/2
            &&
            // 縦幅の判定
            Math.abs(srcCenter.getY() - center.getY()) <= this.size.getY()/2 + r.getHeight()/2
        ) {
            return true
        }
        return false;
    }
}