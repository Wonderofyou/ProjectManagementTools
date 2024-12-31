import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProjects } from "./ProjectContext";

export default function ProjectPage() {
    const { projects } = useProjects();
    const navigate = useNavigate();

    const handleAddNewProject = () => {
        navigate("/account/projects/new"); // Chuyển hướng sang form thêm mới
    };

    return (
        <div>
            <h1>Project Management</h1>
            <div className="mt-4">
                {projects.length > 0 &&
                    projects.map((project) => (
                        <Link
                            key={project._id}
                            to={"/account/projects/" + project._id}
                            className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl"
                        >
                            <div className="grow-0 shrink">
                                <h2 className="text-xl">{project.name}</h2>
                                <p className="text-sm mt-2">{project.description}</p>
                            </div>
                        </Link>
                    ))}
                <div className="text-center mt-4">
                    <button
                        className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
                        onClick={handleAddNewProject}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Add New Project
                    </button>
                </div>
            </div>
        </div>
    );
}
