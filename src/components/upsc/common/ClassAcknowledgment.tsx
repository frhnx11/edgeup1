import { useState } from 'react';

interface ClassAcknowledgmentProps {
  onConfirm: () => void;
  onCancel: () => void;
  classDetails: {
    subject: string;
    topic: string;
  };
}

export function ClassAcknowledgment({ onConfirm, onCancel, classDetails }: ClassAcknowledgmentProps) {
  const [acknowledgments, setAcknowledgments] = useState({
    attendance: false,
    understanding: false,
    participation: false,
    materials: false
  });

  const allChecked = Object.values(acknowledgments).every(value => value);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Class Attendance Confirmation</h2>
        <p className="text-gray-600 mb-2">{classDetails.subject}</p>
        <p className="text-gray-600 mb-6">{classDetails.topic}</p>

        <div className="space-y-4">
          <label className="flex items-start gap-3 p-4 bg-indigo-50/50 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors">
            <input
              type="checkbox"
              checked={acknowledgments.attendance}
              onChange={e => setAcknowledgments(prev => ({ ...prev, attendance: e.target.checked }))}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <span className="text-gray-700">
              I confirm that I have attended the entire class session
            </span>
          </label>

          <label className="flex items-start gap-3 p-4 bg-indigo-50/50 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors">
            <input
              type="checkbox"
              checked={acknowledgments.understanding}
              onChange={e => setAcknowledgments(prev => ({ ...prev, understanding: e.target.checked }))}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <span className="text-gray-700">
              I understand the concepts covered in today's class
            </span>
          </label>

          <label className="flex items-start gap-3 p-4 bg-indigo-50/50 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors">
            <input
              type="checkbox"
              checked={acknowledgments.participation}
              onChange={e => setAcknowledgments(prev => ({ ...prev, participation: e.target.checked }))}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <span className="text-gray-700">
              I actively participated in class discussions and activities
            </span>
          </label>

          <label className="flex items-start gap-3 p-4 bg-indigo-50/50 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors">
            <input
              type="checkbox"
              checked={acknowledgments.materials}
              onChange={e => setAcknowledgments(prev => ({ ...prev, materials: e.target.checked }))}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <span className="text-gray-700">
              I have access to all class materials and resources
            </span>
          </label>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!allChecked}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
              allChecked
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Confirm Attendance
          </button>
        </div>
      </div>
    </div>
  );
}