export interface Task {
  id: string;
  vin: string;
  model: string;
  operation: string;
  description: string;
  assignee: string;
  status: 'pending' | 'in_progress' | 'done';
  startDate: string;
  deadline: string;
  materialReceived: boolean;
  orderNumber: string;
  post: string;
  teamSize: number;
}

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    vin: 'MR0KB3CD700924519',
    model: 'Toyota Hilux',
    operation: 'Бронювання кунгу',
    description: 'Комплект деталей 3,0 мм (355)',
    assignee: 'Кушнір В.',
    status: 'done',
    startDate: '2025-06-10T08:00:00Z',
    deadline: '2025-06-12T18:00:00Z',
    materialReceived: true,
    orderNumber: '#195',
    post: 'Пост 2',
    teamSize: 2,
  },
  {
    id: '2',
    vin: 'MR0KB3CD700924519',
    model: 'Toyota Hilux',
    operation: 'Встановлення склопластику (зад/дах)',
    description: 'Склопластикові панелі задні та дахові',
    assignee: 'Іванюк М.',
    status: 'in_progress',
    startDate: '2025-06-11T08:00:00Z',
    deadline: '2025-06-13T18:00:00Z',
    materialReceived: true,
    orderNumber: '#195',
    post: 'Пост 4',
    teamSize: 1,
  },
  {
    id: '3',
    vin: 'MR0KB3CD700924519',
    model: 'Toyota Hilux',
    operation: 'Збирання салону (електрика)',
    description: 'Електропроводка салону, підключення',
    assignee: 'Яремін В.',
    status: 'pending',
    startDate: '2025-06-12T08:00:00Z',
    deadline: '2025-06-14T18:00:00Z',
    materialReceived: false,
    orderNumber: '#195',
    post: 'Пост 6',
    teamSize: 1,
  },
  {
    id: '4',
    vin: 'MR0KB3CD700924511',
    model: 'Toyota Hilux',
    operation: 'Порізка бронекомплекта',
    description: 'Порізка бронелистів згідно шаблону',
    assignee: 'Мельник В.',
    status: 'done',
    startDate: '2025-06-09T08:00:00Z',
    deadline: '2025-06-11T18:00:00Z',
    materialReceived: true,
    orderNumber: '#196',
    post: 'Пост 1',
    teamSize: 1,
  },
  {
    id: '5',
    vin: 'MR0KB3CD700924520',
    model: 'Toyota Land Cruiser',
    operation: 'Встановлення бронеплит',
    description: 'Бронеплити днища та дверей',
    assignee: 'Лесюк О.',
    status: 'pending',
    startDate: '2025-06-13T08:00:00Z',
    deadline: '2025-06-15T18:00:00Z',
    materialReceived: false,
    orderNumber: '#197',
    post: 'Пост 3',
    teamSize: 2,
  },
  {
    id: '6',
    vin: 'MR0KB3CD700924520',
    model: 'Toyota Land Cruiser',
    operation: 'Фарбування захисне',
    description: 'Захисне фарбування кузова RAL 6014',
    assignee: 'Кушнір В.',
    status: 'in_progress',
    startDate: '2025-06-12T08:00:00Z',
    deadline: '2025-06-14T18:00:00Z',
    materialReceived: true,
    orderNumber: '#197',
    post: 'Пост 5',
    teamSize: 1,
  },
  {
    id: '7',
    vin: 'MR0KB3CD700924522',
    model: 'Toyota Hilux',
    operation: 'Встановлення турелі',
    description: 'Монтаж поворотної платформи',
    assignee: 'Іванюк М.',
    status: 'pending',
    startDate: '2025-06-14T08:00:00Z',
    deadline: '2025-06-16T18:00:00Z',
    materialReceived: false,
    orderNumber: '#198',
    post: 'Пост 2',
    teamSize: 3,
  },
];
