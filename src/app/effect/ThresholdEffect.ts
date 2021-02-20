import CVImage from "../../typecv/image/CVImage";
import Effect from "./Effect";
// 白黒の二値化に変更するクラス
export default class ThresholdEffect extends Effect{
    //スライダーの値
    private rangeValue:number
    // 初期化メソッド
    constructor(){
        super()
        this.rangeValue = -1
        let slider = <HTMLInputElement>document.getElementById("thresholdRange")
        slider.addEventListener("mouseup", () =>{
            this.rangeValue = Number(slider.value)
            let image = <HTMLImageElement>document.getElementById("outputImage")
            let cvImage = new CVImage(image)
            let outputImage = this.apply(cvImage)
            outputImage.show("postProcessed")
        })
    }
    //画像を加工するメソッド
    apply(image: CVImage): CVImage {
        let dst = image.clone()
        let rgbmin = 0
        let rgbMax = 255

        for (let i = 0; i < image.getHeight(); i++) {
            for (let j = 0; j < image.getWidth(); j++) {
                let r = image.readPixel(i,j,0)
                let g = image.readPixel(i,j,1)
                let b = image.readPixel(i,j,2)
                let y = r * 0.299 + g * 0.587 + b * 0.114

                if (this.rangeValue <=  y){
                    dst.writePixel(i,j,rgbmin,0)
                    dst.writePixel(i,j,rgbmin,1)
                    dst.writePixel(i,j,rgbmin,2)
                } else {
                    dst.writePixel(i,j,rgbMax,0)
                    dst.writePixel(i,j,rgbMax,1)
                    dst.writePixel(i,j,rgbMax,2)
                }
            }
        }
        image.delete()
        return dst
    }
}