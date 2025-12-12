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
    selectedTagsRow.innerHTML = '<span style="font-size:12px;color:#64748b">選択中タグ:</span> ' +
      Array.from(selected).map(t => `<button class="tag" data-remove="${t}">${t} ×</button>`).join(' ');
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
  }

  function matches(app, q, tags){
    const name = (app.getAttribute('data-name')||'').toLowerCase();
    const desc = (app.getAttribute('data-desc')||'').toLowerCase();
    const tagStr = (app.getAttribute('data-tags')||'').toLowerCase();
    const hay = name + "\n" + desc + "\n" + tagStr;
    const passSearch = q ? hay.includes(q) : true;
    const tagArr = tagStr.split(',').map(s=>s.trim()).filter(Boolean);
    const passTags = tags.size ? tagArr.some(t => tags.has(t)) : true;
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
})();
