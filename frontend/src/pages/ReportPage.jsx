import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const ReportPage = () => {
  const generatePDF = () => {
    const reportElement = document.getElementById("report-content");

    html2canvas(reportElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190; // Chiều rộng ảnh trong PDF
      const pageHeight = 285; // Chiều cao trang PDF
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("report.pdf");
    });
  };
  //usestate owner, product
  const { projectId } = useParams();
  const [project, setProject] = useState({});
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (projectId) {
      axios.get(`/v1/projects/get-project/${projectId}`)
        .then(response => {
          setProject(response.data.project);
        })
        .catch(error => {
          console.error("Error fetching tasks:", error);
        });
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      axios.get(`/v1/tasks/get-tasks-for-report/${projectId}`)
        .then(response => {
          setTasks(response.data.tasksAndMembers);
          console.log(response.data.tasksAndMembers);
        })
        .catch(error => {
          console.error("Error fetching tasks:", error);
        });
    }
  }, [projectId]);
  // console.log(tasks)

  return (
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 rounded-lg shadow-lg">
      {/* Nút tạo PDF */}
      <div className="flex justify-end mb-4">
        <button
          onClick={generatePDF}
          className="px-4 py-2 bg-green-600 text-white rounded-lg shadow"
        >
          Tạo PDF
        </button>
      </div>

      {/* Nội dung báo cáo */}
      <div id="report-content">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-lg font-medium">
              Owner: <span className="font-bold">{project?.project_id?.owner_id?.name}</span>
            </p>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold">REPORT</h1>
            <p className="text-lg">
              {/* add date here */}
              Due Date: <span className="font-bold">{ }</span>
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-8 border-green-500 flex items-center justify-center text-2xl font-bold">
              {project?.project_id?.progress}
            </div>
            <p className="mt-4 font-medium">Completed</p>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Duration Hours
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Effort Hours
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Cost
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
              Story Points
            </button>
          </div>
        </div>

        {/* Team Progress */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Team Progress</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Teammate</th>
                <th className="border border-gray-300 px-4 py-2">Task Name</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {item.assignee_id.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {item.task_id.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {item.task_id.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


      </div>
    </div>
  );
};

export default ReportPage;


