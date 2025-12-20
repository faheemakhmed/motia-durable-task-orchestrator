import { ApiRouteConfig, Handlers } from 'motia';

export const config: ApiRouteConfig = {
  name: 'SubmitTask',
  type: 'api',
  path: '/submit',
  method: 'POST',
  emits: ['task.submitted'],
  flows: ['durable-orchestrator']
};

export const handler: Handlers['SubmitTask'] = async (req: any, { emit, logger, state }: any) => {
  try {
    const { topic } = req.body; // CHANGED: We now expect a 'topic'

    if (!topic) {
      return { status: 400, body: { error: 'Topic is required' } };
    }

    logger.info('Received new research request', { topic });

    const taskId = Date.now().toString(); 
    
    // Save initial state
    await state.set('tasks', taskId, {
      type: 'research-agent',
      topic: topic,
      status: 'received',
      createdAt: new Date().toISOString()
    });

    await emit({
      topic: 'task.submitted',
      data: { taskId, topic } // Pass the topic to the worker
    });

    return {
      status: 202,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: {
        message: 'Research Agent started',
        taskId: taskId
      }
    };
  } catch (error: any) {
    logger.error('Error in submit', { error: error.message });
    return { status: 500, body: { message: "Internal server error" } };
  }
};