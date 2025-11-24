import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock,
  BarChart2,
  Layout,
  HelpCircle,
  Eye,
  Shield,
  Lock,
  MessageSquare,
  CheckCircle,
  Tag,
  Award,
  Cog,
  Settings,
  Palette,
  Plus,
  Info
} from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { ToggleSwitch } from './ToggleSwitch';
import { Section } from './Section';

// Type definitions
type GradingMethod = 'highest' | 'average' | 'first' | 'last';

interface FeedbackItem {
  id: string;
  gradeBoundary: string;
  feedback: string;
}

interface QuizFormData {
  // General
  name: string;
  introduction: string;
  timeLimit: number;
  attempts: number;
  gradingMethod: GradingMethod;
  showUserPicture: boolean;
  showBlocks: boolean;
  
  // Question behavior
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  showCorrectAnswers: boolean;
  showMarkDetails: boolean;
  allowReview: boolean;
  allowRedo: boolean;
  allowBackwards: boolean;
  
  // Layout
  showProgressBar: boolean;
  showQuestionNumbers: boolean;
  showQuestionInNavigation: boolean;
  showCurrentQuestion: boolean;
  showQuestionFeedback: boolean;
  showQuestionMarks: boolean;
  showTotalMarks: boolean;
  showGrade: boolean;
  showAttempts: boolean;
  showTime: boolean;
  showClock: boolean;
  
  // Review options - During the attempt
  showResponses: boolean;
  showMarks: boolean;
  showSpecificFeedback: boolean;
  showGeneralFeedback: boolean;
  showRightAnswer: boolean;
  
  // Review options - Later, while the quiz is still open
  laterShowResponses: boolean;
  laterShowMarks: boolean;
  laterShowSpecificFeedback: boolean;
  laterShowGeneralFeedback: boolean;
  laterShowRightAnswer: boolean;
  
  // Review options - After the quiz is closed
  afterShowResponses: boolean;
  afterShowMarks: boolean;
  afterShowSpecificFeedback: boolean;
  afterShowGeneralFeedback: boolean;
  afterShowRightAnswer: boolean;
  afterShowOverallFeedback: boolean;
  
  // Additional review settings
  showMarksInReview: boolean;
  
  // Overall Feedback
  feedbackItems: FeedbackItem[];
  
  // Appearance
  browserSecurity: 'none' | 'popup' | 'securewindow' | 'safetymode';
  
  // Safe Exam Browser
  requirePassword: boolean;
  browserPassword: string;
  allowedBrowserKeys: string;
  
  // Extra restrictions
  allowedIPAddresses: string;
  enforcedDelay: number;
  enforcedDelayBetweenAttempts: number;
  preventCopyPaste: boolean;
  requireNetworkAddress: boolean;
  
  // Common Module Settings
  availability: 'show' | 'hide' | 'stealth';
  idNumber: string;
  
  // Activity Completion
  completionTracking: 'none' | 'manual' | 'automatic';
  requireView: boolean;
  requireGrade: boolean;
  passingGrade: number;
  
  // Tags
  activityTags: string;
  
  // Competencies
  completeAllCompetencies: boolean;
  notifyCompetencyCompletion: boolean;
}

// Section Icons
const sectionIcons = {
  general: <Cog className="w-5 h-5" />,
  timing: <Clock className="w-5 h-5" />,
  grade: <BarChart2 className="w-5 h-5" />,
  layout: <Layout className="w-5 h-5" />,
  questionBehavior: <HelpCircle className="w-5 h-5" />,
  reviewOptions: <Eye className="w-5 h-5" />,
  appearance: <Palette className="w-5 h-5" />,
  safeExamBrowser: <Shield className="w-5 h-5" />,
  extraRestrictions: <Lock className="w-5 h-5" />,
  overallFeedback: <MessageSquare className="w-5 h-5" />,
  commonModuleSettings: <Settings className="w-5 h-5" />,
  restrictAccess: <Lock className="w-5 h-5" />,
  activityCompletion: <CheckCircle className="w-5 h-5" />,
  tags: <Tag className="w-5 h-5" />,
  competencies: <Award className="w-5 h-5" />,
} as const;

type SectionKey = keyof typeof sectionIcons;

interface QuizPageProps {
  onCancel?: () => void;
}

