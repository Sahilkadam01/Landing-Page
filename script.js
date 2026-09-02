(() => {

    const sections = document.querySelectorAll(
      '[data-stack-section]'
    );
  
    if (!sections.length) return;
  
  
    let lastScrollY = window.scrollY;
  
  
    const observer = new IntersectionObserver(
      (entries) => {
  
        entries.forEach((entry) => {
  
          const section = entry.target;
  
          if (entry.isIntersecting) {
  
            /*
             * Section is entering the viewport.
             * Works when scrolling DOWN or UP.
             */
            section.classList.add('is-active');
  
          } else {
  
            /*
             * Section has left the viewport.
             *
             * Remove the class so the animation
             * can happen again when coming back.
             */
            section.classList.remove('is-active');
  
          }
  
        });
  
      },
      {
        threshold: 0.15
      }
    );
  
  
    sections.forEach((section) => {
      observer.observe(section);
    });
  
  
    /*
     * Detect scroll direction
     *
     * This is optional but useful if later
     * you want different animations for
     * DOWN and UP.
     */
  
    window.addEventListener(
      'scroll',
      () => {
  
        const currentScrollY = window.scrollY;
  
        if (currentScrollY > lastScrollY) {
  
          document.documentElement.dataset.direction = 'down';
  
        } else if (currentScrollY < lastScrollY) {
  
          document.documentElement.dataset.direction = 'up';
  
        }
  
        lastScrollY = currentScrollY;
  
      },
      {
        passive: true
      }
    );
  
  })();