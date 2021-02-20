import CVImage from "../../typecv/image/CVImage";
import Effect from "./Effect";

export default class InvertEffect extends Effect{
    
    // 画像を加工する
    apply(image: CVImage): CVImage {
        let dst = image.clone()

        for (let i = 0; i < image.getHeight(); i++) {
            for (let j = 0; j < image.getWidth(); j++) {
                let b = image.readPixel(i,j,0)
                let g = image.readPixel(i,j,1)
                let r = image.readPixel(i,j,2)

                dst.writePixel(i, j, 255 - b, 0)
                dst.writePixel(i, j, 255 - g, 1)
                dst.writePixel(i, j, 255 - r, 2)
            }
        }
        let outputImage = dst.clone()
        image.delete()
        dst.delete()
        return outputImage
    }
}