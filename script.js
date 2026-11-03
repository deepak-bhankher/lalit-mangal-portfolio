/**
 * Lalit Mangal - Video Editor Portfolio
 * Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const videoModal = document.getElementById('video-modal');
  const modalPlayer = document.getElementById('modal-player');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-video-title');
  const modalDescription = document.getElementById('modal-description');
  const modalTag = document.getElementById('modal-tag');
  
  const videoCards = document.querySelectorAll('.video-card');
  const filterBtns = document.querySelectorAll('.filter-btn');

  /* ==========================================================================
     Smooth Scroll Navigation
     ========================================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  /* ==========================================================================
     Modern Dialog & Light Dismiss Fallback (modern-web-guidance compliant)
     ========================================================================== */
  if (videoModal) {
    // Light dismiss fallback for browsers without native closedBy support
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const outside = (e, dialog) => {
        const r = dialog.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };

      for (const dialog of document.querySelectorAll('dialog[closedby="any"]')) {
        let pressedOutside = false;
        dialog.addEventListener('pointerdown', (e) => {
          pressedOutside = outside(e, dialog);
        });
        dialog.addEventListener('pointerup', (e) => {
          if (pressedOutside && outside(e, dialog)) {
            dialog.close();
          }
        });
      }
    }

    // Close button event
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => {
        videoModal.close();
      });
    }

    // When modal closes, immediately pause video and reset source
    videoModal.addEventListener('close', () => {
      modalPlayer.pause();
      modalPlayer.currentTime = 0;
      modalPlayer.src = '';
    });
  }

  /* ==========================================================================
     Video Cards Click to Open High-Def Theatre Modal
     ========================================================================== */
  videoCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const videoSrc = card.getAttribute('data-video-src');
      const title = card.getAttribute('data-title');
      const desc = card.getAttribute('data-desc');
      const genre = card.querySelector('.video-genre')?.textContent || 'Showcase';

      if (videoModal && modalPlayer && videoSrc) {
        modalTitle.textContent = title;
        modalDescription.textContent = desc;
        modalTag.textContent = genre;

        modalPlayer.src = videoSrc;
        videoModal.showModal();
        modalPlayer.play().catch(() => {
          // Auto-play was prevented; user can click play button in native controls
        });
      }
    });

    // Desktop Hover Live Preview (muted)
    const hoverVideo = card.querySelector('.hover-video');
    if (hoverVideo && window.matchMedia('(hover: hover)').matches) {
      card.addEventListener('mouseenter', () => {
        hoverVideo.classList.add('is-active');
        hoverVideo.play().catch(() => {});
      });

      card.addEventListener('mouseleave', () => {
        hoverVideo.classList.remove('is-active');
        hoverVideo.pause();
        hoverVideo.currentTime = 0;
      });
    }
  });

  /* ==========================================================================
     Portfolio Filter Tabs
     ========================================================================== */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      videoCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
        }
      });
    });
  });

  /* ==========================================================================
     Animated Stat Counters
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsAnimated = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 1600;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = target;
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(current);
        }
      }, stepTime);
    });
  };

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          animateCounters();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  /* ==========================================================================
     Header Sticky Shadow Effect
     ========================================================================== */
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.7)';
      header.style.background = 'rgba(7, 7, 9, 0.95)';
    } else {
      header.style.boxShadow = 'none';
      header.style.background = 'rgba(7, 7, 9, 0.85)';
    }
  });

});
