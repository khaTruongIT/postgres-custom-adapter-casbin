/* eslint-disable @typescript-eslint/no-floating-promises */
import {AuthorizeAppApplication} from '../application';
import {CasbinWorker} from './casbin.worker';

(async () => {
  const app = new AuthorizeAppApplication();
  const worker = new CasbinWorker(app);
  await worker.init();
})();
