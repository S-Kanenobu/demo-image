import CVState from "../CVState"
import Rectangle from "../math/Rectangle";
import Vector from "../math/Vector";
import Line from "../math/curve/Line";
import { MatType } from "./MatType";
import { ThresholdingType } from "./ThresholdingType";
import { ChannelType } from "./ChannelType";

export default class CVImage {

    // ガウスぼかしのカーネルのサイズ
    protected GAUSSIAN_KERNEL_SIZE = 3;
    // アンシャープマスクのカーネルのサイズ
    protected UNSHARP_MASK_KERNEL_SIZE = 5;
    // 画像全体の面積として扱う割合
    protected ENTIRE_AREA_RATIO = 0.7;

    // 画像の幅
    protected width: number = 0.0;
    // 画像の高さ
    protected height: number = 0.0;
    // 画像データの実体(cv.Mat)
    protected data: any = null;
    // 画像データのタイプ
    protected type: MatType;

    // デフォルトコンストラクタ
    constructor();
    // コンストラクタ(HTML要素指定)
    constructor(srcElement: HTMLElement);
    // コピーコンストラクタ
    constructor(srcImg: CVImage);
    // コンストラクタ
    constructor(height: number, width: number);
    // コンストラクタの実装
    constructor(a?: any, b?: any) {
        const cv = CVState.instance
        if (a === null) {
            this.width = 0.0;
            this.height = 0.0;
            this.data = new cv.Mat()
        }
        if (a instanceof HTMLElement) {
            const element = <HTMLElement>a
            this.data = cv.imread(element);
            this.width = this.data.size().width;
            this.height = this.data.size().height;
        } else if (a instanceof CVImage) {
            const img = <CVImage>a;
            this.data = img.getData().clone();
            this.width = img.getWidth();
            this.height = img.getHeight();
        }
        if (!isNaN(a) && isNaN(b)) { // 数値で指定されたとき
            this.data = new cv.Mat(a, b)
            this.width = a;
            this.height = b;
        }
        this.type = MatType.CV_8U
    }

    // CVImageからコピーを作成する
    public copyFrom(src: CVImage): void;
    // cv.Matからコピーを作成する
    public copyFrom(mat: any): void;
    // copyFromの実装
    public copyFrom(obj: any): void {
        if (obj instanceof CVImage) {
            this.data = obj.getData().clone();
            this.width = obj.getWidth();
            this.height = obj.getHeight();
        } else {
            this.data = obj.clone();
            this.width = obj.size().width;
            this.height = obj.size().height;
        }
    }

    // 複製する
    public clone(): CVImage {
        return new CVImage(this);
    }

    // データを取得する
    public getData(): any { return this.data }
    // 幅を取得する
    public getWidth(): number { return this.width }
    // 高さを取得する
    public getHeight(): number { return this.height }

    // HTMLElementに表示する
    // @param dstId 出力するHTMLCanvasElementのid
    public show(dstId: string) {
        const cv = CVState.instance
        cv.imshow(dstId, this.data)
    }

    // 色チャンネルを分離する
    public split(channel: number) {
        const cv = CVState.instance
        let rgbaPlanes = new cv.MatVector();
        cv.split(this.data, rgbaPlanes);
        let plane = rgbaPlanes.get(channel);
        this.data = plane
    }

    // 幅と高さを指定してデータを生成する
    public create(width: number, height: number, type: number) {
        this.width = width;
        this.height = height;
        const cv = CVState.instance;
        this.data = new cv.Mat(height, width, type);
    }

    // 塗りつぶす
    public fillForOneChannel(val: number) {
        const cv = CVState.instance
        let scalar = new cv.Scalar(val);
        this.data.setTo(scalar);
    }
    

    // 塗りつぶす
    public fill(r: number, g: number, b: number) {
        const cv = CVState.instance
        let scalar = new cv.Scalar(r, g, b);
        this.data.setTo(scalar);
    }

    // 画素の平均を計算する
    public mean(): number {
        const cv = CVState.instance
        return cv.mean(this.data)[0];
    }

    // 画素の合計を返す
    public sum(): number { 
        let sum = 0;
        for (var j = 0; j < this.width; j++) {
            for (var i = 0; i < this.height; i++) {
                sum += this.readPixel(i ,j);
            }
        }
        return sum;
    }

    // ガウスぼかしをかける
    public addGaussianBlur() {
        let tmp = this.data.clone();
        const cv = CVState.instance
        let kSize = new cv.Size(this.GAUSSIAN_KERNEL_SIZE,
            this.GAUSSIAN_KERNEL_SIZE);
        cv.GaussianBlur(tmp, this.data, kSize, 0, 0, cv.BORDER_DEFAULT);
        tmp.delete();
    }

