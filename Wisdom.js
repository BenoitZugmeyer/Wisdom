/*
  Wisdom

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
/*global define*/

// Loader logic.
(function (definition) {
  'use strict';

  // AMD support.
  if (typeof define === 'function')
    define(definition);

  // Export to the global scope.
  else
    window.Wisdom = definition();

}(function () {
  'use strict';

  /*
    Constructor. Populates the root with the arguments. Support construction
    without `new`.

    ~ ... -> Wisdom
  */
  function Wisdom() {

    if (!(this instanceof Wisdom))
      return new Wisdom();

    this.root = [];
    builder(this, arguments);

  }

  /*
    Function used to populate the last element built. It takes the current
    Wisdom instance and a list (array-like) of things to add. 'Things' can be:

  * falsy will be ignored,
  * DOM elements and objects with an `inject` method will be appended,
  * array-like (objects with a length) will be recursively reiterated,
  * plain objects will be used to set attributes with the `setter` function,
  * other things will be used as strings and appended.

    ~ Wisdom, {length: Number, ...} -> Wisdom
  */
  function builder(self, args, undefined) {
    var last = self.last
      , i, l, argument;

    for (i = 0, l = args.length; i < l; i += 1) {
      argument = args[i];

      if (argument)
        if (typeof argument.inject === 'function')
          argument.inject(last);

        else if (typeof argument === 'object')
          if (argument.nodeType !== undefined)
            append(self, last, argument);

          else if (typeof argument.length === 'number')
            builder(self, argument);

          else
            setter(last, argument);

        else if (last && last.tagName &&
                 last.tagName.toLowerCase() === 'input')
          last.value += argument;

        else
          append(self, last, doc.createTextNode(argument));

    }

    return self;
  }

  /*
    Append a DOM node to the 'last' element, or the root of the instance.

    ~ Wisdom, Falsy|Element, Node
  */
  function append(self, last, node) {

    if (last)
      last.appendChild(node);

    else
      self.root.push(node);

  }

  var doc = document
    , setters
    , setter
    , prototype;


  /*
    Define the prototype.
  */

  prototype = Wisdom.prototype = {

    /*
      Close the last element, and populate its parent.

      ~ Wisdom: ... -> Wisdom
    */
    $: function () {
      var self = this;

      self.last = self.last !== self.root[self.root.length - 1] ?
        self.last.parentNode :
        null;

      return builder(self, arguments);
    },

    /*
      Close all the elements up to the root and populate it.

      ~ Wisdom: ... -> Wisdom
    */
    $$: function () {

      while (this.last)
        this.$();

      return builder(this, arguments);
    },

    /*
      Inject the root in the DOM.

      ~ Wisdom: Element, ? 'top'|'after'|'before'|'bottom' -> Wisdom
    */
    inject: function (parent, where) {
      var root = this.root
        , length = root.length
        , dom, i;

      if (length) {
        if (length === 1)
          dom = root[0];

        else {
          dom = doc.createDocumentFragment();
          for (i = 0; i < length; i += 1)
            dom.appendChild(root[i]);
        }

        if (!where || where === 'bottom')
          parent.appendChild(dom);

        else if (where === 'top')
          parent.insertBefore(dom, parent.firstChild);

        else
          parent.parentNode.insertBefore(
            dom,
            where === 'after' ? parent.nextSibling : parent
          );

      }

      return this;
    },

    /*
      Clean this instance. It will be reusable after that.

      ~ Wisdom: -> Wisdom
    */
    clean: function () {

      this.last = null;
      this.root.length = 0;

      return this;
    },

    /*
      Populate the last element.

      ~ Wisdom: ... -> Wisdom
    */
    _: function () {
      return builder(this, arguments);
    }

  };

  // Iterate over each known HTML5 tag names and populate the prototype.
  (function (bind) {
    var tags = 'title.base.link.meta.hr.br.wbr.img.embed.param.source.track.\
area.col.input.option.textarea.keygen.command.html.head.style.script.noscript.\
body.section.nav.article.aside.h1.h2.h3.h4.h5.h6.hgroup.header.footer.address.\
p.pre.blockquote.ol.ul.li.dl.dt.dd.figure.figcaption.div.a.em.strong.small.s.\
cite.q.dfn.abbr.time.code.var.samp.kbd.sub.sup.i.b.u.mark.ruby.rt.rp.bdi.bdo.\
span.ins.del.iframe.object.video.audio.canvas.map.table.caption.colgroup.\
tbody.thead.tfoot.tr.td.th.form.fieldset.legend.label.button.select.datalist.\
optgroup.output.progress.meter.details.summary.menu'.split('.'),
      i, l;

    for (i = 0, l = tags.length; i < l; i += 1)
      bind(tags[i]);

  }(function (tag) {
    /*
      Add an element and populate it.

      ~ Wisdom: ... -> Wisdom
    */
    prototype[tag] = function () {
      var self = this
        , last = self.last;

      self.last = doc.createElement(tag);

      // Populate
      builder(self, arguments);

      // Inject
      append(self, last, self.last);

      return self;
    };
  }));


  /*
    Static methods.
  */

  /*
    Default setter. Iterate over the properties of the object and set the
    corresponding attributes.

    ~ Element, Object
  */
  setter = function (dom, object) {

    for (var property in object)
      dom.setAttribute(property, object[property]);

  };

  setters = { alone: setter };

  /*
    Define a new setter. Call it with no argument to set the fallback one, a
    framework name to use the corresponding setter or a function of your own.
    Return the previous setter.

    ~ ? String|Function, ?Function -> Function
  */
  Wisdom.defineSetter = function (name, newSetter) {
    var result = setter;

    if (newSetter)
      setters[name] = newSetter;

    setter = typeof name === 'function' ?
      name :
      setters[name] || setters.alone;

    return result;
  };

  return Wisdom;
}));
/* vim: set et ts=2 sw=2 sts=2: */
