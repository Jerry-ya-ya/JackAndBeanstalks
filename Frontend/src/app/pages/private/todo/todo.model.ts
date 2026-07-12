export interface Todo {
    id: number;
    text: string;
    done: boolean;
    user_id?: number;
    created_by_id?: number;
    project_id?: number;
    project_title?: string;
    assignee_name?: string;
    created_at?: string;
}
