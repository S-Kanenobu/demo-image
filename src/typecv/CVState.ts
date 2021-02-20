// OpenCVインスタンスを管理するシングルトンクラス
export default class CVState {

    // OpenCVインスタンス
    private static _instance: any;

    // コンストラクタ
    private constructor() {}

    // インスタンスを取得する
    public static get instance(): any {
        if (!this._instance) {
            console.log("CVState.instance invalid.");
            console.log(this._instance);
        }
        return this._instance;
    }

    // 初期化する
    public static async init (): Promise<boolean> {
        console.log("CV.init()");
        return new Promise(resolve => {
            var cv = require("./lib/opencv.js");
            cv['onRuntimeInitialized']=()=>{
                console.log("onRuntimeInitialized");
                this._instance = cv;
                console.log(cv);
                resolve(true);
            };
        })
    }
}