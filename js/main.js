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
    const animationType = card.dataset.animation;
    const target = card.querySelector('.animation-target');
    let isPlaying = false;
    let resetTimeout;

    // アニメーション状態のリセット
    const resetAnimation = () => {
      isPlaying = false;
      if (animationType.includes('transition')) {
        const previewContainer = card.querySelector('.animation-preview');
        previewContainer.classList.remove(`${animationType}-animation`);
      } else if (target) {
        target.classList.remove(`${animationType}-animation`);
      }
    };

    // アニメーション終了の監視
    const observeAnimationEnd = () => {
      if (resetTimeout) {
        clearTimeout(resetTimeout);
      }

      let duration = 2000;
      switch (animationType) {
        case 'slide-transition':
          duration = 5000; // アニメーション全体の時間を5秒に設定
          break;
        case 'diagonal-transition':
          duration = 2200;
          break;
        case 'sparkle':
          duration = 1500;
          break;
        case 'circle-scale':
          duration = 2000; // 円形拡大アニメーションの時間を設定
          break;
        case 'text-slide-up':
          duration = 1000; // テキストスライドアップアニメーションの時間を設定
          break;
        case 'text-slide-up-chars':
          duration = 3000; // アニメーション全体の時間を3秒に設定（文字アニメーション + 停止時間）
          break;
        default:
          duration = 1000;
      }

      resetTimeout = setTimeout(resetAnimation, duration);

      if (!animationType.includes('transition') && target) {
        target.addEventListener(
          'animationend',
          () => {
            clearTimeout(resetTimeout);
            resetAnimation();
          },
          { once: true }
        );
      }
    };

    card.addEventListener('click', () => {
      if (isPlaying) return;

      isPlaying = true;

      // トランジションアニメーションの場合
      if (animationType.includes('transition')) {
        const previewContainer = card.querySelector('.animation-preview');
        previewContainer.classList.remove(`${animationType}-animation`);
        void previewContainer.offsetWidth; // リフロー強制
        previewContainer.classList.add(`${animationType}-animation`);
      }
      // 通常のアニメーションの場合
      else if (target) {
        target.classList.remove(`${animationType}-animation`);
        void target.offsetWidth; // リフロー強制
        target.classList.add(`${animationType}-animation`);
      }

      observeAnimationEnd();
    });

    // キーボード操作のサポート
    card.addEventListener('keydown', (event) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        card.click();
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
  liveRegion.textContent = `${animationName} animation started`;
};

// アニメーション終了時の通知
const announceAnimationComplete = (animationName) => {
  liveRegion.textContent = `${animationName} animation completed`;
};
