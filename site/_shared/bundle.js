import m from 'mithril';
import {log} from '~shared/util';

log(process.env.EXAMPLE_BUILD_VAR);

m.request({
  url: '/api/example',
  background: true,
  deserialize: responseText => responseText,
}).then(data => {
  log(data);
});
