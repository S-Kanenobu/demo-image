// 画像をダウンロードするクラス
export default class SaveEffect {
    // キャンバス
    private canvas:HTMLCanvasElement
    // 初期化クラス
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = <HTMLCanvasElement>document.getElementById("postProcessed")
    }
    
    // キャンバスを保存する
    public saveCanvas(): void {
        let imageType = "image/png";
        let fileName = "art_work.png";
        let dataUrl = this.canvas.toDataURL(imageType);
        let blob = this.Base64toBlob(dataUrl);
        this.saveBlob(blob, fileName);
    }
    // Base64データをBlob型に変換する
    // https://st40.xyz/one-run/article/133/
    public Base64toBlob(base64: string) {
        // カンマで分割して以下のようにデータを分ける
        // tmp[0] : データ形式（data:image/png;base64）
        // tmp[1] : base64データ（iVBORw0k～）
        var tmp = base64.split(',');
        // base64データの文字列をデコード
        var data = atob(tmp[1]);
        // tmp[0]の文字列（data:image/png;base64）からコンテンツタイプ（image/png）部分を取得
        var mime = tmp[0].split(':')[1].split(';')[0];
        // 1文字ごとにUTF-16コードを表す 0から65535 の整数を取得
        var buf = new Uint8Array(data.length);
        for (var i = 0; i < data.length; i++) {
            buf[i] = data.charCodeAt(i);
        }
        // blobデータを作成
        var blob = new Blob([buf], { type: mime });
        return blob;
        }
    
        // 画像をダウンロードする
        // https://st40.xyz/one-run/article/133/
        public saveBlob(blob:Blob, fileName:string) {
            let url = (window.URL);
            // ダウンロード用のURL作成
            var dataUrl = url.createObjectURL(blob);
            // イベント作成
            var event = document.createEvent("MouseEvents");
            event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            // a要素を作成
            var a = <HTMLAnchorElement>document.createElementNS("http://www.w3.org/1999/xhtml", "a");
            // ダウンロード用のURLセット
            a.href = dataUrl;
            // ファイル名セット
            a.download = fileName;
            // イベントの発火
            a.dispatchEvent(event);
        }
}