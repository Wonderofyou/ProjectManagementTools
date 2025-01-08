import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
              Owner: <span className="font-bold">John Doe</span>
            </p>
            <p className="text-lg font-medium">
              Driver: <span className="font-bold">James Charles</span>
            </p>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold">REPORT</h1>
            <p className="text-lg">
              Due Date: <span className="font-bold">12 Dec 2023</span>
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-8 border-green-500 flex items-center justify-center text-2xl font-bold">
              72%
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
                <th className="border border-gray-300 px-4 py-2">Task</th>
                <th className="border border-gray-300 px-4 py-2">Progress %</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  Teammate 1
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  12
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  28.6%
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  Teammate 2
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  22
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  42.9%
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  Teammate 3
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  12
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  28.6%
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  Teammate 4
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  12
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  28.6%
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  Teammate 5
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  7
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  14.3%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Commit Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Last Commit</h2>
          <div className="mb-4 p-4 bg-white rounded-lg shadow">
            <h3 className="font-bold">Last commit of worst member</h3>
            <p className="text-gray-600">Teammate 1 | 12 Aug 2023</p>
            <p>
              "I think this looks good we can go with his one for the hero
              section..."
            </p>
          </div>
          <div className="mb-4 p-4 bg-white rounded-lg shadow">
            <h3 className="font-bold">Last commit of best member</h3>
            <p className="text-gray-600">Teammate 1 | 12 Aug 2023</p>
            <p>
              "I think this looks good we can go with his one for the hero
              section..."
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg shadow">
            <h3 className="font-bold">AI Suggestion</h3>
            <p>"Your template is the best, keep continue"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