    // 画素を読む
    // @param i 画像の列におけるindex(0 < i < heightを満たすi)
    // @param j 画像の行におけるindex(0 < j < widthを満たすj)
    public readPixel(i: number, j: number, channel: number = 0, 
        type: MatType = MatType.CV_8U): number {
        switch (type) {
            case MatType.CV_8U:
                return this.data.ucharPtr(i, j)[channel];
            case MatType.CV_8S:
                return this.data.charPtr(i, j)[channel];
            case MatType.CV_16U:
                return this.data.ushortPtr(i, j)[channel];
            case MatType.CV_16S:
                return this.data.shortPtr(i, j)[channel];
            case MatType.CV_32S:
                return this.data.intPtr(i, j)[channel];
            case MatType.CV_32F:
                return this.data.floatPtr(i, j)[channel];
            case MatType.CV_64F:
                return this.data.doublePtr(i, j)[channel];
        }
    }

    // 画素に書き込む
    // @param i 画像の列におけるindex(0 < i < heightを満たすi)
    // @param j 画像の行におけるindex(0 < j < widthを満たすj)
    public writePixel(i: number, j: number, colVal: number, channel: number = 0, 
        type: MatType = MatType.CV_8U) {
        switch (type) {
            case MatType.CV_8U:
                this.data.ucharPtr(i, j)[channel] = colVal;
                break;
            case MatType.CV_8S:
                this.data.charPtr(i, j)[channel] = colVal;
                break;
            case MatType.CV_16U:
                this.data.ushortPtr(i, j)[channel] = colVal;
                break;
            case MatType.CV_16S:
                this.data.shortPtr(i, j)[channel] = colVal;
                break;
            case MatType.CV_32S:
                this.data.intPtr(i, j)[channel] = colVal;
                break;
            case MatType.CV_32F:
                this.data.floatPtr(i, j)[channel] = colVal;
                break;
            case MatType.CV_64F:
                this.data.doublePtr(i, j)[channel] = colVal;
                break;
        }
    }

    // 輪郭を抽出する
    public findContours(): Rectangle[] {
        const cv = CVState.instance
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();

        // console.log("【CVImage.findContours()】call cv.findContours().")
        cv.findContours(this.data, contours, hierarchy, cv.RETR_LIST,
             cv.CHAIN_APPROX_NONE);
        // console.log("【CVImage.findContours()】end cv.findContours().")
        
        let ret: Rectangle[] = [];
        // console.log("【CVImage.findContours()】 contours.size(): " + contours.size());
        for (var i = 0; i  < contours.size(); i++) {
            let cnt = contours.get(i)
            let cr = cv.boundingRect(cnt);
            let rect = new Rectangle(cr.x, cr.y, cr.width, cr.height)
            ret.push(rect)  
        }
        // console.log("【CVImage.findContours()】end.")
        return ret
    } 

    // 矩形を描画する
    public drawRectangles(rects: Rectangle[]): void {
        const cv = CVState.instance
        for (var i = 0; i < rects.length; i++) {
            let r = rects[i];
            let p1 = new cv.Point(r.getX(), r.getY())
            let p2 = new cv.Point(r.getX() + r.getWidth(), r.getY() + r.getHeight())
            let color = new cv.Scalar(0, 0, 0);
            cv.rectangle(this.data, p1, p2, color, 1, cv.LINE_AA, 0)
        }
    }

    // 直線を描画する
    public drawLines(lines: Line[]): void {
        const cv = CVState.instance
        for (var i = 0; i < lines.length; i++) {
            let l = lines[i];
            let p1 = new cv.Point(l.start.getX(), l.start.getY());
            let p2 = new cv.Point(l.end.getX(), l.end.getY());
            let color = new cv.Scalar(255, 0, 0);
            cv.line(this.data, p1, p2, color)
        }
    }

    // 画像データの情報を表示する
    public showInfo(): void {
        console.log(
            'image width: ' + this.data.cols + '\n' +
            'image height: ' + this.data.rows + '\n' +
            'image size: ' + this.data.size().width + '*' 
                + this.data.size().height + '\n' +
            'image depth: ' + this.data.depth() + '\n' +
            'image channels ' + this.data.channels() + '\n' +
            'image type: ' + this.data.type() + '\n');
    }

