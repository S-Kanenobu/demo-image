import CVImage from "../../typecv/image/CVImage";
import Effect from "./Effect";

export default class GrayScaleEffect extends Effect{
    
    // 画像を加工する
    apply(image: CVImage): CVImage {
        return image.cvtColorGray()
    }
}