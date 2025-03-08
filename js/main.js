document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.animation-card');

  // スキップリンクの処理
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.addEventListener('blur', () => {
      mainContent.removeAttribute('tabindex');
    });
  }

  cards.forEach((card) => {
    const playBtn = card.querySelector('.play-btn');
    const previewContainer = card.querySelector('.animation-preview');
    const animationType = card.dataset.animation;
    const title = card.querySelector('h3').textContent;
    let isPlaying = false;

    // アニメーション状態のリセット
    const resetAnimation = () => {
      isPlaying = false;
      playBtn.removeAttribute('disabled');
      playBtn.removeAttribute('aria-busy');
      playBtn.querySelector('.btn-text').textContent = '再生';
      previewContainer.classList.remove(`${animationType}-animation`);
      announceAnimationComplete(title);
    };

    // アニメーション終了時の処理
    const handleAnimationEnd = () => {
      // タイマーをセットしてアニメーション完了を確実に検知
      setTimeout(resetAnimation, 2000); // アニメーションの最大時間後にリセット
    };

    playBtn.addEventListener('click', () => {
      if (isPlaying) return;

      isPlaying = true;
      playBtn.setAttribute('disabled', 'true');
      playBtn.setAttribute('aria-busy', 'true');
      playBtn.querySelector('.btn-text').textContent = '再生中...';

      // アニメーションをリセットして再開
      previewContainer.classList.remove(`${animationType}-animation`);
      void previewContainer.offsetWidth; // リフロー強制
      previewContainer.classList.add(`${animationType}-animation`);

      // アニメーション開始を通知
      announceAnimationStart(title);

      // アニメーション終了処理を設定
      handleAnimationEnd();
    });

    // キーボード操作のサポート
    playBtn.addEventListener('keydown', (event) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        playBtn.click();
      }
    });
  });
});

// スクリーンリーダー向けの通知領域を作成
const createLiveRegion = () => {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.classList.add('sr-only');
  document.body.appendChild(liveRegion);
  return liveRegion;
};

const liveRegion = createLiveRegion();

// アニメーション開始時の通知
const announceAnimationStart = (animationName) => {
  liveRegion.textContent = `${animationName}アニメーションを開始しました`;
};

// アニメーション終了時の通知
const announceAnimationComplete = (animationName) => {
  liveRegion.textContent = `${animationName}アニメーションが完了しました`;
};
