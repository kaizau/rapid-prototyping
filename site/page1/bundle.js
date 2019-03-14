import m from 'mithril';

const App = {
  view() {
    return m('.App', [
      m('h1', 'Page 1'),
      m('p', 'This component is rendered by mithril.js.'),
      m('p', m('img', {src: '/home/test.jpg'})),
    ]);
  },
};

m.mount(document.querySelector('.AppRoot'), App);
