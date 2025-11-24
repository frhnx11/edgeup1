import React, { useState, useRef } from "react";

interface Props {
  onCancel: () => void;
}

const categoryOptions = [
  "Miscellaneous",
  "Science",
  "Mathematics",
  "Languages",
  "Technology",
  "Arts",
  "Business",
  "History"
];

interface AddCourseFormProps extends Props {
  onSaveAndDisplay?: () => void;
}

const AddCourseForm: React.FC<AddCourseFormProps> = ({ onCancel, onSaveAndDisplay }) => {
  const [form, setForm] = useState({
    fullName: "",
    shortName: "",
    category: "Miscellaneous",
    visibility: "Show",
    startDate: "2025-06-14",
    startTime: "00:00",
    endDate: "2026-06-14",
    endTime: "00:00",
    endEnabled: false,
    idNumber: "",
    summary: "",
    summaryHtml: false,
    courseImage: null as File | null,
    imagePreview: ""
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    if (type === "checkbox") {
      setForm((f) => ({ ...f, [name]: checked }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setForm((f) => ({ ...f, courseImage: file }));
      const reader = new FileReader();
      reader.onload = (ev) => setForm((f) => ({ ...f, imagePreview: ev.target?.result as string }));
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setForm((f) => ({ ...f, courseImage: file }));
      const reader = new FileReader();
      reader.onload = (ev) => setForm((f) => ({ ...f, imagePreview: ev.target?.result as string }));
      reader.readAsDataURL(file);
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Rich text editor (basic, mockup)
  const handleSummaryFormat = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
  };
  const handleSummaryInput = (e: React.FormEvent<HTMLDivElement>) => {
    setForm((f) => ({ ...f, summary: e.currentTarget.innerHTML }));
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
        <h1 className="text-3xl font-bold text-white mb-1">Add Course</h1>
      </div>
      <form className="w-full p-0 m-0">
        {/* General Section */}
        <section className="p-8 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">General</h2>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Course full name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Course short name</label>
              <input
                type="text"
                name="shortName"
                value={form.shortName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Course category</label>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs flex items-center">
                  × {form.category}
                </span>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Course visibility</label>
              <select
                name="visibility"
                value={form.visibility}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              >
                <option value="Show">Show</option>
                <option value="Hide">Hide</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Course start date</label>
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                />
                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2] w-[100px]"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Course end date</label>
              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  disabled={!form.endEnabled}
                />
                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2] w-[100px]"
                  disabled={!form.endEnabled}
                />
                <label className="flex items-center gap-1 ml-2">
                  <input
                    type="checkbox"
                    name="endEnabled"
                    checked={form.endEnabled}
                    onChange={handleChange}
                    className="accent-[#4A90E2]"
                  />
                  <span>Enable</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Course ID number</label>
              <input
                type="text"
                name="idNumber"
                value={form.idNumber}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              />
            </div>
          </div>
        </section>
        {/* Description Section */}
        <section className="p-8 border-b border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Description</h2>
          <div className="mb-4">
            <label className="block font-medium mb-1">Course summary</label>
            {/* Rich text editor toolbar (mockup) */}
            <div className="flex flex-wrap gap-2 mb-2">
              <button type="button" className="p-1 rounded hover:bg-blue-100" title="Bold" onClick={() => handleSummaryFormat('bold')}> <b>B</b> </button>
              <button type="button" className="p-1 rounded hover:bg-blue-100" title="Italic" onClick={() => handleSummaryFormat('italic')}> <i>I</i> </button>
              <button type="button" className="p-1 rounded hover:bg-blue-100" title="Underline" onClick={() => handleSummaryFormat('underline')}> <u>U</u> </button>
              <button type="button" className="p-1 rounded hover:bg-blue-100" title="Bullet list" onClick={() => handleSummaryFormat('insertUnorderedList')}>• List</button>
              <button type="button" className="p-1 rounded hover:bg-blue-100" title="Numbered list" onClick={() => handleSummaryFormat('insertOrderedList')}>1. List</button>
              <button type="button" className="p-1 rounded hover:bg-blue-100" title="Insert link" onClick={() => handleSummaryFormat('createLink', prompt('Enter URL') || '')}>🔗</button>
              <button type="button" className="p-1 rounded hover:bg-blue-100" title="Remove link" onClick={() => handleSummaryFormat('unlink')}>❌🔗</button>
              <button type="button" className="p-1 rounded hover:bg-blue-100" title="Insert image" onClick={() => handleSummaryFormat('insertImage', prompt('Enter image URL') || '')}>🖼️</button>
              <button type="button" className="p-1 rounded hover:bg-blue-100" title="Insert media" disabled>🎬</button>
              <button type="button" className="p-1 rounded hover:bg-blue-100" title="Insert table" disabled>▦</button>
              <button type="button" className="p-1 rounded hover:bg-blue-100" title="Horizontal rule" onClick={() => handleSummaryFormat('insertHorizontalRule')}>─</button>
              <button type="button" className="p-1 rounded hover:bg-blue-100" title="HTML editor toggle" onClick={() => setForm(f => ({ ...f, summaryHtml: !f.summaryHtml }))}>{'<>'}</button>
              <button type="button" className="p-1 rounded hover:bg-blue-100" title="Math formula editor" disabled>∑</button>
              <button type="button" className="p-1 rounded hover:bg-blue-100" title="Special characters" disabled>Ω</button>
            </div>
            {/* Editable div for rich text */}
            {form.summaryHtml ? (
              <textarea
                name="summary"
                value={form.summary}
                onChange={handleChange}
                className="w-full min-h-[120px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2] font-mono"
                placeholder="Enter HTML..."
              />
            ) : (
              <div
                contentEditable
                suppressContentEditableWarning
                className="w-full min-h-[120px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2] bg-white"
                onInput={handleSummaryInput}
                dangerouslySetInnerHTML={{ __html: form.summary }}
                style={{ outline: 'none' }}
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Course image</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer bg-gray-50 hover:bg-blue-50 relative"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              style={{ minHeight: 140 }}
            >
              {form.imagePreview ? (
                <img src={form.imagePreview} alt="Preview" className="mx-auto max-h-32 mb-2 rounded shadow" />
              ) : (
                <span className="text-gray-400">You can drag and drop files here to add them.</span>
              )}
              <input
                type="file"
                accept=".gif,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Maximum file size: 128MB, maximum number of files: 1<br />
              Accepted file types: Image (GIF) .gif, Image (JPEG) .jpg, Image (PNG) .png
            </div>
          </div>
        </section>
        {/* Bottom Actions */}
        <div className="flex gap-4 justify-end mt-8 p-8 bg-white border-t border-gray-200">
          <button type="submit" className="bg-gradient-to-r from-[#4A90E2] to-[#357ABD] text-white font-semibold px-6 py-2 rounded shadow hover:from-[#357ABD] hover:to-[#4A90E2]">Save and return</button>
          <button
            type="button"
            className="bg-gradient-to-r from-[#4A90E2] to-[#357ABD] text-white font-semibold px-6 py-2 rounded shadow hover:from-[#357ABD] hover:to-[#4A90E2]"
            onClick={onSaveAndDisplay}
          >
            Save and display
          </button>
          <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded shadow" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddCourseForm;