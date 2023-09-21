import React, { useEffect } from "react";

const VISUALIZER_CANVAS_WIDTH = 310;
const VISUALIZER_CANVAS_HEIGHT = 267;

type VisualizerProps = {
    analyser: AnalyserNode | null; //Web Audio APIの型
    source: MediaElementAudioSourceNode | null; //Web Audio APIの型
    currentSongIndex: number;
}

const Visualizer = ({analyser, source, currentSongIndex}: VisualizerProps) => {
    useEffect(() => {

        if(!analyser || !source) return;

        // キャンバスを配置するコンテナ要素を取得
        const container = document.querySelector('#canvasWrapper');

        // 既存のキャンバスがあれば削除
        const oldCanvas = document.querySelector('#canvasWrapper canvas');
        if(oldCanvas) oldCanvas.remove();

        // 新しいキャンバス要素を作成し、幅と高さを設定
        let canvas = document.createElement('canvas');
        canvas.width = VISUALIZER_CANVAS_WIDTH;
        canvas.height = VISUALIZER_CANVAS_HEIGHT;
        container?.appendChild(canvas);

         // キャンバスの2D描画コンテキストを取得
        let ctx = canvas?.getContext('2d');
        if (!ctx) return;

        // analyserのFFTサイズを設定
        analyser.fftSize = 256;
        // analyserのfrequencyBinCountプロパティからバッファの長さを取得
        let bufferLength = analyser.frequencyBinCount;
        // データ配列を作成。この配列には、analyserから取得した周波数データが格納される
        //（Uint8Array型の配列に波形描画に必要なデータが格納される）
        let dataArray = new Uint8Array(bufferLength);
        // バーの幅を計算(* 3で各々のバーの横幅を調整)
        let barWidth = (VISUALIZER_CANVAS_WIDTH / bufferLength) * 3;
        let barHeight;
        let x;
        // 描画フレームを定義。この関数は再帰的に呼び出され、アニメーションループを作成する
        function renderFrame() {
            requestAnimationFrame(renderFrame);
            x = 0;
            if(!analyser || !ctx) return;

            // analyserから周波数データを取得し、dataArrayに格納
            analyser.getByteFrequencyData(dataArray);

            // 上から下へのグラデーション
            let grd = ctx.createLinearGradient(0, 65, 0, VISUALIZER_CANVAS_HEIGHT);
            grd.addColorStop(0, "rgba(3, 8, 22, 0.8)"); // 上端は黒色
            grd.addColorStop(1, "rgba(255, 255, 0, 0.8)"); // 下端は蛍光黄色

            // 背景色を設定し、全体を塗りつぶし
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, VISUALIZER_CANVAS_WIDTH, VISUALIZER_CANVAS_HEIGHT);

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];
                // グラデーションの割合を計算
                let t = i / bufferLength;
                let r = (1 - t) * 250 + t * 0;
                let g = (1 - t) * 255 + t * 255;
                let b = (1 - t) * 8 + t * 0;

                ctx.fillStyle = 
                    "rgb(" +
                    Math.floor(r) +
                    "," +
                    Math.floor(g) +
                    "," +
                    Math.floor(b) +
                    ")";
                // バーを描画
                //四角形の左上のx座標, 四角形の左上のy座標, 四角形の幅, 四角形の高さ
                ctx.fillRect(x, VISUALIZER_CANVAS_HEIGHT - barHeight, barWidth, barHeight);
                // x座標を更新
                x+= barWidth + 1;

            }
        }

        renderFrame();
    }, [currentSongIndex, analyser, source]);
    return <div id="canvasWrapper"/>
};

export default Visualizer;

