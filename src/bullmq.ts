import { Queue, Worker } from 'bullmq';
import redis from './lib/redis.js';
import { nanoid } from 'nanoid';
import { faker } from '@faker-js/faker';

const queue = new Queue('email-queue', {
  connection: redis,
});

// Add single job
const receipt = await queue.add(
  'send-email',
  {
    to: 'user@example.com',
    subject: 'Hello',
    body: 'Hello World',
  },
  {
    jobId: `send-email-${nanoid()}-${Date.now()}`,
  },
);

// Add multiple jobs
const bulkJobs = await queue.addBulk(
  Array.from({ length: 2 }, (_, i) => ({
    name: 'send-email',
    data: {
      to: faker.internet.email(),
      subject: faker.word.words(5),
      body: faker.lorem.paragraph(),
    },
    opts: {
      jobId: `send-email-${nanoid()}-${Date.now()}`,
    },
  })),
);

// Add repeating job
const repeatingJob = await queue.add(
  'send-ten-second-email',
  {
    to: 'user@example.com',
    subject: 'Hello',
    body: 'Hello World',
  },
  {
    repeat: {
      every: 10 * 1000, // 10 seconds in milliseconds
    },
  },
);

const worker = new Worker(
  'email-queue',
  async (job) => {
    console.log(`Processing job ${job.id}`);
    console.log('job.data', job.data);

    job.updateProgress(50);

    // simulate some work
    await new Promise((resolve) => setTimeout(resolve, 1000));

    job.updateProgress(100);
  },
  {
    connection: redis,
  },
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

export { queue, worker };
