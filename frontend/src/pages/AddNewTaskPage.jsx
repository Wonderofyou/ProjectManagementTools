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
        status: 'Pending',
        priority: 'Low',
        assigned_members: [], // Add assigned_members field
    });

    const [members, setMembers] = useState([]); // Store project members
    const [showAssignModal, setShowAssignModal] = useState(false);

    useEffect(() => {
        if (projectId) {
            axios.get(`/v1/tasks/get-members-in-project/${projectId}`)
                .then(response => {
                    setMembers(response.data.members);
                    console.log(response.data.members);
                })
                .catch(error => {
                    console.error("Error fetching members in project:", error);
                });
        }
    }, [projectId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
        axios.post(`/v1/tasks/create-task/${projectId}`, formData)
            .then(() => {
                navigate(`/projects/${projectId}/tasks`);
            })
            .catch(error => {
                console.error("Error creating task:", error);
            });
    };

    return (
        <div className="max-w-full mx-auto mt-10 bg-blue-100 py-10">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center bg-blue-100 py-4 rounded-md shadow-md">
                Add New Task
            </h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 max-w-4xl mx-auto">
                <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                        <label className="block text-lg font-medium text-gray-800 mb-2">Task Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="shadow-md appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="shadow-md appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-lg font-medium text-gray-800 mb-2">End Date</label>
                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            className="shadow-md appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>
                <hr className="border-gray-300 mb-6" />
                <div className="mb-6">
                    <label className="block text-lg font-medium text-gray-800 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="shadow-md appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="shadow-md appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Pending">Pending</option>
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
                        className="shadow-md appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
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
