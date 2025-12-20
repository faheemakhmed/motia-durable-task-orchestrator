import { EventConfig, Handlers } from 'motia';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config(); // Load the .env file

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const config: EventConfig = {
  name: 'TaskWorker',
  type: 'event',
  subscribes: ['task.submitted'], 
  emits: [],
  flows: ['durable-orchestrator']
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const handler: Handlers['TaskWorker'] = async (data: any, { logger, state, streams }: any) => {
  const { taskId, topic } = data;

  logger.info(`Agent starting REAL research on: ${topic}`, { taskId });

  await state.set('tasks', taskId, {
    status: 'processing',
    topic: topic,
    startedAt: new Date().toISOString()
  });

  // 1. THE "VISUAL" STEPS
  // We keep these to show progress to the user while we prepare the call
  const researchSteps = [
    `Connecting to Gemini 1.5 Flash...`,
    `Analyzing semantic context of "${topic}"...`,
    `Retrieving relevant data points...`,
    `Synthesizing final report structure...`
  ];

  for (let i = 0; i < researchSteps.length; i++) {
    await wait(1500); // Small delay for UX
    const progress = (i + 1) * 20;
    
    // Update the Dashboard
    if (streams?.taskUpdates) {
        await streams.taskUpdates.set(taskId, {
            progress: progress,
            message: researchSteps[i],
            timestamp: new Date().toISOString()
        });
    }
  }

  // 2. THE REAL INTELLIGENCE
  try {
    const prompt = `
      You are an elite research agent. 
      Write a comprehensive, professional research report on the topic: "${topic}".
      
      Structure it with these exact Markdown headers:
      # RESEARCH REPORT: ${topic.toUpperCase()}
      ## Executive Summary
      ## Key Trends & Findings
      ## Future Outlook
      
      Keep it concise but insightful.
    `;

    logger.info("Sending prompt to Gemini...");
    
    // The actual API Call
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const realReport = response.text();

    // 3. SAVE THE REAL RESULT
    await state.set('tasks', taskId, {
      status: 'completed',
      topic: topic,
      report: realReport, // <--- This is now real AI generated text
      finishedAt: new Date().toISOString()
    });

    logger.info(`✅ Gemini successfully generated report for: ${topic}`);

  } catch (error: any) {
    logger.error("Gemini API Failed", { error: error.message });
    
    // Fallback if API key is wrong or quota exceeded
    await state.set('tasks', taskId, {
      status: 'completed',
      topic: topic,
      report: "# Error\nCould not contact AI Brain. Please check server logs.",
      finishedAt: new Date().toISOString()
    });
  }
};