import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { MoreVertical, Calendar, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const priorityStyles = {
    Low: 'text-slate-500 bg-slate-50 border-slate-200',
    Medium: 'text-amber-600 bg-amber-50 border-amber-100',
    High: 'text-orange-600 bg-orange-50 border-orange-100',
    Critical: 'text-red-600 bg-red-50 border-red-100',
};

const TaskCard = ({ task, index, onEdit }) => {
    const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;
    const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onEdit(task)}
                    className={`bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group mb-3
                        ${snapshot.isDragging ? 'shadow-2xl border-indigo-500 scale-105 z-50' : ''}`}
                >
                    <div className="flex justify-between items-start mb-3">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${priorityStyles[task.priority] || priorityStyles.Low}`}>
                            {task.priority}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical size={14} className="text-slate-300" />
                        </div>
                    </div>

                    <h4 className="font-black text-slate-900 mb-2 leading-tight group-hover:text-indigo-700 transition-colors uppercase tracking-tight text-sm">
                        {task.title}
                    </h4>

                    {task.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 mb-4 font-medium leading-relaxed">
                            {task.description}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {task.tags?.map((tag, i) => (
                            <span key={i} className="text-[9px] bg-slate-50 text-slate-400 px-2 py-0.5 rounded-lg border border-slate-100 font-bold uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {totalSubtasks > 0 && (
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between items-center text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                <span>Progress</span>
                                <span>{completedSubtasks}/{totalSubtasks}</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                <div
                                    className="h-full bg-indigo-600 transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-3 text-slate-400">
                            {task.estimatedTime > 0 && (
                                <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                                    <Clock size={12} />
                                    <span>{task.estimatedTime}h</span>
                                </div>
                            )}
                        </div>
                        <div className="flex -space-x-1">
                            <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-[10px] text-white font-black shadow-sm">
                                {task.category?.[0].toUpperCase() || 'D'}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;
