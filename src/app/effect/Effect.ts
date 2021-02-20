import CVImage from "../../typecv/image/CVImage";

// エフェクト基底クラス
export default abstract class Effect{
    // 画像を加工する
    abstract apply(image: CVImage): CVImage
}