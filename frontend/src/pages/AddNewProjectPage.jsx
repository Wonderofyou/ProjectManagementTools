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
        axios.post('v1/projects/create-project', formData).then(() => {
            console.log(formData);
            navigate('/projects');
        }).catch(error => {
            console.error("Error creating project:", error);
        });
    };

    return (
        <div className="max-w-full mx-auto mt-10 bg-blue-100 py-10">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center bg-white- py-4 rounded-md shadow-md">
                Add New Project
            </h1>
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 max-w-4xl mx-auto">
                <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                        <label className="block text-lg font-medium text-gray-800 mb-2">Project Name</label>
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
                <div className="flex justify-center items-center">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                    >
                        Create Project
                    </button>
                </div>
            </form>
        </div>
    );
}
