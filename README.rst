Wisdom
======

Wisdom tiny is a JavaScript library intended to simplify DOM construction. It's
goal is to be used in projects who does not use templates to format HTML.

 * Really small (≈ 1.1KB minified + gziped)

 * Compact and easy to use

 * Easy to read

 * Adaptable with any framework who does DOM manipulation


Documentation
-------------

All methods have the same signature: they populate the current element (or the
root if there is no open element) by iterating over the passed arguments.

  * falsy arguments will be ignored,

  * DOM elements and objects with an ``inject`` method will be appended,

  * array-like (objects with a length) will be iterated and their values will
    be used to populate the element (splat effect),

  * plain objects will be used to set attributes with the ``setter`` function,

  * other things will be used as strings and appended.


``Wisdom(...)``
............

Constructor. Populate the root with its arguments. Call it with or without the
``new`` keyword.

``Wisdom:<tagname>(...)``
..........................

``<tagname>`` can be any HTML element name. Append an element to the parent and
populate it with the arguments.

``Wisdom:$(...)``
.................

'Close' the current element and populate its parent with the arguments. The
next element will be append next to the current element.

``Wisdom:$$(...)``
..................

Recursively close all opened elements and populates the root with the
arguments. The next element will be append in the root.

``Wisdom:_(...)``
.................

Simply populates the current element with the arguments.

``Wisdom:last``
...............

Reference to current element. This is the element who will be used as parent
for the next content appended.

``Wisdom.defineSetter(nameOrSetter, ?setter)``
..............................................

Define the current setter to use, and returns the old one.

If the first argument is a function, this function is used to do some DOM
manipulation based on an object. The DOM element and the object to apply is
passed as arguments to the function.

If the first argument is a string and the second is a function, it defines a
'named' setter, which is immediately used and can be restored by calling this
static method with the name anely.

If the first argument is a string and no second argument is given, it define
the current setter to the previously registered named setter.


Example
-------

::

  new Wisdom()
    .h1('Hello World!').$()
    .p('How are you today? did you check ')
      .a('this awesome JS lib', { href: 'http://github.com/BenoitZugmeyer/Wisdom' })
      .$(' which let you build your DOM insanely fast?')
    .$()
    .p('I hope you\'ll like it!')
    .inject(document.body);

HTML equivalent:

::

  <h1>Hello World!</h1>
  <p>How are you today? did you check
    <a href="http://github.com/BenoitZugmeyer/Wisdom">this awesome JS lib</a>
    which let you build your DOM insanely fast?
  </p>
  <p>I hope you'll like it!</p>

Example of usage using a MooTools setter:

::

  Wisdom.defineSetter(function (dom, object) {

    document.id(dom).set(object);

  });

  new Wisdom()
    .form({ events: { submit: function () { alert('submitted!'); } } }),
      .label({ styles: { color: 'red' } }, 'Name:')
        .input({ type: 'text' }).$()
      .$()
      .input({ type: 'submit' }, 'Send').$()
  .inject(document.body);


License
-------

This library is relaesed under an MIT license. See the file LICENSE.txt for the
full content of the license.
