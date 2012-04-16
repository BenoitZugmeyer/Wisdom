/*
  Wisdom-mootools

  Benoît Zugmeyer - 2012

  https://github.com/BenoitZugmeyer/Wisdom
*/

/*jshint

  eqeqeq:true, immed:true, latedef:true, noarg:true, noempty:true, nonew:true,
  plusplus:true, undef:true, strict:true, trailing:true, onevar: true,

  laxcomma:true, multistr: true,

  browser:true,

  maxlen: 79
*/
/*global define, Wisdom*/

// Loader logic.
(function (definition) {
  'use strict';

  // AMD support.
  if (typeof define === 'function')
    define(['Wisdom'], definition);

  // Export to the global scope.
  else
    definition(Wisdom);

}(function (Wisdom) {
  'use strict';

  /*
    MooTools setter. Simply call `set` on the dom.

    ~ Element, Object
  */
  Wisdom.defineSetter('mootools', function (dom, object) {

    document.id(dom).set(object);

  });

}));
/* vim: set et ts=2 sw=2 sts=2: */
