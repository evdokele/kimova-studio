/* ============================================================
   KIMOVA STUDIO — main.js
   ============================================================ */

/* === Smooth scroll — homepage anchor links === */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    e.preventDefault();
    var target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ============================================================
   LIGHTBOX — about / talking-head video with sound
   Only active on the homepage (lightbox element present)
   ============================================================ */
(function() {
  var lightbox  = document.getElementById('lightbox');
  if (!lightbox) return;

  var lbIframe  = document.getElementById('lightbox-iframe');
  var closeBtn  = document.querySelector('.lightbox-close');

  function openLightbox() {
    lightbox.classList.add('open');
    /* Load Vimeo iframe with autoplay+sound on open */
    if (lbIframe && lbIframe.dataset.src) {
      lbIframe.src = lbIframe.dataset.src;
    }
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    /* Stop Vimeo by clearing src */
    if (lbIframe) lbIframe.src = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLightbox();
  });

  /* Wire the about-video overlay that carries data-action="lightbox" */
  var aboutOverlay = document.querySelector('#about-video-trigger .video-overlay');
  if (aboutOverlay) {
    aboutOverlay.addEventListener('click', function(e) {
      e.stopPropagation();
      openLightbox();
    });
  }
})();

/* ============================================================
   VIDEO OVERLAYS — all iframes using background=1
   Click swaps src to the sound version (data-sound-src)
   About-video overlay is handled by the lightbox block above
   ============================================================ */
(function() {
  document.querySelectorAll('.video-overlay').forEach(function(overlay) {
    /* Skip lightbox-bound overlays — handled above */
    if (overlay.dataset.action === 'lightbox') return;

    overlay.addEventListener('click', function() {
      var parent = overlay.parentElement;
      var iframe = parent.querySelector('iframe');
      if (!iframe) return;
      var soundSrc = iframe.dataset.soundSrc;
      if (soundSrc) {
        iframe.src = soundSrc;
        overlay.classList.add('playing');
      }
    });
  });
})();

/* ============================================================
   CARD THUMBNAIL HOVER VIDEOS
   mouseenter → play from start; mouseleave → pause + reset
   ============================================================ */
(function() {
  document.querySelectorAll('.card').forEach(function(card) {
    var video = card.querySelector('.thumb-video');
    if (!video) return;

    card.addEventListener('mouseenter', function() {
      video.currentTime = 0;
      video.play();
    });

    card.addEventListener('mouseleave', function() {
      video.pause();
      video.currentTime = 0;
    });
  });
})();

/* ============================================================
   FLOWO FEATURE TABS — swap Vimeo src on tab click
   Each tab loads its own background=1 url; click-to-sound
   data attribute is updated so the overlay handler still works
   ============================================================ */
(function() {
  var tabs   = document.querySelectorAll('.flowo-tab');
  var iframe = document.getElementById('flowo-feature-iframe');
  if (!tabs.length || !iframe) return;

  var bgSrcs = {
    'daily-focus':          'https://player.vimeo.com/video/1182644157?background=1&title=0&byline=0&portrait=0',
    'smart-prioritisation': 'https://player.vimeo.com/video/1182644699?background=1&title=0&byline=0&portrait=0',
    'team-pulse':           'https://player.vimeo.com/video/1182645376?background=1&title=0&byline=0&portrait=0'
  };

  var soundSrcs = {
    'daily-focus':          'https://player.vimeo.com/video/1182644157?autoplay=1&title=0&byline=0&portrait=0',
    'smart-prioritisation': 'https://player.vimeo.com/video/1182644699?autoplay=1&title=0&byline=0&portrait=0',
    'team-pulse':           'https://player.vimeo.com/video/1182645376?autoplay=1&title=0&byline=0&portrait=0'
  };

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');

      var key = tab.dataset.video;
      if (!bgSrcs[key]) return;

      /* Load muted background version */
      iframe.src = bgSrcs[key];
      iframe.dataset.soundSrc = soundSrcs[key];

      /* Reset overlay so hover+click-to-sound works again on new tab */
      var overlay = iframe.parentElement.querySelector('.video-overlay');
      if (overlay) overlay.classList.remove('playing');
    });
  });
})();
