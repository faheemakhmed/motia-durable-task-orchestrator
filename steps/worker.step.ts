import { EventConfig, Handlers } from 'motia';

// 1. Configuration
export const config: EventConfig = {
  name: 'TaskWorker',
  type: 'event',
  subscribes: ['task.submitted'], // <--- This matches your API's emit!
  flows: ['durable-orchestrator'],
  infrastructure: {
    queue: {
      maxRetries: 3, 
      visibilityTimeout: 30 
    }
  }
};

// Helper for delay
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 2. Handler
export const handler: Handlers['TaskWorker'] = async (data: any, { logger, state, streams }: any) => {
  const { taskId, taskName } = data;

  logger.info(`Starting background work for Task: ${taskName}`, { taskId });

  // Update State: Processing
  await state.set('tasks', taskId, {
    status: 'processing',
    startedAt: new Date().toISOString()
  });

  // Simulate heavy work (5 steps)
  for (let i = 1; i <= 5; i++) {
    await wait(2000); // 2 second delay
    const progress = i * 20;

    // REAL-TIME STREAM UPDATE (The "Winning" Feature)
    await streams.taskUpdates.set(taskId, {
      progress: progress,
      message: `Step ${i} of 5 completed`,
      timestamp: new Date().toISOString()
    });

    logger.info(`Task ${taskId} is ${progress}% complete...`);
  }

  // Update State: Completed
  await state.set('tasks', taskId, {
    status: 'completed',
    finishedAt: new Date().toISOString()
  });

  logger.info(`✅ Task ${taskId} successfully completed.`);
};