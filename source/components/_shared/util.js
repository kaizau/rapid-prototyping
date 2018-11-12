export function delegateEvent(container, selector, event, callback) {
  container.addEventListener(event, (e) => {
    let target = e.target;
    let matched;

    while (!matched && target && target !== e.currentTarget) {
      matched = target.matches(selector);
      target = target.parentNode;
      if (matched) {
        callback(e);
      }
    }
  }, true);
}

export function toArray(list) {
  return Array.prototype.slice.call(list);
}
