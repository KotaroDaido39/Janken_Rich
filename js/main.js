// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/rRibjAvjh/";

let model, webcam, labelContainer, maxPredictions, guu;
let guu_count = 0;
let choki_count = 0;
let paa_count = 0;
let playerHand = document.getElementById("Player-hand-value");
let playerHandValue;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("hand-container");
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    guu_count = prediction[0].probability.toFixed(2);
    choki_count = prediction[1].probability.toFixed(2);
    paa_count = prediction[2].probability.toFixed(2);
}

let startTime = null; // 条件を満たし始めた時刻を記録する変数

// guu_countの値を定期的にチェックする関数
function checkHandCount() {
    if (guu_count >= 0.8) {
        if (startTime === null) {
            // 条件を満たし始めた時刻を記録
            startTime = Date.now();
        } else if (Date.now() - startTime >= 3000) {
            // 3秒以上条件を満たしている場合
            console.log("guu_countが3秒以上0.8以上です");
            console.log({ playerHand });
            playerHandValue = "グー";
            playerHand.textContent = "グー";
            setTimeout(playJanken, 1000);
            // 必要に応じてここで処理を行う
            clearInterval(handInterval); // インターバルをクリアして更新を停止
        }
    } else if (choki_count >= 0.8) {
        if (startTime === null) {
            // 条件を満たし始めた時刻を記録
            startTime = Date.now();
        } else if (Date.now() - startTime >= 3000) {
            // 3秒以上条件を満たしている場合
            console.log("choki_countが3秒以上0.8以上です");
            console.log({ playerHand });
            playerHandValue = "チョキ";
            playerHand.textContent = "チョキ";
            setTimeout(playJanken, 1000);
            // 必要に応じてここで処理を行う
            clearInterval(handInterval); // インターバルをクリアして更新を停止
        }
    } else if (paa_count >= 0.8) {
        if (startTime === null) {
            // 条件を満たし始めた時刻を記録
            startTime = Date.now();
        } else if (Date.now() - startTime >= 3000) {
            // 3秒以上条件を満たしている場合
            console.log("paa_countが3秒以上0.8以上です");
            console.log({ playerHand });
            playerHandValue = "パー";
            playerHand.textContent = "パー";
            setTimeout(playJanken, 1000);
            // 必要に応じてここで処理を行う
            clearInterval(handInterval); // インターバルをクリアして更新を停止
        }
    } else {
        // 条件を満たさなくなったら時刻をリセット
        startTime = null;
    }
}

const handInterval = setInterval(checkHandCount, 1000);

function getRandomHand() {
    const randomNum = Math.floor(Math.random() * 3);
    let hand;
    if (randomNum === 0) {
        hand = "グー";
        document.getElementById("hand_paa").remove();
        document.getElementById("hand_choki").remove();
    } else if (randomNum === 1) {
        hand = "チョキ";
        document.getElementById("hand_guu").remove();
        document.getElementById("hand_paa").remove();
    } else {
        hand = "パー";
        document.getElementById("hand_choki").remove();
        document.getElementById("hand_guu").remove();
    }
    return hand;
}

function playJanken() {
    
    const computerHandValue = getRandomHand();

    let result;
    if (playerHandValue === computerHandValue) {
        result = "引き分け";
    } else if (
        (playerHandValue === "グー" && computerHandValue === "チョキ") ||
        (playerHandValue === "チョキ" && computerHandValue === "パー") ||
        (playerHandValue === "パー" && computerHandValue === "グー")
    ) {
        result = "あなたの勝ち";
    } else {
        result = "コンピューターの勝ち";
    }
    console.log(result);
    document.getElementById("result").textContent = result;
}


