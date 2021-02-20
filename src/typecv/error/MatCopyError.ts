import CVError from "../error/CVError"

// cvMatコピー時のエラークラス
export default class MatCopyError extends CVError {
    // コンストラクタ 
    constructor(copyerror?: string) {
        super("copy unable:" + copyerror);
        this.name = "MatCopyError";
    }
}