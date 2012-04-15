/*
  Wisdom-jquery

  Author:
    Benoît Zugmeyer - 2012

  See:
    http://simon.html5.org/html-elements
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
    jQuery setter. Iterate over the properties of the object. If the
    property is a valid jQuery method, apply its value to the method, else
    set the corresponding attribute.

    ~ Element, Object
  */
  Wisdom.defineSetter('jquery', function (dom, object) {
    var property, value;

    dom = window.jQuery(dom);

    for (property in object) {
      value = object[property];

      if (typeof dom[property] === 'function')
        dom[property].apply(
          dom,
          window.jQuery.isArray(value) ? value : [value]
        );

      else
        dom.attr(property, value);

    }

  });

}));
/* vim: set et ts=2 sw=2 sts=2: */
