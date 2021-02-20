import CVImage from "../typecv/image/CVImage"
import { MatType } from "../typecv/image/MatType"
import EffectTool from "./effect/EffectTool"
import { EffectType } from "./effect/EffectType"
import SaveEffect from "./effect/SaveEffect"

export default class App{
    //画像を入力するドロップエリア
    private dropArea:HTMLElement
    //画像をプレビューするエリア
    private previewArea:HTMLImageElement
    //画像を加工するクラス
    private effectTool:EffectTool
    //加工後の画像
    private postProcessed: HTMLCanvasElement

    // 明るさボタン
    private brightnessButton:HTMLButtonElement
    // 色相ボタン
    private hueButton:HTMLButtonElement
    // コントラストボタン
    private contrastButton:HTMLButtonElement
    // 明度ボタン
    private sarturationButton:HTMLButtonElement

    // セピア色ボタン
    private sepiaButton:HTMLButtonElement
    // グレースケールボタン
    private grayScaleButton:HTMLButtonElement
    // 色の反転ボタン
    private invertButton:HTMLButtonElement

    // 白と黒の二値化ボタン
    private thresholdButton:HTMLButtonElement
    // 透明度ボタン
    private transpalentButton:HTMLButtonElement
    // 階調の変更ボタン
    private posterizationButton:HTMLButtonElement
    // 六角形ボタン
    private pixelateButton:HTMLButtonElement

    // 青赤グラデーション
    private blueRedButton:HTMLButtonElement
    // トイカメラ風
    private toyCameraButton:HTMLButtonElement
    // レトロ風
    private retroButton:HTMLButtonElement

    // ダウンロードボタン
    private downloadButton:HTMLButtonElement
    // 明るさレンジ
    private brightnessRange:HTMLInputElement
    // 色相レンジ
    private hueRange:HTMLInputElement
    // コントラストレンジ
    private contrastRange:HTMLInputElement
    // 明度レンジ
    private sarturationRange:HTMLInputElement

    // 白と黒の二値化レンジ
    private thresholdRange:HTMLInputElement
    // 透明度レンジ
    private transpalentRange:HTMLInputElement
    // 階調の変更レンジ
    private posterizationRange:HTMLInputElement
    // 六角形タイルレンジ
    private pixelateRange:HTMLInputElement

    constructor(){
        this.dropArea = document.getElementById("dropArea")
        this.previewArea = <HTMLImageElement>document.getElementById("outputImage")
        this.postProcessed = <HTMLCanvasElement>document.getElementById("postProcessed")
        this.downloadButton = <HTMLButtonElement>document.getElementById("downloadButton")

        this.brightnessButton = <HTMLButtonElement>document.getElementById("brightnessButton")
        this.hueButton = <HTMLButtonElement>document.getElementById("hueButton")
        this.contrastButton = <HTMLButtonElement>document.getElementById("contrastButton")
        this.sarturationButton = <HTMLButtonElement>document.getElementById("sarturationButton")

        this.sepiaButton = <HTMLButtonElement>document.getElementById("sepiaButton")
        this.grayScaleButton = <HTMLButtonElement>document.getElementById("grayScaleButton")
        this.invertButton = <HTMLButtonElement>document.getElementById("invertButton")

        this.thresholdButton = <HTMLButtonElement>document.getElementById("thresholdButton")
        this.transpalentButton = <HTMLButtonElement>document.getElementById("transpalentButton")
        this.posterizationButton = <HTMLButtonElement>document.getElementById("posterizationButton")
        this.pixelateButton = <HTMLButtonElement>document.getElementById("pixelateButton")

        this.blueRedButton = <HTMLButtonElement>document.getElementById("blueRedButton")
        this.toyCameraButton = <HTMLButtonElement>document.getElementById("toyCameraButton")
        this.retroButton = <HTMLButtonElement>document.getElementById("retroButton")

        this.brightnessRange = <HTMLInputElement>document.getElementById("brightnessRange")
        this.hueRange = <HTMLInputElement>document.getElementById("hueRange")
        this.contrastRange = <HTMLInputElement>document.getElementById("contrastRange")
        this.sarturationRange = <HTMLInputElement>document.getElementById("sarturationRange")

        this.thresholdRange = <HTMLInputElement>document.getElementById("thresholdRange")
        this.transpalentRange = <HTMLInputElement>document.getElementById("transpalentRange")
        this.posterizationRange = <HTMLInputElement>document.getElementById("posterizationRange")
        this.pixelateRange = <HTMLInputElement>document.getElementById("pixelateRange")

        this.effectTool = new EffectTool()
        this.setEventListener()
    }

