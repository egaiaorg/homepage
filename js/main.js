(function () {
  'use strict';

  /* -----------------------------------------
     Mobile nav toggle
  ----------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var siteNav = document.getElementById('siteNav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      siteNav.classList.toggle('is-open', !isOpen);
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked (mobile)
    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        siteNav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* -----------------------------------------
     Sticky header shadow on scroll
  ----------------------------------------- */
  var header = document.getElementById('siteHeader');

  function updateHeaderState() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  /* -----------------------------------------
     Scroll reveal animations
  ----------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* -----------------------------------------
     Testimonial carousel (scroll-snap + dots)
  ----------------------------------------- */
  var track = document.getElementById('testimonialTrack');
  var dotsWrap = document.getElementById('testimonialDots');
  var prevBtn = document.querySelector('[data-testimonial="prev"]');
  var nextBtn = document.querySelector('[data-testimonial="next"]');

  if (track && dotsWrap) {
    var cards = Array.prototype.slice.call(track.children);

    cards.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', function () {
        cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      dotsWrap.appendChild(dot);
    });

    var dots = Array.prototype.slice.call(dotsWrap.children);

    function setActiveDotByScroll() {
      var trackRect = track.getBoundingClientRect();
      var closestIndex = 0;
      var closestDistance = Infinity;

      cards.forEach(function (card, i) {
        var rect = card.getBoundingClientRect();
        var distance = Math.abs(rect.left - trackRect.left);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === closestIndex);
      });
    }

    var scrollTimeout;
    track.addEventListener(
      'scroll',
      function () {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(setActiveDotByScroll, 100);
      },
      { passive: true }
    );

    function scrollByCard(direction) {
      var card = track.children[0];
      var cardWidth = card ? card.getBoundingClientRect().width : 300;
      track.scrollBy({ left: direction * (cardWidth + 16), behavior: 'smooth' });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { scrollByCard(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { scrollByCard(1); });
  }

  /* -----------------------------------------
     Footer year
  ----------------------------------------- */
  var yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
