import { useState } from 'react';

interface TestAcknowledgmentProps {
  onConfirm: () => void;
}

export function TestAcknowledgment({ onConfirm }: TestAcknowledgmentProps) {
  const [acknowledgments, setAcknowledgments] = useState({
    attendance: false,
    understanding: false,
    preparation: false,
    honesty: false
  });

  const allChecked = Object.values(acknowledgments).every(value => value);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Acknowledgment</h2>
        <p className="text-gray-600 mb-8">Please confirm the following before proceeding with the test</p>

        <div className="space-y-4">
          <label className="flex items-start gap-3 p-4 bg-indigo-50/50 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors">
            <input
              type="checkbox"
              checked={acknowledgments.attendance}
              onChange={e => setAcknowledgments(prev => ({ ...prev, attendance: e.target.checked }))}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <span className="text-gray-700">
              I confirm that I have attended all the required classes for today's topics
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
              I understand all the concepts covered in today's classes
            </span>
          </label>

          <label className="flex items-start gap-3 p-4 bg-indigo-50/50 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors">
            <input
              type="checkbox"
              checked={acknowledgments.preparation}
              onChange={e => setAcknowledgments(prev => ({ ...prev, preparation: e.target.checked }))}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <span className="text-gray-700">
              I am fully prepared and ready to take this assessment
            </span>
          </label>

          <label className="flex items-start gap-3 p-4 bg-indigo-50/50 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors">
            <input
              type="checkbox"
              checked={acknowledgments.honesty}
              onChange={e => setAcknowledgments(prev => ({ ...prev, honesty: e.target.checked }))}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
            <span className="text-gray-700">
              I promise to complete this test honestly and independently
            </span>
          </label>
        </div>

        <button
          onClick={onConfirm}
          disabled={!allChecked}
          className={`w-full mt-8 py-3 px-4 rounded-xl font-medium transition-all ${
            allChecked
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Start Test
        </button>
      </div>
    </div>
  );
}