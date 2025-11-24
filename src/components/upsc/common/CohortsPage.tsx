import React from 'react';

interface CohortsPageProps {
  onCancel: () => void;
}

import { useState } from "react";
import { Pencil, MoreVertical, Upload, FileText, ChevronDown } from "lucide-react";

const sampleSystemCohorts = [
  { name: "Grade 9 - A", id: "G9A", description: "Grade 9, Section A", size: 32, source: "Created manually" },
  { name: "Grade 9 - B", id: "G9B", description: "Grade 9, Section B", size: 30, source: "Created manually" },
  { name: "Grade 10 - A", id: "G10A", description: "Grade 10, Section A", size: 29, source: "Profile field based" },
  { name: "Grade 10 - B", id: "G10B", description: "Grade 10, Section B", size: 28, source: "Profile field based" },
  { name: "Batch 2025", id: "B2025", description: "Graduating batch of 2025", size: 120, source: "Created manually" },
  { name: "Batch 2026", id: "B2026", description: "Graduating batch of 2026", size: 112, source: "Created manually" },
  { name: "Science Stream", id: "SCI-2025", description: "Science stream cohort 2025", size: 46, source: "Profile field based" },
  { name: "Commerce Stream", id: "COM-2025", description: "Commerce stream cohort 2025", size: 38, source: "Profile field based" },
  { name: "Mathematics Club", id: "MATHCLUB", description: "Math club members", size: 18, source: "Created manually" },
  { name: "Debate Team", id: "DEBATE", description: "Debate team cohort", size: 12, source: "Created manually" },
  { name: "Alumni 2022", id: "ALUM22", description: "Alumni batch of 2022", size: 94, source: "Profile field based" },
  { name: "Alumni 2023", id: "ALUM23", description: "Alumni batch of 2023", size: 101, source: "Profile field based" },
];

const sampleAllCohorts = [
  { category: "OQC - Female", name: "Amena Sabreen-L1", id: "OQC-F-1", description: "OQC Female Level 1", size: 1, source: "Profile field based cohort membership" },
  { category: "OQC - Male", name: "Abdul Waheed-L1", id: "OQC-M-1", description: "OQC Male Level 1", size: 3, source: "Profile field based cohort membership" },
  { category: "OQC - Female", name: "Sara Khan-L2", id: "OQC-F-2", description: "OQC Female Level 2", size: 0, source: "Profile field based cohort membership" },
  { category: "OQC - Female", name: "Fatima Noor-L3", id: "OQC-F-3", description: "OQC Female Level 3", size: 2, source: "Profile field based cohort membership" },
  { category: "OQC - Male", name: "Imran Siddiq-L2", id: "OQC-M-2", description: "OQC Male Level 2", size: 1, source: "Profile field based cohort membership" },
  { category: "OQC - Male", name: "Bilal Ahmed-L3", id: "OQC-M-3", description: "OQC Male Level 3", size: 2, source: "Profile field based cohort membership" },
  { category: "Science Stream", name: "Physics Enthusiasts", id: "SCI-PHY", description: "Physics lovers group", size: 7, source: "Profile field based cohort membership" },
  { category: "Science Stream", name: "Chemistry Champs", id: "SCI-CHEM", description: "Chemistry group", size: 5, source: "Profile field based cohort membership" },
  { category: "Commerce Stream", name: "Accountancy Group", id: "COM-ACC", description: "Accountancy students", size: 8, source: "Profile field based cohort membership" },
  { category: "Mathematics Club", name: "Senior Math Circle", id: "MATH-SENIOR", description: "Senior math club", size: 6, source: "Profile field based cohort membership" },
  { category: "Mathematics Club", name: "Junior Math Circle", id: "MATH-JUNIOR", description: "Junior math club", size: 4, source: "Profile field based cohort membership" },
  { category: "Debate Team", name: "Varsity Debaters", id: "DEB-VARSITY", description: "Varsity debate team", size: 3, source: "Profile field based cohort membership" },
  { category: "Debate Team", name: "Junior Debaters", id: "DEB-JUNIOR", description: "Junior debate team", size: 2, source: "Profile field based cohort membership" },
  { category: "Alumni", name: "Alumni 2022", id: "ALUM22", description: "Alumni batch of 2022", size: 94, source: "Profile field based cohort membership" },
  { category: "Alumni", name: "Alumni 2023", id: "ALUM23", description: "Alumni batch of 2023", size: 101, source: "Profile field based cohort membership" },
];

const tabList = [
  { key: "system", label: "System cohorts" },
  { key: "all", label: "All cohorts" },
  { key: "add", label: "Add new cohort" },
  { key: "upload", label: "Upload cohorts" },
];

