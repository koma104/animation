document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.animation-card');

  cards.forEach((card) => {
    const playBtn = card.querySelector('.play-btn');
    const target = card.querySelector('.animation-target');
    const animationType = card.dataset.animation;

    playBtn.addEventListener('click', () => {
      // アニメーションをリセットするために、要素を複製して置き換える
      const newTarget = target.cloneNode(true);
      target.parentNode.replaceChild(newTarget, target);

      // 新しい要素にアニメーションクラスを追加
      requestAnimationFrame(() => {
        newTarget.classList.add(`${animationType}-animation`);
      });
    });
  });
});
