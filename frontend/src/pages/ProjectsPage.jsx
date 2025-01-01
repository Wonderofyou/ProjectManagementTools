import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);

    // Fetch projects from API
    useEffect(() => {
        axios.get('v1/projects/projects').then(response => {
            setProjects(response.data);
        });
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Projects</h1>
            <div className="mt-4">
                {projects.length > 0 ? projects.map(project => (
                    <Link key={project._id} to={'/account/projects/' + project._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
                        <div>
                            <h2 className="text-xl">{project.name}</h2>
                            <p className="text-sm mt-2">{project.description}</p>
                            <p className="text-sm text-gray-500 mt-1">Status: {project.status}</p>
                        </div>
                    </Link>
                )) : (
                    <p>No projects found. Create a new one below.</p>
                )}
                <div className="text-center mt-4">
                    <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/projects/new'}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                        </svg>
                        Add new project
                    </Link>
                </div>
            </div>
        </div>
    );
}
