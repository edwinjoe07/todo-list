const BASE_URL = 'https://todo-backend-z00o.onrender.com/api';
// const BASE_URL = 'http://localhost:5000/api';

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData
        });
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

export const getAllTodos = async () => {
    try {
        console.log('Fetching todos from:', `${BASE_URL}/todos`);
        const response = await fetch(`${BASE_URL}/todos`);
        return handleResponse(response);
    } catch (error) {
        console.error('getAllTodos error:', error);
        throw error;
    }
};

export const createTodo = async (text) => {
    try {
        console.log('Creating todo:', text);
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
        console.log('Updating todo:', id, updates);
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
        console.log('Deleting todo:', id);
        const response = await fetch(`${BASE_URL}/todos/${id}`, {
            method: 'DELETE',
        });
        return handleResponse(response);
    } catch (error) {
        console.error('deleteTodo error:', error);
        throw error;
    }
}; 