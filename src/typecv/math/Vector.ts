//二次元ベクトルクラス
export default class Vector {
    // 要素
    private x: number = 0.0;
    private y: number = 0.0;

    // デフォルトコンストラクタ
    constructor();
    // コンストラクタ(要素指定)
    constructor(x: number, y: number);
    // コピーコンストラクタ
    constructor(vec: Vector);
    // コンストラクタの実体
    constructor(a?: any, b?: number) {
        if (a === null) { // デフォルトデフォルトコンストラクタの呼び出し
            this.x = 0.0;
            this.y = 0.0;
        }
        if (a instanceof Vector) { // コピーコンストラクタの呼び出し
            this.x = a.x
            this.y = a.y
        } else if (b !== null && b !== undefined) { // コンストラクタ(要素指定)の呼び出し
            this.x = a
            this.y = b
        }
    }

    //xのゲッター
    public getX(): number { return this.x; }

    //xのセッター
    public setX(x: number): void{ this.x = x; }

    //yのゲッター
    public getY(): number { return this.y; }

    //yのセッター
    public setY(y: number): void { this.y = y; }

    //x,yのセッター
    public setXY(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    //x,yのセッター(Vector)
    public set(vec: Vector): void {
        this.x = vec.x;
        this.y = vec.y;
    }

    //加算する
    public add(vec: Vector): void {
        this.x += vec.x;
        this.y += vec.y;
    }

    //減算する
    public sub(vec: Vector): void {
        this.x -= vec.x;
        this.y -= vec.y;
    }
    //返り値をVectorに設定した減産
    public sub1(vec: Vector): Vector {
        let v = new Vector
        v.x = this.x - vec.x;
        v.y = this.y - vec.y;
        return v
    }

    //乗算する
    public multiply(m: number): void {
        this.x *= m;
        this.y *= m;
    }

    //除算する
    public divide(d: number): void {
        this.x /= d;
        this.y /= d;
    }

    // 角度を求める
    public getAngle(v: Vector): number {
        // debug_minami
        // アークコサインを使わないように直す
       let rad =  Math.acos(this.getCos(v));
       rad = (rad / Math.PI) * 180;
       return rad;
    }

    //余弦を返す
    public getCos(vec: Vector): number {
        let nor = this.norm() * vec.norm();
        if (nor == 0.0) {
            return 0;
        } else {
            return this.dot(vec) / nor;
        }
    }

    //垂直な単位ベクトルを返す
    public getUnitVec(): Vector[] {
        let y1 = this.x / this.norm();
        let y2 = -y1;
        let x1 = -this.y * y1 / this.x;
        let x2 = -this.y * y2 / this.x;
        let unitVectors: Vector[] = []
        let unit1 = new Vector(x1, y1);
        let unit2 = new Vector(x2, y2);
        unitVectors.push(unit1);
        unitVectors.push(unit2);
        return unitVectors;
    }

    //等しいか
    public equals(vec: Vector): boolean{
        return this.x == vec.x && this.y == vec.y;
    }

    //距離を取得する
    public distance(vec: Vector): number {
        let dx = this.x - vec.x;
        let dy = this.y - vec.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    //内積を求める
    public dot(vec: Vector): number {
        return this.x * vec.getX() + this.y * vec.getY();
    }
    //大きさを求める
    public norm(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    //単位ベクトルを返す
    public getUnit(): Vector {
        let v = new Vector();
        let mag = this.norm();
        if (mag == 0.0) {
            v.setXY(0, 0);
        } else {
            v.setXY(this.x / mag, this.y / mag);
        }
        return v;
    }

    // ベクトル１をベクトル２に正射影したベクトルを求める
    public static getProjection (vec1: Vector, vec2: Vector): Vector {
        let pX = vec2.getUnit().getX() * vec1.norm() * vec1.getCos(vec2);
        let pY = vec2.getUnit().getY() * vec1.norm() * vec1.getCos(vec2);
        let vec = new Vector(pX, pY);
        return vec;
    }
}
