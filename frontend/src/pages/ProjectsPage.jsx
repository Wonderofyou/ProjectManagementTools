import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProjectsPage() {
   const [projects, setProjects] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [projectsPerPage] = useState(6);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [projectToDelete, setProjectToDelete] = useState(null);

   useEffect(() => {
       axios.get('v1/projects/get-projects').then(response => {
           setProjects(response.data.projects);
           console.log("Projects data:", response.data);
       }).catch(error => {
           console.error("Error fetching projects:", error);
       });
   }, []);

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

   const handleDeleteClick = (e, project) => {
       e.preventDefault();
       setProjectToDelete(project);
       setShowDeleteModal(true);
   };

   const handleConfirmDelete = () => {
       console.log("Deleting project:", projectToDelete);
       setShowDeleteModal(false);
       setProjectToDelete(null);
   };

   const indexOfLastProject = currentPage * projectsPerPage;
   const indexOfFirstProject = indexOfLastProject - projectsPerPage;
   const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
   const totalPages = Math.ceil(projects.length / projectsPerPage);

   return (
       <div className="p-8 bg-blue-50 min-h-screen relative">
           <h1 className="text-3xl font-bold mb-8">Project</h1>
           
           <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-w-7xl mx-auto">
               {currentProjects.length > 0 ? currentProjects.map(project => (
                   <Link key={project._id} to={`/projects/${project._id}/tasks`}>
                       <div className="bg-white p-6 rounded-xl shadow-sm h-full relative">
                           <div className="flex justify-between items-start mb-4 border-b pb-4">
                               <h2 className="text-xl font-semibold">{project.project_id.name}</h2>
                               <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(project.project_id.status)}`}>
                                   {project.project_id.status}
                               </span>
                           </div>

                           <p className="text-gray-600 mb-6">{project.project_id.description || "Mô tả"}</p>

                           <div className="flex justify-between items-center">
                               <div>
                                   <p className="text-red-500">
                                       Deadline: {new Date(project.project_id.end_date).toLocaleDateString()}
                                   </p>
                                   <div className="flex -space-x-2 mt-2">
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
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                           d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                   </svg>
                                   14 issues
                               </div>
                           </div>

                           {/* Delete button */}
                           <div className="absolute bottom-1 right-4">
                               <button 
                                   onClick={(e) => handleDeleteClick(e, project)}
                                   className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                               >
                                   <svg 
                                       xmlns="http://www.w3.org/2000/svg" 
                                       className="h-5 w-5" 
                                       fill="none" 
                                       viewBox="0 0 24 24" 
                                       stroke="currentColor"
                                   >
                                       <path 
                                           strokeLinecap="round" 
                                           strokeLinejoin="round" 
                                           strokeWidth={2} 
                                           d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                                       />
                                   </svg>
                               </button>
                           </div>
                       </div>
                   </Link>
               )) : (
                   <p className="col-span-2 text-center text-gray-500">No projects found. Create a new one below.</p>
               )}
           </div>

           <div className="flex justify-center mt-8 gap-2">
               <button 
                   onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} 
                   disabled={currentPage === 1}
                   className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
               >
                   Previous
               </button>
               {[...Array(totalPages)].map((_, idx) => (
                   <button
                       key={idx + 1}
                       onClick={() => setCurrentPage(idx + 1)}
                       className={`w-8 h-8 rounded-lg ${
                           currentPage === idx + 1 
                               ? 'bg-blue-600 text-white' 
                               : 'bg-gray-100 text-gray-600'
                       }`}
                   >
                       {idx + 1}
                   </button>
               ))}
               <button 
                   onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)} 
                   disabled={currentPage === totalPages}
                   className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
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

           {showDeleteModal && (
               <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                   <div className="bg-white rounded-lg p-6 w-96">
                       <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                       <p className="text-gray-600 mb-6">
                           Are you sure you want to delete this project? This action cannot be undone.
                       </p>
                       <div className="flex justify-end space-x-3">
                           <button
                               onClick={() => setShowDeleteModal(false)}
                               className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                           >
                               Cancel
                           </button>
                           <button
                               onClick={handleConfirmDelete}
                               className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                           >
                               Delete
                           </button>
                       </div>
                   </div>
               </div>
           )}
       </div>
   );
}