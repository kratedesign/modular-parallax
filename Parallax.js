/**
 * Makes some sections appear to scroll at different speeds than others
 * @requires requestAnimationFrame
 * @requires getSupportedPropertyName
 * @returns window.Parallax object
 * @author jack@kratedesign.com, updated 6.30.14
 * 
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


  'use strict';

  /* Some defaults and initial/static vars: */
  var latestKnownScrollY = 0,
      transforms = ["webkitTransform", "transform","msTransform",  "mozTransform", "oTransform"],
      transformProp = getSupportedPropertyName(transforms),
      pxElements = [],
      active = false,
      ticking = false,
      debugging = false,
      defaultSpeed = 0.3;


  /* Here's where the actual math happens to translate the sections */
  function calcParallax(scrollPosition, rate, el, offset) {
    var adjustment = -scrollPosition*rate + (100*offset),
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


  /* Set up our event listener */
  function bindListeners() {
    window.addEventListener('scroll', onScroll, false);
    active = true;

    if( debugging ) {
      console.log('Parallax started');
    }
  }


  /* onScroll is our event handler and hooks into our rAF call */
  function onScroll() {
    active = true;
    latestKnownScrollY = getScrollPosition();
    requestTick();
  }


  /* If we've scrolled, wait till it's convenient for the browser, then update */
  function requestTick() {
    if( !ticking ) {
      requestAnimationFrame(update);
    }
    ticking = true;
  }


  /* It's convenient now? Okay! */
  function update() {
    ticking = false;
    var currentScrollY = latestKnownScrollY;

    for ( var i = 0; i < pxElements.length; i++ ) {

      var el = pxElements[i],
      speed = getSpeed(el);
      calcParallax( currentScrollY, speed, el, i );
    }
  }


  /* Add one element to an existing parallax */

  function add(ele) {
    pxElements.push(ele);
  }

  /* Add a collection, then kick off the effect */
  function setAll(arr) {
    pxElements.length = 0;
    for ( var ind = 0; ind < arr.length; ind++ ) {
      pxElements[ind] = arr[ind];
    }
    if( debugging ) {
      window.setTimeout(
        function() { console.log(pxElements); }, 10);
    }
    init();
  };


  /* Print out some useful console logs */

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


  /* Or don't. */
  function quiet() {
    debugging = false;
  }


  /* Another debug function; check to see if we're running */
  function isActive() {
    return active;
  }


  /* Get everything started */
  function init() {
    bindListeners();
  }


  /* Pause the effect (can be undone) */
  function stop() {
    window.removeEventListener('scroll', onScroll, false);
    if( debugging ) {
      console.log('Parallax stopped, use Parallax.init() to resume');
    }
    active = false;
  }


  /* Destroy the instance (needs to be re-set and invoked after this) */
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
