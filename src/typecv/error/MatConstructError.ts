import CVError from "../error/CVError"

// cvMatインスタンス作成時のエラークラス
export default class MatConstructError extends CVError {
    // コンストラクタ 
    constructor(constructerror?: string) {
        super("construct unable:" + constructerror);
        this.name = "MatConstructError";
    }
}

