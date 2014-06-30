modular-parallax
================

No-frills, no-library parallax scrolling. Built lightweight to support our most common use case - alternating sections of content and background, typically where the background appears to move slower than the content. Works well for single-section backgrounds as well. And maybe other patterns - if you've implemented it for a different scenario, let us know. We'd love to see how this is getting used!

Works out of the box in all modern browsers, IE9+. Avoids jank with requestAnimationFrame. Leans on a few utilities packaged separately here (getScrollPosition, for example) - these can be merged into Parallax.js at build time. They're just separated here for clarity's sake.
Also, the demo uses the excellent v-unit.js library for image sizing, but it's not strictly required. Get your images to their desired size by whatever means you like; this library's here to slide them up and down for you.
