import CVImage from "../../typecv/image/CVImage";
import Polygon from "../../typecv/math/Polygon";
import Vector from "../../typecv/math/Vector";
import Effect from "./Effect";
// 六角形モザイクに変更するクラス
export default class PixelateEffect extends Effect{
    //スライダーの値
    private rangeValue:number
    // 初期化メソッド
    constructor(){
        super()
        this.rangeValue = -1
        let slider = <HTMLInputElement>document.getElementById("pixelateRange")
        slider.addEventListener("mouseup", () =>{
            this.rangeValue = Number(slider.value)
            let image = <HTMLImageElement>document.getElementById("outputImage")
            let cvImage = new CVImage(image)
            let outputImage = this.apply(cvImage)
            outputImage.show("postProcessed")
        })
    }
    // 画像を加工するメソッド
    apply(image: CVImage): CVImage {
        let dst = image.clone()
        let imageWidth = image.getWidth()
        let imageHeight = image.getHeight()

        let mosaicSize = 10
        let size = mosaicSize
        let size2 = mosaicSize * 2
        let seizeHalfRoot3 = 0.5 * size * Math.sqrt(3)

        let pixelx = 0, pixely = 0, pixelCount= 0
        let r = 0, g =0, b = 0
        let evenY = true
        let flagBoard: boolean[][] = new Array()
        for (let i = 0; i < imageWidth; i++) {
            flagBoard[i] = new Array()
            for (let j = 0; j < imageHeight; j++){
                flagBoard[i][j] = false
            }
        }
        for (let y = -seizeHalfRoot3; y < imageHeight; y += seizeHalfRoot3) {       
            //行が偶数か奇数かでxのスタート地点を変更
            let startX:number
            if(evenY){
                startX = -size * 1.5
            } else {
                startX = 0
            }
            //フラグを反転
            evenY = !evenY
            for (let x = startX; x < imageWidth; x += size * 3) {
                //六角形の頂点を作成
                let p0 = new Vector(x + size * 0.5, y + 0),
                    p1 = new Vector(x + size * 1.5, y + 0),
                    p2 = new Vector(x + size * 2.0, y + seizeHalfRoot3),
                    p3 = new Vector(x + size * 1.5, y + size * Math.sqrt(3)),
                    p4 = new Vector(x + size * 0.5, y + size * Math.sqrt(3)),
                    p5 = new Vector(x + 0, y + seizeHalfRoot3)
                let polygon = new Polygon([p0, p1, p2, p3, p4, p5])
                //六角形内に存在するのか判定
                r = g = b = pixelCount = 0
                for (let i = 0; i < size2; i++){
                    for (let j = 0; j < size2; j++){
                        pixelx = x + i
                        pixely = y + j
                        let pixelv = new Vector(pixelx, pixely)
                        //塗りつぶすかの判定
                        if (pixelx >= 0 && pixelx < imageWidth && pixely >= 0 && pixely < imageHeight) {
                            if (polygon.isContain(pixelv)) {
                                flagBoard[pixelx][pixely] = true
                                //rgbの値をそれぞれ足す
                                r += image.readPixel(pixely, pixelx, 0)
                                g += image.readPixel(pixely, pixelx, 1)
                                b += image.readPixel(pixely, pixelx, 2)
                                pixelCount ++
                            }
                        }
                    }
                }
                //平均を取る
                r = Math.round(r / pixelCount)
                g = Math.round(g / pixelCount)
                b = Math.round(b / pixelCount)
                //モザイクをかける
                for(let i = 0;  i< size2; i ++) {
                    for (let j = 0; j < size2; j++) {
                        pixelx = x + i
                        pixely = y + j
                        //画像の範囲内かの判定
                        if(pixelx < imageWidth && pixely < imageHeight) {
                            if (pixelx >= 0 && pixely >= 0 && flagBoard[pixelx][pixely]) {
                                    dst.writePixel(pixely, pixelx, r, 0)
                                    dst.writePixel(pixely, pixelx, g, 1)
                                    dst.writePixel(pixely, pixelx, b, 2)
                            }
                        }
                    }
                }
            }
        }
        image.delete()
        return dst
    }
}