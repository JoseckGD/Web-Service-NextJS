import { NextResponse } from 'next/server';
import dbConnection from '../../../../../utils/dbConnection';

export async function GET(req, res) {
    try {
        const tasks = await getTasks();
        return NextResponse.json({ status: true, message: 'Hello from the API tasks', data: tasks });
    } catch (error) {
        return NextResponse.json({ status: false, message: 'Error from the API! ' + error });
    }
}

export async function POST(req, res) {
    const body = await req.json()
    try {
        const { title, description } = body;
        const task = await createTask(title, description);
        return NextResponse.json({ status: true, message: 'Hello from the API tasks', data: task });
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json({ status: false, message: 'Error from the API! ', error: error });
    }
}

export async function PUT(req, res) {
    const body = await req.json()
    try {
        const { id, title, description } = body;
        const task = await updateTask(id, title, description);
        if (task) {
            return NextResponse.json({ status: true, message: 'Task modify', data: task });
        } else {
            return NextResponse.json({ status: false, message: 'Task not found ' });
        }
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json({ status: false, message: 'Error from the API! ', error: error });
    }
}

export async function DELETE(req, { params }) {
    const { id } = params;
    try {
        const result = await deleteTask(id);
        console.log("result: ", result);
        if (result) {
            return NextResponse.json({ status: true, message: 'Task deleted successfully' });
        } else {
            return NextResponse.json({ status: false, message: 'Task not found ' });
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        return NextResponse.json({ status: false, message: 'Error from the API! ', error: error });
    }
}

// Funciones auxiliares

async function getTasks() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM tasks';
        dbConnection.query(query, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(results);
        });
    });
}

async function createTask(title, description) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO tasks (title, description) VALUES (?, ?)';
        const values = [title, description];
        dbConnection.query(query, values, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            const taskId = results.insertId;
            const createdTask = { id: taskId, title, description };
            resolve(createdTask);
        });
    });
}

async function updateTask(id, title, description) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE tasks SET title = ?, description = ? WHERE id = ?';
        const values = [title, description, id];
        dbConnection.query(query, values, (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            if (results.affectedRows === 0) {
                resolve(null);
            } else {
                const updatedTask = { id, title, description };
                resolve(updatedTask);
            }
        });
    });
}

async function deleteTask(id) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM tasks WHERE id = ?';
        dbConnection.query(query, [id], (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            if (results.affectedRows === 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}
