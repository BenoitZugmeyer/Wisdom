/*jshint

  eqeqeq:true, immed:true, latedef:true, noarg:true, noempty:true, nonew:true,
  plusplus:true, undef:true, strict:true, trailing:true, onevar: true,

  laxcomma:true, multistr: true,

  browser:true,

  maxlen: 79
*/
/*global sink, start, Wisdom*/

(function () {
  'use strict';

  var nodeTypes = [
    {},
    'element',
    'attribute',
    'text',
    'cdata_section',
    'entity_reference',
    'entity',
    'processing_instruction',
    'comment',
    'document',
    'document_type',
    'document_fragment',
    'notation'
  ];

  function is(element, what) {
    return element && (nodeTypes[element.nodeType] === what ||
                       element.tagName.toLowerCase() === what);

  }

  sink('Trivial cases', function (test, ok) {

    Wisdom.defineSetter();

    test('create an element', 3, function () {
      var element = new Wisdom().span().last;

      ok(is(element, 'span'), 'is a <span>');
      ok(element.childNodes.length === 0, 'is empty');
      ok(!element.parentNode, 'does not have any parent');

    });

    test('create an element with attributes', 5, function () {
      var element = new Wisdom().span({
            'class': 'foo bar',
            'data-foo': 'bar'
          }, {
            style: 'color: red'
          })
          ._({
            id: 'baz'
          }).last;

      ok(element.id === 'baz', 'ID');
      ok(element.className === 'foo bar', 'classes');
      ok(element.style.cssText.replace(/ /g, '')  === 'color:red;', 'style');
      ok(element.getAttribute('data-foo') === 'bar', 'data attribute');
      ok('dataset' in element && element.dataset.foo === 'bar',
         'dataset value (if the browser supports it)');

    });

    test('append text', 3, function () {
      var element = new Wisdom().span('foo', '<bar>')._('baz').last;

      ok((element.textContent || element.innerText) === 'foo<bar>baz', 'text');
      ok(element.innerHTML === 'foo&lt;bar&gt;baz', 'html');

      element = new Wisdom().input('foo', '"bar"')._('baz').last;

      ok(element.value === 'foo"bar"baz', 'value');

    });

    test('append text on inputs', 2, function () {
      var dom = new Wisdom()
        , parent = dom.div('foo').last
        , child = dom.input('bar')._('baz').last;

      dom.$('foz');

      ok((parent.textContent || parent.innerText) === 'foofoz', 'text');
      ok(child.value === 'barbaz', 'value');

    });

    test('append child', 6, function () {
      var dom = new Wisdom()
        , parent = dom.span().last
        , child = dom.strong().last;

      ok(is(child, 'strong'), 'child is a <strong>');
      ok(child.childNodes.length === 0, '! child > *');
      ok(child.parentNode === parent, 'parent > child');
      ok(is(parent, 'span'), 'parent is a <span>');
      ok(parent.childNodes.length === 1, '! parent > * + *');
      ok(!parent.parentNode, '! * > parent');

    });

    test('closing element', 5, function () {
      var dom = new Wisdom()
        , parent = dom.div().last
        , first = dom.form().last
        , second = dom.span().last
        , third = dom.$().span().last;

      ok(first.parentNode === parent, 'parent > first');
      ok(second.parentNode === first, 'first > second');
      ok(second.nextSibling === third, 'second + third');
      ok(parent.childNodes.length === 1, '! parent > * + *');
      ok(first.childNodes.length === 2, 'first > * + *, ! first * + * + *');

    });

    test('clean', 3, function () {
      var dom = new Wisdom()
        , first = dom.div().last
        , second = dom.clean().div().last;

      ok(!first.parentNode, '! * > first');
      ok(!second.parentNode, '! * > second');

      dom.inject(first);

      ok(second.parentNode === first, 'first > second');

    });

  });


  sink('Injection', function (test, ok, before) {
    var containerDom = new Wisdom()
      , container = containerDom.div().div().last
      , marker = containerDom.div().last
      , dom = new Wisdom()
      , child = dom.div().last;

    before(function () {

      if (child.parentNode)
        child.parentNode.removeChild(child);

    });

    test('no argument', 3, function () {

      dom.inject(container);

      ok(container.childNodes.length === 2,
         'container > * + *, ! container > * + * + *');
      ok(child.parentNode === container, 'container > child');
      ok(child.previousSibling === marker, 'marker + child');

    });

    test('bottom', 3, function () {

      dom.inject(container, 'bottom');

      ok(container.childNodes.length === 2,
         'container > * + *, ! container > * + * + *');
      ok(child.parentNode === container, 'container > child');
      ok(child.previousSibling === marker, 'marker + child');

    });

    test('top', 3, function () {

      dom.inject(container, 'top');

      ok(container.childNodes.length === 2,
         'container > * + *, ! container > * + * + *');
      ok(child.parentNode === container, 'container > child');
      ok(child.nextSibling === marker, 'child + marker');

    });

    test('after', 3, function () {

      dom.inject(container, 'after');

      ok(container.childNodes.length === 1, '! container > * + *');
      ok(marker.parentNode === container, 'container > marker');
      ok(child.previousSibling === container, 'container + child');

    });

    test('before', 3, function () {

      dom.inject(container, 'before');

      ok(container.childNodes.length === 1, '! container > * + *');
      ok(marker.parentNode === container, 'container > marker');
      ok(child.nextSibling === container, 'child + container');

    });

  });

  sink('Multiple roots', function (test, ok) {

    test('creation', 3, function () {
      var dom = new Wisdom().div().$().div();

      ok(dom.root.length === 2, '* + *');
      ok(is(dom.root[0], 'div'), 'div + *');
      ok(is(dom.root[1], 'div'), '* + div');

    });

    test('creation with text', 5, function () {
      var dom = new Wisdom('foo')
        , element = dom.span().last;

      dom.$('bar');

      ok(!element.parentNode, '! * > element');
      ok(dom.root.length === 3, 'root > * + * + *');
      ok(is(dom.root[0], 'text'), 'root[0] is text');
      ok(dom.root[1] === element, 'root[1] is element');
      ok(is(dom.root[2], 'text'), 'root[2] is text');

    });

    test('recusive close', 3, function () {
      var dom = new Wisdom().div().div().$$().div();

      ok(dom.root.length === 2, '* + *');
      ok(is(dom.root[0], 'div'), 'div + *');
      ok(is(dom.root[1], 'div'), '* + div');

    });

    test('injection', 5, function () {
      var container = document.createElement('div');

      new Wisdom().div('foo').$('bar').div('baz').inject(container);

      ok(container.childNodes.length === 3, 'container > * + * + *');
      ok((container.textContent || container.innerText) === 'foobarbaz',
         'contains foobarbaz');
      ok(is(container.childNodes[0], 'div'), 'container > div + * + *');
      ok(is(container.childNodes[1], 'text'), 'container > * + text + *');
      ok(is(container.childNodes[2], 'div'), 'container > * + * + div');

    });

  });

  start();

}());

/* vim: set et ts=2 sw=2 sts=2: */
