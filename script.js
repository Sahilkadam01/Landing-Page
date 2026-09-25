// 1................................................................................
// (() => {

//     const sections = document.querySelectorAll(
//       '[data-stack-section]'
//     );

//     if (!sections.length) return;


//     let lastScrollY = window.scrollY;


//     const observer = new IntersectionObserver(
//       (entries) => {

//         entries.forEach((entry) => {

//           const section = entry.target;

//           if (entry.isIntersecting) {

//             /*
//              * Section is entering the viewport.
//              * Works when scrolling DOWN or UP.
//              */
//             section.classList.add('is-active');

//           } else {

//             /*
//              * Section has left the viewport.
//              *
//              * Remove the class so the animation
//              * can happen again when coming back.
//              */
//             section.classList.remove('is-active');

//           }

//         });

//       },
//       {
//         threshold: 0.15
//       }
//     );


//     sections.forEach((section) => {
//       observer.observe(section);
//     });


//     /*
//      * Detect scroll direction
//      *
//      * This is optional but useful if later
//      * you want different animations for
//      * DOWN and UP.
//      */

//     window.addEventListener(
//       'scroll',
//       () => {

//         const currentScrollY = window.scrollY;

//         if (currentScrollY > lastScrollY) {

//           document.documentElement.dataset.direction = 'down';

//         } else if (currentScrollY < lastScrollY) {

//           document.documentElement.dataset.direction = 'up';

//         }

//         lastScrollY = currentScrollY;

//       },
//       {
//         passive: true
//       }
//     );

//   })();


// 2.////////////////////////////////////////////////////////////////////////////
// (() => {

//     const sections = document.querySelectorAll(
//       '[data-stack-section]'
//     );

//     if (!sections.length) return;


//     let isScrolling = false;
//     let scrollTimer;


//     /*
//      * Detect when the user has moved far enough
//      * toward the next section and gently complete
//      * the movement.
//      */
//     const handleScroll = () => {

//       if (isScrolling) return;

//       clearTimeout(scrollTimer);

//       scrollTimer = setTimeout(() => {

//         const viewportCenter = window.innerHeight * 0.55;

//         sections.forEach((section) => {

//           const rect = section.getBoundingClientRect();

//           /*
//            * Section has entered the viewport
//            * but hasn't fully taken over yet.
//            */
//           if (
//             rect.top > 0 &&
//             rect.top < viewportCenter
//           ) {

//             const target = window.scrollY + rect.top;

//             isScrolling = true;

//             window.scrollTo({
//               top: target,
//               behavior: 'smooth'
//             });

//             setTimeout(() => {
//               isScrolling = false;
//             }, 700);

//           }

//         });

//       }, 70);
//     };


//     /*
//      * IntersectionObserver controls only the
//      * section activation animation.
//      */
//     const observer = new IntersectionObserver(
//       (entries) => {

//         entries.forEach((entry) => {

//           if (entry.isIntersecting) {

//             entry.target.classList.add('is-active');

//           } else {

//             entry.target.classList.remove('is-active');

//           }

//         });

//       },
//       {
//         threshold: 0.15
//       }
//     );


//     sections.forEach((section) => {
//       observer.observe(section);
//     });


//     /*
//      * Scroll direction
//      */
//     let lastScrollY = window.scrollY;

//     window.addEventListener(
//       'scroll',
//       () => {

//         const currentScrollY = window.scrollY;

//         if (currentScrollY > lastScrollY) {

//           document.documentElement.dataset.direction = 'down';

//         } else if (currentScrollY < lastScrollY) {

//           document.documentElement.dataset.direction = 'up';

//         }

//         lastScrollY = currentScrollY;

//         handleScroll();

//       },
//       {
//         passive: true
//       }
//     );

//   })();

