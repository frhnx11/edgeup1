import React, { useState } from 'react';

// Collapsible section helper
function CollapsibleSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-6 bg-white rounded-lg border border-gray-200">
      <button
        type="button"
        className="flex items-center justify-between w-full px-6 py-4 text-lg font-semibold text-gray-900 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{title}</span>
        <span className={`ml-4 transition-transform ${open ? 'rotate-90' : ''}`}>▶</span>
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
}

interface ZoomMeetingFormProps {
  onCancel?: () => void;
}

export default function ZoomMeetingForm({ onCancel }: ZoomMeetingFormProps) {
  // Form state (UI only, no backend)
  const [form, setForm] = useState({
    format: 'Zoom',
    title: '',
    description: '',
    date: '',
    time: '',
    durationHours: '1',
    durationMinutes: '0',
    recurring: false,
    webinar: false,
    showSchedule: true,
    requireRegistration: 'No',
    passwordOption: 'password', // 'password' or 'nopass'
    password: '',
    waitingRoom: true,
    joinBeforeHost: false,
    authentication: false,
    showSecuritySection: true,
    hostVideo: true,
    participantsVideo: true,
    audioOption: 'both', // 'telephone', 'computer', 'both'
    muteOnEntry: false,
    autoRecording: false,
    showMediaSection: true,
    audio: true,
    video: true,
    host: '',
    alternateHost: '',
    gradeType: 'None',
    showOnCoursePage: 'Show',
    idNumber: '',
    completion: false,
    completionDate: '2025-06-13',
    completionTime: '16:58',
    completionEnabled: false,
    tags: '',
    competencies: '',
    competencyAction: 'Do nothing',
    competencySearch: '',
    selectedCompetency: '',
  });

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // UI only, no submit logic
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Back Button */}
      <button
        type="button"
        onClick={onCancel}
        className="absolute top-6 left-6 flex items-center gap-2 text-[#4A90E2] hover:text-[#357ABD] font-semibold text-lg z-10 bg-white rounded-full p-2 shadow"
        style={{ width: 'fit-content' }}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="15 18 9 12 15 6"></polyline></svg>
        Back
      </button>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#4A90E2] to-[#357ABD] py-8 px-10 pl-28">
        <h1 className="text-3xl font-bold text-white mb-1">Adding a new Zoom meeting</h1>
        <p className="text-white/80">Fill out the details below to add a Zoom meeting to your course.</p>
      </div>
      <form className="w-full p-0 m-0">
        {/* Format */}
        <CollapsibleSection title="Format">
          <select
            name="format"
            value={form.format}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
          >
            <option value="Zoom">Zoom</option>
            <option value="Google Meet">Google Meet</option>
            <option value="Teams">Microsoft Teams</option>
          </select>
        </CollapsibleSection>
        {/* Description */}
        <CollapsibleSection title="Description">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={4}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
          />
          {/* Toolbar placeholder */}
          <div className="flex gap-2 mt-2">
            <button type="button" className="p-1 px-2 text-gray-500 bg-gray-100 rounded hover:bg-gray-200">B</button>
            <button type="button" className="p-1 px-2 text-gray-500 bg-gray-100 rounded hover:bg-gray-200">I</button>
            <button type="button" className="p-1 px-2 text-gray-500 bg-gray-100 rounded hover:bg-gray-200">U</button>
            {/* ...more toolbar buttons as needed */}
          </div>
        </CollapsibleSection>
        {/* Schedule */}
        <CollapsibleSection title="Schedule">
          <div className="flex gap-4 mb-3 flex-wrap">
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            />
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            />
            <div className="flex items-center gap-2">
              <span>Duration:</span>
              <select
                name="durationHours"
                value={form.durationHours}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              >
                {[...Array(13).keys()].map((h) => (
                  <option key={h} value={h}>{h}h</option>
                ))}
              </select>
              <select
                name="durationMinutes"
                value={form.durationMinutes}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              >
                <option value="0">00m</option>
                <option value="15">15m</option>
                <option value="30">30m</option>
                <option value="45">45m</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="recurring" checked={form.recurring} onChange={handleChange} className="accent-[#4A90E2]" />
              <span>Recurring meeting</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="webinar" checked={form.webinar} onChange={handleChange} className="accent-[#4A90E2]" />
              <span>Webinar</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="showSchedule" checked={form.showSchedule} onChange={handleChange} className="accent-[#4A90E2]" />
              <span>Show schedule section</span>
            </label>
            <label className="flex items-center gap-2">
              <span>Require registration:</span>
              <select
                name="requireRegistration"
                value={form.requireRegistration}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </label>
          </div>
        </CollapsibleSection>

        {/* Breakout Rooms */}
        <CollapsibleSection title="Breakout rooms">
          <div className="flex items-center gap-4 mb-4">
            <button
              type="button"
              className="border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
            >
              Show rooms
            </button>
          </div>
          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-6">
            <span className="text-gray-500 mb-2">No Rooms</span>
            <button
              type="button"
              className="flex items-center gap-2 text-[#4A90E2] hover:text-[#357ABD] font-semibold px-3 py-2 rounded-full border border-[#4A90E2] bg-white hover:bg-blue-50 shadow-sm"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="10" y1="4" x2="10" y2="16" /><line x1="4" y1="10" x2="16" y2="10" /></svg>
              <span>Add a room by clicking +</span>
            </button>
          </div>
        </CollapsibleSection>
        {/* Security */}
        <CollapsibleSection title="Security">
          {/* Password or No Pass */}
          <div className="flex gap-6 mb-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="passwordOption"
                value="password"
                checked={form.passwordOption === 'password'}
                onChange={handleChange}
                className="accent-[#4A90E2]"
              />
              <span>Password</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="passwordOption"
                value="nopass"
                checked={form.passwordOption === 'nopass'}
                onChange={handleChange}
                className="accent-[#4A90E2]"
              />
              <span>No password <span className="text-xs text-gray-500">(anyone with the link can join)</span></span>
            </label>
          </div>
          <div className="mb-2 text-xs text-gray-500">
            <div>{form.passwordOption === 'password' ? 'Only participants with the password can join this meeting.' : 'Anyone with the meeting link can join. For better security, consider enabling a password.'}</div>
          </div>
          {form.passwordOption === 'password' && (
            <input
              type="text"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Meeting password"
              className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            />
          )}
          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" name="waitingRoom" checked={form.waitingRoom} onChange={handleChange} className="accent-[#4A90E2]" />
            <span>Enable waiting room</span>
          </label>
          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" name="joinBeforeHost" checked={form.joinBeforeHost} onChange={handleChange} className="accent-[#4A90E2]" />
            <span>Allow participants to join anytime</span>
          </label>
          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" name="authentication" checked={form.authentication} onChange={handleChange} className="accent-[#4A90E2]" />
            <span>Require authentication to join</span>
          </label>
          <label className="flex items-center gap-2 mb-2">
            <input type="checkbox" name="showSecuritySection" checked={form.showSecuritySection} onChange={handleChange} className="accent-[#4A90E2]" />
            <span>Show security section on meeting page</span>
          </label>
        </CollapsibleSection>
        {/* Media */}
        <CollapsibleSection title="Media">
          <div className="flex flex-col gap-3 mb-3">
            {/* Host video toggle */}
            <div className="flex items-center gap-4">
              <span>Host video:</span>
              <label className="flex items-center gap-1">
                <input type="radio" name="hostVideo" value="true" checked={form.hostVideo} onChange={() => setForm(f => ({...f, hostVideo: true}))} className="accent-[#4A90E2]" /> ON
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" name="hostVideo" value="false" checked={!form.hostVideo} onChange={() => setForm(f => ({...f, hostVideo: false}))} className="accent-[#4A90E2]" /> OFF
              </label>
            </div>
            {/* Participants video toggle */}
            <div className="flex items-center gap-4">
              <span>Participants video:</span>
              <label className="flex items-center gap-1">
                <input type="radio" name="participantsVideo" value="true" checked={form.participantsVideo} onChange={() => setForm(f => ({...f, participantsVideo: true}))} className="accent-[#4A90E2]" /> ON
              </label>
              <label className="flex items-center gap-1">
                <input type="radio" name="participantsVideo" value="false" checked={!form.participantsVideo} onChange={() => setForm(f => ({...f, participantsVideo: false}))} className="accent-[#4A90E2]" /> OFF
              </label>
            </div>
            {/* Audio options */}
            <div className="flex flex-col gap-2">
              <span>Audio options:</span>
              <label className="flex items-center gap-2">
                <input type="radio" name="audioOption" value="telephone" checked={form.audioOption === 'telephone'} onChange={handleChange} className="accent-[#4A90E2]" />
                <span>Telephone only</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="audioOption" value="computer" checked={form.audioOption === 'computer'} onChange={handleChange} className="accent-[#4A90E2]" />
                <span>Computer audio only</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="audioOption" value="both" checked={form.audioOption === 'both'} onChange={handleChange} className="accent-[#4A90E2]" />
                <span>Computer audio and Telephone</span>
              </label>
            </div>
            {/* Mute participants upon entry */}
            <label className="flex items-center gap-2">
              <input type="checkbox" name="muteOnEntry" checked={form.muteOnEntry} onChange={handleChange} className="accent-[#4A90E2]" />
              <span>Mute participants upon entry</span>
            </label>
            {/* Automatic recording */}
            <label className="flex items-center gap-2">
              <input type="checkbox" name="autoRecording" checked={form.autoRecording} onChange={handleChange} className="accent-[#4A90E2]" />
              <span>Automatic recording (Cloud)</span>
            </label>
            {/* Show media section */}
            <label className="flex items-center gap-2">
              <input type="checkbox" name="showMediaSection" checked={form.showMediaSection} onChange={handleChange} className="accent-[#4A90E2]" />
              <span>Show Media section on meeting page</span>
            </label>
          </div>
        </CollapsibleSection>
        {/* Host Settings */}
        <CollapsibleSection title="Host settings">
          <input
            type="text"
            name="host"
            value={form.host}
            onChange={handleChange}
            placeholder="Host name or email"
            className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
          />
          <input
            type="text"
            name="alternateHost"
            value={form.alternateHost}
            onChange={handleChange}
            placeholder="Alternate host email (optional)"
            className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
          />
          <span className="text-xs text-gray-500">Enter the email address of an alternate host. Separate multiple emails with commas.</span>
        </CollapsibleSection>
        {/* Grade */}
        <CollapsibleSection title="Grade">
          <div className="flex items-center gap-4">
            <label className="font-medium">Type:</label>
            <select
              name="gradeType"
              value={form.gradeType}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            >
              <option value="None">None</option>
              <option value="Points">Points</option>
              <option value="Percentage">Percentage</option>
              <option value="Letter">Letter</option>
            </select>
          </div>
        </CollapsibleSection>
        {/* Common module settings */}
        <CollapsibleSection title="Common module settings">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block font-medium mb-1">Availability</label>
              <select
                name="showOnCoursePage"
                value={form.showOnCoursePage}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
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
          </div>
        </CollapsibleSection>
        {/* Restrict access */}
        <CollapsibleSection title="Restrict access">
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
        </CollapsibleSection>
        {/* Activity completion */}
        <CollapsibleSection title="Activity completion">
          <div className="flex flex-col gap-3">
            <label className="font-medium">Completion tracking</label>
            <span className="text-gray-700">Students can manually mark the activity as completed</span>
            <div className="flex items-center gap-4">
              <label className="font-medium">Expect completed on</label>
              <input
                type="date"
                name="completionDate"
                value={form.completionDate || '2025-06-13'}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              />
              <input
                type="time"
                name="completionTime"
                value={form.completionTime || '16:58'}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="completionEnabled" checked={form.completionEnabled ?? false} onChange={handleChange} className="accent-[#4A90E2]" />
                <span>Enable</span>
              </label>
            </div>
          </div>
        </CollapsibleSection>
        {/* Tags */}
        <CollapsibleSection title="Tags">
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Add tags (comma separated)"
            className="w-full mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
          />
        </CollapsibleSection>
        {/* Competencies */}
        <CollapsibleSection title="Competencies">
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
            <select name="competencyAction" value={form.competencyAction || 'Do nothing'} onChange={handleChange} className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]">
              <option value="Do nothing">Do nothing</option>
              <option value="Mark as complete">Mark as complete</option>
              <option value="Require review">Require review</option>
            </select>
          </div>
        </CollapsibleSection>
        {/* Bottom Actions */}
        <div className="flex gap-4 justify-end mt-8">
          <button type="button" className="bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold px-6 py-2 rounded shadow">Save and return to course</button>
          <button type="button" className="bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold px-6 py-2 rounded shadow">Save and display</button>
          <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-2 rounded shadow" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}