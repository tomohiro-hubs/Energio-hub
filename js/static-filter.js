(function(){
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  const search = $('#search');
  const tagList = $('#tagList');
  const selectedTagsRow = $('#selectedTags');
  const cards = $$('.card');

  const selected = new Set();

  function renderSelectedTags(){
    if (!selected.size) { selectedTagsRow.textContent = ''; return; }
    
    // Tag buttons
    const tagsHtml = Array.from(selected).map(t => `<button class="tag" data-remove="${t}">${t} ×</button>`).join(' ');
    // Clear All button
    const clearAllHtml = `<button id="clearAllTags" class="tag-clear">全て解除</button>`;

    selectedTagsRow.innerHTML = '<span style="font-size:12px;color:#64748b">選択中タグ:</span> ' + tagsHtml + clearAllHtml;
    
    // remove handlers
    $$("[data-remove]").forEach(btn => {
      btn.addEventListener('click', () => {
        const t = btn.getAttribute('data-remove');
        selected.delete(t);
        // unhighlight button in tagList
        const b = tagList.querySelector(`[data-tag="${CSS.escape(t)}"]`);
        if (b) b.classList.remove('tag--active');
        filter();
      });
    });

    // clear all handler
    const clearBtn = $('#clearAllTags');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        // remove active class from all buttons
        selected.forEach(t => {
          const b = tagList.querySelector(`[data-tag="${CSS.escape(t)}"]`);
          if (b) b.classList.remove('tag--active');
        });
        selected.clear();
        filter();
      });
    }
  }

  function matches(app, q, tags){
    const name = (app.getAttribute('data-name')||'').toLowerCase();
    const desc = (app.getAttribute('data-desc')||'').toLowerCase();
    const tagStr = (app.getAttribute('data-tags')||'').toLowerCase();
    const hay = name + "\n" + desc + "\n" + tagStr;
    const passSearch = q ? hay.includes(q) : true;
    const tagArr = tagStr.split(',').map(s=>s.trim()).filter(Boolean);
    // Case-insensitive check for tags
    const passTags = tags.size 
      ? tagArr.some(cardTag => {
          // Check if any selected tag matches this cardTag (ignoring case)
          for (let selTag of tags) {
            if (selTag.toLowerCase() === cardTag) return true;
          }
          return false;
        }) 
      : true;
    return passSearch && passTags;
  }

  function filter(){
    const q = (search && search.value || '').trim().toLowerCase();
    cards.forEach(c => {
      c.style.display = matches(c, q, selected) ? '' : 'none';
    });
    renderSelectedTags();
  }

  // Toggle tag
  if (tagList) {
    tagList.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-tag]');
      if (!btn) return;
      const t = btn.getAttribute('data-tag');
      if (selected.has(t)) { selected.delete(t); btn.classList.remove('tag--active'); }
      else { selected.add(t); btn.classList.add('tag--active'); }
      filter();
    });
  }

  if (search) {
    search.addEventListener('input', filter);
  }

  // Style for active tag (augment CSS gracefully)
  const style = document.createElement('style');
  style.textContent = `.tag--active{background:#dc2626;color:#fff;border-color:#dc2626}`;
  document.head.appendChild(style);

  // Sort logic
  const sortSelect = $('#sortSelect');
  const grid = $('.grid');
  // Initial order is preserved in 'cards' array (since it was queried at start)
  
  const catOrder = {'設計':1, '解析':2, '調査':3, 'マニュアル':4, '施工管理':5, '業務管理':6, '監視':7};

  function getCategory(card){
    const el = card.querySelector('.badge');
    return el ? el.textContent.trim() : '';
  }

  function sortCards() {
    if (!sortSelect || !grid) return;
    const mode = sortSelect.value;
    
    // We sort the 'cards' array (which contains DOM elements)
    // Create a new array to sort so we don't mutate the original 'cards' order if we want to restore "default" easily?
    // Actually 'cards' is Array.from(...) so it's a static array.
    // If 'default', we just use the original order of 'cards'.
    // If 'category', we sort based on that.
    
    const cardsToSort = [...cards]; // copy

    if (mode === 'category') {
      cardsToSort.sort((a, b) => {
        const catA = getCategory(a);
        const catB = getCategory(b);
        const orderA = catOrder[catA] || 99;
        const orderB = catOrder[catB] || 99;
        if(orderA !== orderB) return orderA - orderB;
        return 0; // stable sort otherwise
      });
    }
    
    // Re-append to grid
    cardsToSort.forEach(c => grid.appendChild(c));
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', sortCards);
  }

  // Initial
  filter();

  // About Modal
  const aboutLink = $('#aboutLink');
  const aboutModal = $('#aboutModal');
  const aboutClose = $('#aboutClose');
  const modalBackdrop = $('.modal-backdrop');

  if (aboutLink && aboutModal) {
    const openModal = (e) => {
      e.preventDefault();
      aboutModal.classList.remove('hidden');
      aboutModal.setAttribute('aria-hidden', 'false');
      // Focus management could be added here
    };

    const closeModal = () => {
      aboutModal.classList.add('hidden');
      aboutModal.setAttribute('aria-hidden', 'true');
    };

    aboutLink.addEventListener('click', openModal);
    
    if (aboutClose) aboutClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !aboutModal.classList.contains('hidden')) {
        closeModal();
      }
    });
  }
  // Loading Screen
  window.addEventListener('load', () => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      // 1.5秒待ってからフェードアウトさせる
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 1500);
    }
  });

  // Password Protected Download
  window.downloadWithPassword = function(url, correctPassword) {
    const input = prompt("ダウンロードパスワードを入力してください:");
    if (input === correctPassword) {
      const link = document.createElement('a');
      link.href = url;
      link.download = url.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (input !== null) {
      alert("パスワードが間違っています。");
    }
  };
})();
