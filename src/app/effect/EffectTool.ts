import CVImage from "../../typecv/image/CVImage"
import BlueRedEffect from "./BlueRedEffect"
import BrightnessEffect from "./BrightnessEffect"
import ContrastEffect from "./ContrastEffect"
import Effect from "./Effect"
import { EffectType } from "./EffectType"
import GrayScaleEffect from "./GrayScaleEffect"
import HueEffect from "./HueEffect"
import InvertEffect from "./InvertEffect"
import PixelateEffect from "./PixelateEffect"
import PosterizationEffect from "./PosterizationEffect"
import RetroEffect from "./RetroEffect"
import SarturationEffect from "./SarturationEffect"
import SepiaEffect from "./SepiaEffect"
import ThresholdEffect from "./ThresholdEffect"
import ToyCameraEffect from "./ToyCameraEffect"
import TranspalentEffect from "./TranspalentEffect"

export default class EffectTool{

    // 現在選択されているエフェクト
    private currentEffect: Effect
    //現在設定しているレンジの値
    private rangeValue:number

    constructor(){
        this.currentEffect = new GrayScaleEffect()
        this.rangeValue = 1
    }

    // エフェクトを切り替える
    public changeEffect(type: EffectType) {
        if (type == EffectType.Sepia){
            this.currentEffect = new SepiaEffect()
        } else if(type == EffectType.GrayScale) {
            this.currentEffect = new GrayScaleEffect()
        } else if (type == EffectType.Invert) {
            this.currentEffect = new InvertEffect()
        } else if (type == EffectType.Hue) {
            this.currentEffect = new HueEffect()
        } else if (type == EffectType.Brightness){
            this.currentEffect = new BrightnessEffect()
        } else if (type == EffectType.Sarturation){
            this.currentEffect = new SarturationEffect()
        } else if(type == EffectType.Contrast){
            this.currentEffect = new ContrastEffect()
        } else if(type == EffectType.Threshold){
            this.currentEffect = new ThresholdEffect()
        } else if(type == EffectType.Transpalent){
            this.currentEffect = new TranspalentEffect()
        } else if(type == EffectType.Posterization){
            this.currentEffect = new PosterizationEffect()
        } else if(type == EffectType.Pixelate){
            this.currentEffect = new PixelateEffect()
        } else if(type == EffectType.BlueRed){
            this.currentEffect = new BlueRedEffect()
        } else if(type == EffectType.ToyCamera){
            this.currentEffect = new ToyCameraEffect()
        } else if(type == EffectType.Retro){
            this.currentEffect = new RetroEffect()
        }

    }

    //エフェクトをかける
    public applyEffect(image: CVImage): CVImage {
        return this.currentEffect.apply(image)
    }

}