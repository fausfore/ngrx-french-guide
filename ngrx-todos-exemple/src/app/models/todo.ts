export interface Todo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

export interface TodoListState {
    data: Todo[];
    loading: boolean;
    loaded: boolean;
    selectedTodo: Todo;
}
