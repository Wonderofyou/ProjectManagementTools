import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { FiArrowRight } from "react-icons/fi";
import axios from "axios";

export default function ReportsListPage() {
  //fetch project

  const [projects, setProjects] = useState([]);


  useEffect(() => {
    axios.get('v1/projects/get-projects').then(response => {
      setProjects(response.data.projects);
      // console.log("Projects data:", response.data);
    }).catch(error => {
      console.error("Error fetching projects:", error);
    });
  }, []);

  console.log(projects);

  console.log(projects);

  return (
    <div className="max-w-full px-12 py-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <HiOutlineDocumentReport className="text-blue-500" />
        Projects List
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {projects.map((project) => (
          <div
            key={project._id}
            className="p-8 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-1"
          >
            <h2 className="text-2xl font-semibold text-gray-800">
              {project.project_id.name}
            </h2>
            <p className="text-gray-600 mt-2">Description: {project.project_id.description}</p>

            <div className="mt-4">
              <p className="text-sm text-gray-500 p-2 p-2">Progress</p>
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
