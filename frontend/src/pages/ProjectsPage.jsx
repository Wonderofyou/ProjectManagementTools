import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage] = useState(6);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [inviteEmail, setInviteEmail] = useState("");  // New state for invite email
    const [inviteMessage, setInviteMessage] = useState("");  // Message for the invite
    const [isInviting, setIsInviting] = useState(false);  // Loading state for the invite button
    const [showInviteForm, setShowInviteForm] = useState(false); // New state for showing invite form
    const [role, setRole] = useState("member");  // Khởi tạo state cho role, mặc định là 'member'
    const [showNotification, setShowNotification] = useState(false);
    const [NotificationMessage, setNotificationMessage] = useState("");

    useEffect(() => {
        axios.get('v1/projects/get-projects').then(response => {
            setProjects(response.data.projects);
            // console.log("Projects data:", response.data);
        }).catch(error => {
            console.error("Error fetching projects:", error);
        });
    }, []);

    useEffect(() => {
        // Kiểm tra khi selectedProject thay đổi
        if (selectedProject) {
            console.log("Selected project has changed:", selectedProject);
        }
    }, [selectedProject]);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-600';
            case 'in progress':
                return 'bg-blue-100 text-blue-600';
            case 'pending':
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };



    const handleInviteMessageChange = (e) => {
        setInviteMessage(e.target.value);  // Update invite message
    };

    const handleConfirmDelete = async () => {
        if (!selectedProject) return; // Kiểm tra nếu không có project để xóa

        try {
            console.log(selectedProject);
            // Gọi API xóa project
            await axios.delete(`v1/projects/delete-project/${selectedProject._id}`);

            // Xóa project khỏi danh sách
            setProjects(projects.filter(project => project.project_id._id !== selectedProject._id));

            setNotificationMessage("Project deleted successfully.");
            setShowNotification(true);
            console.log(NotificationMessage);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
            setNotificationMessage(errorMessage);
            setShowNotification(true);
        } finally {
            // Đóng modal xóa sau khi hoàn thành
            setShowDeleteModal(false);
            setSelectedProject(null);
        }
    };

    const handleInviteClick = (e, project) => {
        e.preventDefault();
        setSelectedProject(project);  // Lưu toàn bộ object project thay vì chỉ projectId
        setShowInviteForm(true);  // Hiển thị form invite
        console.log("Selected project:", selectedProject);
    };

    const handleDeleteClick = (e, project) => {
        e.preventDefault();
        setSelectedProject(project);
        setShowDeleteModal(true);
        // console.log("Selected delete project:", selectedProject);
    };


    const handleInviteSubmit = async (e) => {
        e.preventDefault();
        setIsInviting(true);  // Set trạng thái loading
        try {
            console.log(selectedProject);
            console.log(inviteEmail, inviteMessage, role);

            await axios.post('v1/user/invite', {
                projectId: selectedProject._id,
                email: inviteEmail,
                content: inviteMessage,
                role: role,
            });
            setNotificationMessage("Invite sent successfully");
            setShowNotification(true);
            setInviteEmail("");  // Xóa dữ liệu input sau khi gửi
            setInviteMessage("");
            setShowInviteForm(false);  // Ẩn form sau khi gửi mời
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
            setNotificationMessage(errorMessage);
            setShowNotification(true);
            console.log(NotificationMessage);
            console.error("Error sending invite:", error);
        } finally {
            setIsInviting(false);  // Tắt trạng thái loading
        }
    };





    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(projects.length / projectsPerPage);
    return (
        <div className="p-8 bg-blue-50 min-h-screen relative">
            <h1 className="text-3xl font-bold mb-8">Project</h1>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-w-7xl mx-auto">
                {currentProjects.length > 0 ? currentProjects.map(project => (
                    <Link key={project.project_id._id} to={`/projects/${project.project_id._id}/tasks`}>
                        <div className="bg-white p-6 rounded-xl shadow-sm h-full relative">
                            <div className="flex justify-between items-start mb-4 border-b pb-4">
                                <h2 className="text-xl font-semibold">{project.project_id.name}</h2>
                                <span className={`px-4 py-1 rounded-full text-sm ${getStatusColor(project.project_id.status)}`}>
                                    {project.project_id.status}
                                </span>
                            </div>

                            <p className="text-gray-600 mb-6">{project.project_id.description || "Mô tả"}</p>

                            {/* Hiển thị progress */}
                            <div className="mb-4">
                                <p className="text-gray-600">Progress: {project.project_id.progress}%</p>
                                {/* Optional: bạn có thể thêm một thanh tiến độ */}
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-500 h-2.5 rounded-full"
                                        style={{ width: `${project.project_id.progress || 0}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-red-500">
                                        Deadline: {new Date(project.project_id.end_date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>




                            {/* Invite button */}
                            <div className="absolute bottom-1 right-14 ">
                                <button
                                    onClick={(e) => handleInviteClick(e, project.project_id)}  // Invite button click event
                                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M3 3h18a1 1 0 011 1v16a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zM12 13l4-4m0 0l-4-4m4 4H7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Delete button */}
                            <div className="absolute bottom-1 right-4">
                                <button
                                    onClick={(e) => handleDeleteClick(e, project.project_id)}
                                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
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
                        </div>
                    </Link>
                )) : (
                    <p className="col-span-2 text-center text-gray-500">No projects found. Create a new one below.</p>
                )}
            </div>
            {/* Display Invite Form if showInviteForm is true */}
            {showInviteForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">Invite Member</h3>
                        <form onSubmit={(e) => handleInviteSubmit(e, selectedProject._id)}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea
                                    id="message"
                                    value={inviteMessage}
                                    onChange={handleInviteMessageChange}
                                    rows="3"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                />
                                {inviteMessage.trim() === "" && (
                                    <p className="text-red-500 text-xs mt-1">Message is required</p>
                                )}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="member">Member</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowInviteForm(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel

                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    disabled={isInviting || inviteMessage.trim() === ""}
                                >
                                    {isInviting ? 'Inviting...' : 'Send Invite'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showNotification && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-80 h-40 relative">
                        <h3 className="text-lg font-semibold mb-4">{NotificationMessage}</h3>
                        {/* Nút Cancel nằm ở góc phải dưới */}
                        <div className="absolute bottom-4 right-4">
                            <button
                                type="button"
                                onClick={() => setShowNotification(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <div className="flex justify-center mt-8 gap-2">
                <button
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
                >
                    Previous
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                    <button
                        key={idx + 1}
                        onClick={() => setCurrentPage(idx + 1)}
                        className={`w-8 h-8 rounded-lg ${currentPage === idx + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        {idx + 1}
                    </button>
                ))}
                <button
                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
                >
                    Next
                </button>
            </div>

            <div className="text-center mt-8">
                <Link
                    to="/projects/new"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add new project
                </Link>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this project? This action cannot be undone.
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
        </div>
    );
}