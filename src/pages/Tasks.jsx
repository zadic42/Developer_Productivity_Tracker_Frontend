import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from '../components/KanbanColumn';
import TaskModal from '../components/TaskModal';
import API from '../api/axios';
import { Plus, Search, Filter, Loader2 } from 'lucide-react';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [initialStatus, setInitialStatus] = useState('Todo');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const { data } = await API.get('/tasks');
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        // Optimistic UI update
        const taskToUpdate = tasks.find(t => t._id === draggableId);
        const updatedTasks = tasks.map(t =>
            t._id === draggableId ? { ...t, status: destination.droppableId } : t
        );
        setTasks(updatedTasks);

        try {
            await API.patch(`/tasks/${draggableId}`, { status: destination.droppableId });
        } catch (error) {
            console.error('Error updating task status:', error);
            fetchTasks(); // Rollback on error
        }
    };

    const handleSaveTask = async (formData) => {
        try {
            if (selectedTask) {
                const { data } = await API.patch(`/tasks/${selectedTask._id}`, formData);
                setTasks(tasks.map(t => t._id === data._id ? data : t));
            } else {
                const { data } = await API.post('/tasks', formData);
                setTasks([...tasks, data]);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const openCreateModal = (status) => {
        setSelectedTask(null);
        setInitialStatus(status);
        setIsModalOpen(true);
    };

    const openEditModal = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const columns = ['Todo', 'In Progress', 'Done'];

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-indigo-500" size={48} />
                <p className="text-slate-400 font-medium">Loading your workspace...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Kanban Board</h2>
                    <p className="text-slate-500 font-medium">Manage your progress and boost productivity.</p>
                </div>
                <button
                    onClick={() => openCreateModal('Todo')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 px-6 rounded-2xl shadow-lg shadow-indigo-600/10 transition-all flex items-center justify-center gap-2 group text-xs uppercase tracking-widest"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    New Task
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all focus:border-indigo-300"
                    />
                </div>
                <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl hover:text-slate-900 hover:border-slate-300 transition-all font-bold shadow-sm">
                    <Filter size={18} />
                    <span className="text-xs uppercase tracking-widest font-black">Filter</span>
                </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar min-h-screen">
                    {columns.map(status => (
                        <KanbanColumn
                            key={status}
                            status={status}
                            tasks={tasks.filter(t => t.status === status)}
                            onAddTask={openCreateModal}
                            onEditTask={openEditModal}
                        />
                    ))}
                </div>
            </DragDropContext>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                task={selectedTask}
                initialStatus={initialStatus}
            />
        </div>
    );
};

export default Tasks;
