import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TasksPage() {
    const { projectId } = useParams();
    //console.log("Project ID:", projectId);
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(6);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        if (projectId) {
            axios.get(`/v1/tasks/get-tasks/${projectId}`)
                .then(response => {
                    setTasks(response.data.tasks);
                    // console.log(response.data.tasks);
                })
                .catch(error => {
                    console.error("Error fetching tasks:", error);
                });
        }
    }, [projectId]);

    const handleStatusChange = async (task, newStatus) => {
        try {
            console.log(task.task_id._id);
            // Gửi yêu cầu PUT đến API để cập nhật trạng thái của task bằng axios
            const response = await axios.put(`/v1/tasks/update-status/${task.task_id._id}`, {
                status: newStatus,  // Truyền trạng thái mới vào body
            });

            if (response.status !== 200) {
                throw new Error(response.data.message || "Failed to update task status");
            }

            const updatedTask = response.data;

            // Cập nhật danh sách task trong UI
            setTasks((prevTasks) =>
                prevTasks.map((t) =>
                    t.task_id._id === task.task_id._id
                        ? { ...t, task_id: { ...t.task_id, status: updatedTask.task.status } }
                        : t
                )
            );

            // Hiển thị thông báo thành công nếu cần
            alert("Task status updated successfully!");
        } catch (error) {
            console.error("Error updating task status:", error);
            alert("Failed to update task status. Please try again.");
        }
    };


    const getStatusColor = (status) => {
        switch (status) {
            case 'Finish':
                return 'bg-green-100 text-green-600'; // Green for finished tasks
            case 'On Progress':
                return 'bg-blue-100 text-blue-600'; // Blue for ongoing tasks
            case 'Pending':
            default:
                return 'bg-gray-100 text-gray-600'; // Default color for pending tasks
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

    useEffect(() => {
        // Kiểm tra khi selectedProject thay đổi
        if (selectedTask) {
            console.log("Selected task has changed:", selectedTask);
        }
    }, [selectedProject]);

    const handleConfirmDelete = async () => {
        if (!selectedTask) return; // Kiểm tra nếu không có task để xóa

        try {
            console.log(selectedTask);
            // Gọi API xóa task
            await axios.delete(`/v1/tasks/delete-task/${selectedTask._id}`);

            // Xóa task khỏi danh sách
            setTasks(tasks.filter(task => task.task_id._id !== selectedTask._id));

            // Hiển thị thông báo thành công
            setNotificationMessage("Task deleted successfully.");
            setShowNotification(true);
            console.log(NotificationMessage);
        } catch (error) {
            // Lấy thông báo lỗi nếu xảy ra
            const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
            setNotificationMessage(errorMessage);
            setShowNotification(true);
        } finally {
            // Đóng modal xóa sau khi hoàn thành
            setShowDeleteModal(false);
            setSelectedTask(null);
        }
    };




    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(tasks.length / tasksPerPage);

    return (
        <div className="p-8 bg-blue-100 min-h-screen relative">
            <h1 className="text-3xl font-bold mb-8">Tasks</h1>
            <div className="flex flex-col space-y-3">
                {currentTasks.length > 0 ? currentTasks.map(task => (
                    <div key={task.task_id._id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow relative">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="text-gray-400">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="font-medium text-lg">{task.task_id.name}</h2>
                                    <p className="text-sm text-gray-500">
                                        Opened {getDaysFromCreation(task.task_id.createdAt)} days by {task.task_id.created_by?.name || 'Unknown'}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">{task.task_id.description}</p>
                                </div>
                            </div>

                            <div className="relative">
                                <button
                                    className={`px-3 py-1 rounded-full text-sm ${getStatusColor(task.task_id.status)}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        // Đóng menu nếu đang mở, ngược lại thì mở menu
                                        setSelectedTask(selectedTask === task ? null : task);
                                    }}
                                >
                                    {task.task_id.status}
                                </button>
                                {selectedTask === task && (
                                    <div
                                        className="absolute bg-white border rounded shadow-lg mt-2 z-50"
                                        style={{ minWidth: "150px" }}
                                    >
                                        {["In Progress", "Completed"].map((status) => (
                                            <button
                                                key={status}
                                                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200"
                                                onClick={() => {
                                                    handleStatusChange(task, status);
                                                    setSelectedTask(null); // Đóng menu sau khi chọn
                                                }}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>


                            <div className="flex items-center space-x-4">
                                <div className="bg-gray-100 px-4 py-1 rounded-full text-gray-600">
                                    <span className="flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{formatTimeRemaining(task.task_id.end_date)}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={(e) => handleDeleteClick(e, task)}
                            className="absolute bottom-1 right-3 p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                )) : (
                    <p className="text-center text-gray-500">No tasks found. Create a new one below.</p>
                )}
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this task? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
