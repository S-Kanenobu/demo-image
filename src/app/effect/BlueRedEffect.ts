import CVImage from "../../typecv/image/CVImage"
import Effect from "./Effect"
//赤と青のグラデーションに変更するクラス
export default class BlueRedEffect extends Effect{
    //画像を加工するメソッド
    apply(image: CVImage): CVImage {
        let dst = image.clone()
        let bLUT = []
        let gLUT = []
        let rLUT = []
        //赤と青のグラデーションに変更LUTを設定
        for (let i = 0; i < 256; i ++) {
            rLUT.push(i)
            gLUT.push(0)
            bLUT.push(255-i)
        }
          
        for ( let i = 0; i < image.getHeight(); i++) {
            for (let j = 0; j < image.getWidth(); j++) {
                let r = image.readPixel(i, j, 0)
                let g = image.readPixel(i, j, 1)
                let b = image.readPixel(i, j, 2)               
                let y = Math.floor (r * 0.299 + g * 0.587 + b * 0.114)

                dst.writePixel(i, j, rLUT[y], 0)
                dst.writePixel(i, j, gLUT[y], 1)
                dst.writePixel(i, j, bLUT[y], 2)
            }
        }
        image.delete()
        return dst
    }
}