const CohortsPage: React.FC<CohortsPageProps> = ({ onCancel }) => {
  const [activeTab, setActiveTab] = useState("system");
  const [systemSearch, setSystemSearch] = useState("");
  const [allSearch, setAllSearch] = useState("");
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [systemCohorts, setSystemCohorts] = useState(sampleSystemCohorts);
  const [allCohorts] = useState(sampleAllCohorts);
  const [addForm, setAddForm] = useState({
    name: "",
    context: "System",
    cohortId: "",
    visible: true,
    description: "",
  });
  const [uploadSectionOpen, setUploadSectionOpen] = useState(true);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [csvDelimiter, setCsvDelimiter] = useState(",");
  const [encoding, setEncoding] = useState("UTF-8");
  const [defaultContext, setDefaultContext] = useState("System");
  const [page, setPage] = useState(1);

  // Tab Content Renderers
  function renderSystemCohorts() {
    return (
      <div>
        {/* Search bar */}
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search cohorts"
            value={systemSearch}
            onChange={e => setSystemSearch(e.target.value)}
            className="border border-gray-300 rounded-l px-3 py-2 w-64 focus:outline-none"
          />
          <button className="bg-gray-200 text-gray-600 px-4 py-2 rounded-r">Search</button>
        </div>
        {/* Data Table */}
        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Cohort ID</th>
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-left">Cohort size</th>
                <th className="py-2 px-4 text-left">Source</th>
                <th className="py-2 px-4 text-left">Edit</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {systemCohorts.filter(row =>
                row.name.toLowerCase().includes(systemSearch.toLowerCase()) ||
                row.id.toLowerCase().includes(systemSearch.toLowerCase())
              ).map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">
                    {editingRow === idx ? (
                      <input className="border rounded px-2 py-1 w-32" value={row.name} readOnly />
                    ) : (
                      row.name
                    )}
                  </td>
                  <td className="py-2 px-4">{row.id}</td>
                  <td className="py-2 px-4">{row.description}</td>
                  <td className="py-2 px-4">{row.size}</td>
                  <td className="py-2 px-4">{row.source}</td>
                  <td className="py-2 px-4">
                    <button onClick={() => setEditingRow(idx)} className="text-blue-600 hover:text-blue-800">
                      <Pencil size={18} />
                    </button>
                  </td>
                  <td className="py-2 px-4 text-right">
                    <button className="text-gray-600 hover:text-gray-900">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderAllCohorts() {
    return (
      <div>
        {/* Search bar */}
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search cohorts"
            value={allSearch}
            onChange={e => setAllSearch(e.target.value)}
            className="border border-gray-300 rounded-l px-3 py-2 w-64 focus:outline-none"
          />
          <button className="bg-gray-200 text-gray-600 px-4 py-2 rounded-r">Search</button>
        </div>
        {/* Data Table */}
        <div className="overflow-x-auto rounded shadow mb-4">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Cohort ID</th>
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-left">Cohort size</th>
                <th className="py-2 px-4 text-left">Source</th>
                <th className="py-2 px-4 text-left">Edit</th>
              </tr>
            </thead>
            <tbody>
              {allCohorts.filter(row =>
                row.name.toLowerCase().includes(allSearch.toLowerCase()) ||
                row.category.toLowerCase().includes(allSearch.toLowerCase())
              ).map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{row.category}</td>
                  <td className="py-2 px-4">{row.name}</td>
                  <td className="py-2 px-4">{row.id}</td>
                  <td className="py-2 px-4">{row.description}</td>
                  <td className="py-2 px-4">{row.size}</td>
                  <td className="py-2 px-4">{row.source}</td>
                  <td className="py-2 px-4">
                    <button className="text-blue-600 hover:text-blue-800">
                      <Pencil size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <button
                key={num}
                className={`px-3 py-1 rounded ${page === num ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                onClick={() => setPage(num)}
              >
                {num}
              </button>
            ))}
          </div>
          <button className="ml-2 px-3 py-1 bg-gray-200 text-gray-700 rounded">Next</button>
        </div>
      </div>
    );
  }

  function renderAddCohort() {
    return (
      <form className="max-w-2xl mx-auto bg-white rounded shadow p-6 mt-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none"
            value={addForm.name}
            onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Context</label>
          <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs mr-2">System</span>
          <select className="border border-gray-300 rounded px-3 py-2 w-full mt-2">
            <option>System</option>
            <option>Other context</option>
          </select>
        </div>
        <div className="mb-4 flex items-center">
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">Cohort ID</label>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none"
              value={addForm.cohortId}
              onChange={e => setAddForm(f => ({ ...f, cohortId: e.target.value }))}
            />
          </div>
          <div className="flex items-center ml-4 mt-6">
            <input
              type="checkbox"
              checked={addForm.visible}
              onChange={e => setAddForm(f => ({ ...f, visible: e.target.checked }))}
              className="mr-2"
            />
            <span className="text-blue-600 font-medium">Visible</span>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <div className="border border-gray-300 rounded mb-2">
            {/* Simulated rich text toolbar */}
            <div className="flex items-center space-x-2 px-2 py-1 bg-gray-100 border-b">
              <button type="button" className="text-gray-600 hover:text-blue-600"><b>B</b></button>
              <button type="button" className="text-gray-600 hover:text-blue-600"><i>I</i></button>
              <button type="button" className="text-gray-600 hover:text-blue-600">U</button>
              <button type="button" className="text-gray-600 hover:text-blue-600">•</button>
              <button type="button" className="text-gray-600 hover:text-blue-600">1.</button>
              <button type="button" className="text-gray-600 hover:text-blue-600">A</button>
              <button type="button" className="text-gray-600 hover:text-blue-600">Link</button>
              <button type="button" className="text-gray-600 hover:text-blue-600">Img</button>
            </div>
            <textarea
              className="w-full h-32 px-3 py-2 border-none rounded-b focus:outline-none"
              value={addForm.description}
              onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Enter cohort description..."
            />
          </div>
        </div>
        <div className="flex space-x-2 mt-4">
          <button type="submit" className="bg-gray-200 text-gray-700 px-4 py-2 rounded">Save changes</button>
          <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded">Cancel</button>
        </div>
        <div className="text-xs text-gray-500 mt-2">There are required fields in this form marked <span className="text-red-500">*</span></div>
      </form>
    );
  }

  function renderUploadCohorts() {
    return (
      <div className="max-w-2xl mx-auto mt-4 bg-white rounded shadow p-6">
        {/* Collapsible upload section */}
        <div className="mb-4">
          <button
            className="flex items-center text-white bg-gray-900 px-4 py-2 rounded hover:bg-gray-800"
            onClick={() => setUploadSectionOpen(o => !o)}
            type="button"
          >
            <Upload className="mr-2" /> Upload cohorts
            <ChevronDown className={`ml-2 transition-transform ${uploadSectionOpen ? '' : 'rotate-180'}`} />
          </button>
          {uploadSectionOpen && (
            <div className="mt-4 border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center p-8">
              <FileText className="w-12 h-12 text-gray-400 mb-2" />
              <div className="mb-2 text-gray-600">You can drag and drop files here to add them</div>
              <input
                type="file"
                className="hidden"
                id="cohort-upload-input"
                onChange={e => setUploadFile(e.target.files?.[0] || null)}
              />
              <label htmlFor="cohort-upload-input" className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded mb-2">Choose a file</label>
              <div className="text-xs text-gray-500 mb-2">Maximum size: 128MB</div>
              {uploadFile && <div className="text-sm text-gray-700">Selected: {uploadFile.name}</div>}
            </div>
          )}
        </div>
        {/* Form fields */}
        <div className="mb-4 flex space-x-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">CSV delimiter</label>
            <input
              type="text"
              value={csvDelimiter}
              onChange={e => setCsvDelimiter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">Encoding</label>
            <select
              value={encoding}
              onChange={e => setEncoding(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none"
            >
              <option>UTF-8</option>
              <option>ISO-8859-1</option>
              <option>Windows-1252</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">Default context</label>
            <select
              value={defaultContext}
              onChange={e => setDefaultContext(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none"
            >
              <option>System</option>
              <option>Other context</option>
            </select>
          </div>
        </div>
        {/* Action buttons */}
        <div className="flex space-x-2 mt-4">
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">Preview</button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Tabs */}
      <div className="flex border-b bg-white px-6 pt-6">
        {tabList.map(tab => (
          <button
            key={tab.key}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${activeTab === tab.key ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
        <div className="flex-grow" />
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded ml-2"
          onClick={onCancel}
        >
          Back
        </button>
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {activeTab === "system" && renderSystemCohorts()}
        {activeTab === "all" && renderAllCohorts()}
        {activeTab === "add" && renderAddCohort()}
        {activeTab === "upload" && renderUploadCohorts()}
      </div>
      {/* Bottom Back Button */}
      <div className="px-6 pb-6 flex justify-end">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition font-medium"
          onClick={onCancel}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default CohortsPage;