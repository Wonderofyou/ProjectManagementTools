import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FiArrowRight } from "react-icons/fi";
import axios from "axios";

export default function ReportsListPage() {
  // Fetch projects
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios
      .get('v1/projects/get-projects')
      .then((response) => {
        setProjects(response.data.projects);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 p-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <HiOutlineDocumentReport className="text-blue-500" />
          Projects List
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project._id}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {project.project_id.name}
              </h2>
              <p className="text-gray-600 mt-2">Description: {project.project_id.description}</p>

              <div className="mt-4">
                <p className="text-sm text-gray-500">Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full transition-all"
                    style={{ width: `${project.project_id.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {project.project_id.progress}% completed
                </p>
              </div>

              <Link
                to={`/report/${project.project_id._id}`}
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Report <FiArrowRight className="ml-2" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
