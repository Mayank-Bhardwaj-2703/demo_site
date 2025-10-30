const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const initNav = () => {
  const toggle = qs('[data-js="nav-toggle"]');
  const links = qs('[data-js="nav-links"]');
  if (!toggle || !links) return;

  const closeNav = () => {
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  qsa('a', links).forEach((link) =>
    link.addEventListener('click', () => {
      if (links.classList.contains('is-open')) {
        closeNav();
      }
    }),
  );

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && links.classList.contains('is-open')) {
      closeNav();
    }
  });
};

const initScrollAnimations = () => {
  const nodes = qsa('[data-animate]');
  if (!nodes.length || 'IntersectionObserver' in window === false) {
    nodes.forEach((node) => node.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10%' },
  );

  nodes.forEach((node) => observer.observe(node));
};

const initCounters = () => {
  const counters = qsa('[data-js="counter"]');
  if (!counters.length) return;

  const duration = 1600;

  const animateCounter = (counter) => {
    const parent = counter.closest('[data-count]');
    if (!parent) return;
    const target = Number(parent.dataset.count || 0);
    const start = performance.now();

    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = target > 30 ? value.toLocaleString() : `${value}`;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target > 30 ? target.toLocaleString() : `${target}`;
      }
    };

    requestAnimationFrame(update);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }
};

const initMarquee = () => {
  const marquee = qs('[data-js="marquee"]');
  if (!marquee) return;

  const text = marquee.innerHTML;
  marquee.innerHTML = `${text}${text}`;

  let offset = 0;
  const speed = 0.6;

  const tick = () => {
    offset = (offset - speed) % (marquee.scrollWidth / 2);
    marquee.style.transform = `translateX(${offset}px)`;
    requestAnimationFrame(tick);
  };

  tick();
};

const initSlider = () => {
  const slider = qs('[data-js="slider"]');
  const track = qs('[data-js="slider-track"]');
  if (!slider || !track) return;

  const items = qsa('.testimonial', track);
  if (items.length < 2) return;

  let index = 0;
  const prev = qs('[data-js="slider-prev"]');
  const next = qs('[data-js="slider-next"]');

  const goTo = (nextIndex) => {
    index = (nextIndex + items.length) % items.length;
    track.style.transform = `translateX(calc(${index} * -100%))`;
  };

  next?.addEventListener('click', () => goTo(index + 1));
  prev?.addEventListener('click', () => goTo(index - 1));

  let autoplay;
  const start = () => {
    autoplay = setInterval(() => goTo(index + 1), 6000);
  };
  const stop = () => autoplay && clearInterval(autoplay);

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  start();
};

const initYear = () => {
  const yearNode = qs('[data-js="year"]');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollAnimations();
  initCounters();
  initMarquee();
  initSlider();
  initYear();
});
