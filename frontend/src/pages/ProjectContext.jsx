import { createContext, useContext, useState } from "react";

// Tạo Context
const ProjectContext = createContext();

// Provider để bọc các thành phần
export function ProjectProvider({ children }) {
    const [projects, setProjects] = useState([]);

    const addProject = (newProject) => {
        setProjects((prevProjects) => [...prevProjects, newProject]);
    };

    return (
        <ProjectContext.Provider value={{ projects, addProject }}>
            {children}
        </ProjectContext.Provider>
    );
}

// Custom hook để sử dụng ProjectContext
export function useProjects() {
    return useContext(ProjectContext);
}
