export interface Todo {
    id: number;
    text: string;
    done: boolean;
    priority: number;
    user_id?: number;
    created_by_id?: number;
    claimed_by_id?: number;
    project_id?: number;
    project_title?: string;
    assignee_name?: string;
    claimed_by_name?: string;
    created_at?: string;
}
