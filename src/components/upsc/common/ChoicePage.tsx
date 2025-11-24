import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, HelpCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChoicePageProps {
  onCancel?: () => void;
}

export function ChoicePage({ onCancel }: ChoicePageProps) {
  const navigate = useNavigate();
  
  // Section visibility states
  const [generalOpen, setGeneralOpen] = useState(true);
  const [optionsOpen, setOptionsOpen] = useState(true);
  const [availabilityOpen, setAvailabilityOpen] = useState(true);
  const [resultsOpen, setResultsOpen] = useState(true);
  const [commonSettingsOpen, setCommonSettingsOpen] = useState(true);
  const [restrictAccessOpen, setRestrictAccessOpen] = useState(true);
  const [activityCompletionOpen, setActivityCompletionOpen] = useState(true);
  const [tagsOpen, setTagsOpen] = useState(true);
  const [competenciesOpen, setCompetenciesOpen] = useState(true);
  
  // Form state
  const [choiceName, setChoiceName] = useState('');
  const [description, setDescription] = useState('');
  const [displayOnCoursePage, setDisplayOnCoursePage] = useState(false);
  const [displayMode, setDisplayMode] = useState('Display horizontally');
  const [allowUpdate, setAllowUpdate] = useState('No');
  const [allowMultiple, setAllowMultiple] = useState('No');
  const [limitResponses, setLimitResponses] = useState('No');
  const [options, setOptions] = useState(['', '', '', '', '']);
  const [allowResponsesFrom, setAllowResponsesFrom] = useState('');
  const [allowResponsesFromEnabled, setAllowResponsesFromEnabled] = useState(false);
  const [allowResponsesUntil, setAllowResponsesUntil] = useState('');
  const [allowResponsesUntilEnabled, setAllowResponsesUntilEnabled] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [publishResults, setPublishResults] = useState('Do not publish results to students');
  const [showUnanswered, setShowUnanswered] = useState('No');
  const [includeInactive, setIncludeInactive] = useState('No');
  const [availability, setAvailability] = useState('Show on course page');
  const [idNumber, setIdNumber] = useState('');
  const [groupMode, setGroupMode] = useState('No groups');
  const [completionTracking, setCompletionTracking] = useState('Students can manually mark the activity as completed');
  const [expectCompletedOn, setExpectCompletedOn] = useState('');
  const [expectCompletedEnabled, setExpectCompletedEnabled] = useState(false);
  const [tags, setTags] = useState('');
  const [courseCompetencies, setCourseCompetencies] = useState('');
  const [uponActivityCompletion, setUponActivityCompletion] = useState('Do nothing');

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addMoreOptions = () => {
    setOptions([...options, '', '', '']);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Choice form submitted:', {
      choiceName,
      description,
      displayOnCoursePage,
      displayMode,
      allowUpdate,
      allowMultiple,
      limitResponses,
      options: options.filter(option => option.trim() !== ''),
      allowResponsesFrom,
      allowResponsesFromEnabled,
      allowResponsesUntil,
      allowResponsesUntilEnabled,
      showPreview,
      publishResults,
      showUnanswered,
      includeInactive,
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
          <h1 className="text-2xl font-semibold text-gray-900">📝 Adding a new Choice</h1>
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
                <span className="font-medium">1️⃣ General</span>
              </div>
            </button>

            {generalOpen && (
              <div className="p-6 space-y-6">
                {/* Choice name Field */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="choiceName" className="text-sm font-medium text-gray-700 pt-2">
                    Choice name <span className="text-red-500">*</span>
                  </label>
                  <div className="col-span-2">
                    <input
                      type="text"
                      id="choiceName"
                      value={choiceName}
                      onChange={(e) => setChoiceName(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter choice name"
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
                        placeholder="Enter description..."
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

                {/* Display mode for the options */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="displayMode" className="text-sm font-medium text-gray-700 pt-2">
                    Display mode for the options
                  </label>
                  <div className="col-span-2">
                    <select
                      id="displayMode"
                      value={displayMode}
                      onChange={(e) => setDisplayMode(e.target.value)}
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Display horizontally">Display horizontally</option>
                      <option value="Display vertically">Display vertically</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Options Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <button
              type="button"
              onClick={() => setOptionsOpen(!optionsOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 border-b"
            >
              <div className="flex items-center">
                {optionsOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                <span className="font-medium">2️⃣ Options</span>
              </div>
            </button>

            {optionsOpen && (
              <div className="p-6 space-y-6">
                {/* Allow choice to be updated */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="allowUpdate" className="text-sm font-medium text-gray-700 pt-2">
                    Allow choice to be updated
                  </label>
                  <div className="col-span-2">
                    <select
                      id="allowUpdate"
                      value={allowUpdate}
                      onChange={(e) => setAllowUpdate(e.target.value)}
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>

                {/* Allow more than one choice to be selected */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="allowMultiple" className="text-sm font-medium text-gray-700 pt-2">
                    Allow more than one choice to be selected
                  </label>
                  <div className="col-span-2">
                    <select
                      id="allowMultiple"
                      value={allowMultiple}
                      onChange={(e) => setAllowMultiple(e.target.value)}
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>

                {/* Limit the number of responses allowed */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="limitResponses" className="text-sm font-medium text-gray-700 pt-2">
                    Limit the number of responses allowed
                  </label>
                  <div className="col-span-2">
                    <select
                      id="limitResponses"
                      value={limitResponses}
                      onChange={(e) => setLimitResponses(e.target.value)}
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>

                {/* Option inputs */}
                {options.map((option, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 items-start">
                    <label htmlFor={`option${index + 1}`} className="text-sm font-medium text-gray-700 pt-2">
                      Option {index + 1}
                    </label>
                    <div className="col-span-2">
                      <input
                        type="text"
                        id={`option${index + 1}`}
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter option ${index + 1}`}
                      />
                    </div>
                  </div>
                ))}

                {/* Add more options button */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <div className="col-start-2 col-span-2">
                    <button
                      type="button"
                      onClick={addMoreOptions}
                      className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add 3 fields to form
                    </button>
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
                <span className="font-medium">3️⃣ Availability</span>
              </div>
            </button>

            {availabilityOpen && (
              <div className="p-6 space-y-6">
                {/* Allow responses from */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="allowResponsesFrom" className="text-sm font-medium text-gray-700 pt-2">
                    Allow responses from
                  </label>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="datetime-local"
                        id="allowResponsesFrom"
                        value={allowResponsesFrom}
                        onChange={(e) => setAllowResponsesFrom(e.target.value)}
                        disabled={!allowResponsesFromEnabled}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        placeholder="13 June 2025 17:04"
                      />
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={allowResponsesFromEnabled}
                          onChange={(e) => setAllowResponsesFromEnabled(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                        />
                        <span className="text-sm text-gray-700">Enable</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Allow responses until */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="allowResponsesUntil" className="text-sm font-medium text-gray-700 pt-2">
                    Allow responses until
                  </label>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="datetime-local"
                        id="allowResponsesUntil"
                        value={allowResponsesUntil}
                        onChange={(e) => setAllowResponsesUntil(e.target.value)}
                        disabled={!allowResponsesUntilEnabled}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                        placeholder="16 June 2025 10:11"
                      />
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={allowResponsesUntilEnabled}
                          onChange={(e) => setAllowResponsesUntilEnabled(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                        />
                        <span className="text-sm text-gray-700">Enable</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Show preview checkbox */}
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="col-start-2 col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showPreview}
                        onChange={(e) => setShowPreview(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                      />
                      <span className="text-sm text-gray-700">Show preview</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <button
              type="button"
              onClick={() => setResultsOpen(!resultsOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 border-b"
            >
              <div className="flex items-center">
                {resultsOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                <span className="font-medium">4️⃣ Results</span>
              </div>
            </button>

            {resultsOpen && (
              <div className="p-6 space-y-6">
                {/* Publish results */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="publishResults" className="text-sm font-medium text-gray-700 pt-2">
                    Publish results
                  </label>
                  <div className="col-span-2">
                    <select
                      id="publishResults"
                      value={publishResults}
                      onChange={(e) => setPublishResults(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Do not publish results to students">Do not publish results to students</option>
                      <option value="Show results to students after they answer">Show results to students after they answer</option>
                      <option value="Show results to students only after the choice is closed">Show results to students only after the choice is closed</option>
                      <option value="Always show results to students">Always show results to students</option>
                    </select>
                  </div>
                </div>

                {/* Show column for unanswered */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="showUnanswered" className="text-sm font-medium text-gray-700 pt-2">
                    Show column for unanswered
                  </label>
                  <div className="col-span-2">
                    <select
                      id="showUnanswered"
                      value={showUnanswered}
                      onChange={(e) => setShowUnanswered(e.target.value)}
                      className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                </div>

                {/* Include responses from inactive/suspended users */}
                <div className="grid grid-cols-3 gap-4 items-start">
                  <label htmlFor="includeInactive" className="text-sm font-medium text-gray-700 pt-2">
                    Include responses from inactive/suspended users
                  </label>
                  <div className="col-span-2">
                    <select
                      id="includeInactive"
                      value={includeInactive}
                      onChange={(e) => setIncludeInactive(e.target.value)}
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

          {/* Common module settings Section */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <button
              type="button"
              onClick={() => setCommonSettingsOpen(!commonSettingsOpen)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 border-b"
            >
              <div className="flex items-center">
                {commonSettingsOpen ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                <span className="font-medium">5️⃣ Common module settings</span>
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
                      placeholder="Optional"
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
                <span className="font-medium">6️⃣ Restrict access</span>
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
                <span className="font-medium">7️⃣ Activity completion</span>
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
                        placeholder="13 June 2025 17:04"
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
                <span className="font-medium">8️⃣ Tags</span>
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
                <span className="font-medium">9️⃣ Competencies</span>
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

          {/* Action Buttons */}
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