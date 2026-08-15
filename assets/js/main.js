/* TecnoAndina — interactividad básica */

(function () {
  'use strict';

  /* Menú móvil */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.classList.remove('open');
      });
    });
  }

  /* Sombra del header al hacer scroll */
  var header = document.querySelector('.header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Animación de aparición al hacer scroll */
  var revealSel = 'section, article, footer, .cat-card, .info-box, .video-card, .price, .steps, .faq, .check-list, .chip-row, .grid, .split, .contact, .testi-carousel, .testi-track, .testi-group, .hero-visual, .hero-stats, .topbar, .marquee-band, .cta-band, .page-hero > .container > div';
  var extraEls = document.querySelectorAll(revealSel);
  for (var ei = 0; ei < extraEls.length; ei++) {
    var ex = extraEls[ei];
    if (!ex.classList.contains('reveal') && !ex.querySelector('.reveal') && !ex.closest('.reveal')) {
      ex.classList.add('reveal');
    }
  }
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('in', entry.isIntersecting);
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* Reproductor de video explicativo (póster con botón play) */
  var videoCards = document.querySelectorAll('.video-card');
  videoCards.forEach(function (card) {
    var video = card.querySelector('video');
    var playBtn = card.querySelector('.play');
    var poster = card.querySelector('.poster');
    if (!video || !playBtn) return;

    playBtn.addEventListener('click', function () {
      playBtn.style.display = 'none';
      if (poster) poster.style.opacity = '0';
      video.controls = true;
      video.play().catch(function () { /* autoplay bloqueado */ });
    });

    video.addEventListener('pause', function () {
      if (video.ended) {
        playBtn.style.display = 'grid';
        if (poster) poster.style.opacity = '1';
      }
    });
  });

  /* Contador animado de las estadísticas del hero */
  var statsBox = document.querySelector('.hero-stats');
  if (statsBox) {
    var formatInt = function (value) {
      return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };
    statsBox.querySelectorAll('.stat b').forEach(function (b) {
      var suffixHtml = '';
      var sfx = b.querySelector('span');
      if (sfx) suffixHtml = sfx.outerHTML;
      var txt = b.textContent;
      var prefix = txt.charAt(0) === '+' ? '+' : '';
      var target = parseInt(txt.replace(/[^\d]/g, ''), 10) || 0;
      b.dataset.target = target;
      b.dataset.prefix = prefix;
      b.innerHTML = prefix + '<span class="stat-num">0</span>' + suffixHtml;
    });
    var startCounter = function (b, onDone) {
      var target = parseInt(b.dataset.target || '0', 10);
      var numEl = b.querySelector('.stat-num');
      if (!numEl) { if (onDone) onDone(); return; }
      var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) { numEl.textContent = formatInt(target); if (onDone) onDone(); return; }
      var duration = 2286;
      var growUntil = duration * 0.55;
      var t0 = Date.now();
      b.classList.add('counting');
      var tick = function () {
        var p = Math.min((Date.now() - t0) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        numEl.textContent = formatInt(target * eased);
        b.classList.toggle('counting', (Date.now() - t0) < growUntil);
        if (p < 1) {
          setTimeout(tick, 16);
        } else if (onDone) {
          onDone();
        }
      };
      tick();
    };
    var runCounter = function () {
      var stats = Array.prototype.slice.call(statsBox.querySelectorAll('.stat b'));
      stats.sort(function (a, b) {
        return (parseInt(b.dataset.target, 10) || 0) - (parseInt(a.dataset.target, 10) || 0);
      });
      var idx = 0;
      var next = function () {
        while (idx < stats.length) {
          var b = stats[idx++];
          if (b.__counted) continue;
          b.__counted = true;
          startCounter(b, next);
          return;
        }
      };
      next();
    };
    if ('IntersectionObserver' in window) {
      var so = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { runCounter(); so.disconnect(); }
        });
      }, { threshold: 0.3 });
      so.observe(statsBox);
    } else {
      runCounter();
    }
  }

  /* PWA: registro del service worker */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* sin SW, el sitio sigue normal */ });
    });
  }

  /* PWA: botón de instalación */
  var installPrompt = null;
  var installBtn = document.querySelector('#install-app');
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    installPrompt = e;
    if (installBtn && !window.matchMedia('(display-mode: standalone)').matches) {
      installBtn.classList.add('show');
    }
  });
  if (installBtn) {
    installBtn.addEventListener('click', function () {
      if (!installPrompt) return;
      installPrompt.prompt();
      installPrompt.userChoice.then(function () { installPrompt = null; });
    });
  }
  window.addEventListener('appinstalled', function () {
    if (installBtn) installBtn.classList.remove('show');
    installPrompt = null;
  });

  /* Año dinámico en el footer */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* Formulario de contacto: envío a FormSubmit (llega a harleyvasquez@icloud.com) */
  var form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = function (id) { var el = form.querySelector('#' + id); return el ? el.value.trim() : ''; };
      var payload = {
        nombre: val('nombre'),
        telefono: val('telefono'),
        correo: val('correo'),
        interes: val('interes'),
        mensaje: val('mensaje')
      };
      var successEl = form.querySelector('.form-success');
      var errorEl = form.querySelector('.form-error');
      var btn = form.querySelector('button[type="submit"]');
      var originalLabel = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Enviando...'; }
      fetch('https://formsubmit.co/ajax/harleyvasquez@icloud.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          return { ok: res.ok, data: data };
        });
      }).then(function (r) {
        var msg = (r.data && r.data.message) || '';
        var needsActivation = /activation|activate/i.test(msg);
        if (successEl) successEl.style.display = 'none';
        if (errorEl) errorEl.style.display = 'none';
        if (r.ok && (!r.data || r.data.success !== 'false')) {
          if (successEl) successEl.style.display = 'block';
          form.reset();
          setTimeout(function () {
            if (successEl) successEl.style.display = 'none';
          }, 6000);
        } else {
          if (errorEl) {
            errorEl.textContent = needsActivation
              ? 'FormSubmit aún no está activado: revisa el correo de confirmación enviado a harleyvasquez@icloud.com.'
              : 'No se pudo enviar. Inténtalo de nuevo o escríbenos a WhatsApp: +57 318 202 0729.';
            errorEl.style.display = 'block';
          }
        }
      }).catch(function () {
        if (errorEl) {
          errorEl.textContent = 'Error de conexión. Inténtalo de nuevo o escríbenos a WhatsApp: +57 318 202 0729.';
          errorEl.style.display = 'block';
        }
      }).finally(function () {
        if (btn) { btn.disabled = false; btn.textContent = originalLabel; }
      });
    });
  }

  /* Hero slider: crossfade + adelantar/retroceder con dedo, arrastre de mouse o rueda horizontal */
  var heroSlides = document.querySelectorAll('.hero-slide');
  var heroTitles = document.querySelectorAll('.hero-titles h1, .hero-titles h2');
  if (heroSlides.length && heroTitles.length) {
    var hIdx = 0;
    var heroTimer = null;
    var heroNext = function () { showHero(hIdx + 1); };
    var heroPrev = function () { showHero(hIdx - 1); };
    var showHero = function (i) {
      heroSlides[hIdx].classList.remove('active');
      heroTitles[hIdx].classList.remove('active');
      heroTitles[hIdx].setAttribute('aria-hidden', 'true');
      hIdx = ((i % heroSlides.length) + heroSlides.length) % heroSlides.length;
      heroSlides[hIdx].classList.add('active');
      heroTitles[hIdx].classList.add('active');
      heroTitles[hIdx].removeAttribute('aria-hidden');
      clearInterval(heroTimer);
      heroTimer = setInterval(heroNext, 6000);
    };
    heroTimer = setInterval(heroNext, 6000);
    var heroStage = heroSlides[0].parentElement;
    var heroSection = heroStage.closest('.hero');
    if (heroSection) {
      heroSection.style.touchAction = 'pan-y';
      var hStartX = 0, hPointer = null;
      heroSection.addEventListener('pointerdown', function (e) {
        if (e.target.closest('a,button,input')) return;
        hPointer = e.pointerId;
        hStartX = e.clientX;
        heroSection.classList.add('dragging');
      });
      heroSection.addEventListener('pointermove', function (e) {
        if (e.pointerId !== hPointer) return;
        if (Math.abs(e.clientX - hStartX) < 8) return;
        heroSection.classList.add('dragging');
      });
      heroSection.addEventListener('pointerup', function (e) {
        if (e.pointerId !== hPointer) return;
        hPointer = null;
        heroSection.classList.remove('dragging');
        var dx = e.clientX - hStartX;
        if (dx < -60) heroNext();
        else if (dx > 60) heroPrev();
      });
      var heroWheelAt = 0;
      heroSection.addEventListener('wheel', function (e) {
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
        if (Date.now() - heroWheelAt < 700) return;
        heroWheelAt = Date.now();
        if (e.deltaX > 0) heroNext(); else heroPrev();
      }, { passive: true });
    }
  }
