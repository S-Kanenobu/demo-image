import CVImage from "../../typecv/image/CVImage";
import Effect from "./Effect";

export default class HueEffect extends Effect{
    //スライダーの値
    private rangeValue:number

    constructor(){
        super()
        this.rangeValue = -1
        let slider = <HTMLInputElement>document.getElementById("hueRange")
        slider.addEventListener("mouseup", () =>{
            this.rangeValue = Number(slider.value)
            let image = <HTMLImageElement>document.getElementById("outputImage")
            let cvImage = new CVImage(image)
            let outputImage = this.apply(cvImage)
            outputImage.show("postProcessed")
        })
    }

    apply(image: CVImage): CVImage {
        let hsv = image.cvtColorHSV()
        let dst = hsv.clone()
        for (let i = 0; i < hsv.getHeight(); i++) {
            for (let j = 0; j < hsv.getWidth(); j++) {
                let dsth = (this.rangeValue * 180) % 180  
                dst.writePixel(i, j, dsth, 0)
            }
        }
        let outputImage = dst.cvtColorBGR()
        image.delete()
        hsv.delete()
        dst.delete()
        return outputImage
    }
}