// ======================
// 質問データ
// ======================

const fixedQuestion = {
  question: "今日はどんな気分で過ごしたい？",
  options: [
    { text: "ゆったりしたい", score: 1 },
    { text: "体を動かしたい", score: 10 },
    { text: "穏やかに楽しみたい", score: 100 },
    { text: "刺激や冒険を楽しみたい", score: 1000 }
  ]
};

const otherQuestions = [
  {
    question: "今聴きたい音楽のジャンルは？",
    options: [
      { text: "静かで落ち着く音楽", score: 1 },
      { text: "テンション上がるアップテンポ", score: 10 },
      { text: "ゆったりリズムでリラックス", score: 100 },
      { text: "ノリのいいライブ音源や冒険感ある曲", score: 1000 }
    ]
  },
  {
    question: "気分を色で表すとしたら？",
    options: [
      { text: "緑豊かな柔らかい色", score: 1 },
      { text: "ビビッドで元気な色", score: 10 },
      { text: "暖色系の落ち着いた色", score: 100 },
      { text: "鮮やかで冒険心を感じる色", score: 1000 }
    ]
  },
  {
    question: "動物と入れ替われるなら？",
    options: [
      { text: "パンダのようにのんびり", score: 1 },
      { text: "犬のように元気に活動", score: 10 },
      { text: "猫になっておうちでくつろぐ", score: 100 },
      { text: "タカやイルカのように自由で冒険的", score: 1000 }
    ]
  },
  {
    question: "今の気持ちを天気に例えると？",
    options: [
      { text: "穏やかな青空", score: 1 },
      { text: "快晴で爽快な風", score: 10 },
      { text: "柔らかい夕暮れ", score: 100 },
      { text: "嵐の前の静けさ", score: 1000 }
    ]
  },
  {
    question: "コンビニで食べたいものは？",
    options: [
      { text: "カットフルーツ", score: 1 },
      { text: "ホットスナック", score: 10 },
      { text: "しっとりスイーツ", score: 100 },
      { text: "新作パン", score: 1000 }
    ]
  },
  {
    question: "飲み物を選ぶなら？",
    options: [
      { text: "ハーブティーやカフェラテ", score: 1 },
      { text: "スポーツドリンクや炭酸", score: 10 },
      { text: "紅茶やホットココア", score: 100 },
      { text: "オリジナルカクテル", score: 1000 }
    ]
  }
];

// ======================
// 診断結果データの読み込み
// ======================
let resultsData = [];

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    resultsData = data;
  })
  .catch(err => console.error("データ読み込みエラー:", err));

// ======================
// 変数
// ======================
let currentQuestionIndex = 0;
let userScore = 0;
let selectedQuestions = [];

// ======================
// HTML要素取得
// ======================
const quizContainer = document.getElementById('quiz-container');
const nextBtn = document.getElementById('next-btn');
const resultDiv = document.getElementById('result');

// ======================
// 初期化
// ======================
nextBtn.addEventListener('click', () => {
  if(currentQuestionIndex === 0) {
    startQuiz();
  } else {
    showNextQuestion();
  }
});

function startQuiz() {
  // ランダムで3問選択
  selectedQuestions = shuffleArray(otherQuestions).slice(0,3);
  // 固定問題を先頭に追加
  selectedQuestions.unshift(fixedQuestion);
  currentQuestionIndex = 0;
  userScore = 0;
  nextBtn.style.display = "none";
  showQuestion();
}

// ======================
// 質問表示
// ======================
function showQuestion() {
  quizContainer.innerHTML = '';

  const q = selectedQuestions[currentQuestionIndex];

  const questionEl = document.createElement('div');
  questionEl.className = 'question';
  questionEl.textContent = q.question;
  quizContainer.appendChild(questionEl);

  const optionsEl = document.createElement('ul');
  optionsEl.className = 'options';

  q.options.forEach(opt => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.textContent = opt.text;
    btn.addEventListener('click', () => {
      userScore += opt.score;
      currentQuestionIndex++;
      if(currentQuestionIndex < selectedQuestions.length) {
        showQuestion();
      } else {
        showResult();
      }
    });
    li.appendChild(btn);
    optionsEl.appendChild(li);
  });

  quizContainer.appendChild(optionsEl);
}

// ======================
// 診断結果表示
// ======================
function showResult() {
  quizContainer.style.display = 'none';
  nextBtn.style.display = 'none';
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = '';

  const matched = resultsData.find(r => r.scores.includes(userScore));

  if(matched) {
    const h2 = document.createElement('h2');
    h2.textContent = matched.type;
    resultDiv.appendChild(h2);

    const desc = document.createElement('p');
    desc.textContent = matched.description;
    resultDiv.appendChild(desc);

    const rec1 = document.createElement('p');
    rec1.textContent = `おすすめ①: ${matched.recommend1}`;
    resultDiv.appendChild(rec1);

    const rec2 = document.createElement('p');
    rec2.textContent = `おすすめ②: ${matched.recommend2}`;
    resultDiv.appendChild(rec2);
  } else {
    resultDiv.textContent = "診断結果が見つかりませんでした。";
  }
}

// ======================
// 配列シャッフル関数
// ======================
function shuffleArray(array) {
  let arr = array.slice();
  for(let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
