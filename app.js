const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { navigation.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
window.matchMedia('(min-width:901px)').addEventListener('change', closeMenu);
document.querySelector('#year').textContent = new Date().getFullYear();
const form = document.querySelector('#enquiry-form');
if (form) {
  const service = new URLSearchParams(window.location.search).get('service');
  if ([...form.elements.service.options].some(option => option.value === service)) form.elements.service.value = service;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const status = document.querySelector('#form-status');
    const name = form.elements.name.value.trim();
    const message = form.elements.message.value.trim();
    if (name.length < 2 || message.length < 10) {
      status.textContent = 'Please enter your name (at least 2 characters) and a message of at least 10 characters.';
      (name.length < 2 ? form.elements.name : form.elements.message).focus();
      return;
    }
    const email = form.elements.email.value.trim();
    const details = ['Hello Sikolini Beads & Autogele,', '', 'Name: ' + name, ...(email ? ['Email: ' + email] : []), 'Service: ' + form.elements.service.value, 'Occasion date: ' + (form.elements.date.value || 'Not specified'), '', message];
    const url = 'https://wa.me/' + (document.documentElement.dataset.whatsapp || '2348051400660') + '?text=' + encodeURIComponent(details.join('\n'));
    status.textContent = 'Your enquiry is ready. Review it in WhatsApp and press Send to contact us. ';
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Open WhatsApp enquiry ↗';
    status.append(link);
    window.open(url, '_blank', 'noopener,noreferrer');
  });
  form.querySelector('button[type="submit"]').disabled = false;
}

// One-time homepage reveals; never hide content when motion is reduced or unsupported.
if (document.body.classList.contains('homepage') && 'IntersectionObserver' in window) {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealItems = [...document.querySelectorAll('.homepage .section-heading, .homepage .service-grid article, .homepage .story-inner > div, .homepage .steps article, .homepage .gallery figure, .homepage .enquiry > div')];
  let revealObserver;
  function stopReveals() {
    revealObserver?.disconnect();
    revealItems.forEach(item => item.classList.remove('motion-ready'));
  }
  if (!motionPreference.matches) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold: 0.08});
    revealItems.forEach((item, index) => {
      // Already visible content does not disappear after the page has loaded.
      if (item.getBoundingClientRect().top < window.innerHeight) return;
      item.style.setProperty('--reveal-delay', `${(index % 3) * 70}ms`);
      item.classList.add('motion-ready');
      revealObserver.observe(item);
    });
  }
  motionPreference.addEventListener('change', stopReveals);
  window.addEventListener('beforeprint', stopReveals);
}
// Gallery filters and a native, keyboard-accessible full-size image viewer.
const imageViewer = document.querySelector('#image-viewer');
if (imageViewer) {
  const allCards = [...document.querySelectorAll('.collection-section .collection-card')];
  const count = document.querySelector('#collection-count');
  const filterBar = document.querySelector('.collection-filters');
  const viewerImage = document.querySelector('#viewer-image');
  const viewerCaption = document.querySelector('#viewer-caption');
  const viewerCount = document.querySelector('#viewer-count');
  let visibleLinks = [];
  let activeIndex = 0;
  let originalLink;
  function refreshLinks() { visibleLinks = allCards.filter(card => !card.hidden).map(card => card.querySelector('.gallery-open')); }
  function showImage(index) {
    activeIndex = (index + visibleLinks.length) % visibleLinks.length;
    const link = visibleLinks[activeIndex];
    viewerImage.src = link.href;
    viewerImage.alt = link.dataset.caption;
    viewerCaption.textContent = link.dataset.caption;
    const relatedService = link.closest('.collection-card').querySelector('.gallery-service-link');
    const serviceLink = document.querySelector('#viewer-service');
    if (serviceLink && relatedService) serviceLink.href = relatedService.href;
    viewerCount.textContent = `${activeIndex + 1} / ${visibleLinks.length}`;
  }
  refreshLinks();
  filterBar.hidden = false;
  filterBar.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    filterBar.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    allCards.forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
    refreshLinks();
    count.textContent = `${visibleLinks.length} ${visibleLinks.length === 1 ? 'design' : 'designs'}`;
  });
  document.querySelector('.collection-section').addEventListener('click', event => {
    const link = event.target.closest('.gallery-open');
    if (!link || typeof imageViewer.showModal !== 'function' || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    originalLink = link;
    showImage(visibleLinks.indexOf(link));
    imageViewer.showModal();
  });
  imageViewer.querySelector('[data-viewer-close]').addEventListener('click', () => imageViewer.close());
  imageViewer.querySelector('[data-viewer-prev]').addEventListener('click', () => showImage(activeIndex - 1));
  imageViewer.querySelector('[data-viewer-next]').addEventListener('click', () => showImage(activeIndex + 1));
  imageViewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showImage(activeIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showImage(activeIndex + 1); }
  });
  imageViewer.addEventListener('click', event => { if (event.target === imageViewer) imageViewer.close(); });
  imageViewer.addEventListener('close', () => { viewerImage.removeAttribute('src'); originalLink?.focus(); });
}

