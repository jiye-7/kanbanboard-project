const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'ToDoList 레이아웃 만들기' },
    'task-2': { id: 'task-2', content: 'Drag&Drop 기능 구현하기' },
    'task-3': { id: 'task-3', content: '여러개의 column 만들기' },
    'task-4': {
      id: 'task-4',
      content: '여러개의 column Drag&Drop 기능 구현하기',
    },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To do',
      taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In progress',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: [],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

export default initialData;
