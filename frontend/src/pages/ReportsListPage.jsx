import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FiArrowRight } from "react-icons/fi";

export default function ReportsListPage() {
  // Fake data
  const fakeProjects = [
    { id: "1", name: "Project A", description: "This is project A", progress: 72 },
    { id: "2", name: "Project B", description: "This is project B", progress: 45 },
    { id: "3", name: "Project C", description: "This is project C", progress: 90 },
    { id: "4", name: "Project D", description: "This is project D", progress: 55 },
  ];

  const [projects, setProjects] = useState([]);

  // Simulate data fetching
  useEffect(() => {
    setTimeout(() => {
      setProjects(fakeProjects);
    }, 500);
  }, []);

  return (
    <div className="max-w-full px-12 py-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <HiOutlineDocumentReport className="text-blue-500" />
        Projects List
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {projects.map((project) => (
          <div
            key={project.id}
            className="p-8 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1"
          >
            <h2 className="text-2xl font-semibold text-gray-800">{project.name}</h2>
            <p className="text-gray-600 mt-2">Description: {project.description}</p>

            <div className="mt-4">
              <p className="text-sm text-gray-500">Progress</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`bg-blue-500 h-2.5 rounded-full transition-all`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{project.progress}% completed</p>
            </div>

            <Link
              to={`/report/${project.id}`}
              className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              View Report <FiArrowRight className="ml-2" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