    // イベントリスナーを設定する
    private setEventListener() {
        // ドロップイベントの処理
        this.dropArea.addEventListener('dragover', function(evt){
            console.log("Drag Over")
            evt.preventDefault();
        })
        
        this.dropArea.addEventListener('drop',
            this.handleDropEvent.bind(this), false)

        this.brightnessButton.addEventListener("click", function() {
            this.effectTool.changeEffect(EffectType.Brightness)
            this.showWithEffect()

        }.bind(this))
        this.hueButton.addEventListener("click", function() {
            this.effectTool.changeEffect(EffectType.Hue)
            this.showWithEffect()

        }.bind(this))
        this.contrastButton.addEventListener("click", function() {
            this.effectTool.changeEffect(EffectType.Contrast)
            this.showWithEffect()
    
        }.bind(this))    
        this.sarturationButton.addEventListener("click", function() {
            this.effectTool.changeEffect(EffectType.Sarturation)
            this.showWithEffect()

        }.bind(this))
        this.sepiaButton.addEventListener("click", function() {
            this.effectTool.changeEffect(EffectType.Sepia)
            this.showWithEffect()
            
        }.bind(this))
        this.grayScaleButton.addEventListener("click", function() {
            this.effectTool.changeEffect(EffectType.GrayScale)
            this.showWithEffect()

        }.bind(this))
        this.invertButton.addEventListener("click", function() {
            this.effectTool.changeEffect(EffectType.Invert)
            this.showWithEffect()

        }.bind(this))
        this.thresholdButton.addEventListener("click", function() {
            this.effectTool.changeEffect(EffectType.Threshold)
            this.showWithEffect()
        }.bind(this))
        this.transpalentButton.addEventListener("click", function() {
            this.effectTool.changeEffect(EffectType.Transpalent)
            this.showWithEffect()
        }.bind(this))
        this.posterizationButton.addEventListener("click", function() {
            this.effectTool.changeEffect(EffectType.Posterization)
            this.showWithEffect()
        }.bind(this))
        this.pixelateButton.addEventListener("click", function() {
            this.effectTool.changeEffect(EffectType.Pixelate)
            this.showWithEffect()
        }.bind(this))
        this.blueRedButton.addEventListener("click", function() {
            this.effectTool.changeEffect(EffectType.BlueRed)
            this.showWithEffect()
        }.bind(this))
        this.toyCameraButton.addEventListener("click", function() {
            this.effectTool.changeEffect(EffectType.ToyCamera)
            this.showWithEffect()
        }.bind(this))
        this.retroButton.addEventListener("click", function() {
            this.effectTool.changeEffect(EffectType.Retro)
            this.showWithEffect()
        }.bind(this))
        this.downloadButton.addEventListener("click", function() {
            this.downloadEffect()
        }.bind(this))
    }
        
    // ドロップイベントをハンドリングする
    private handleDropEvent(event: DragEvent) {
        event.stopPropagation()
        event.preventDefault()
        console.log("onDrag")
        
        const file = event.dataTransfer.files[0]
        const reader = new FileReader()
        
        reader.onload = function () { 
            this.previewArea.src = <string>reader.result
        }.bind(this)
        
        this.previewArea.onload = function(){
            this.onLoadImage()
        }.bind(this)
        
        reader.readAsDataURL(file)
    }
        
    // 画像ロードが完了したとき
    private onLoadImage() {
        console.log("onLoadImage")
        this.showWithEffect()
    }

    // エフェクトをかけて画像を表示する
    private showWithEffect() {
        let image = new CVImage(this.previewArea)
        let outout = this.effectTool.applyEffect(image)
        outout.show("postProcessed")
        let effectImage = <any>outout.clone()
        this.postProcessed = <HTMLCanvasElement>effectImage
    }
    //ダウンロード処理
    private downloadEffect(){
        let canvas = new SaveEffect(this.postProcessed)
        canvas.saveCanvas()
    }
}