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
        const updatedFormData = { ...formData, [name]: value };

        if (name === 'start_date' || name === 'end_date') {
            const startDate = new Date(updatedFormData.start_date);
            const endDate = new Date(updatedFormData.end_date);

            // Kiểm tra lỗi: end_date phải lớn hơn hoặc bằng start_date
            if (startDate && endDate && endDate < startDate) {
                setError('End date must be greater than or equal to start date.');
            } else {
                setError(''); // Xóa lỗi nếu hợp lệ
            }
        }

        setFormData(updatedFormData);
    };

    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const startDate = new Date(formData.start_date);
        const endDate = new Date(formData.end_date);

        if (endDate < startDate) {
            return;
        }

        // Xử lý logic nếu không có lỗi
        const currentDate = new Date();
        const updatedStatus = startDate >= currentDate ? 'Pending' : 'In Progress';
        const updatedFormData = { ...formData, status: updatedStatus };

        axios.post('v1/projects/create-project', updatedFormData).then(() => {
            console.log(updatedFormData);
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
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
                    <input
                        type="text"
                        value={formData.start_date ? (new Date(formData.start_date) >= new Date() ? 'Pending' : 'In Progress') : ''}
                        className="shadow-md appearance-none border-2 border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 bg-gray-100"
                        readOnly
                    />
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
