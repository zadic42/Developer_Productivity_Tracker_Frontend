import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

const KanbanColumn = ({ status, tasks, onAddTask, onEditTask }) => {
    const statusIcons = {
        'Todo': 'bg-indigo-500',
        'In Progress': 'bg-cyan-500',
        'Done': 'bg-emerald-500'
    };

    return (
        <div className="flex-shrink-0 w-80 flex flex-col h-full group/column">
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-900 uppercase tracking-widest text-[11px]">{status}</h3>
                    <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-black">
                        {tasks.length}
                    </span>
                </div>
                <button
                    onClick={() => onAddTask(status)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all opacity-0 group-hover/column:opacity-100"
                >
                    <Plus size={16} />
                </button>
            </div>

            <Droppable droppableId={status}>
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex-1 flex flex-col gap-3 p-3 rounded-3xl min-h-[500px] transition-colors
                            ${snapshot.isDraggingOver ? 'bg-indigo-50/50' : 'bg-slate-50/50 border border-dashed border-slate-200'}`}
                    >
                        {tasks.map((task, index) => (
                            <TaskCard
                                key={task._id}
                                task={task}
                                index={index}
                                onEdit={onEditTask}
                            />
                        ))}
                        {provided.placeholder}

                        <button
                            onClick={() => onAddTask(status)}
                            className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-white transition-all flex items-center justify-center gap-2 group mt-2"
                        >
                            <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Post Module</span>
                        </button>
                    </div>
                )}
            </Droppable>
        </div>
    );
};

export default KanbanColumn;
