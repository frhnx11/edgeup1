import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Info, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Link, Image, Table, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/AdminLayout';

export function ChatActivityPage() {
  const navigate = useNavigate();
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(true);
  const [isGeneralExpanded, setIsGeneralExpanded] = useState(true);
  const [chatName, setChatName] = useState('');
  const [directPublication, setDirectPublication] = useState('Don\'t publish any first event');
  const [allowDirectMessages, setAllowDirectMessages] = useState('Allow direct messages');
  const [maxUsers, setMaxUsers] = useState('No');
  const [showCurrentPage, setShowCurrentPage] = useState('Show all current page');
  const [allArticles, setAllArticles] = useState('All articles');
  const [showResults, setShowResults] = useState('No groups');
  const [manualCompletion, setManualCompletion] = useState(false);
  const [manageFiles, setManageFiles] = useState('No selected files');
  const [clearView, setClearView] = useState('Clear view');
  const [access, setAccess] = useState('Access');
  const [grading, setGrading] = useState('No grading');

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm">
      {/* Back button */}
      <div className="mb-4">
        <button 
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          onClick={() => navigate('/admin')}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Admin Panel
        </button>
      </div>
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Adding a new Chat</h1>
        <button className="text-blue-600 hover:text-blue-800 text-sm">
          Collapse all
        </button>
      </div>

      <div className="space-y-6">
        {/* General Section */}
        <div className="border border-gray-200 rounded-lg">
          <div 
            className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
            onClick={() => setIsGeneralExpanded(!isGeneralExpanded)}
          >
            <h2 className="font-medium text-gray-800">General</h2>
            {isGeneralExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
          
          {isGeneralExpanded && (
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Set default chat name
                </label>
                <input
                  type="text"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Advanced Section */}
        <div className="border border-gray-200 rounded-lg">
          <div 
            className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
            onClick={() => setIsAdvancedExpanded(!isAdvancedExpanded)}
          >
            <h2 className="font-medium text-gray-800">ADVANCED</h2>
            {isAdvancedExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
          
          {isAdvancedExpanded && (
            <div className="p-4 space-y-4">
              {/* Rich Text Editor */}
              <div>
                <div className="border border-gray-300 rounded-md">
                  <div className="flex items-center justify-between p-2 border-b border-gray-300 bg-gray-50">
                    <div className="flex items-center space-x-1">
                      <button type="button" className="p-1 hover:bg-gray-200 rounded">
                        <Bold className="w-4 h-4" />
                      </button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded">
                        <Italic className="w-4 h-4" />
                      </button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded">
                        <Underline className="w-4 h-4" />
                      </button>
                      <div className="w-px h-4 bg-gray-300 mx-1"></div>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded">
                        <AlignLeft className="w-4 h-4" />
                      </button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded">
                        <AlignCenter className="w-4 h-4" />
                      </button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded">
                        <AlignRight className="w-4 h-4" />
                      </button>
                      <div className="w-px h-4 bg-gray-300 mx-1"></div>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded">
                        <List className="w-4 h-4" />
                      </button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded">
                        <Link className="w-4 h-4" />
                      </button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded">
                        <Image className="w-4 h-4" />
                      </button>
                      <button type="button" className="p-1 hover:bg-gray-200 rounded">
                        <Table className="w-4 h-4" />
                      </button>
                    </div>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    className="w-full p-3 min-h-[120px] resize-none focus:outline-none"
                    placeholder="Enter chat description..."
                  />
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Info className="w-4 h-4 mr-1" />
                  Display description on course page
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Direct publication of new pages
                  </label>
                  <select
                    value={directPublication}
                    onChange={(e) => setDirectPublication(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Don't publish any first event</option>
                    <option>Publish first event</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allow direct messages
                  </label>
                  <select
                    value={allowDirectMessages}
                    onChange={(e) => setAllowDirectMessages(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Allow direct messages</option>
                    <option>Disable direct messages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max
                  </label>
                  <select
                    value={maxUsers}
                    onChange={(e) => setMaxUsers(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Show all current page
                  </label>
                  <select
                    value={showCurrentPage}
                    onChange={(e) => setShowCurrentPage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Show all current page</option>
                    <option>Hide current page</option>
                  </select>
                </div>
              </div>

              {/* Additional Settings */}
              <div className="space-y-4">
                <div>
                  <select
                    value={allArticles}
                    onChange={(e) => setAllArticles(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>All articles</option>
                    <option>Selected articles</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group mode
                  </label>
                  <select
                    value={showResults}
                    onChange={(e) => setShowResults(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>No groups</option>
                    <option>Separate groups</option>
                    <option>Visible groups</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Add grouping/assign access restrictions
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Restrict Access Section */}
        <div className="border border-gray-200 rounded-lg">
          <div className="p-4 bg-gray-50">
            <h2 className="font-medium text-gray-800">Restrict access</h2>
          </div>
          <div className="p-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Add restriction
            </button>
          </div>
        </div>

        {/* Activity Completion Section */}
        <div className="border border-gray-200 rounded-lg">
          <div className="p-4 bg-gray-50">
            <h2 className="font-medium text-gray-800">Activity completion</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="manual-completion"
                checked={manualCompletion}
                onChange={(e) => setManualCompletion(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="manual-completion" className="text-sm text-gray-700">
                Students can manually mark this activity as completed
              </label>
              <Info className="w-4 h-4 ml-1 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <select
                  value={manageFiles}
                  onChange={(e) => setManageFiles(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Manage attached files</option>
                  <option>No selected files</option>
                </select>
              </div>

              <div>
                <select
                  value={clearView}
                  onChange={(e) => setClearView(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Clear view</option>
                  <option>Standard view</option>
                </select>
              </div>

              <div>
                <select
                  value={access}
                  onChange={(e) => setAccess(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>No selection</option>
                  <option>Access</option>
                </select>
              </div>

              <div>
                <select
                  value={grading}
                  onChange={(e) => setGrading(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>No grading</option>
                  <option>Enable grading</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-6">
          <button
            type="button"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save and return to course
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Save and display
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
}