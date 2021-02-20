// エラーをハンドリングするクラス
// エラークラス
export default class CVError extends Error {
    // エラーが発生した関数
    public errorFunction: Function;
    // エラーが発生した行数
    public errorLineNumber: number;

    // コンストラクタ 
    constructor(e?:string) {
        super(e);
        this.name = new.target.name;
        this.errorFunction = this.constructor;
        this.errorLineNumber = 0;
    }
    // エラーの内容を文字列に変換する
    public toString(): string {
        let str = "name:" + this.name;
        return str;
    }
}
