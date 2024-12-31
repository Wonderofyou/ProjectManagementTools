import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "./ProjectContext";

export default function AddNewProjectPage() {
    const { addProject } = useProjects(); // Lấy hàm thêm dự án từ context
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        status: "Pending",
        team: [],
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call API to save the project
        console.log("Submitted Data: ", formData);
        navigate("/account/projects");
    };

    return (
        <div className="max-w-4xl mx-auto mt-6 p-4 bg-gray-50 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2">Project Title</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-2">Project Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        rows="3"
                        required
                    />
                </div>
                <div className="flex gap-4">
                    <div>
                        <label className="block mb-2">Start Date</label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2">End Date</label>
                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block mb-2">Team Members</label>
                    <select
                        name="team"
                        value={formData.team}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                team: [...formData.team, e.target.value],
                            })
                        }
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select Role</option>
                        <option value="Hieu">Hieu (Team Lead)</option>
                        <option value="Manh">Manh (Frontend)</option>
                        <option value="Lam">Lam (Backend)</option>
                        <option value="Loi">Loi (PM)</option>
                    </select>
                </div>
                <div className="text-right">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-6 rounded"
                    >
                        Create
                    </button>
                </div>
            </form>
        </div>
    );
}
