import { EventConfig, Handlers } from 'motia';

// 1. Configuration: Tells Motia to wake up this code when 'task.submitted' is seen
export const config: EventConfig = {
  name: 'TaskWorker',
  type: 'event',
  subscribes: ['task.submitted'], // Listens to the topic emitted by Phase 2
  flows: ['durable-orchestrator'],
  infrastructure: {
    queue: {
      maxRetries: 3, // If the code crashes, Motia will retry up to 3 times
      visibilityTimeout: 30 // Wait 30 seconds between retries
    }
  }
};

// Helper function to simulate a delay (working)
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 2. Handler: The background business logic
export const handler: Handlers['TaskWorker'] = async (data, { logger, state }) => {
  const { taskId, taskName } = data;

  logger.info(`Starting background work for Task: ${taskName}`, { taskId });

  // Update state to 'processing'
  await state.set('tasks', taskId, {
    status: 'processing',
    startedAt: new Date().toISOString()
  });

  // Simulate a 5-step heavy process
  for (let i = 1; i <= 5; i++) {
    // SIMULATED FAILURE (For testing fault tolerance)
    // If you want to see a retry in action, uncomment the next 3 lines:
    // if (i === 3 && Math.random() > 0.5) {
    //   throw new Error("Temporary Kitchen Disaster! Retrying...");
    // }

    await wait(2000); // Wait 2 seconds per step
    logger.info(`Task ${taskId} is ${i * 20}% complete...`);
  }

  // Final Update to State
  await state.set('tasks', taskId, {
    status: 'completed',
    finishedAt: new Date().toISOString()
  });

  logger.info(`✅ Task ${taskId} successfully completed.`);
};