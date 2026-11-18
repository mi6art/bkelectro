const object = document.querySelector('#object');
if (object) {
  const area = document.querySelector('#area');
  const project = document.querySelector('#project');
  const result = document.querySelector('#brief-text');
  const names = { flat: 'Квартира', new: 'Новостройка', business: 'Коммерческое помещение' };
  const info = {
    flat: 'Подготовьте план, список техники и пожелания к розеткам и освещению. Уточните стадию ремонта.',
    new: 'Уточните состояние электрики от застройщика. Подготовьте план мебели и техники, пожелания к свету и этап начала отделки.',
    business: 'Подготовьте план рабочих зон, перечень оборудования, ограничения доступа и желаемые сроки. Отметьте, работает ли помещение сейчас.'
  };
  function brief() {
    const n = Number(area.value);
    const size = Number.isFinite(n) && n > 0 && n <= 100000 ? `, площадь ${n} м²` : '';
    const plan = project.value === 'no' ? ' Плана пока нет: запишите известные параметры и вопросы.' : ' План есть: держите его под рукой для обсуждения.';
    return `${names[object.value]}${size}. ${info[object.value]}${plan}`;
  }
  function update() { result.textContent = brief(); }
  [object, area, project].forEach(el => el.addEventListener('input', update));
  update();
  document.querySelector('#download-brief').addEventListener('click', () => {
    const data = `BKelectro — подготовка к расчёту\n\n${brief()}\n\nРайон Москвы: __________\nЖелаемое начало: __________\nДополнительные вопросы: __________\n\nОбсудить объект: +7 (926) 630-68-34\nЭто список исходных данных, не смета. Ничего не отправлено.\n`;
    const url = URL.createObjectURL(new Blob([data], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'BKelectro-zadanie.txt'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}

const heroFilm = document.querySelector('#hero-film');
if (heroFilm) {
  const toggle = document.querySelector('#film-toggle');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = navigator.connection?.saveData;
  let userPaused = reduceMotion.matches || !!saveData;
  let visible = true;
  function updateLabel() {
    toggle.textContent = heroFilm.paused ? 'Смотреть видео' : 'Пауза';
  }
  async function start() {
    if (!heroFilm.getAttribute('src')) heroFilm.src = heroFilm.dataset.videoSrc;
    heroFilm.muted = true;
    try { await heroFilm.play(); } catch { /* The poster remains if autoplay is unavailable. */ }
    updateLabel();
  }
  function sync() {
    if (userPaused || !visible || document.hidden) { heroFilm.pause(); updateLabel(); }
    else start();
  }
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    userPaused = !heroFilm.paused;
    sync();
  });
  heroFilm.addEventListener('play', updateLabel);
  heroFilm.addEventListener('pause', updateLabel);
  heroFilm.addEventListener('error', () => { toggle.hidden = true; });
  reduceMotion.addEventListener('change', e => { userPaused = e.matches; sync(); });
  document.addEventListener('visibilitychange', sync);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold:0.05 }).observe(heroFilm);
  sync();
}
