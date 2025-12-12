(function(){
  const modalHtml = `
  <div class="modal-overlay" id="aboutModal" aria-hidden="true">
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="aboutTitle">
      <div class="modal-header">
        <h2 id="aboutTitle">Energio Tool Hub について</h2>
        <button class="modal-close" aria-label="閉じる">×</button>
      </div>
      <div class="modal-body">
        <p>このページは GitHub Pages 上の完全静的なリンク集です。検索とタグフィルタはブラウザ内で処理されます。将来的に <code>public/data.json</code> を用いてカードを動的に生成し、エラー/リトライやお気に入り機能も拡張予定です。</p>
        <ul>
          <li>データソース: 現在は静的HTML、今後 <code>public/data.json</code></li>
          <li>保存: ローカル（LocalStorage、今後追加予定）</li>
          <li>認証: なし</li>
          <li>動作環境: GitHub Pages などの静的ホスティング</li>
        </ul>
      </div>
      <div class="modal-footer">
        <button class="btn" id="closeAbout">閉じる</button>
      </div>
    </div>
  </div>`;

  function ensureModal(){
    if (!document.getElementById('aboutModal')){
      const wrap = document.createElement('div');
      wrap.innerHTML = modalHtml;
      document.body.appendChild(wrap.firstElementChild);
    }
  }

  function openModal(){
    ensureModal();
    const overlay = document.getElementById('aboutModal');
    overlay.removeAttribute('aria-hidden');
    overlay.classList.add('open');
    const closeBtn = overlay.querySelector('.modal-close');
    const close2 = overlay.querySelector('#closeAbout');
    const onClose = () => { overlay.setAttribute('aria-hidden','true'); overlay.classList.remove('open'); };
    closeBtn.addEventListener('click', onClose, { once: true });
    close2.addEventListener('click', onClose, { once: true });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) onClose(); });
    document.addEventListener('keydown', function esc(e){ if (e.key === 'Escape'){ onClose(); document.removeEventListener('keydown', esc); } });
  }

  function init(){
    const link = document.getElementById('aboutLink');
    if (!link) return;
    link.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  }

  document.addEventListener('DOMContentLoaded', init);
})();