// Native carousel: no autoplay; touch, trackpad, buttons and arrow keys all work.
const carousel = document.querySelector('#gallery-carousel');
if (carousel) {
  const controls = document.querySelector('.carousel-controls');
  const previous = controls.querySelector('[data-carousel-prev]');
  const next = controls.querySelector('[data-carousel-next]');
  const position = document.querySelector('#carousel-position');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cards = () => [...carousel.querySelectorAll('.collection-card')].filter(card => !card.hidden);
  function currentIndex(items) {
    let nearest = 0;
    items.forEach((card, index) => { if (Math.abs(card.offsetLeft - carousel.scrollLeft) < Math.abs(items[nearest].offsetLeft - carousel.scrollLeft)) nearest = index; });
    return nearest;
  }
  function updateCarousel() {
    const items = cards();
    if (!items.length) return;
    const frame = carousel.getBoundingClientRect();
    const shown = items.map((card,index) => ({index,rect:card.getBoundingClientRect()})).filter(item => Math.min(item.rect.right,frame.right)-Math.max(item.rect.left,frame.left) > item.rect.width*.5);
    const first = shown.length ? shown[0].index : currentIndex(items);
    const last = shown.length ? shown[shown.length-1].index : first;
    const label = `${first+1}${last>first?'–'+(last+1):''} of ${items.length}`;
    if (position.textContent !== label) position.textContent = label;
    previous.disabled = carousel.scrollLeft <= 2;
    next.disabled = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 2;
  }
  function moveCarousel(direction) {
    const items = cards();
    if (!items.length) return;
    const target = Math.max(0, Math.min(items.length-1, currentIndex(items)+direction));
    carousel.scrollTo({left:items[target].offsetLeft,behavior:reducedMotion.matches?'instant':'smooth'});
  }
  previous.addEventListener('click', () => moveCarousel(-1));
  next.addEventListener('click', () => moveCarousel(1));
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveCarousel(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); moveCarousel(1); }
  });
  let pendingFrame = false;
  carousel.addEventListener('scroll', () => {
    if (!pendingFrame) { pendingFrame = true; requestAnimationFrame(() => { pendingFrame = false; updateCarousel(); }); }
  }, {passive:true});
  document.querySelector('.collection-filters').addEventListener('click', event => {
    if (!event.target.closest('button[data-filter]')) return;
    carousel.scrollTo({left:0,behavior:'instant'});
    requestAnimationFrame(updateCarousel);
  });
  if ('ResizeObserver' in window) new ResizeObserver(updateCarousel).observe(carousel);
  else window.addEventListener('resize', updateCarousel);
  controls.hidden = false;
  updateCarousel();
}

// Open a collection category from the homepage discovery links.
if (document.querySelector('#gallery-carousel')) {
  const requestedCategory = new URLSearchParams(window.location.search).get('category');
  const matchingFilter = [...document.querySelectorAll('.collection-filters button')].find(button => button.dataset.filter === requestedCategory);
  matchingFilter?.click();
}

