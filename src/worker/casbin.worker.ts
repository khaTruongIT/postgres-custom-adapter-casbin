import {Job, Worker} from 'bullmq';
import {AuthorizeAppApplication} from '../application';
import {getLogger} from '../utils';
import {createConnection} from '../utils/redis';

const logger = getLogger('casbin.worker');

const connection = createConnection();

export class CasbinWorker {
  private worker: Worker;
  constructor(private app: AuthorizeAppApplication) {}

  async init() {
    logger.info('Initializing casbin worker...');

    this.worker = new Worker(
      'casbin-event-bus',
      async job => {
        console.log(`job data :${JSON.stringify(job.data)}`);
        console.log('job name ==>', job.name);
      },
      {
        connection,
      },
    );

    this.worker.on('completed', job => {
      console.log(`job ==>`, JSON.stringify(job));
      this.handleJob(job).catch(err => {
        console.error(`Error handle event ${JSON.stringify(err)}`);
        return err;
      });
    });

    this.worker.on('progress', (job: Job) => {
      console.log('in progress');
      console.log('job ==>', JSON.stringify(job));
    });

    this.worker.on('failed', (job: Job, err: Error) => {
      console.error(
        `handle job ${JSON.stringify(job)}, error name: ${err.name}, error: ${
          err.message
        }`,
      );
    });

    await this.worker.waitUntilReady();
    logger.info('Casbin worker ready...');
  }

  async handleJob(job: any) {
    console.log(`${JSON.stringify(job)}`);
    // const name = job.data.name;
    // const type = job.data.type;
    // console.log('type ==>', type);
    // const entity = job.data.entity;
    // console.log('entity ==>', entity);
    // switch (type) {
    //   case 'created':
    //     console.log(`created ${name} in meilisearch`);
    //     await this.service.addDocuments(name, [entity]);
    //     break;
    //   case 'updated':
    //     console.log(`updated ${name} in meilisearch`);
    //     await this.service.updateDocuments(name, [entity]);
    //     break;
    //   case 'deleted':
    //     console.warn(`deleted ${name} in meilisearch`);
    //     await this.service.deleteDocument(name, entity);
    // }
  }
}
