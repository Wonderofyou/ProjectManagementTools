import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProjectsPage() {
    // Set up state for projects, pagination, and current page
    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage] = useState(4); // 2 projects per row, 2 rows per page (total 4)

    useEffect(() => {
        axios.get('v1/projects/get-projects').then(response => {
            setProjects(response.data.projects);
        }).catch(error => {
            console.error("Error fetching projects:", error);
        });
    }, []);



    // Pagination logic
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate the total number of pages
    const totalPages = Math.ceil(projects.length / projectsPerPage);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Projects</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
                {currentProjects.length > 0 ? currentProjects.map(project => (
                    console.log("project: ", project),
                    <Link key={project._id} to={`/projects/${project._id}/tasks`} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
                        <div className="w-full">
                            <h2 className="text-xl">{project.project_id.name}</h2>
                            <p className="text-sm mt-2">{project.project_id.description}</p>
                            <p className="text-sm text-gray-500 mt-1">Status: {project.project_id.status}</p>
                            <p className="text-sm text-gray-500 mt-1">Deadline: {project.project_id.end_date}</p>
                        </div>
                    </Link>

                )) : (
                    <p>No projects found. Create a new one below.</p>
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
                <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/projects/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>
                    Add new project
                </Link>
            </div>
        </div>
    );
}
