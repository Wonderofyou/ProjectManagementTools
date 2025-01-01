import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TasksPage() {
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(6); // 3 tasks per row, 2 rows per page (total 6)
    // const location = useLocation();
    // const searchParams = new URLSearchParams(location.search);
    // const projectId = searchParams.get("projectId");

    useEffect(() => {
        axios.get('v1/tasks/get-tasks').then(response => {
            setTasks(response.data.tasks);
        })
            .catch(error => {
                console.error("Error fetching tasks:", error);
            });
    }, []);

    // Pagination logic
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate the total number of pages
    const totalPages = Math.ceil(tasks.length / tasksPerPage);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Tasks</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 mt-4">
                {currentTasks.length > 0 ? currentTasks.map(task => (
                    <div key={task._id} className="flex flex-col gap-2 bg-gray-100 p-4 rounded-2xl">
                        <h2 className="text-xl">{task.name}</h2>
                        <p className="text-sm mt-2">{task.description}</p>
                        <p className="text-sm text-gray-500 mt-1">Status: {task.status}</p>
                        <p className="text-sm text-gray-500 mt-1">Priority: {task.priority}</p>
                        <p className="text-sm text-gray-500 mt-1">Start Date: {new Date(task.start_date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500 mt-1">End Date: {new Date(task.end_date).toLocaleDateString()}</p>
                    </div>
                )) : (
                    <p>No tasks found. Create a new one below.</p>
                )}
            </div>

            <div className="text-center mt-4">
                {/* Pagination Controls */}
                <div>
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="inline-flex gap-2 bg-gray-300 text-gray-600 py-2 px-4 rounded-full">
                        Previous
                    </button>
                    <span className="mx-4">Page {currentPage} of {totalPages}</span>
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="inline-flex gap-2 bg-gray-300 text-gray-600 py-2 px-4 rounded-full">
                        Next
                    </button>
                </div>
            </div>

            <div className="text-center mt-4">
                <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/projects/tasks/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>
                    Add new task
                </Link>
            </div>
        </div>
    );
}
