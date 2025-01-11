import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function AddNewTaskPage() {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'In Progress', // Default value, can be changed by the user
        priority: 'Low',
        assigned_members: [], // Add assigned_members field
    });

    const [members, setMembers] = useState([]); // Store project members
    const [showAssignModal, setShowAssignModal] = useState(false);

    const [error1, setError1] = useState('');
    const [error2, setError2] = useState('');
    const [error3, setError3] = useState('');
    const [error4, setError4] = useState('');
    const [error5, setError5] = useState('');
    const [project, setProject] = useState(); // State để lưu thông tin project

    useEffect(() => {
        if (projectId) {
            axios.get(`/v1/tasks/get-members-in-project/${projectId}`)
                .then(response => {
                    setMembers(response.data.members);
                })
                .catch(error => {
                    console.error("Error fetching members in project:", error);
                });
        }
    }, [projectId]);

    useEffect(() => {
        axios.get(`/v1/tasks/get-project-info/${projectId}`)
            .then(response => {
                setProject(response.data.project);
            })
            .catch(error => {
                console.error("Error fetching project information:", error);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };

        if (name === 'start_date' || name === 'end_date') {
            const startDate = new Date(updatedFormData.start_date);
            const endDate = new Date(updatedFormData.end_date);

            // Kiểm tra lỗi: end_date phải lớn hơn hoặc bằng start_date
            if (startDate && endDate && endDate < startDate) {
                setError1('End date must be greater than or equal to start date.');
            } else {
                setError1('');
            }

            // Kiểm tra lỗi: start date của task phải lớn hơn hoặc bằng start_date của project
            if (startDate && endDate && startDate < new Date(project.start_date)) {
                setError2('Start date of task must be greater than or equal to start date of project.');
            } else {
                setError2('');
            }

            // Kiểm tra lỗi: end date của task phải bé hơn hoặc bằng end_date của project
            if (startDate && endDate && endDate > new Date(project.end_date)) {
                setError3('End date of task must be smaller than or equal to end date of project.');
            } else {
                setError3('');
            }

            // Kiểm tra lỗi: start date của task phải be hơn hoặc bằng end_date của project
            if (startDate && endDate && startDate > new Date(project.end_date)) {
                setError4('Start date of task must be smaller than or equal to end date of project.');
            } else {
                setError4('');
            }

            // Kiểm tra lỗi: end date của task phải lớn hơn hoặc bằng start_date của project
            if (startDate && endDate && endDate < new Date(project.start_date)) {
                setError5('End date of task must be greater than or equal to start date of project.');
            } else {
                setError5('');
            }
        }

        setFormData(updatedFormData);
    };

    const handleMemberToggle = (memberId) => {
        setFormData(prevFormData => {
            const isAssigned = prevFormData.assigned_members.includes(memberId);
            const updatedMembers = isAssigned
                ? prevFormData.assigned_members.filter(id => id !== memberId)
                : [...prevFormData.assigned_members, memberId];
            return { ...prevFormData, assigned_members: updatedMembers };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const startDate = new Date(formData.start_date);
        const endDate = new Date(formData.end_date);

        // Kiểm tra lỗi về ngày tháng
        if (endDate < startDate || startDate < project.start_date || endDate > project.end_date) {
            return;
        }

        // Xử lý logic nếu không có lỗi
        const updatedFormData = { ...formData };

        axios.post(`/v1/tasks/create-task/${projectId}`, updatedFormData)
            .then(() => {
                navigate(`/projects/${projectId}/tasks`);
            })
            .catch(error => {
                console.error("Error creating task:", error);
            });
    };

    return (
        <div className="max-w-full mx-auto mt-10 bg-gradient-to-r from-indigo-50 to-blue-100 py-10 px-4">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center bg-white py-4 rounded-lg shadow-xl">
                Add New Task
            </h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4 max-w-4xl mx-auto">
                <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                        <label className="block text-lg font-medium text-gray-800 mb-2">Task Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="shadow-md appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out hover:border-blue-500"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-lg font-medium text-gray-800 mb-2">Start Date</label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className="shadow-md appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out hover:border-blue-500"
                            required
                        />
                        {error2 && <p className="text-red-500 text-sm mt-1">{error2}</p>}
                        {error4 && <p className="text-red-500 text-sm mt-1">{error4}</p>}
                        {/* Display project start date */}
                        {project && <p className="text-sm text-blue-600 mt-1">Project Start Date: {new Date(project.start_date).toLocaleDateString()}</p>}
                    </div>
                    <div className="flex-1">
                        <label className="block text-lg font-medium text-gray-800 mb-2">End Date</label>
                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            className="shadow-md appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out hover:border-blue-500"
                            required
                        />
                        {error1 && <p className="text-red-500 text-sm mt-1">{error1}</p>}
                        {error3 && <p className="text-red-500 text-sm mt-1">{error3}</p>}
                        {error5 && <p className="text-red-500 text-sm mt-1">{error5}</p>}
                        {/* Display project end date */}
                        {project && <p className="text-sm text-blue-600 mt-1">Project End Date: {new Date(project.end_date).toLocaleDateString()}</p>}
                    </div>
                </div>
                <hr className="border-gray-300 mb-6" />
                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-800 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="shadow-md appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out hover:border-blue-500"
                        required
                    />
                </div>
                <hr className="border-gray-300 mb-6" />
                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-800 mb-2">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="shadow-md appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out hover:border-blue-500"
                    >
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>

                <hr className="border-gray-300 mb-6" />
                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-800 mb-2">Priority</label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="shadow-md appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out hover:border-blue-500"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <hr className="border-gray-300 mb-6" />
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={() => setShowAssignModal(true)}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                    >
                        Assign Members
                    </button>
                </div>
                <div className="flex justify-center items-center">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                    >
                        Create Task
                    </button>
                </div>
            </form>

            {showAssignModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-1/3 transform transition-all duration-500 ease-in-out scale-100 hover:scale-105">
                        <h2 className="text-xl font-bold mb-4">Assign Members</h2>
                        <ul>
                            {members.map(member => (
                                <li key={member.user_id._id} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        id={`member-${member.user_id._id}`}
                                        checked={formData.assigned_members.includes(member.user_id._id)}
                                        onChange={() => handleMemberToggle(member.user_id._id)}
                                    />
                                    <label htmlFor={`member-${member.user_id._id}`} className="ml-2">
                                        {member.user_id.name}
                                    </label>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
