import CVImage from "../../typecv/image/CVImage";
import Effect from "./Effect";
//階調を変更するクラス
export default class PosterizationEffect extends Effect{
    //スライダーの値
    private rangeValue:number
    // 初期化メソッド
    constructor(){
        super()
        this.rangeValue = -1
        let slider = <HTMLInputElement>document.getElementById("posterizationRange")
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

        for (let i = 0; i < image.getHeight(); i++) {
            for (let j = 0; j < image.getWidth(); j++) {
                let r = image.readPixel(i,j,0)
                let g = image.readPixel(i,j,1)
                let b = image.readPixel(i,j,2)

                let dstr = this.createPosterize(r)
                let dstg = this.createPosterize(g)
                let dstb = this.createPosterize(b)

                dst.writePixel(i, j, dstr, 0)
                dst.writePixel(i, j, dstg, 1)
                dst.writePixel(i, j, dstb, 2)
            }
        }
        image.delete()
        return dst
    }
    // 階調を変更するメソッド
    private createPosterize(rgbValue:number):number{    
        let posterize = Math.floor(rgbValue / this.rangeValue)
        let posterizeValue = posterize * this.rangeValue
        return posterizeValue
    }
}