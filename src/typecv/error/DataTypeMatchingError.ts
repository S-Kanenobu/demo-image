import CVError from "../error/CVError"

// cvMatインスタンス作成時のエラークラス
export default class DataTypeMatchingError extends CVError {
    // コンストラクタ 
    constructor(dataError?: string) {
        super("no matching data type:" + dataError);
        this.name = "DataTypeMatchingError";
    }
}
