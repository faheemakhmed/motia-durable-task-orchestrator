import { ApiRouteConfig, Handlers } from "motia";

export const config: ApiRouteConfig = {
  name: "SubmitTask",
  type: "api",
  path: "/submit",
  method: "POST",
  flows: ["TaskOrchestrator"],
  emits: ["task.Submitted"],
};

export const handler: Handlers["SubmitTask"] = async (req, context) => {
  const { logger, state } = context;

  // Safely find the emit function
  const emitFn =
    context.emits || context.emit || context.send || context.publish;

  if (!emitFn) {
    logger.error("No event emitter found in context");
    return {
      status: 500,
      body: { error: "Internal configuration error" },
    };
  }

  const body = req.body || {};
  const { taskName, priority } = body;

  if (!taskName) {
    return {
      status: 400,
      body: { error: "Task name is required" },
    };
  }

  const taskId = Date.now().toString();

  await state.set("tasks", taskId, {
    name: taskName,
    status: "received",
    createdAt: new Date().toISOString(),
    priority: priority || "normal",
  });

  await emitFn({
    topic: "task.Submitted",
    data: { taskId, taskName },
  });

  logger.info("Task submitted", { taskId });

  return {
    status: 202,
    body: {
      message: "task accepted, work will happen later",
      taskId,
    },
  };
};
