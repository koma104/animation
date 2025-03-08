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
    const animationType = card.dataset.animation;
    const previewContainer = card.querySelector('.animation-preview');
    const target = card.querySelector('.animation-target');
    const title = card.querySelector('h3').textContent;
    let isPlaying = false;
    let resetTimeout;

    // アニメーション状態のリセット
    const resetAnimation = () => {
      isPlaying = false;
      playBtn.removeAttribute('disabled');
      playBtn.removeAttribute('aria-busy');
      playBtn.querySelector('.btn-text').textContent = 'Play';

      // トランジションアニメーションの場合
      if (animationType.includes('transition')) {
        previewContainer.classList.remove(`${animationType}-animation`);
      } else if (target) {
        // 通常のアニメーションの場合
        target.classList.remove(`${animationType}-animation`);
      }
      announceAnimationComplete(title);
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
        case 'line-reveal-1':
        case 'line-reveal-2':
          duration = 1200; // ライン分割アニメーションの時間を設定
          break;
        case 'text-reveal':
          duration = 2000; // テキスト出現アニメーションの時間を設定
          break;
        case 'circle-scale':
          duration = 2000; // 円形拡大アニメーションの時間を設定
          break;
        case 'text-slide-up':
          duration = 1000; // テキストスライドアップアニメーションの時間を設定
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

    playBtn.addEventListener('click', () => {
      if (isPlaying) return;

      isPlaying = true;
      playBtn.setAttribute('disabled', 'true');
      playBtn.setAttribute('aria-busy', 'true');
      playBtn.querySelector('.btn-text').textContent = 'Playing...';

      // トランジションアニメーションの場合
      if (animationType.includes('transition')) {
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
  liveRegion.textContent = `${animationName} animation started`;
};

// アニメーション終了時の通知
const announceAnimationComplete = (animationName) => {
  liveRegion.textContent = `${animationName} animation completed`;
};
