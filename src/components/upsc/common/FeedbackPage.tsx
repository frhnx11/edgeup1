import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FeedbackPageProps {
  onCancel?: () => void;
}

export function FeedbackPage({ onCancel }: FeedbackPageProps) {
  const navigate = useNavigate();
  
  // Section visibility states
  const [generalOpen, setGeneralOpen] = useState(true);
  const [availabilityOpen, setAvailabilityOpen] = useState(true);
  const [afterSubmissionOpen, setAfterSubmissionOpen] = useState(true);
  const [commonSettingsOpen, setCommonSettingsOpen] = useState(true);
  const [restrictAccessOpen, setRestrictAccessOpen] = useState(true);
  const [activityCompletionOpen, setActivityCompletionOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(true);
  const [competenciesOpen, setCompetenciesOpen] = useState(true);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [displayOnCoursePage, setDisplayOnCoursePage] = useState(false);
  const [recordUserNames, setRecordUserNames] = useState('Anonymous');
  const [allowMultipleSubmissions, setAllowMultipleSubmissions] = useState('No');
  const [enableNotification, setEnableNotification] = useState('No');
  const [autoNumberQuestions, setAutoNumberQuestions] = useState('No');
  const [showAnalysisPage, setShowAnalysisPage] = useState('No');
  const [completionMessage, setCompletionMessage] = useState('');
  const [linkToNextActivity, setLinkToNextActivity] = useState('');
  const [availability, setAvailability] = useState('Show on course page');
  const [idNumber, setIdNumber] = useState('');
  const [groupMode, setGroupMode] = useState('No groups');
  const [completionTracking, setCompletionTracking] = useState('Students can manually mark the activity as completed');
  const [expectCompletedOn, setExpectCompletedOn] = useState('');
  const [expectCompletedEnabled, setExpectCompletedEnabled] = useState(false);
  const [tags, setTags] = useState('');
  const [courseCompetencies, setCourseCompetencies] = useState('');
  const [uponActivityCompletion, setUponActivityCompletion] = useState('Do nothing');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', {
      name,
      description,
      displayOnCoursePage,
      recordUserNames,
      allowMultipleSubmissions,
      enableNotification,
      autoNumberQuestions,
      showAnalysisPage,
      completionMessage,
      linkToNextActivity,
      availability,
      idNumber,
      groupMode,
      completionTracking,
      expectCompletedOn,
      expectCompletedEnabled,
      tags,
      courseCompetencies,
      uponActivityCompletion
    });
    
    // Navigate back to previous page after submission
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
          <h1 className="text-2xl font-semibold text-gray-900">Adding a new Feedback</h1>
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
                {/* Name Field */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 pt-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Description Field */}
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
                        placeholder="Enter feedback description..."
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

          {/* Question and submission settings Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <button
              type="button"
              onClick={() => setAvailabilityOpen(!availabilityOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 border-b"
            >
              <div className="flex items-center">
                {availabilityOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                <span className="font-medium">Question and submission settings</span>
              </div>
            </button>

            {availabilityOpen && (
              <div className="p-6 space-y-6">
                {/* Record user names */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="recordUserNames" className="text-sm font-medium text-gray-700 pt-2 flex items-center">
                    Record user names
                    <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                  </label>
                  <div className="col-span-2">
                    <select
                      id="recordUserNames"
                      value={recordUserNames}
                      onChange={(e) => setRecordUserNames(e.target.value)}
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Anonymous">Anonymous</option>
                      <option value="Full name">Full name</option>
                      <option value="Username">Username</option>
                    </select>
                  </div>
                </div>

                {/* Allow multiple submissions */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="allowMultipleSubmissions" className="text-sm font-medium text-gray-700 pt-2 flex items-center ">
                    Allow multiple submissions
                    <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                  </label>
                  <div className="col-span-2">
                    <select
                      id="allowMultipleSubmissions"
                      value={allowMultipleSubmissions}
                      onChange={(e) => setAllowMultipleSubmissions(e.target.value)}
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>

                {/* Enable notification of submissions */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="enableNotification" className="text-sm font-medium text-gray-700 pt-2 flex items-center">
                    Enable notification of submissions
                    <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                  </label>
                  <div className="col-span-2">
                    <select
                      id="enableNotification"
                      value={enableNotification}
                      onChange={(e) => setEnableNotification(e.target.value)}
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>

                {/* Auto-number questions */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="autoNumberQuestions" className="text-sm font-medium text-gray-700 pt-2 flex items-center">
                    Auto-number questions
                    <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                  </label>
                  <div className="col-span-2">
                    <select
                      id="autoNumberQuestions"
                      value={autoNumberQuestions}
                      onChange={(e) => setAutoNumberQuestions(e.target.value)}
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* After submission Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <button
              type="button"
              onClick={() => setAfterSubmissionOpen(!afterSubmissionOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 border-b"
            >
              <div className="flex items-center">
                {afterSubmissionOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                <span className="font-medium">After submission</span>
              </div>
            </button>

            {afterSubmissionOpen && (
              <div className="p-6 space-y-6">
                {/* Show analysis page */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="showAnalysisPage" className="text-sm font-medium text-gray-700 pt-2 flex items-center">
                    Show analysis page
                    <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                  </label>
                  <div className="col-span-2">
                    <select
                      id="showAnalysisPage"
                      value={showAnalysisPage}
                      onChange={(e) => setShowAnalysisPage(e.target.value)}
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>

                {/* Completion message */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="completionMessage" className="text-sm font-medium text-gray-700 pt-2">
                    Completion message
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
                      </div>
                      <textarea
                        id="completionMessage"
                        value={completionMessage}
                        onChange={(e) => setCompletionMessage(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 focus:outline-none resize-none"
                        placeholder="Enter completion message..."
                      />
                    </div>
                  </div>
                </div>

                {/* Link to next activity */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="linkToNextActivity" className="text-sm font-medium text-gray-700 pt-2">
                    Link to next activity
                  </label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      id="linkToNextActivity"
                      value={linkToNextActivity}
                      onChange={(e) => setLinkToNextActivity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/next-activity"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Common module settings Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <button
              type="button"
              onClick={() => setCommonSettingsOpen(!commonSettingsOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 border-b"
            >
              <div className="flex items-center">
                {commonSettingsOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                <span className="font-medium">Common module settings</span>
              </div>
            </button>

            {commonSettingsOpen && (
              <div className="p-6 space-y-6">
                {/* Availability */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="availability" className="text-sm font-medium text-gray-700 pt-2 flex items-center">
                    Availability
                    <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                  </label>
                  <div className="col-span-2">
                    <select
                      id="availability"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Show on course page">Show on course page</option>
                      <option value="Hide from students">Hide from students</option>
                    </select>
                  </div>
                </div>

                {/* ID number */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="idNumber" className="text-sm font-medium text-gray-700 pt-2 flex items-center">
                    ID number
                    <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                  </label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      id="idNumber"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Group mode */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="groupMode" className="text-sm font-medium text-gray-700 pt-2 flex items-center">
                    Group mode
                    <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                  </label>
                  <div className="col-span-2">
                    <select
                      id="groupMode"
                      value={groupMode}
                      onChange={(e) => setGroupMode(e.target.value)}
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="No groups">No groups</option>
                      <option value="Separate groups">Separate groups</option>
                      <option value="Visible groups">Visible groups</option>
                    </select>
                  </div>
                </div>

                {/* Add group/grouping access restriction button */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <div className="col-start-2 col-span-2">
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Add group/grouping access restriction
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Restrict access Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <button
              type="button"
              onClick={() => setRestrictAccessOpen(!restrictAccessOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 border-b"
            >
              <div className="flex items-center">
                {restrictAccessOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                <span className="font-medium">Restrict access</span>
              </div>
            </button>

            {restrictAccessOpen && (
              <div className="p-6">
                <div className="text-sm text-gray-600 mb-4">
                  Access restrictions: None
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
                >
                  Add restriction...
                </button>
              </div>
            )}
          </div>

          {/* Activity completion Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <button
              type="button"
              onClick={() => setActivityCompletionOpen(!activityCompletionOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 border-b"
            >
              <div className="flex items-center">
                {activityCompletionOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                <span className="font-medium">Activity completion</span>
              </div>
            </button>

            {activityCompletionOpen && (
              <div className="p-6 space-y-6">
                {/* Completion tracking */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="completionTracking" className="text-sm font-medium text-gray-700 pt-2 flex items-center">
                    Completion tracking
                    <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                  </label>
                  <div className="col-span-2">
                    <select
                      id="completionTracking"
                      value={completionTracking}
                      onChange={(e) => setCompletionTracking(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Students can manually mark the activity as completed">Students can manually mark the activity as completed</option>
                      <option value="Show activity as complete when conditions are met">Show activity as complete when conditions are met</option>
                      <option value="Do not indicate activity completion">Do not indicate activity completion</option>
                    </select>
                  </div>
                </div>

                {/* Expect completed on */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="expectCompletedOn" className="text-sm font-medium text-gray-700 pt-2">
                    Expect completed on
                  </label>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="datetime-local"
                        id="expectCompletedOn"
                        value={expectCompletedOn}
                        onChange={(e) => setExpectCompletedOn(e.target.value)}
                        disabled={!expectCompletedEnabled}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={expectCompletedEnabled}
                          onChange={(e) => setExpectCompletedEnabled(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                        />
                        <span className="text-sm text-gray-700">Enable</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tags Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <button
              type="button"
              onClick={() => setTagsOpen(!tagsOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 border-b"
            >
              <div className="flex items-center">
                {tagsOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                <span className="font-medium">Tags</span>
              </div>
            </button>

            {tagsOpen && (
              <div className="p-6 space-y-6">
                {/* Manage standard tags */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="standardTags" className="text-sm font-medium text-gray-700 pt-2">
                    Manage standard tags
                  </label>
                  <div className="col-span-2">
                    <select
                      id="standardTags"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">No selection</option>
                    </select>
                  </div>
                </div>

                {/* Enter tags */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="tags" className="text-sm font-medium text-gray-700 pt-2">
                    Enter tags
                  </label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter tags separated by commas"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Competencies Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <button
              type="button"
              onClick={() => setCompetenciesOpen(!competenciesOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 border-b"
            >
              <div className="flex items-center">
                {competenciesOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                <span className="font-medium">Competencies</span>
              </div>
            </button>

            {competenciesOpen && (
              <div className="p-6 space-y-6">
                {/* Course competencies */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="courseCompetencies" className="text-sm font-medium text-gray-700 pt-2">
                    Course competencies
                  </label>
                  <div className="col-span-2">
                    <select
                      id="courseCompetencies"
                      value={courseCompetencies}
                      onChange={(e) => setCourseCompetencies(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">No selection</option>
                    </select>
                  </div>
                </div>

                {/* Upon activity completion */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="uponActivityCompletion" className="text-sm font-medium text-gray-700 pt-2">
                    Upon activity completion
                  </label>
                  <div className="col-span-2">
                    <select
                      id="uponActivityCompletion"
                      value={uponActivityCompletion}
                      onChange={(e) => setUponActivityCompletion(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Do nothing">Do nothing</option>
                      <option value="Attach evidence">Attach evidence</option>
                      <option value="Send for review">Send for review</option>
                      <option value="Complete the competency">Complete the competency</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit buttons */}
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