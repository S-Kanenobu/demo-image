import CVImage from "../../typecv/image/CVImage";
import Effect from "./Effect";

export default class SepiaEffect extends Effect{
    
    // 画像を加工する
    apply(image: CVImage): CVImage {
        let dst = image.clone()
        for (let i = 0; i < image.getHeight(); i++) {
            for (let j = 0; j < image.getWidth(); j++) {
                
                let r = image.readPixel(i,j,0)
                let g = image.readPixel(i,j,1)
                let b = image.readPixel(i,j,2)

                let rgbRate = (r + g + b) / 765
                let dstr = rgbRate * 240
                let dstg = rgbRate * 200
                let dstb = rgbRate * 148

                dst.writePixel(i, j, dstr, 0)
                dst.writePixel(i, j, dstg, 1)
                dst.writePixel(i, j, dstb, 2)                
            }
        }
        let outputImage = dst.clone()
        image.delete()
        dst.delete()
        return outputImage
    }
}