// Main QuizPage Component
export const QuizPage: React.FC<QuizPageProps> = ({ onCancel }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<QuizFormData>({
    // General
    name: '',
    introduction: '',
    timeLimit: 30,
    attempts: 3,
    gradingMethod: 'highest',
    showUserPicture: false,
    showBlocks: false,
    
    // Question behavior
    shuffleQuestions: false,
    shuffleAnswers: false,
    showCorrectAnswers: true,
    showMarkDetails: true,
    allowReview: true,
    allowRedo: false,
    allowBackwards: true,
    
    // Layout
    showProgressBar: true,
    showQuestionNumbers: true,
    showQuestionInNavigation: true,
    showCurrentQuestion: true,
    showQuestionFeedback: true,
    showQuestionMarks: true,
    showTotalMarks: true,
    showGrade: true,
    showAttempts: true,
    showTime: true,
    showClock: true,
    
    // Review options - During the attempt
    showResponses: true,
    showMarks: false,
    showSpecificFeedback: false,
    showGeneralFeedback: false,
    showRightAnswer: false,
    
    // Review options - Later, while the quiz is still open
    laterShowResponses: true,
    laterShowMarks: true,
    laterShowSpecificFeedback: true,
    laterShowGeneralFeedback: true,
    laterShowRightAnswer: true,
    
    // Review options - After the quiz is closed
    afterShowResponses: true,
    afterShowMarks: true,
    afterShowSpecificFeedback: true,
    afterShowGeneralFeedback: true,
    afterShowRightAnswer: true,
    afterShowOverallFeedback: true,
    
    // Additional review settings
    showMarksInReview: true,
    
    // Overall Feedback
    feedbackItems: [
      { id: '1', gradeBoundary: '100%', feedback: '' },
      { id: '2', gradeBoundary: '', feedback: '' },
      { id: '3', gradeBoundary: '0%', feedback: '' },
    ],
    
    // Appearance
    browserSecurity: 'none',
    
    // Safe Exam Browser
    requirePassword: false,
    browserPassword: '',
    allowedBrowserKeys: 'F1, F2, F3, F4, F5, F6, F7, F9, F10, F11, F12, Tab, Ctrl+Shift+W, Alt+Left, Alt+Right, Ctrl+Shift+Tab, Alt+Tab, Alt+F4',
    
    // Extra restrictions
    allowedIPAddresses: '',
    enforcedDelay: 0,
    enforcedDelayBetweenAttempts: 0,
    preventCopyPaste: false,
    requireNetworkAddress: false,
    
    // Common Module Settings
    availability: 'show',
    idNumber: '',
    
    // Activity Completion
    completionTracking: 'none',
    requireView: false,
    requireGrade: false,
    passingGrade: 70,
    
    // Tags
    activityTags: '',
    
    // Competencies
    completeAllCompetencies: false,
    notifyCompetencyCompletion: false
  });

  // Section state
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    general: true,
    timing: false,
    grade: false,
    layout: false,
    questionBehavior: false,
    reviewOptions: false,
    appearance: false,
    safeExamBrowser: false,
    extraRestrictions: false,
    overallFeedback: true,
    commonModuleSettings: false,
    restrictAccess: false,
    activityCompletion: false,
    tags: false,
    competencies: false,
  });

  // Toggle section visibility
  const toggleSection = (section: SectionKey) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      console.log('Submitting form:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Quiz saved successfully!');
      handleCancel();
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Failed to save quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add a New Quiz</h1>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="quiz-form"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save and Return to Course'}
          </button>
        </div>
      </div>

      <form id="quiz-form" onSubmit={handleSubmit} className="space-y-6">
        {/* General Section */}
        <Section
          title="General"
          icon={sectionIcons.general}
          isOpen={openSections.general}
          onToggle={() => toggleSection('general')}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter quiz name"
              />
            </div>

            <div>
              <label htmlFor="introduction" className="block text-sm font-medium text-gray-700 mb-1">
                Introduction
              </label>
              <RichTextEditor
                value={formData.introduction}
                onChange={(value) => setFormData(prev => ({ ...prev, introduction: value }))}
                placeholder="Enter quiz introduction..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-1">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  id="timeLimit"
                  name="timeLimit"
                  min="1"
                  value={formData.timeLimit}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="attempts" className="block text-sm font-medium text-gray-700 mb-1">
                  Attempts Allowed
                </label>
                <input
                  type="number"
                  id="attempts"
                  name="attempts"
                  min="0"
                  value={formData.attempts}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="gradingMethod" className="block text-sm font-medium text-gray-700 mb-1">
                Grading Method
              </label>
              <select
                id="gradingMethod"
                name="gradingMethod"
                value={formData.gradingMethod}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="highest">Highest grade</option>
                <option value="average">Average grade</option>
                <option value="first">First attempt</option>
                <option value="last">Last attempt</option>
              </select>
            </div>
          </div>
        </Section>

        {/* Layout Section */}
        <Section
          title="Layout"
          icon={sectionIcons.layout}
          isOpen={openSections.layout}
          onToggle={() => toggleSection('layout')}
        >
          <div className="space-y-4">
            <ToggleSwitch
              checked={formData.showProgressBar}
              onChange={(checked) => setFormData(prev => ({ ...prev, showProgressBar: checked }))}
              label="Show progress bar"
              description="Show a progress bar during the attempt."
            />
            <ToggleSwitch
              checked={formData.showQuestionNumbers}
              onChange={(checked) => setFormData(prev => ({ ...prev, showQuestionNumbers: checked }))}
              label="Show question numbers"
              description="Show question numbers next to each question."
            />
            <ToggleSwitch
              checked={formData.showQuestionInNavigation}
              onChange={(checked) => setFormData(prev => ({ ...prev, showQuestionInNavigation: checked }))}
              label="Show question in navigation"
              description="Show question text in the navigation panel."
            />
            <ToggleSwitch
              checked={formData.showCurrentQuestion}
              onChange={(checked) => setFormData(prev => ({ ...prev, showCurrentQuestion: checked }))}
              label="Show current question"
              description="Highlight the current question in the navigation."
            />
          </div>
        </Section>

        {/* Question Behavior Section */}
        <Section
          title="Question Behavior"
          icon={sectionIcons.questionBehavior}
          isOpen={openSections.questionBehavior}
          onToggle={() => toggleSection('questionBehavior')}
        >
          <div className="space-y-4">
            <ToggleSwitch
              checked={formData.shuffleQuestions}
              onChange={(checked) => setFormData(prev => ({ ...prev, shuffleQuestions: checked }))}
              label="Shuffle questions"
              description="Randomly shuffle the order of questions for each attempt."
            />
            <ToggleSwitch
              checked={formData.shuffleAnswers}
              onChange={(checked) => setFormData(prev => ({ ...prev, shuffleAnswers: checked }))}
              label="Shuffle answers"
              description="Randomly shuffle the order of answers within each question."
            />
            <ToggleSwitch
              checked={formData.showCorrectAnswers}
              onChange={(checked) => setFormData(prev => ({ ...prev, showCorrectAnswers: checked }))}
              label="Show correct answers"
              description="Show which answers are correct after the quiz is submitted."
            />
            <ToggleSwitch
              checked={formData.showMarkDetails}
              onChange={(checked) => setFormData(prev => ({ ...prev, showMarkDetails: checked }))}
              label="Show mark details"
              description="Show detailed marks for each question after submission."
            />
          </div>
        </Section>

        {/* Review Options Section */}
        <Section
          title="Review Options"
          icon={sectionIcons.reviewOptions}
          isOpen={openSections.reviewOptions}
          onToggle={() => toggleSection('reviewOptions')}
        >
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">During the attempt</h4>
              <div className="space-y-3 ml-4">
                <ToggleSwitch
                  checked={formData.showResponses}
                  onChange={(checked) => setFormData(prev => ({ ...prev, showResponses: checked }))}
                  label="The response"
                />
                <ToggleSwitch
                  checked={formData.showMarks}
                  onChange={(checked) => setFormData(prev => ({ ...prev, showMarks: checked }))}
                  label="Marks"
                />
                <ToggleSwitch
                  checked={formData.showSpecificFeedback}
                  onChange={(checked) => setFormData(prev => ({ ...prev, showSpecificFeedback: checked }))}
                  label="Specific feedback"
                />
                <ToggleSwitch
                  checked={formData.showGeneralFeedback}
                  onChange={(checked) => setFormData(prev => ({ ...prev, showGeneralFeedback: checked }))}
                  label="General feedback"
                />
                <ToggleSwitch
                  checked={formData.showRightAnswer}
                  onChange={(checked) => setFormData(prev => ({ ...prev, showRightAnswer: checked }))}
                  label="Right answer"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Later, while the quiz is still open</h4>
              <div className="space-y-3 ml-4">
                <ToggleSwitch
                  checked={formData.laterShowResponses}
                  onChange={(checked) => setFormData(prev => ({ ...prev, laterShowResponses: checked }))}
                  label="The response"
                />
                <ToggleSwitch
                  checked={formData.laterShowMarks}
                  onChange={(checked) => setFormData(prev => ({ ...prev, laterShowMarks: checked }))}
                  label="Marks"
                />
                <ToggleSwitch
                  checked={formData.laterShowSpecificFeedback}
                  onChange={(checked) => setFormData(prev => ({ ...prev, laterShowSpecificFeedback: checked }))}
                  label="Specific feedback"
                />
                <ToggleSwitch
                  checked={formData.laterShowGeneralFeedback}
                  onChange={(checked) => setFormData(prev => ({ ...prev, laterShowGeneralFeedback: checked }))}
                  label="General feedback"
                />
                <ToggleSwitch
                  checked={formData.laterShowRightAnswer}
                  onChange={(checked) => setFormData(prev => ({ ...prev, laterShowRightAnswer: checked }))}
                  label="Right answer"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">After the quiz is closed</h4>
              <div className="space-y-3 ml-4">
                <ToggleSwitch
                  checked={formData.afterShowResponses}
                  onChange={(checked) => setFormData(prev => ({ ...prev, afterShowResponses: checked }))}
                  label="The response"
                />
                <ToggleSwitch
                  checked={formData.afterShowMarks}
                  onChange={(checked) => setFormData(prev => ({ ...prev, afterShowMarks: checked }))}
                  label="Marks"
                />
                <ToggleSwitch
                  checked={formData.afterShowSpecificFeedback}
                  onChange={(checked) => setFormData(prev => ({ ...prev, afterShowSpecificFeedback: checked }))}
                  label="Specific feedback"
                />
                <ToggleSwitch
                  checked={formData.afterShowGeneralFeedback}
                  onChange={(checked) => setFormData(prev => ({ ...prev, afterShowGeneralFeedback: checked }))}
                  label="General feedback"
                />
                <ToggleSwitch
                  checked={formData.afterShowRightAnswer}
                  onChange={(checked) => setFormData(prev => ({ ...prev, afterShowRightAnswer: checked }))}
                  label="Right answer"
                />
                <ToggleSwitch
                  checked={formData.afterShowOverallFeedback}
                  onChange={(checked) => setFormData(prev => ({ ...prev, afterShowOverallFeedback: checked }))}
                  label="Overall feedback"
                />
              </div>
            </div>

            <div className="pt-2">
              <ToggleSwitch
                checked={formData.showMarksInReview}
                onChange={(checked) => setFormData(prev => ({ ...prev, showMarksInReview: checked }))}
                label="Whether to show the student's score"
              />
            </div>
          </div>
        </Section>

        {/* Appearance Section */}
        <Section
          title="Appearance"
          icon={sectionIcons.appearance}
          isOpen={openSections.appearance}
          onToggle={() => toggleSection('appearance')}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="browserSecurity" className="block text-sm font-medium text-gray-700 mb-1">
                Browser security
              </label>
              <select
                id="browserSecurity"
                name="browserSecurity"
                value={formData.browserSecurity}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="none">None</option>
                <option value="popup">Pop-up window with some JavaScript security</option>
                <option value="securewindow">Pop-up window with full screen</option>
                <option value="safetymode">Safe Exam Browser with client configuration</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                You can select to use Safe Exam Browser to restrict student's ability to use other applications while taking the quiz.
              </p>
            </div>

            <div>
              <label htmlFor="showUserPicture" className="block text-sm font-medium text-gray-700 mb-1">
                Show the user's picture
              </label>
              <select
                id="showUserPicture"
                name="showUserPicture"
                value={formData.showUserPicture ? '1' : '0'}
                onChange={(e) => setFormData(prev => ({ ...prev, showUserPicture: e.target.value === '1' }))}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                If enabled, the student's name and picture will be shown on-screen during the attempt, and on the review screen.
              </p>
            </div>
          </div>
        </Section>

        {/* Safe Exam Browser Section */}
        <Section
          title="Safe Exam Browser"
          icon={sectionIcons.safeExamBrowser}
          isOpen={openSections.safeExamBrowser}
          onToggle={() => toggleSection('safeExamBrowser')}
        >
          <div className="space-y-4">
            <ToggleSwitch
              checked={formData.requirePassword}
              onChange={(checked) => setFormData(prev => ({ ...prev, requirePassword: checked }))}
              label="Require password"
              description="If enabled, students must enter the password before they can start an attempt."
            />
            
            {formData.requirePassword && (
              <div>
                <label htmlFor="browserPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="browserPassword"
                  name="browserPassword"
                  value={formData.browserPassword}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter password"
                />
              </div>
            )}

            <div>
              <label htmlFor="allowedBrowserKeys" className="block text-sm font-medium text-gray-700 mb-1">
                Allowed browser keys
              </label>
              <input
                type="text"
                id="allowedBrowserKeys"
                name="allowedBrowserKeys"
                value={formData.allowedBrowserKeys}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g., F1, F2, F3, F4, F5, F6, F7, F9, F10, F11, F12"
              />
              <p className="mt-1 text-xs text-gray-500">
                List of browser keys students are allowed to use during the quiz. Separate keys with commas.
              </p>
            </div>
          </div>
        </Section>

        {/* Extra Restrictions on Attempts Section */}
        <Section
          title="Extra Restrictions on Attempts"
          icon={sectionIcons.extraRestrictions}
          isOpen={openSections.extraRestrictions}
          onToggle={() => toggleSection('extraRestrictions')}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="allowedIPAddresses" className="block text-sm font-medium text-gray-700 mb-1">
                Allowed IP addresses
              </label>
              <input
                type="text"
                id="allowedIPAddresses"
                name="allowedIPAddresses"
                value={formData.allowedIPAddresses}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g., 123.45.67.89, 98.76.54.32"
              />
              <p className="mt-1 text-xs text-gray-500">
                Restrict access to specific IP addresses. Leave empty for no restriction.
              </p>
            </div>

            <div>
              <label htmlFor="enforcedDelay" className="block text-sm font-medium text-gray-700 mb-1">
                Enforced delay between 1st and 2nd attempts (minutes)
              </label>
              <input
                type="number"
                id="enforcedDelay"
                name="enforcedDelay"
                min="0"
                value={formData.enforcedDelay}
                onChange={handleInputChange}
                className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="enforcedDelayBetweenAttempts" className="block text-sm font-medium text-gray-700 mb-1">
                Enforced delay between later attempts (minutes)
              </label>
              <input
                type="number"
                id="enforcedDelayBetweenAttempts"
                name="enforcedDelayBetweenAttempts"
                min="0"
                value={formData.enforcedDelayBetweenAttempts}
                onChange={handleInputChange}
                className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <ToggleSwitch
              checked={formData.preventCopyPaste}
              onChange={(checked) => setFormData(prev => ({ ...prev, preventCopyPaste: checked }))}
              label="Prevent copy and paste"
              description="If enabled, students will not be able to copy and paste text in the quiz."
            />

            <ToggleSwitch
              checked={formData.requireNetworkAddress}
              onChange={(checked) => setFormData(prev => ({ ...prev, requireNetworkAddress: checked }))}
              label="Require network address"
              description="If enabled, students must be connected to a specific network to attempt the quiz."
            />
          </div>
        </Section>

        {/* Overall Feedback Section */}
        <Section
          title={
            <div className="flex items-center">
              <span>Overall Feedback</span>
              <Info className="w-4 h-4 ml-2 text-gray-400" />
              <span className="ml-2 text-sm text-gray-500 font-normal">(Optional)</span>
            </div>
          }
          icon={null}
          isOpen={openSections.overallFeedback}
          onToggle={() => toggleSection('overallFeedback')}
        >
          <div className="space-y-6">
            {formData.feedbackItems.map((item, index) => (
              <div key={item.id} className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-700">Grade boundary</span>
                  <span className="text-sm text-gray-500">
                    {item.gradeBoundary || 'No value'}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback
                  </label>
                  <RichTextEditor
                    value={item.feedback}
                    onChange={(value) => {
                      const updatedItems = [...formData.feedbackItems];
                      updatedItems[index].feedback = value;
                      setFormData(prev => ({
                        ...prev,
                        feedbackItems: updatedItems
                      }));
                    }}
                    placeholder="Enter feedback for this grade boundary..."
                    className="mt-1"
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => {
                const newId = (formData.feedbackItems.length + 1).toString();
                setFormData(prev => ({
                  ...prev,
                  feedbackItems: [
                    ...prev.feedbackItems,
                    { id: newId, gradeBoundary: '', feedback: '' },
                    { id: (parseInt(newId) + 1).toString(), gradeBoundary: '', feedback: '' },
                    { id: (parseInt(newId) + 2).toString(), gradeBoundary: '', feedback: '' }
                  ]
                }));
              }}
              className="mx-auto flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add 3 more feedback fields
            </button>
          </div>
        </Section>

        {/* Common Module Settings Section */}
        <Section
          title="Common Module Settings"
          icon={sectionIcons.commonModuleSettings}
          isOpen={openSections.commonModuleSettings}
          onToggle={() => toggleSection('commonModuleSettings')}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="show">Show on course page</option>
                <option value="hide">Hide from students</option>
                <option value="stealth">Make available but don't show on course page</option>
              </select>
            </div>

            <div>
              <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-1">
                ID number
              </label>
              <input
                type="text"
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter ID number"
              />
            </div>
          </div>
        </Section>

        {/* Activity Completion Section */}
        <Section
          title="Activity Completion"
          icon={sectionIcons.activityCompletion}
          isOpen={openSections.activityCompletion}
          onToggle={() => toggleSection('activityCompletion')}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="completionTracking" className="block text-sm font-medium text-gray-700 mb-1">
                Completion tracking
              </label>
              <select
                id="completionTracking"
                name="completionTracking"
                value={formData.completionTracking}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="none">Do not indicate activity completion</option>
                <option value="manual">Students can manually mark the activity as completed</option>
                <option value="automatic">Show activity as complete when conditions are met</option>
              </select>
            </div>

            {formData.completionTracking === 'automatic' && (
              <div className="ml-6 space-y-4">
                <ToggleSwitch
                  checked={formData.requireView}
                  onChange={(checked) => setFormData(prev => ({ ...prev, requireView: checked }))}
                  label="Require view"
                  description="Student must view this activity to complete it"
                />
                
                <ToggleSwitch
                  checked={formData.requireGrade}
                  onChange={(checked) => setFormData(prev => ({ ...prev, requireGrade: checked }))}
                  label="Require grade"
                  description="Student must receive a grade to complete this activity"
                />
                
                <div className="pl-6">
                  <label htmlFor="passingGrade" className="block text-sm font-medium text-gray-700 mb-1">
                    Passing grade
                  </label>
                  <input
                    type="number"
                    id="passingGrade"
                    name="passingGrade"
                    min="0"
                    max="100"
                    value={formData.passingGrade}
                    onChange={handleInputChange}
                    className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="0-100"
                  />
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* Tags Section */}
        <Section
          title="Tags"
          icon={sectionIcons.tags}
          isOpen={openSections.tags}
          onToggle={() => toggleSection('tags')}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="activityTags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                id="activityTags"
                name="activityTags"
                value={formData.activityTags}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Add tags separated by commas"
              />
            </div>
            
            <div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.activityTags.split(',').filter(tag => tag.trim() !== '').map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {tag.trim()}
                    <button
                      type="button"
                      onClick={() => {
                        const updatedTags = formData.activityTags.split(',')
                          .filter((_, i) => i !== index)
                          .join(',');
                        setFormData(prev => ({
                          ...prev,
                          activityTags: updatedTags
                        }));
                      }}
                      className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600 focus:outline-none"
                    >
                      <span className="sr-only">Remove tag</span>
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Competencies Section */}
        <Section
          title="Competencies"
          icon={sectionIcons.competencies}
          isOpen={openSections.competencies}
          onToggle={() => toggleSection('competencies')}
        >
          <div className="space-y-4">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Competencies are not enabled for this site. Please contact your site administrator if you need this feature.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled
              >
                <Plus className="w-4 h-4 mr-2" />
                Add competency
              </button>
              <p className="mt-2 text-sm text-gray-500">
                No competencies have been added to this activity.
              </p>
            </div>
          </div>
        </Section>
      </form>
    </div>
  );
};

export default QuizPage;