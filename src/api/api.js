const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const getAllTodos = async () => {
    try {
        const response = await fetch(`${BASE_URL}/todos`);
        return handleResponse(response);
    } catch (error) {
        console.error('getAllTodos error:', error);
        throw error;
    }
};

export const createTodo = async (text) => {
    try {
        const response = await fetch(`${BASE_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });
        return handleResponse(response);
    } catch (error) {
        console.error('createTodo error:', error);
        throw error;
    }
};

export const updateTodo = async (id, updates) => {
    try {
        const response = await fetch(`${BASE_URL}/todos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });
        return handleResponse(response);
    } catch (error) {
        console.error('updateTodo error:', error);
        throw error;
    }
};

export const deleteTodo = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/todos/${id}`, {
            method: 'DELETE',
        });
        return handleResponse(response);
    } catch (error) {
        console.error('deleteTodo error:', error);
        throw error;
    }
}; 