    // roi
    public roi(r: Rectangle): CVImage {
        const cv = CVState.instance
        let ur: Rectangle;
        let sr = new Rectangle(0, 0, this.width, this.height)
        if (!sr.isContain(r)) { // はみ出すとき
            ur = sr.round(r);
        } else {
            ur = new Rectangle(r);
        }
        let cr = new cv.Rect(ur.getX(), ur.getY(), ur.getWidth(), ur.getHeight())
        let dstMat = new cv.Mat();
        dstMat = this.data.roi(cr);
        let dst = new CVImage()
        dst.copyFrom(dstMat)
        return dst
    }

    // 矩形列で指定された領域を切り取って返す
    public rois(rects: Rectangle[]): CVImage[] {
        let ret: CVImage[] = [];
        for (var i = 0; i < rects.length; i++) {
            let img = this.roi(rects[i]);
            ret.push(img);
        }
        return ret;
    }

    // 2値化する
    public threshold(thresh: number, type: ThresholdingType = ThresholdingType.THRESH_BINARY_INV) {
        const cv = CVState.instance
        switch (type) {
            case ThresholdingType.THRESH_BINARY:
                break   // 未実装
            case ThresholdingType.THRESH_BINARY_INV:
                cv.threshold(this.data, this.data, thresh, 255, cv.THRESH_BINARY_INV);
                break
            case ThresholdingType.THRESH_MASK:
                break   // 未実装
            case ThresholdingType.THRESH_OTSU:
                cv.threshold(this.data, this.data, thresh, 255,
                     cv.THRESH_BINARY + cv.THRESH_OTSU);
                break;
            case ThresholdingType.THRESH_TOZERO:
                break   // 未実装
            case ThresholdingType.THRESH_TOZERO_INV:
                break   // 未実装
            case ThresholdingType.THRESH_TRIANGLE:
                break   // 未実装
            case ThresholdingType.THRESH_TRUNC:
                break   // 未実装
        }
    }

    // 適応的閾値処理を行う
    public adaptiveThreshold(maxVal: number, kSize: number = 5, c: number = 1) {
        const cv = CVState.instance
        cv.adaptiveThreshold(this.data, this.data, maxVal, 
            cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, kSize, c);
    }

    // Cannyエッジ検出をする
    public canny(min: number, max: number, scale: number) {
        const cv = CVState.instance
        cv.Canny(this.data, this.data, min, max, scale, false);
    }

    // 直線を検出する(確率的ハフ変換)
    public houghLinesP(minLen: number, maxGap: number) {
        const cv = CVState.instance
        let lines = new cv.Mat();
        cv.HoughLinesP(this.data, lines, 1, Math.PI / 180, 2, minLen, maxGap);

        let ret: Line[] = []
        for (let i = 0; i < lines.rows; ++i) {
            let s = new Vector(lines.data32S[i * 4], lines.data32S[i * 4 + 1]);
            let e = new Vector(lines.data32S[i * 4 + 2], lines.data32S[i * 4 + 3]);
            let l = new Line()
            l.start = s
            l.end = e
            ret.push(l)
        }
        return ret
    }

    // 回転する
    public rotate(degree: number) {
        const cv = CVState.instance
        let dsize = new cv.Size(this.width, this.height);
        let center = new cv.Point(this.width / 2, this.height / 2);
        let M = cv.getRotationMatrix2D(center, degree, 1);
        cv.warpAffine(this.data, this.data, M, dsize, cv.INTER_LINEAR,
             cv.BORDER_CONSTANT, new cv.Scalar());
    }

    // 画像データを開放する
    public delete() {
        this.data.delete();
    }

