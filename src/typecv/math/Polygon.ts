import Vector from "./Vector";

//多角形クラス
export default class Polygon {
    // 頂点
    private _vertices: Vector[]
    // コンストラクタ
    constructor(vertices: Vector[]) {
        this._vertices = vertices
    }
    // 多角形内に指定の点を含むか
    public isContain(pos:Vector):boolean {
        let ls = []
        for(let i = 0; i < this._vertices.length; i++){
            let v = this._vertices[i]
            let d = v.sub1(pos)
            ls.push(d)
        }
        let sum = 0
        for (let i = 0; i<ls.length-1; i++){
            let cur = <Vector>ls[i]
            let next = <Vector>ls[i+1]
            let angle = cur.getAngle(next)
            sum += angle
        }
        sum += ls[ls.length-1].getAngle(ls[0])
        if(sum >= Math.PI * 2){
            return true
        } else {
            return false
        }
    }
}