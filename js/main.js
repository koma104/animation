document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.animation-card');

  cards.forEach((card) => {
    const playBtn = card.querySelector('.play-btn');
    const previewContainer = card.querySelector('.animation-preview');
    let target = card.querySelector('.animation-target');
    const animationType = card.dataset.animation;
    const title = card.querySelector('h3').textContent;

    // アニメーション状態を追跡
    let isPlaying = false;

    // アニメーション終了時のハンドラー
    const handleAnimationEnd = (event) => {
      isPlaying = false;
      event.target.classList.remove(`${animationType}-animation`);
      playBtn.removeAttribute('disabled');

      // スクリーンリーダーに通知
      announceAnimationComplete(title);
    };

    playBtn.addEventListener('click', () => {
      if (isPlaying) return;

      // アニメーション再生中は再生ボタンを無効化
      isPlaying = true;
      playBtn.setAttribute('disabled', 'true');

      // アニメーションをリセットするために、要素を複製して置き換える
      const newTarget = document.createElement('div');
      newTarget.className = 'animation-target';
      previewContainer.replaceChild(newTarget, target);
      target = newTarget;

      // アニメーション終了イベントのリスナーを追加
      target.addEventListener('animationend', handleAnimationEnd, { once: true });

      // 新しい要素にアニメーションクラスを追加
      requestAnimationFrame(() => {
        target.classList.add(`${animationType}-animation`);
      });

      // スクリーンリーダーに通知
      announceAnimationStart(title);
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
