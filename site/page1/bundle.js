import m from 'mithril';

const App = {
  view() {
    return m('.App', [
      m('h1', 'Page 1'),
      m('p', '(Rendered by mithril.js)'),
      m('p', m('img', {src: '/index/test.jpg'})),
    ]);
  },
};

m.mount(document.querySelector('.AppRoot'), App);
