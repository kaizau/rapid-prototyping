import 'mithril'; // Includes Promise polyfill
import { toArray } from '_shared/util';

const images = toArray(document.querySelectorAll('img'));
console.log('Images', images);
