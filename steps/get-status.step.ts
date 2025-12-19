import { ApiRouteConfig, Handlers } from 'motia';

export const config: ApiRouteConfig = {
  name: 'GetTaskStatus',
  type: 'api',
  path: '/status/:taskId', // :taskId is a variable!
  method: 'GET',
  emits: [],
  flows: ['durable-orchestrator']
};

export const handler: Handlers['GetTaskStatus'] = async (req, { state, logger }) => {
  const { taskId } = req.pathParams;

  // Retrieve the data from our 'tasks' group in State
  const taskData = await state.get('tasks', taskId);

  if (!taskData) {
    return {
      status: 404,
      body: { error: 'Task not found' }
    };
  }

  logger.info(`Status requested for task ${taskId}`);

  return {
    status: 200,
    body: taskData
  };
};