import { ChannelType } from "../../typecv/image/ChannelType"
import CVImage from "../../typecv/image/CVImage"
import Effect from "./Effect"

export default class ContrastEffect extends Effect{
//スライダーの値
    private rangeValue:number
    
    constructor(){
        super()
        this.rangeValue = -1
        let slider = <HTMLInputElement>document.getElementById("contrastRange")
        slider.addEventListener("mouseup", () =>{
            this.rangeValue = Number(slider.value)
            let image = <HTMLImageElement>document.getElementById("outputImage")
            let cvImage = new CVImage(image)
            let outputImage = this.apply(cvImage)
            outputImage.show("postProcessed")
        })
    }

    apply(image: CVImage): CVImage {
        let dst = image.clone()

        for (let i = 0; i < image.getHeight(); i++) {
            for (let j = 0; j < image.getWidth(); j++) {
                let r = image.readPixel(i,j,0)
                let g = image.readPixel(i,j,1)
                let b = image.readPixel(i,j,2)

                dst.writePixel(i, j, this.createContrast(r), 0)
                dst.writePixel(i, j, this.createContrast(g), 1)
                dst.writePixel(i, j, this.createContrast(b), 2)
            }
        }
        let outputImage = dst.clone()
        image.delete()
        dst.delete()
        return outputImage
    }
    private createContrast(rgbValue:number):number{
        let contrastValue = rgbValue * this.rangeValue + 127 - 127 * this.rangeValue
        if(contrastValue >=255){
            contrastValue = 255
        } else if(contrastValue <=0){
            contrastValue = 0
        }
        return contrastValue
    }

}