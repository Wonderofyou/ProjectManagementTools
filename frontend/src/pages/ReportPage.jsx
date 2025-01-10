import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const ReportPage = () => {
  // Function to generate the PDF
  const generatePDF = () => {
    const reportElement = document.getElementById("report-content");

    html2canvas(reportElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190; // Image width in PDF
      const pageHeight = 285; // PDF page height
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("report.pdf");
    });
  };

  // State hooks for project and tasks
  const { projectId } = useParams();
  const [project, setProject] = useState({});
  const [tasks, setTasks] = useState([]);

  // Fetch project data by projectId
  useEffect(() => {
    if (projectId) {
      axios.get(`/v1/projects/get-project/${projectId}`)
        .then(response => {
          setProject(response.data.project);
        })
        .catch(error => {
          console.error("Error fetching project:", error);
        });
    }
  }, [projectId]);

  // Fetch tasks for the report by projectId
  useEffect(() => {
    if (projectId) {
      axios.get(`/v1/tasks/get-tasks-for-report/${projectId}`)
        .then(response => {
          setTasks(response.data.tasksAndMembers);
        })
        .catch(error => {
          console.error("Error fetching tasks:", error);
        });
    }
  }, [projectId]);

  // Format date to dd/mm/yyyy
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg p-6">
        {/* Button to generate PDF */}
        <div className="flex justify-end mb-4">
          <button
            onClick={generatePDF}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-colors"
          >
            Export PDF
          </button>
        </div>

        {/* Report Content */}
        <div id="report-content">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-lg font-medium">
                Owner: <span className="font-bold">{project?.project_id?.owner_id?.name}</span>
              </p>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-semibold text-gray-800">REPORT</h1>
              <p className="text-lg">
                {/* Displaying Due Date dynamically */}
                Due Date: <span className="font-bold">{formatDate(project?.project_id?.end_date)}</span>
              </p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full border-8 border-green-500 flex items-center justify-center text-2xl font-bold text-gray-800">
                {project?.project_id?.progress}%
              </div>
              <p className="mt-4 font-medium text-gray-700">Completed</p>
            </div>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Duration Hours
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Effort Hours
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Cost
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Story Points
              </button>
            </div>
          </div>

          {/* Team Progress Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Team Progress</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2 text-left">Teammate</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Task Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{item.assignee_id.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.task_id.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.task_id.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReportPage;
