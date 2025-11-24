import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, HelpCircle, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AssignmentPageProps {
  onCancel?: () => void;
}

export function AssignmentPage({ onCancel }: AssignmentPageProps) {
  const navigate = useNavigate();
  
  // Section visibility states
  const [generalOpen, setGeneralOpen] = useState(true);
  const [additionalFilesOpen, setAdditionalFilesOpen] = useState(true);
  const [availabilityOpen, setAvailabilityOpen] = useState(true);
  const [submissionTypesOpen, setSubmissionTypesOpen] = useState(true);
  const [feedbackTypesOpen, setFeedbackTypesOpen] = useState(false);
  const [submissionSettingsOpen, setSubmissionSettingsOpen] = useState(false);
  const [groupSubmissionOpen, setGroupSubmissionOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [gradeOpen, setGradeOpen] = useState(false);
  const [commonSettingsOpen, setCommonSettingsOpen] = useState(false);
  const [restrictAccessOpen, setRestrictAccessOpen] = useState(false);
  const [activityCompletionOpen, setActivityCompletionOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [competenciesOpen, setCompetenciesOpen] = useState(false);
  
  // Form state
  const [assignmentName, setAssignmentName] = useState('');
  const [description, setDescription] = useState('');
  const [displayOnCoursePage, setDisplayOnCoursePage] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Availability dates
  const [allowSubmissionsFrom, setAllowSubmissionsFrom] = useState('');
  const [allowSubmissionsEnabled, setAllowSubmissionsEnabled] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [dueDateEnabled, setDueDateEnabled] = useState(false);
  const [cutOffDate, setCutOffDate] = useState('');
  const [cutOffDateEnabled, setCutOffDateEnabled] = useState(false);
  const [remindToGrade, setRemindToGrade] = useState('');
  const [remindToGradeEnabled, setRemindToGradeEnabled] = useState(false);
  const [alwaysShowDescription, setAlwaysShowDescription] = useState(false);
  
  // Submission types
  const [onlineText, setOnlineText] = useState(false);
  const [fileSubmissions, setFileSubmissions] = useState(false);
  const [maxUploadedFiles, setMaxUploadedFiles] = useState('5');
  const [maxSubmissionSize, setMaxSubmissionSize] = useState('10');
  const [acceptedFileTypes, setAcceptedFileTypes] = useState('');

  const maxFileSize = 100 * 1024 * 1024; // 100MB in bytes

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).filter(file => file.size <= maxFileSize);
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Assignment form submitted:', {
      assignmentName,
      description,
      displayOnCoursePage,
      uploadedFiles,
      allowSubmissionsFrom,
      allowSubmissionsEnabled,
      dueDate,
      dueDateEnabled,
      cutOffDate,
      cutOffDateEnabled,
      remindToGrade,
      remindToGradeEnabled,
      alwaysShowDescription,
      onlineText,
      fileSubmissions,
      maxUploadedFiles,
      maxSubmissionSize,
      acceptedFileTypes
    });
    
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center">
          <button 
            onClick={handleCancel} 
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Adding a new Assignment</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* General Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <button
              type="button"
              onClick={() => setGeneralOpen(!generalOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 border-b"
            >
              <div className="flex items-center">
                {generalOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                <span className="font-medium">General</span>
              </div>
            </button>

            {generalOpen && (
              <div className="p-6 space-y-6">
                {/* Assignment name */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="assignmentName" className="text-sm font-medium text-gray-700 pt-2">
                    Assignment name <span className="text-red-500">*</span>
                  </label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      id="assignmentName"
                      value={assignmentName}
                      onChange={(e) => setAssignmentName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter assignment name"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="description" className="text-sm font-medium text-gray-700 pt-2">
                    Description
                  </label>
                  <div className="col-span-2">
                    <div className="border border-gray-300 rounded-md">
                      <div className="flex flex-wrap items-center p-2 border-b border-gray-300 bg-gray-50 gap-1">
                        <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                          <option>Paragraph</option>
                        </select>
                        <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Bold">
                          <span className="font-bold">B</span>
                        </button>
                        <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Italic">
                          <span className="italic">I</span>
                        </button>
                        <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Underline">
                          <span className="underline">U</span>
                        </button>
                        <div className="w-px h-6 bg-gray-300 mx-1" />
                        <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Bullet List">
                          <span>• —</span>
                        </button>
                        <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Numbered List">
                          <span>1. —</span>
                        </button>
                        <div className="w-px h-6 bg-gray-300 mx-1" />
                        <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Link">
                          <span>🔗</span>
                        </button>
                        <button type="button" className="p-2 hover:bg-gray-200 rounded" title="Image">
                          <span>🖼️</span>
                        </button>
                      </div>
                      <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 focus:outline-none resize-none"
                        placeholder="Enter assignment description..."
                      />
                    </div>
                  </div>
                </div>

                {/* Display on course page checkbox */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="col-start-2 col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={displayOnCoursePage}
                        onChange={(e) => setDisplayOnCoursePage(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                      />
                      <span className="text-sm text-gray-700">Display description on course page</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional files Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <button
              type="button"
              onClick={() => setAdditionalFilesOpen(!additionalFilesOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 border-b"
            >
              <div className="flex items-center">
                {additionalFilesOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                <span className="font-medium">Additional files</span>
              </div>
            </button>

            {additionalFilesOpen && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label className="text-sm font-medium text-gray-700 pt-2">
                    Maximum size for new files
                  </label>
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600">100MB</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 items-start">
                  <label className="text-sm font-medium text-gray-700 pt-2">
                    Files
                  </label>
                  <div className="col-span-2">
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                      }`}
                    >
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-2">
                        Drag and drop files here, or{' '}
                        <label className="text-blue-600 hover:text-blue-800 cursor-pointer">
                          browse
                          <input
                            type="file"
                            multiple
                            onChange={(e) => handleFileUpload(e.target.files)}
                            className="hidden"
                          />
                        </label>
                      </p>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">{file.name}</span>
                              <span className="text-xs text-gray-500">
                                ({(file.size / 1024 / 1024).toFixed(1)} MB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Availability Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <button
              type="button"
              onClick={() => setAvailabilityOpen(!availabilityOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 border-b"
            >
              <div className="flex items-center">
                {availabilityOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                <span className="font-medium">Availability</span>
              </div>
            </button>

            {availabilityOpen && (
              <div className="p-6 space-y-6">
                {/* Allow submissions from */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="allowSubmissionsFrom" className="text-sm font-medium text-gray-700 pt-2">
                    Allow submissions from
                  </label>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="datetime-local"
                        id="allowSubmissionsFrom"
                        value={allowSubmissionsFrom}
                        onChange={(e) => setAllowSubmissionsFrom(e.target.value)}
                        disabled={!allowSubmissionsEnabled}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        placeholder="13 June 2025 00:00"
                      />
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={allowSubmissionsEnabled}
                          onChange={(e) => setAllowSubmissionsEnabled(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                        />
                        <span className="text-sm text-gray-700">Enable</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Due date */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="dueDate" className="text-sm font-medium text-gray-700 pt-2">
                    Due date
                  </label>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="datetime-local"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        disabled={!dueDateEnabled}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        placeholder="20 June 2025 00:00"
                      />
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={dueDateEnabled}
                          onChange={(e) => setDueDateEnabled(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                        />
                        <span className="text-sm text-gray-700">Enable</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Cut-off date */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="cutOffDate" className="text-sm font-medium text-gray-700 pt-2">
                    Cut-off date
                  </label>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="datetime-local"
                        id="cutOffDate"
                        value={cutOffDate}
                        onChange={(e) => setCutOffDate(e.target.value)}
                        disabled={!cutOffDateEnabled}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        placeholder="13 June 2025 16:56"
                      />
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={cutOffDateEnabled}
                          onChange={(e) => setCutOffDateEnabled(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                        />
                        <span className="text-sm text-gray-700">Enable</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Remind me to grade by */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="remindToGrade" className="text-sm font-medium text-gray-700 pt-2">
                    Remind me to grade by
                  </label>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="datetime-local"
                        id="remindToGrade"
                        value={remindToGrade}
                        onChange={(e) => setRemindToGrade(e.target.value)}
                        disabled={!remindToGradeEnabled}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        placeholder="27 June 2025 00:00"
                      />
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={remindToGradeEnabled}
                          onChange={(e) => setRemindToGradeEnabled(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                        />
                        <span className="text-sm text-gray-700">Enable</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Always show description */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="col-start-2 col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={alwaysShowDescription}
                        onChange={(e) => setAlwaysShowDescription(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                      />
                      <span className="text-sm text-gray-700">Always show description</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submission types Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <button
              type="button"
              onClick={() => setSubmissionTypesOpen(!submissionTypesOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 border-b"
            >
              <div className="flex items-center">
                {submissionTypesOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                <span className="font-medium">Submission types</span>
              </div>
            </button>

            {submissionTypesOpen && (
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label className="text-sm font-medium text-gray-700 pt-2">
                    Submission types
                  </label>
                  <div className="col-span-2 space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={onlineText}
                        onChange={(e) => setOnlineText(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                      />
                      <span className="text-sm text-gray-700">Online text</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={fileSubmissions}
                        onChange={(e) => setFileSubmissions(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                      />
                      <span className="text-sm text-gray-700">File submissions</span>
                    </label>
                  </div>
                </div>

                {/* Maximum number of uploaded files */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="maxUploadedFiles" className="text-sm font-medium text-gray-700 pt-2">
                    Maximum number of uploaded files
                  </label>
                  <div className="col-span-2">
                    <input
                      type="number"
                      id="maxUploadedFiles"
                      value={maxUploadedFiles}
                      onChange={(e) => setMaxUploadedFiles(e.target.value)}
                      min="1"
                      className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Maximum submission size */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="maxSubmissionSize" className="text-sm font-medium text-gray-700 pt-2">
                    Maximum submission size
                  </label>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        id="maxSubmissionSize"
                        value={maxSubmissionSize}
                        onChange={(e) => setMaxSubmissionSize(e.target.value)}
                        min="1"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">MB</span>
                    </div>
                  </div>
                </div>

                {/* Accepted file types */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="acceptedFileTypes" className="text-sm font-medium text-gray-700 pt-2">
                    Accepted file types
                  </label>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
                      >
                        Choose...
                      </button>
                      <span className="text-sm text-gray-500">(No selection)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional expandable sections */}
          {[
            { title: 'Feedback types', isOpen: feedbackTypesOpen, setOpen: setFeedbackTypesOpen },
            { title: 'Submission settings', isOpen: submissionSettingsOpen, setOpen: setSubmissionSettingsOpen },
            { title: 'Group submission settings', isOpen: groupSubmissionOpen, setOpen: setGroupSubmissionOpen },
            { title: 'Notifications', isOpen: notificationsOpen, setOpen: setNotificationsOpen },
            { title: 'Grade', isOpen: gradeOpen, setOpen: setGradeOpen },
            { title: 'Common module settings', isOpen: commonSettingsOpen, setOpen: setCommonSettingsOpen },
            { title: 'Restrict access', isOpen: restrictAccessOpen, setOpen: setRestrictAccessOpen },
            { title: 'Activity completion', isOpen: activityCompletionOpen, setOpen: setActivityCompletionOpen },
            { title: 'Tags', isOpen: tagsOpen, setOpen: setTagsOpen },
            { title: 'Competencies', isOpen: competenciesOpen, setOpen: setCompetenciesOpen }
          ].map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm mb-6">
              <button
                type="button"
                onClick={() => section.setOpen(!section.isOpen)}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 border-b"
              >
                <div className="flex items-center">
                  {section.isOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                  <span className="font-medium">{section.title}</span>
                </div>
              </button>

              {section.isOpen && (
                <div className="p-6">
                  <p className="text-sm text-gray-500">
                    {section.title} settings will be configured here.
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Bottom actions */}
          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              name="action"
              value="saveAndDisplay"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save and display
            </button>
            <button
              type="submit"
              name="action"
              value="saveAndReturn"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save and return to course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}