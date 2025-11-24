import { useState } from 'react';
import { AdminLayout } from '../../../../layouts/AdminLayout';
import {
  Search,
  Filter,
  Download,
  ArrowLeft,
  ChevronDown,
  Plus
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function OverallStudentReportsPage() {
  const [selectedExam, setSelectedExam] = useState('Exam');
  const [selectedRegulation, setSelectedRegulation] = useState('Regulation');
  const [selectedSem, setSelectedSem] = useState('Sem 2');
  const [selectedBranch, setSelectedBranch] = useState('B.Tech');
  const [selectedCourse, setSelectedCourse] = useState('CSE');

  // Score vs Class Average Data
  const scoreData = {
    labels: ['Maths', 'Science', 'History', 'Geography', 'English', 'Tamil'],
    datasets: [
      {
        label: 'Average Score',
        data: [110, 90, 160, 120, 70, 110],
        backgroundColor: 'rgba(79, 70, 229, 1)'
      },
      {
        label: 'Pass Rate (%)',
        data: [70, 60, 130, 110, 50, 90],
        backgroundColor: 'rgba(129, 140, 248, 1)'
      }
    ]
  };

  // Performance Trend Analysis Data
  const trendData = {
    labels: ['15-30 min', '30-45 min', '45-60 min', '60-75 min', '75-90 min', '90-105 min'],
    datasets: [
      {
        label: 'Performance',
        data: [18, 10, 12, 30, 25, 32],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Learning Objective Data
  const objectiveData = {
    labels: ['Maths', 'Science', 'History', 'Geography', 'English'],
    datasets: [
      {
        label: 'Class Average',
        data: [35, 55, 95, 95, 45],
        backgroundColor: 'rgba(79, 70, 229, 1)'
      },
      {
        label: 'Your Score',
        data: [65, 55, 95, 95, 45],
        backgroundColor: 'rgba(249, 115, 22, 1)'
      },
      {
        label: 'Top 25%',
        data: [55, 45, 85, 85, 50],
        backgroundColor: 'rgba(34, 197, 94, 1)'
      }
    ]
  };

  // Bloom's Taxonomy Data
  const bloomsData = {
    labels: ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'],
    datasets: [
      {
        label: 'Progress',
        data: [90, 85, 95, 80, 88, 85],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        fill: true
      }
    ]
  };

  // Learning Objective Mastery Data
  const masteryData = {
    labels: ['Mathematical Reasoning', 'Square Root Calculation', 'Perfect Square Identification', 'Equation Solving', 'Real-world Application'],
    datasets: [
      {
        label: 'Mastery Level',
        data: [85, 75, 90, 72, 83],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        fill: true
      }
    ]
  };

  // Time Analysis Data
  const timeData = {
    labels: ['Question-1', 'Question-2', 'Question-3', 'Question-4', 'Question-5', 'Question-6'],
    datasets: [
      {
        label: 'Time Spent',
        data: [5, 7, 4, 8, 9, 8],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Expected Time',
        data: [4, 8, 5, 7, 8, 9],
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'transparent',
        tension: 0.4
      }
    ]
  };

  // Webb's Depth of Knowledge Data
  const webbData = {
    labels: ['Recall', 'Skill Concept', 'Strategic Thinking', 'Extended Thinking'],
    datasets: [
      {
        label: 'Knowledge Level',
        data: [90, 85, 95, 80],
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        fill: true
      }
    ]
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Overall Student Report</h1>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option>Exam</option>
          </select>
          <select
            value={selectedRegulation}
            onChange={(e) => setSelectedRegulation(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option>Regulation</option>
          </select>
          <select
            value={selectedSem}
            onChange={(e) => setSelectedSem(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option>Sem 2</option>
          </select>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option>B.Tech</option>
          </select>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option>CSE</option>
          </select>
        </div>

        {/* Score vs Class Average */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Your Score vs Class Average</h2>
            <div className="h-80">
              <Bar
                data={scoreData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 200
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Bloom's Taxonomy Progress */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Your Progress Across Bloom's Taxonomy Levels</h2>
            <div className="h-80">
              <Radar
                data={bloomsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        stepSize: 20
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Performance Trend & Learning Objective */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-2">Performance Trend Analysis</h2>
            <p className="text-sm text-gray-600 mb-6">Average score: 250 • 5% improvement</p>
            <div className="h-80">
              <Line
                data={trendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Learning Objective</h2>
            <div className="h-80">
              <Bar
                data={objectiveData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Learning Objective Mastery Report */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Learning Objective Mastery Report</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80">
              <Radar
                data={masteryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        stepSize: 20
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                {[
                  { name: 'Mathematical Reasoning', value: 85 },
                  { name: 'Square Root Calculation', value: 75 },
                  { name: 'Perfect Square Identification', value: 90 },
                  { name: 'Equation Solving', value: 72 },
                  { name: 'Real-world Application', value: 83 }
                ].map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{skill.name}</span>
                      <span>{skill.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-600 rounded-full"
                        style={{ width: `${skill.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-green-50 p-4 rounded-lg space-y-2">
                <p className="text-green-800">• You're excelling in Perfect Square Identification (90% mastery). Keep up the good work!</p>
                <p className="text-green-800">• Your Real-world Application skills (70% mastery) have room for improvement. Try solving more word problems to enhance this skill.</p>
                <p className="text-green-800">• Focus on improving Equation Solving (75% mastery) to boost your overall performance in algebra.</p>
                <p className="text-green-800">• Consider requesting additional practice materials for Mathematical Reasoning to bring it up to par with your other skills.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Time Analysis */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Line Graph: Time Spent vs Expected Time</h2>
          <div className="h-80">
            <Line
              data={timeData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 10,
                    title: {
                      display: true,
                      text: 'Time (minutes)'
                    }
                  }
                }
              }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            {[
              { q: 'Question 1', time: '2 min', color: 'bg-gray-800' },
              { q: 'Question 2', time: '3 min', color: 'bg-green-500' },
              { q: 'Question 3', time: '1 min', color: 'bg-green-500' },
              { q: 'Question 4', time: '4 min', color: 'bg-gray-800' },
              { q: 'Question 5', time: '2 min', color: 'bg-orange-500' },
              { q: 'Question 6', time: '3 min', color: 'bg-green-500' },
              { q: 'Question 7', time: '1 min', color: 'bg-gray-800' },
              { q: 'Question 8', time: '4 min', color: 'bg-green-500' },
              { q: 'Question 9', time: '2 min', color: 'bg-orange-500' },
              { q: 'Question 10', time: '3 min', color: 'bg-orange-500' }
            ].map((item, index) => (
              <div key={index} className={`${item.color} text-white rounded-lg p-3 text-center`}>
                <div className="text-sm">{item.q}</div>
                <div className="font-medium">{item.time}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 text-sm text-gray-600">
            <p>• You spent more time than expected on Q2 and Q4. Consider reviewing these topics for better understanding.</p>
            <p>• You completed Q3 much faster than expected. Ensure you're not rushing through questions.</p>
            <p>• Your time management for Q5, Q9, and Q10 was excellent, matching the expected time closely.</p>
            <p>• Overall, you tend to spend slightly more time than expected on most questions. Practice timed exercises to improve your speed.</p>
            <p>• Question 1 and Question 7 were completed in a reasonable time, but there's always room for improvement in efficiency.</p>
            <p>• Question 6 and Question 8 were managed well, but ensure to maintain this consistency across all questions.</p>
          </div>
        </div>

        {/* Webb's Depth of Knowledge */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Webb's Depth of Knowledge</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80">
              <Radar
                data={webbData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        stepSize: 20
                      }
                    }
                  }
                }}
              />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <p>• Analyze complex mathematical problems and break them down into smaller parts.</p>
                <p>• Evaluate different problem-solving strategies and choose the most effective one.</p>
                <p>• Create your own math problems that incorporate multiple concepts you've learned.</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Customized Learning Path:</h3>
                <p className="text-gray-600 mb-4">To improve your cognitive skills across all levels, we suggest:</p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Practice more questions in the 'Strategic Thinking' and 'Extended Thinking' categories.</li>
                  <li>• Engage in collaborative problem-solving sessions with peers to enhance your 'Evaluate' and 'Create' skills.</li>
                  <li>• Work on interdisciplinary projects that apply mathematical concepts to real-world scenarios.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}