const slider = document.querySelector('.home-slider');

if (slider) {
  const slides = [...slider.querySelectorAll('.home-slide')];
  const dots = [...slider.querySelectorAll('.home-slider-dot')];
  const controls = slider.querySelector('.home-slider-controls');
  const toggle = slider.querySelector('.home-slider-toggle');
  const status = slider.querySelector('.home-slider-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hoverCapable = window.matchMedia('(hover: hover)');
  let active = 0;
  let timer;
  let playing = !reducedMotion.matches;
  let onScreen = !('IntersectionObserver' in window);

  function schedule() {
    clearTimeout(timer);
    if (!playing || document.hidden || !onScreen ||
        slider.contains(document.activeElement) ||
        (hoverCapable.matches && slider.matches(':hover'))) return;

    timer = setTimeout(() => {
      show(active + 1, 1);
      schedule();
    }, 6500);
  }

  function show(index, direction, announce = false) {
    const next = (index + slides.length) % slides.length;
    if (next === active) return;

    const outgoing = slides[active];
    slides.forEach(slide => {
      slide.classList.remove('is-current', 'is-leaving', 'is-entering');
      slide.setAttribute('aria-hidden', 'true');
    });
    slider.dataset.direction = direction < 0 ? 'previous' : 'next';
    outgoing.classList.add('is-leaving');
    dots[active].removeAttribute('aria-current');
    active = next;
    slides[active].classList.add('is-current', 'is-entering');
    slides[active].removeAttribute('aria-hidden');
    dots[active].setAttribute('aria-current', 'true');

    if (announce) status.textContent =
      (active + 1) + ' of ' + slides.length + '. ' + slides[active].alt;
  }

  function move(index, direction) {
    show(index, direction, true);
    schedule();
  }

  function updateToggle() {
    toggle.textContent = playing ? 'Pause' : 'Play';
    toggle.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
    schedule();
  }

  controls.querySelector('[data-home-prev]').addEventListener('click', () => move(active - 1, -1));
  controls.querySelector('[data-home-next]').addEventListener('click', () => move(active + 1, 1));
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => move(index, index < active ? -1 : 1));
  });
  toggle.addEventListener('click', () => {
    playing = !playing;
    updateToggle();
  });
  slider.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    move(active + direction, direction);
  });
  slider.addEventListener('pointerenter', schedule);
  slider.addEventListener('pointerleave', schedule);
  slider.addEventListener('focusin', schedule);
  slider.addEventListener('focusout', () => requestAnimationFrame(schedule));
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', event => {
    if (event.matches) playing = false;
    updateToggle();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      schedule();
    }).observe(slider);
  }
  controls.hidden = false;
  updateToggle();
}