(() => {

  const sections = [
    ...document.querySelectorAll('.slide-section')
  ];

  if (!sections.length) return;


  let currentIndex = 0;

  let isAnimating = false;

  let wheelTimeout = null;


  /*
   * =====================================
   * INITIAL STATE
   * =====================================
   */

  sections.forEach((section, index) => {

    section.classList.toggle(
      'active',
      index === 0
    );

  });


  /*
   * =====================================
   * GO TO SECTION
   * =====================================
   */

  const goToSection = (nextIndex) => {

    /*
     * Don't allow another transition
     * while current one is running.
     */
    if (isAnimating) return;


    /*
     * Prevent going outside the page.
     */
    if (
      nextIndex < 0 ||
      nextIndex >= sections.length
    ) {
      return;
    }


    /*
     * Already there.
     */
    if (nextIndex === currentIndex) {
      return;
    }


    const previousIndex = currentIndex;


    /*
     * Direction.
     */
    const direction =
      nextIndex > previousIndex
        ? 'down'
        : 'up';


    isAnimating = true;


    /*
     * =================================
     * DOWN
     * =================================
     *
     * New section starts at:
     *
     * translateY(100%)
     *
     * and moves to:
     *
     * translateY(0)
     */

    if (direction === 'down') {

      sections[nextIndex].style.transform =
        'translateY(100%)';


      /*
       * Put next section above
       * previous section.
       */
      sections[nextIndex].classList.add(
        'active'
      );


      /*
       * Force browser to register
       * the starting position first.
       */
      sections[nextIndex].offsetHeight;


      /*
       * Now slide it upward.
       */
      requestAnimationFrame(() => {

        sections[nextIndex].style.transform =
          'translateY(0)';

      });

    }


    /*
     * =================================
     * UP
     * =================================
     *
     * Previous section comes from
     * the top.
     */

    else {

      sections[previousIndex].style.transform =
        'translateY(100%)';


      sections[nextIndex].style.transform =
        'translateY(0)';


      sections[nextIndex].classList.add(
        'active'
      );

    }


    currentIndex = nextIndex;


    /*
     * =================================
     * FINISH
     * =================================
     */

    clearTimeout(wheelTimeout);

    wheelTimeout = setTimeout(() => {

      /*
       * Remove active state from
       * sections that are no longer
       * visible.
       */
      sections.forEach((section, index) => {

        if (index !== currentIndex) {

          section.classList.remove(
            'active'
          );

        }

      });


      /*
       * Reset old sections.
       */
      sections.forEach((section, index) => {

        if (index < currentIndex) {

          section.style.transform =
            'translateY(-100%)';

        }

        if (index > currentIndex) {

          section.style.transform =
            'translateY(100%)';

        }

      });


      /*
       * Current section stays visible.
       */
      sections[currentIndex].style.transform =
        'translateY(0)';


      isAnimating = false;

    }, 1400);

  };


  /*
   * =====================================
   * MOUSE WHEEL
   * =====================================
   */

  window.addEventListener(
    'wheel',
    (event) => {

      /*
       * Ignore very small trackpad
       * movements.
       */
      if (
        Math.abs(event.deltaY) < 10
      ) {
        return;
      }


      /*
       * One wheel gesture controls
       * exactly one section.
       */
      if (isAnimating) {

        event.preventDefault();

        return;
      }


      event.preventDefault();


      if (event.deltaY > 0) {

        /*
         * SCROLL DOWN
         */
        goToSection(
          currentIndex + 1
        );

      } else {

        /*
         * SCROLL UP
         */
        goToSection(
          currentIndex - 1
        );

      }

    },
    {
      passive: false
    }
  );


  /*
   * =====================================
   * TOUCH / MOBILE
   * =====================================
   */

  let touchStartY = 0;


  window.addEventListener(
    'touchstart',
    (event) => {

      touchStartY =
        event.touches[0].clientY;

    },
    {
      passive: true
    }
  );


  window.addEventListener(
    'touchend',
    (event) => {

      if (isAnimating) return;


      const touchEndY =
        event.changedTouches[0].clientY;


      const distance =
        touchStartY - touchEndY;


      if (
        Math.abs(distance) < 50
      ) {
        return;
      }


      if (distance > 0) {

        /*
         * Swipe UP
         */
        goToSection(
          currentIndex + 1
        );

      } else {

        /*
         * Swipe DOWN
         */
        goToSection(
          currentIndex - 1
        );

      }

    },
    {
      passive: true
    }
  );


})();



//   js for the slick slider 
$(document).ready(function () {

  const $slider = $('.media-slider');

  if (!$slider.length) return;


  $slider.slick({

    slidesToShow: 1,

    slidesToScroll: 1,

    infinite: true,

    arrows: true,

    dots: true,

    appendDots: $('.media-slider-dots'),

    prevArrow: $('.media-slider-prev'),

    nextArrow: $('.media-slider-next'),


    /*
     * Smooth movement
     */
    speed: 1000,

    cssEase: 'cubic-bezier(.16, 1, .3, 1)',


    /*
     * Prevent multiple slides
     * from being triggered quickly.
     */
    waitForAnimate: true,


    /*
     * Swipe / touch
     */
    swipe: true,

    touchMove: true,

    draggable: true,


    /*
     * Adaptive height disabled because
     * both slides have the same visual structure.
     */
    adaptiveHeight: false

  });


  /*
   * PLAY VIDEO ONLY ON ACTIVE SLIDE
   */

  const handleVideo = () => {

    const $videos =
      $slider.find('video');

    $videos.each(function () {

      this.pause();

    });


    const activeVideo =
      $slider
        .find('.slick-current video')
        .get(0);


    if (activeVideo) {

      activeVideo.currentTime = 0;

      activeVideo.play().catch(() => { });

    }

  };


  /*
   * Initial video
   */
  handleVideo();


  /*
   * After slide changes
   */
  $slider.on(
    'afterChange',
    function () {

      handleVideo();

    }
  );

});
