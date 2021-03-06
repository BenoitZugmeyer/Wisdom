Wisdom
======

Wisdom is a tiny JavaScript library intended to simplify DOM construction. Its
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

* other arguments will be used as strings and appended.


``Wisdom(...)``
............

Constructor. Populate the root with its arguments. The ``new`` keyword is
optionnal.

``Wisdom:<tagname>(...)``
..........................

Append an element to the parent and populate it with the arguments.
``<tagname>`` can be any HTML element name.

``Wisdom:$(...)``
.................

'Close' the current element and populate its parent with the arguments. The
next element will be appended next to the current element.

``Wisdom:$$(...)``
..................

Recursively close all opened elements and populates the root with the
arguments. The next element will be appended in the root.

``Wisdom:_(...)``
.................

Simply populates the current element with the arguments.

``Wisdom:inject(domnode, ?where)``
..................................

Inject the root in a DOM node. ``where`` can be either ``'bottom'`` (the
default), ``'top'``, ``'after'`` or ``'before'``.

``Wisdom:clean(...)``
.....................

Empty the current root, so the instance is reusable (slightly quicker than
recreating a new instance). Populate the new root with the arguments.

``Wisdom:last``
...............

Reference to the current element. This is the element who will be used as
parent for the next content appended. Use it to store DOM references in your
code.

``Wisdom.defineSetter(nameOrSetter, ?setter)``
..............................................

Define the current setter to use, and returns the old one.

If the first argument is a function, it is used to do some DOM manipulation
based on an object. The DOM element and the object to apply is passed as
arguments to the function.

If the first argument is a string and the second is a function, it defines a
'named' setter, which is immediately defines the current setter and can be
restored by calling this static method with the name alone.

If the first argument is a string and no second argument is given, it defines
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


ToDo
----

* More examples

* Benchmarks (vs template engines, plain innerHTML, DOM creation using popular frameworks)


License
-------

This library is relaesed under a MIT license. See the file LICENSE.txt for the
full content of the license.
