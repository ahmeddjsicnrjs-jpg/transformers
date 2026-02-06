import { Task, MOCK_TASKS } from '../data/mockTasks';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchTasks = async (): Promise<Task[]> => {
  await delay();
  return MOCK_TASKS;
};

export const fetchTaskById = async (id: string): Promise<Task | undefined> => {
  await delay();
  return MOCK_TASKS.find(task => task.id === id);
};

export const updateTaskStatus = async (
  id: string,
  status: Task['status'],
): Promise<Task> => {
  await delay();
  const task = MOCK_TASKS.find(t => t.id === id);
  if (!task) {
    throw new Error(`Task with id ${id} not found`);
  }
  task.status = status;
  return { ...task };
};
