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
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteMessage, setInviteMessage] = useState("");
    const [isInviting, setIsInviting] = useState(false);
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [role, setRole] = useState("member");
    const [showNotification, setShowNotification] = useState(false);
    const [NotificationMessage, setNotificationMessage] = useState("");

    useEffect(() => {
        axios.get('v1/projects/get-projects').then(response => {
            setProjects(response.data.projects);
        }).catch(error => {
            console.error("Error fetching projects:", error);
        });
    }, []);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-500 text-white';
            case 'in progress':
                return 'bg-blue-500 text-white';
            case 'pending':
            default:
                return 'bg-gray-500 text-white';
        }
    };



    const handleInviteMessageChange = (e) => {
        setInviteMessage(e.target.value);
    };

    const handleConfirmDelete = async () => {
        if (!selectedProject) return;

        try {
            await axios.delete(`v1/projects/delete-project/${selectedProject._id}`);
            setProjects(projects.filter(project => project.project_id._id !== selectedProject._id));
            setNotificationMessage("Project deleted successfully.");
            setShowNotification(true);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
            setNotificationMessage(errorMessage);
            setShowNotification(true);
        } finally {
            setShowDeleteModal(false);
            setSelectedProject(null);
            setTimeout(() => setShowNotification(false), 5000); // Hide notification after 5 seconds
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
        setIsInviting(true);
        try {
            await axios.post('v1/user/invite', {
                projectId: selectedProject._id,
                email: inviteEmail,
                content: inviteMessage,
                role: role,
            });
            setNotificationMessage("Invite sent successfully");
            setShowNotification(true);
            setInviteEmail("");
            setInviteMessage("");
            setShowInviteForm(false);
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
            setNotificationMessage(errorMessage);
            setShowNotification(true);
        } finally {
            setIsInviting(false);
            setTimeout(() => setShowNotification(false), 5000); // Hide notification after 5 seconds
        }
    };

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(projects.length / projectsPerPage);

    return (
        <div className="p-8 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 min-h-screen">
            <h1 className="text-4xl font-semibold text-gray-800 mb-8">Projects</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {currentProjects.length > 0 ? currentProjects.map(project => (
                    <div key={project.project_id._id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
                        <div className="flex justify-between items-center mb-4 border-b pb-4">
                            <h2 className="text-xl font-semibold text-gray-800">{project.project_id.name}</h2>
                            <span className={`${getStatusColor(project.project_id.status)} px-4 py-1 rounded-full text-sm`}>
                                {project.project_id.status}
                            </span>
                        </div>

                        <p className="text-gray-600 mb-4">{project.project_id.description || "No description"}</p>

                        <div className="text-sm text-gray-500">Progress: {project.project_id.progress}%</div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${project.project_id.progress || 0}%` }}></div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-red-500">
                                    Deadline: {new Date(project.project_id.end_date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>




                        <div className="flex justify-between items-center mt-4">
                            <Link
                                to={`/projects/${project.project_id._id}/tasks`} // Link to the Task page of the selected project
                                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                            </Link>
                            <button
                                onClick={(e) => handleInviteClick(e, project.project_id)}
                                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13l4-4m0 0l-4-4m4 4H7" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => handleDeleteClick(e, project.project_id)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )) : (
                    <p className="col-span-2 text-center text-gray-500">No projects found. Create a new one below.</p>
                )}
            </div>

            {/* Pagination */}
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

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this project?</h3>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Invite Form */}
            {showInviteForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">Invite a member</h3>
                        <form onSubmit={handleInviteSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Message</label>
                                <textarea
                                    value={inviteMessage}
                                    onChange={handleInviteMessageChange}
                                    className="w-full p-2 border rounded-md"
                                    rows="4"
                                ></textarea>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowInviteForm(false)}
                                    className="px-4 py-2 bg-gray-300 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isInviting}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                                >
                                    {isInviting ? 'Inviting...' : 'Send Invite'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Notification */}
            {showNotification && (
                <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 p-4 bg-green-500 text-white rounded-lg">
                    <p>{NotificationMessage}</p>
                </div>
            )}
        </div>
    );
}
