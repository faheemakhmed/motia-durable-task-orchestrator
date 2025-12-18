import { ApiRouteConfig, Handlers } from 'motia';

// 1. Configuration: Tells Motia how to trigger this code
export const config: ApiRouteConfig = {
  name: 'SubmitTask',
  type: 'api',
  path: '/submit',
  method: 'POST',
  emits: ['task.submitted'], // Declares that this step will trigger other steps
  flows: ['durable-orchestrator'] // Groups this in the Workbench visualization
};

// 2. Handler: The actual business logic
export const handler: Handlers['SubmitTask'] = async (req, { emit, logger, state }) => {
  const { taskName, priority } = req.body;

  // Validation
  if (!taskName) {
    return { status: 400, body: { error: 'taskName is required' } };
  }

  logger.info('Received new task request', { taskName, priority });

  // Initialize the task state in our "Ledger"
  // We use the internal traceId as a unique Task ID
  const taskId = Date.now().toString(); 
  
  await state.set('tasks', taskId, {
    name: taskName,
    status: 'received',
    priority: priority || 'normal',
    createdAt: new Date().toISOString()
  });

  // Emit the event to wake up the background worker
  await emit({
    topic: 'task.submitted',
    data: { taskId, taskName }
  });

  // Respond immediately to the user
  return {
    status: 202,
    body: {
      message: 'Task accepted and queued for processing',
      taskId: taskId
    }
  };
};




