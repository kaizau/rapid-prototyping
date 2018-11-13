import { delegateEvent } from '_shared/util';

console.log('Hello, universe.');

delegateEvent(document.querySelector('body'), 'p', 'click', (e) => {
  console.log(`Clicked ${e.target.nodeName}`);
});
