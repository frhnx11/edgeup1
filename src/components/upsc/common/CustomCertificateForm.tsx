import React, { useState } from "react";

interface Props {
  onCancel: () => void;
}

const CustomCertificateForm: React.FC<Props> = ({ onCancel }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    emailStudents: "No",
    emailTeachers: "No",
    emailOthers: "",
    allowVerify: false,
    requiredMinutes: 0,
    setProtection: {
      print: false,
      modify: false,
      copy: false,
    },
    showOnCoursePage: "Show",
    idNumber: "",
    groupMode: "No groups",
    completionTracking: "Students can manually mark the activity as completed",
    completionDate: "2025-06-13",
    completionTime: "17:02",
    completionEnabled: false,
    tags: "",
    standardTag: "No selection",
    competencySearch: "",
    selectedCompetency: "",
    competencyAction: "Do nothing",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    if (name.startsWith("setProtection.")) {
      const key = name.split(".")[1];
      setForm((f) => ({
        ...f,
        setProtection: { ...f.setProtection, [key]: checked },
      }));
    } else if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Back Button */}
      <button
        type="button"
        onClick={onCancel}
        className="absolute top-6 left-6 flex items-center gap-2 text-[#4A90E2] hover:text-[#357ABD] font-semibold text-lg z-10 bg-white rounded-full p-2 shadow"
        style={{ width: "fit-content" }}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="15 18 9 12 15 6"></polyline></svg>
        Back
      </button>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4A90E2] to-[#357ABD] py-8 px-10 pl-28">
        <h1 className="text-3xl font-bold text-white mb-1">Adding a new Custom certificate</h1>
      </div>
      <form className="w-full p-0 m-0">
        {/* General */}
        <section className="p-8 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">General</h2>
          <div className="mb-4">
            <label className="block font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Description</label>
            {/* Placeholder for rich text editor */}
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full min-h-[100px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2] resize-y"
              placeholder="Enter description..."
            />
            <div className="text-xs text-gray-400 mt-1">Formatting tools coming soon</div>
          </div>
        </section>
        {/* Options */}
        <section className="p-8 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium mb-1">Email students</label>
              <select name="emailStudents" value={form.emailStudents} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]">
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Email teachers</label>
              <select name="emailTeachers" value={form.emailTeachers} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]">
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Email others</label>
              <input
                type="text"
                name="emailOthers"
                value={form.emailOthers}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                placeholder="Enter email addresses..."
              />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" name="allowVerify" checked={form.allowVerify} onChange={handleChange} className="accent-[#4A90E2]" />
              <span>Allow anyone to verify a certificate</span>
            </div>
            <div>
              <label className="block font-medium mb-1">Required minutes in course</label>
              <input
                type="number"
                name="requiredMinutes"
                value={form.requiredMinutes}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                min={0}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Set protection</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="setProtection.print" checked={form.setProtection.print} onChange={handleChange} className="accent-[#4A90E2]" /> Print
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="setProtection.modify" checked={form.setProtection.modify} onChange={handleChange} className="accent-[#4A90E2]" /> Modify
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="setProtection.copy" checked={form.setProtection.copy} onChange={handleChange} className="accent-[#4A90E2]" /> Copy
              </label>
            </div>
          </div>
        </section>
        {/* Common module settings */}
        <section className="p-8 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Common module settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-medium mb-1">Availability</label>
              <select
                name="showOnCoursePage"
                value={form.showOnCoursePage}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              >
                <option value="Show">Show on course page</option>
                <option value="Hide">Hide from students</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">ID number</label>
              <input
                type="text"
                name="idNumber"
                value={form.idNumber}
                onChange={handleChange}
                placeholder=""
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Group mode</label>
              <select name="groupMode" value={form.groupMode} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]">
                <option>No groups</option>
                <option>Separate groups</option>
                <option>Visible groups</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            className="border border-[#4A90E2] text-[#4A90E2] hover:bg-blue-50 px-4 py-2 rounded transition-colors w-fit mb-2"
          >
            Add group/grouping access restriction
          </button>
        </section>
        {/* Restrict access */}
        <section className="p-8 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Restrict access</h2>
          <div className="flex flex-col gap-3">
            <label className="font-medium">Access restrictions</label>
            <span className="text-gray-500">None</span>
            <button
              type="button"
              className="border border-[#4A90E2] text-[#4A90E2] hover:bg-blue-50 px-4 py-2 rounded transition-colors w-fit"
            >
              Add restriction...
            </button>
          </div>
        </section>
        {/* Activity completion */}
        <section className="p-8 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Activity completion</h2>
          <div className="flex flex-col gap-3">
            <label className="font-medium">Completion tracking</label>
            <select name="completionTracking" value={form.completionTracking} onChange={handleChange} className="w-full max-w-md p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2] mb-2">
              <option>Students can manually mark the activity as completed</option>
              <option>Show activity as complete when conditions are met</option>
              <option>Do not indicate activity completion</option>
            </select>
            <div className="flex items-center gap-4">
              <label className="font-medium">Expect completed on</label>
              <input
                type="date"
                name="completionDate"
                value={form.completionDate}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              />
              <input
                type="time"
                name="completionTime"
                value={form.completionTime}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="completionEnabled" checked={form.completionEnabled} onChange={handleChange} className="accent-[#4A90E2]" />
                <span>Enable</span>
              </label>
            </div>
          </div>
        </section>
        {/* Tags */}
        <section className="p-8 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Tags</h2>
          <div className="mb-4">
            <label className="block font-medium mb-1">Tags</label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="Enter tags..."
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Manage standard tags</label>
            <select name="standardTag" value={form.standardTag} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]">
              <option>No selection</option>
              <option>Important</option>
              <option>Certificate</option>
              <option>Achievement</option>
            </select>
          </div>
        </section>
        {/* Competencies */}
        <section className="p-8 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Competencies</h2>
          <div className="mb-2">
            <span className="block text-sm font-medium">Course competencies</span>
            <span className="block text-gray-500 text-sm mb-1">{form.selectedCompetency ? form.selectedCompetency : 'No selection'}</span>
            <div className="relative mb-2">
              <input
                type="text"
                name="competencySearch"
                value={form.competencySearch}
                onChange={handleChange}
                placeholder="Search competencies..."
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                autoComplete="off"
              />
              {form.competencySearch && (
                <div className="absolute z-10 left-0 right-0 bg-white border border-gray-300 rounded shadow mt-1 max-h-40 overflow-y-auto">
                  {['Collaboration', 'Critical Thinking', 'Problem Solving', 'Communication', 'Creativity']
                    .filter(opt => opt.toLowerCase().includes(form.competencySearch.toLowerCase()))
                    .map(opt => (
                      <div
                        key={opt}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                        onClick={() => setForm(f => ({ ...f, selectedCompetency: opt, competencySearch: '' }))}
                      >
                        {opt}
                      </div>
                    ))}
                  {['Collaboration', 'Critical Thinking', 'Problem Solving', 'Communication', 'Creativity']
                    .filter(opt => opt.toLowerCase().includes(form.competencySearch.toLowerCase())).length === 0 && (
                      <div className="px-4 py-2 text-gray-400">No results</div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label className="font-medium">Upon activity completion</label>
            <select name="competencyAction" value={form.competencyAction} onChange={handleChange} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]">
              <option value="Do nothing">Do nothing</option>
              <option value="Mark as complete">Mark as complete</option>
              <option value="Require review">Require review</option>
            </select>
          </div>
        </section>
        {/* Bottom Actions */}
        <div className="flex gap-4 justify-end mt-8 p-8 bg-white border-t border-gray-200">
          <button type="submit" className="bg-gradient-to-r from-[#4A90E2] to-[#357ABD] text-white font-semibold px-6 py-2 rounded shadow hover:from-[#357ABD] hover:to-[#4A90E2]">Save and return to course</button>
          <button type="submit" className="bg-gradient-to-r from-[#4A90E2] to-[#357ABD] text-white font-semibold px-6 py-2 rounded shadow hover:from-[#357ABD] hover:to-[#4A90E2]">Save and display</button>
          <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded shadow" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CustomCertificateForm;