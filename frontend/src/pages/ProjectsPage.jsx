import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProjectsPage() {
   const [projects, setProjects] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [projectsPerPage] = useState(4);

   useEffect(() => {
       fetchProjects();
   }, [currentPage]); 

   const fetchProjects = async () => {
       try {
           const response = await axios.get('v1/projects/get-projects', {
               params: {
                   page: currentPage,
                   limit: projectsPerPage
               }
           });
           console.log("Projects data:", response.data); // Log để kiểm tra data
           setProjects(response.data.projects);
       } catch (error) {
           console.error("Error fetching projects:", error);
       }
   };

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

   const indexOfLastProject = currentPage * projectsPerPage;
   const indexOfFirstProject = indexOfLastProject - projectsPerPage;
   const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
   const totalPages = Math.ceil(projects.length / projectsPerPage);

   const paginate = (pageNumber) => {
       if (pageNumber > 0 && pageNumber <= totalPages) {
           setCurrentPage(pageNumber);
       }
   };

   return (
       <div className="p-8 bg-blue-100 min-h-screen">
           <h1 className="text-3xl font-bold mb-8">Project</h1>
           
           <div className="grid grid-cols-2 gap-6">
               {currentProjects.length > 0 ? currentProjects.map(project => (
                   <Link key={project._id} to={`/projects/${project._id}/tasks`}>
                       <div className="bg-white p-6 rounded-lg border-t-2 border-gray-200">
                           <div className="flex justify-between items-start mb-4">
                               <h2 className="text-xl font-semibold">
                                   {project.project_id.name || "Untitled Project"}
                               </h2>
                               <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.project_id.status)}`}>
                                   {project.project_id.status}
                               </span>
                           </div>
                           
                           <p className="text-gray-600 mb-6">
                               {project.project_id.description || "Mô tả"}
                           </p>

                           <div className="flex items-center justify-between">
                               <div>
                                   <p className="text-red-500 mb-2">
                                       Deadline: {new Date(project.project_id.end_date).toLocaleDateString()}
                                   </p>
                                   <div className="flex -space-x-2">
                                       {/* Placeholder for team members avatars */}
                                       <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                                       <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                                       <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                                       <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                                           +2
                                       </span>
                                   </div>
                               </div>
                               <div className="flex items-center text-gray-500">
                                   <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                   </svg>
                                   14 issues
                               </div>
                           </div>
                       </div>
                   </Link>
               )) : (
                   <p>No projects found. Create a new one below.</p>
               )}
           </div>

           <div className="flex justify-center mt-8 gap-2">
               <button 
                   onClick={() => paginate(currentPage - 1)} 
                   disabled={currentPage === 1}
                   className="px-4 py-2 rounded bg-gray-100 text-gray-700 disabled:opacity-50"
               >
                   Previous
               </button>
               {[...Array(totalPages)].map((_, i) => (
                   <button
                       key={i + 1}
                       onClick={() => paginate(i + 1)}
                       className={`px-4 py-2 rounded ${
                           currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                       }`}
                   >
                       {i + 1}
                   </button>
               ))}
               <button 
                   onClick={() => paginate(currentPage + 1)} 
                   disabled={currentPage === totalPages}
                   className="px-4 py-2 rounded bg-gray-100 text-gray-700 disabled:opacity-50"
               >
                   Next
               </button>
           </div>

           <div className="text-center mt-8">
               <Link to="/projects/new" className="inline-flex items-center gap-2 px-6 py-2 bg-black text-white rounded-full">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                   </svg>
                   Add new project
               </Link>
           </div>
       </div>
   );
}