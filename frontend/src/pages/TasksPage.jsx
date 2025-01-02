import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TasksPage() {
    const { projectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(6);

    useEffect(() => {
        if (projectId) {
            axios.get(`/v1/tasks/get-tasks/${projectId}`)
                .then(response => {
                    setTasks(response.data.tasks);
                    console.log(response.data.tasks);
                })
                .catch(error => {
                    console.error("Error fetching tasks:", error);
                });
        }
    }, [projectId]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Finish':
                return 'bg-green-100 text-green-600';
            case 'On Progress':
                return 'bg-blue-100 text-blue-600';
            case 'Pending':
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'bg-red-100 text-red-600';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-600';
            case 'Low':
                return 'bg-green-100 text-green-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    // Hàm để tính số ngày từ khi tạo task
    const getDaysFromCreation = (createdAt) => {
        const diffTime = Math.abs(new Date() - new Date(createdAt));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Format time remaining
    const formatTimeRemaining = (endDate) => {
        const now = new Date();
        const end = new Date(endDate);
        const diffTime = Math.abs(end - now);
        const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(tasks.length / tasksPerPage);

    return (
        <div className="p-8 bg-blue-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-8">Tasks</h1>
            
            <div className="flex flex-col space-y-3">
                {currentTasks.length > 0 ? currentTasks.map(task => (
                    <div key={task._id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            {/* Left side */}
                            <div className="flex items-center space-x-4">
                                <div className="text-gray-400">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="font-medium text-lg">{task.name}</h2>
                                    <p className="text-sm text-gray-500">
                                        Opened {getDaysFromCreation(task.createdAt)} days by {task.created_by?.name || 'Unknown'}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                </div>
                            </div>

                            {/* Center */}
                            <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
                                    {task.status}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                            </div>

                            {/* Right side */}
                            <div className="flex items-center space-x-4">
                                <div className="bg-gray-100 px-4 py-1 rounded-full text-gray-600">
                                    <span className="flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{formatTimeRemaining(task.end_date)}</span>
                                    </span>
                                </div>

                                {/* Action buttons */}
                                <div className="flex items-center space-x-2">
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                        </svg>
                                    </button>
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-gray-500">No tasks found. Create a new one below.</p>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 gap-2">
                <button 
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
                <button 
                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            {/* Add new task button */}
            <div className="text-center mt-8">
                <Link 
                    to={`/projects/${projectId}/tasks/new`}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add new task
                </Link>
            </div>
        </div>
    );
}