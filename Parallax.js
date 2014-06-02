/**
 * Makes some sections appear to scroll at different speeds than others
 * @requires requestAnimationFrame
 * @requires getSupportedPropertyName
 * @returns Parallax object instance
 * @author jack@kratedesign.com, updated 5.28.14
 * API:
 *   .add(el) - add [el] to the array of elements being parallaxed
 *   .setAll(array) - set multiple elements and initialize Parallax
 *   .init() - start parallax effects on all els added by 'set'/'setAll' and/or 'fix'
 *   .stop() - stop effects without clearing the element array
 *   .destroy() - stop effects and clear the element array
 *   .debug() - turn on console logging for events
 *   .quiet() - turn off debugging
 *   .isActive() - check whether Parallax is running
 *
 */
 Parallax = (function() {

  var latestKnownScrollY = 0,
  transforms = ["webkitTransform", "transform","msTransform",  "mozTransform", "oTransform"],
  transformProp = getSupportedPropertyName(transforms),
  pxElements = [],
  active = false,
  ticking = false,
  debugging = false,
  defaultSpeed = 0.3;

  function onScroll() {
    active = true;
    latestKnownScrollY = getScrollPosition();
    requestTick();
  }

  function requestTick() {
    if( !ticking ) {
      requestAnimationFrame(update);
    }
    ticking = true;
  }

  function calcParallax(scrollPosition, rate, el, offset) {
    var adjustment = -scrollPosition*rate + (100*i),
    cutoff = 0;

    if ( adjustment <= cutoff ) {
      el.style[transformProp] = "translateY(" + adjustment + "px) translateZ(0px)";
    }
  }

  function getSpeed(elem) {
    if( elem.getAttribute('data-speed') != null ) {
      return elem.getAttribute('data-speed');
    }
    else {
      return defaultSpeed;
    }
  }

  function update() {
    ticking = false;
    var currentScrollY = latestKnownScrollY;

    for ( i = 0; i < pxElements.length; i++ ) {
      var el = pxElements[i],
      speed = getSpeed(el);
      calcParallax( currentScrollY, speed, el, i );
    }
  }

  function bindListeners() {
    window.addEventListener('scroll', onScroll, false);
    active = true;

    if( debugging ) {
      console.log('Parallax started');
    }
  };

  function add(ele) {
    pxElements.push(ele);
  }

  function setAll(arr) {
    pxElements.length = 0;
    for ( ind = 0; ind < arr.length; ind++ ) {
      pxElements[ind] = arr[ind];
    }
    if( debugging ) {
      window.setTimeout(
        function() { console.log(pxElements); }, 10);
    }
    init();
  };

  function debug() {
    debugging = true;
    var msg = [];
    if( !active ) {
      msg.push('Parallax is not active, use Parallax.init() to restart it.');
    }
    else {
      msg.push('Parallax is active on ' + pxElements.length + ' elements.');
    }

    for( var k = 0; k < msg.length; k++ ) {
      var message = msg[k];
      console.log(message);
    }
  }

  function quiet() {
    debugging = false;
  }

  function init() {
    pxLen = pxElements.length;
    bindListeners();
  }

  function stop() {
    window.removeEventListener('scroll', onScroll, false);
    if( debugging ) {
      console.log('Parallax stopped, use Parallax.init() to resume');
    }
    active = false;
  }

  function destroy() {
    for( var p = 0; p < pxElements.length; p++ ) {
      pxElements[p].style[transformProp] = 'translateZ(0px)';
    }
    pxElements.length = 0;
    window.removeEventListener('scroll', onScroll, false);
    if( debugging ) {
      console.log('Parallax removed.');
    }
    active = false;
  }

  function isActive() {
    return active;
  }

  return {
    init: init,
    add: add,
    setAll: setAll,
    isActive: isActive,
    debug: debug,
    quiet: quiet,
    stop: stop,
    destroy: destroy
  }

}());