import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ReportsListPage() {
  // Dữ liệu giả lập
  const fakeProjects = [
    { id: "1", name: "Project A", description: "This is project A", progress: 72 },
    { id: "2", name: "Project B", description: "This is project B", progress: 45 },
    { id: "3", name: "Project C", description: "This is project C", progress: 90 },
    { id: "4", name: "Project D", description: "This is project D", progress: 55 },
  ];

  const [projects, setProjects] = useState([]);

  // Giả lập lấy dữ liệu khi component mount
  useEffect(() => {
    setTimeout(() => {
      setProjects(fakeProjects);
    }, 500); // Giả lập thời gian chờ khi gọi API
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8">Projects List</h1>
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition duration-300"
          >
            <h2 className="text-xl font-bold">{project.name}</h2>
            <p className="text-gray-600">Description: {project.description}</p>
            <p className="text-gray-600">Progress: {project.progress}%</p>
            <Link
              to={`/report/${project.id}`}
              className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              View Report
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
