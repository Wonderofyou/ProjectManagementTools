import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TasksPage() {
    const { projectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(6);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [NotificationMessage, setNotificationMessage] = useState("");
    const [userRole, setUserRole] = useState('');


    useEffect(() => {
        axios.get(`/v1/tasks/get-tasks/${projectId}`)
            .then(response => {
                setTasks(response.data.tasks);
            })
            .catch(error => {
                console.error("Error fetching tasks:", error);
            });
    }, []);

    useEffect(() => {
        axios.get(`/v1/tasks/get-user-info/${projectId}`)
            .then(response => {
                setUserRole(response.data.userRole);
            })
            .catch(error => {
                console.error("Error  user information:", error);
            });
    }, []);

    const handleStatusChange = async (task, newStatus) => {
        try {
            const response = await axios.put(`/v1/tasks/update-status/${task.task_id._id}`, {
                status: newStatus,
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || "Failed to update task status");
            }

            const updatedTask = response.data;
            setTasks((prevTasks) =>
                prevTasks.map((t) =>
                    t.task_id._id === task.task_id._id
                        ? { ...t, task_id: { ...t.task_id, status: updatedTask.task.status } }
                        : t
                )
            );

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
            setNotificationMessage(errorMessage);
            setShowNotification(true);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Finish':
                return 'bg-green-500 text-white'; // Green for finished tasks
            case 'On Progress':
                return 'bg-blue-500 text-white'; // Blue for ongoing tasks
            case 'Pending':
            default:
                return 'bg-gray-500 text-white'; // Default color for pending tasks
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'bg-red-500 text-white';
            case 'Medium':
                return 'bg-yellow-500 text-white';
            case 'Low':
                return 'bg-green-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const getDaysFromCreation = (createdAt) => {
        const diffTime = Math.abs(new Date() - new Date(createdAt));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const formatTimeRemaining = (endDate) => {
        const now = new Date();
        const end = new Date(endDate);
        const diffTime = Math.abs(end - now);
        const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const handleDeleteClick = (e, task) => {
        e.preventDefault();
        setSelectedTask(task);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedTask) return;

        try {
            await axios.delete(`/v1/tasks/delete-task/${selectedTask.task_id._id}`);
            setTasks((prevTasks) =>
                prevTasks.filter((task) => task.task_id._id !== selectedTask.task_id._id)
            );
            setNotificationMessage("Task deleted successfully.");
            setShowNotification(true);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
            setNotificationMessage(errorMessage);
            setShowNotification(true);
        } finally {
            setShowDeleteModal(false);
            setSelectedTask(null);
        }
    };

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(tasks.length / tasksPerPage);

    return (
        <div className="p-8 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 min-h-screen">
            <h1 className="text-4xl font-semibold text-gray-800 mb-8">Project Tasks</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {currentTasks.length > 0 ? currentTasks.map(task => (
                    <div key={task.task_id._id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
                        <div className="flex items-center justify-between space-x-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">{task.task_id.name}</h2>
                                <p className="text-sm text-gray-600 mt-2">{task.task_id.description}</p>
                                <p className="text-sm text-gray-400">Created {getDaysFromCreation(task.task_id.createdAt)} days ago by {task.task_id.created_by?.name || 'Unknown'}</p>
                            </div>

                            <div>
                                <button
                                    className={`px-4 py-2 rounded-full text-white ${getStatusColor(task.task_id.status)}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedTask(selectedTask === task ? null : task);
                                    }}
                                >
                                    {task.task_id.status}
                                </button>
                                {selectedTask === task && (
                                    <div className="absolute bg-white border rounded-lg shadow-lg mt-2 z-50">
                                        {["In Progress", "Completed"].map((status) => (
                                            <button
                                                key={status}
                                                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200"
                                                onClick={() => {
                                                    handleStatusChange(task, status);
                                                    setSelectedTask(null);
                                                }}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <div className="text-sm font-medium text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                                {formatTimeRemaining(task.task_id.end_date)} remaining
                            </div>

                            <button
                                onClick={(e) => handleDeleteClick(e, task)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-gray-500">No tasks found. Create a new one below.</p>
                )}
            </div>

            <div className="flex justify-center mt-8 gap-4">
                <button
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    className="px-6 py-3 rounded-lg bg-gray-300 hover:bg-gray-400 disabled:opacity-50 transition"
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                    className="px-6 py-3 rounded-lg bg-gray-300 hover:bg-gray-400 disabled:opacity-50 transition"
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>

            {userRole === 'admin' && (
                <div className="text-center mt-8">
                    <Link
                        to={`/projects/${projectId}/tasks/new`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add new task
                    </Link>
                </div>
            )}
        </div>
    );
}