/* Carruseles infinitos (marquee, testi, zona): arrastrar con el dedo o el mouse,
     y rueda horizontal. La banda se queda donde el usuario la deja (modo manual);
     un toque sin arrastre la devuelve a la animación automática */
  document.querySelectorAll('.marquee-track, .testi-track, .zona-track').forEach(function (track) {
    var host = track.parentElement;
    var pan = document.createElement('span');
    pan.className = 'marquee-pan';
    host.insertBefore(pan, track);
    pan.appendChild(track);
    host.style.touchAction = 'pan-y';

    var panX = 0, startX = 0, moved = false, pointerId = null, wheelTimer = null;

    var setPan = function (v, smooth) {
      pan.style.transition = smooth ? 'transform .45s cubic-bezier(.2,.8,.3,1)' : '';
      pan.style.transform = 'translateX(' + v + 'px)';
    };
    var pauseTrack = function () {
      track.style.animationPlayState = 'paused';
    };
    var resumeTrack = function () {
      clearTimeout(wheelTimer);
      track.style.animationPlayState = '';
    };
    var toManual = function () {
      clearTimeout(wheelTimer);
      host.classList.add('manual');
      pauseTrack();
    };
    var toAuto = function () {
      host.classList.remove('manual');
      resumeTrack();
      setPan(0, true);
      panX = 0;
      setTimeout(function () { pan.style.transition = ''; }, 500);
    };

    host.addEventListener('pointerdown', function (e) {
      pointerId = e.pointerId;
      startX = e.clientX;
      moved = false;
      pauseTrack();
      if (host.setPointerCapture) { try { host.setPointerCapture(e.pointerId); } catch (err) {} }
    });
    host.addEventListener('pointermove', function (e) {
      if (e.pointerId !== pointerId) return;
      var dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) moved = true;
      if (moved) setPan(panX + dx);
    });
    host.addEventListener('pointerup', function (e) {
      if (e.pointerId !== pointerId) return;
      pointerId = null;
      if (moved) {
        panX += e.clientX - startX;
        host.classList.add('dragging');
        document.addEventListener('click', function kill(ev) {
          ev.preventDefault();
          ev.stopPropagation();
          document.removeEventListener('click', kill, true);
        }, true);
        toManual();
        host.classList.remove('dragging');
      } else if (host.classList.contains('manual')) {
        toAuto();
      } else {
        resumeTrack();
      }
    });
    host.addEventListener('pointercancel', function (e) {
      if (e.pointerId !== pointerId) return;
      pointerId = null;
      resumeTrack();
    });
    host.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      pauseTrack();
      panX -= e.deltaX;
      setPan(panX);
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(function () { toManual(); }, 300);
    }, { passive: false });
  });
})();