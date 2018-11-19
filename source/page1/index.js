import m from 'mithril';

console.log('Welcome to page 1');

const App = {
  view() {
    return m('.App', [
      m('h1', 'Page 1'),
    ]);
  },
};

m.mount(document.body, App);