    // 差分をとる
    public diff(src: CVImage): CVImage {
        let dst = new CVImage();
        dst.copyFrom(this.data);
        let rows = this.height;
        let cols = this.width;
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                let p0 = this.readPixel(i, j);
                let p1 = src.readPixel(i, j);
                let dp = Math.abs(p0 - p1);
                dst.writePixel(i, j, dp);
            }
        }
        return dst;
    }

    // スカラーを乗算する
    public mul(scalar: number) {
        for (var i = 0; i < this.data.rows; i++) {
            for (var j = 0; j < this.data.cols; j++) {
                let p = this.readPixel(i, j);
                this.writePixel(i , j, p * scalar);
            }
        }      
    }

    // スカラーで除算する
    public div(scalar: number) {
        for (var i = 0; i < this.data.rows; i++) {
            for (var j = 0; j < this.data.cols; j++) {
                let p = this.readPixel(i, j);
                this.writePixel(i , j, p / scalar);
            }
        }  
    }

    // アンシャープマスクをかける
    public unsharpmask(strength: number = 1.0, kernelSize: number = 5) {
        const cv = CVState.instance
        let kernel: number[] = [];
        let pow = kernelSize * kernelSize
        for (var i = 0; i < pow; i++) {
            let v = - strength / pow;
            // console.log(Math.ceil(pow / 2));
            if (i == (Math.ceil(pow / 2))) { // カーネルの中心に達した時
                let rest = pow - 1
                let cv = 1 + (rest * strength) / pow;
                kernel.push(cv);
            } else { // それ以外の平滑化部
                kernel.push(v);
            }
        }

        let mat = new cv.matFromArray(kernelSize, kernelSize, cv.CV_32F, kernel);

        // フィルタ適用
        let dst = this.data.clone()
        let anchor = new cv.Point(-1, -1);
        cv.filter2D(this.data, dst, cv.CV_8U, mat, anchor, 0, cv.BORDER_DEFAULT);
        this.data = dst
    }

    // グレースケール変換する
    public cvtColorGray(): CVImage {
        const cv = CVState.instance
        let dst = new CVImage(this);
        cv.cvtColor(this.getData(), dst.getData(), cv.COLOR_RGBA2GRAY, 0);
        return dst;
    }
    //RGBからHSV色空間に変換する
    public cvtColorHSV(): CVImage {
        const cv = CVState.instance
        let dst = new CVImage(this);
        cv.cvtColor(this.getData(), dst.getData(), cv.COLOR_BGR2HSV);
        return dst;
    }

    //HSVからRGB色空間に変換する
    public cvtColorBGR(): CVImage {
        const cv = CVState.instance
        let dst = new CVImage(this);
        cv.cvtColor(this.getData(), dst.getData(), cv.COLOR_HSV2BGR);
        return dst;
    }

    // 画像を拡大する
    public expandImage(width: number, height: number): void {
        const cv = CVState.instance;
        cv.resize(this.data, this.data, new cv.Size(width,height), 0, 0, cv.INTER_LINEAR)
    }

    // 画像を拡大する
    public expandImageScale(scale: number): void {
        const cv = CVState.instance;
        let w = this.width * scale
        let h = this.height * scale
        cv.resize(this.data, this.data, new cv.Size(w, h), 0, 0, cv.INTER_LINEAR)
    }
    
    // ヒストグラムを作成する
    public makeHistogram(channel: ChannelType): CVImage {
        // openCVインスタンス作成
        const cv = CVState.instance

        // 対象画像のmat作成
        let src = this.data.clone()
        if (channel == ChannelType.all) {// 全色指定の場合、画像をグレースケールに変換
            // Y = 0.299 * R + 0.587 * G + 0.114 * B の重みで変換し、全てのチャンネルにYが代入される。
            cv.cvtColor(this.data, src, cv.COLOR_RGBA2GRAY, 0);
        }
        // matを配列として持つ
        let srcVec = new cv.MatVector()
        srcVec.push_back(src)
        // その他のヒストグラムのパラメータ
        let channels = [channel] // ヒストグラム化するチャンネル
        if (channel == ChannelType.all) {// 全色指定の場合、存在するチャンネルから一つ選ぶ
            channels = [0]
        }
        let accumulate = false // 重ね書きするか
        let histSize = [256] // ビンの本数
        let ranges = [0, 255] // 値域
        let hist = new cv.Mat() // ヒストグラムデータ格納Mat
        let mask = new cv.Mat() // マスク
        let color = new cv.Scalar(255, 255, 255) // ビンの色
        let scale = 2 // ビンの太さ

        // ヒストグラムデータ作成
        cv.calcHist(srcVec, channels, mask, hist, histSize, ranges, accumulate);
        let result = cv.minMaxLoc(hist, mask);
        let max = result.maxVal; // ビンの最大値
        // ヒストグラム描画用データ
        let dstData = new cv.Mat.zeros(src.rows, histSize[0] * scale, cv.CV_8UC3);

        // ヒストグラムの描画(各ビンの塗り潰し)
        for (let i = 0; i < histSize[0]; i++) {
            let binVal = hist.data32F[i] * src.rows / max;
            let point1 = new cv.Point(i * scale, src.rows - 1);
            let point2 = new cv.Point((i + 1) * scale - 1, src.rows - binVal);
            cv.rectangle(dstData, point1, point2, color, cv.FILLED);
        }

        // 画像を作る
        let dist = new CVImage();
        dist.copyFrom(dstData)

        return dist
    }
}