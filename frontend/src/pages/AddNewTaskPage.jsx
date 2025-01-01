import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddNewProjectPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'Pending',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('v1/task/create-task', formData).then(() => {
            console.log(formData);
            navigate('/');
        }).catch(error => {
            console.error("Error creating project:", error);
        });
    };

    return (
        <div className="max-w-full mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Add New Project</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Project Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Start Date</label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-gray-700 text-sm font-bold mb-2">End Date</label>
                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                            required
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div className="flex justify-center items-center">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Create Project
                    </button>
                </div>
            </form>
        </div>
    );
}
