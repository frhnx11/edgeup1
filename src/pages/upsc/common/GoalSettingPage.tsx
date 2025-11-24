import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, Target, Sparkles, CheckCircle2, School, Building2, Award
} from 'lucide-react';
import AssessmentQuiz from '../../../components/upsc/common/AssessmentQuiz';

export function GoalSettingPage() {
  const navigate = useNavigate();
  const [selectedStage, setSelectedStage] = useState('');
  const [showAssessment, setShowAssessment] = useState(false);

  // Map archetypes to student types
  const mapArchetypeToStudentType = (archetype: string): string => {
    const socialLearnerTypes = [
      'Social Learner',
      'Creative Explorer',
      'Gen-Z Maverick',
      'Struggling Fighter',
      'Enthusiastic Beginner'
    ];

    return socialLearnerTypes.includes(archetype) ? 'social-learner' : 'academic-achiever';
  };

  const handleStageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedStage) {
      alert('Please select a stage');
      return;
    }

    // Show assessment for all stages (school, college, and UPSC)
    setShowAssessment(true);
  };

  const handleAssessmentComplete = (archetype: string) => {
    console.log('🎯 Assessment Complete! Archetype:', archetype);

    // Map archetype to student type
    const studentType = mapArchetypeToStudentType(archetype);
    console.log('🎯 Mapped to student type:', studentType);

    // Save to localStorage
    localStorage.setItem('userStage', selectedStage);
    localStorage.setItem('userStudentType', studentType);
    localStorage.setItem('userArchetype', archetype);
    localStorage.setItem('goalData', JSON.stringify({
      stage: selectedStage,
      studentType,
      archetype,
      completedAt: new Date().toISOString()
    }));

    // Route based on stage and determined student type
    const routeMap: Record<string, Record<string, string>> = {
      school: {
        'social-learner': '/school/social-learner/student/classes',
        'academic-achiever': '/school/academic-achiever/student/classes'
      },
      college: {
        'social-learner': '/college/social-learner/student/dashboard',
        'academic-achiever': '/college/academic-achiever/student/dashboard'
      },
      upsc: {
        'social-learner': '/upsc/social-learner/student/dashboard',
        'academic-achiever': '/upsc/academic-achiever/student/dashboard'
      }
    };

    const route = routeMap[selectedStage]?.[studentType];
    console.log('🎯 Navigating to:', route);

    if (route) {
      navigate(route);
    } else {
      console.error('🎯 No route found for:', selectedStage, studentType);
    }
  };

  // If assessment is showing, render only the assessment
  if (showAssessment) {
    return <AssessmentQuiz onComplete={handleAssessmentComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 flex relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [-100, 100, -100],
            y: [0, -50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"
        />
      </div>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-1/4 bg-gradient-to-br from-brand-primary via-blue-700 to-indigo-800 text-white p-8 hidden lg:block relative overflow-hidden shadow-2xl"
      >
        {/* Sidebar Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="relative flex items-center gap-3 text-xl font-semibold mb-10"
        >
          <img
            src="/Logo.png"
            alt="Edgeup Logo"
            className="h-12 object-contain drop-shadow-lg"
          />
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative mt-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Quick Setup</span>
          </div>

          <h2 className="text-3xl font-bold mb-4 leading-tight">Discover Your Learning Style</h2>
          <p className="text-lg opacity-90 leading-relaxed">
            Take our smart assessment to find your perfect learning path. Select your stage and we'll guide you through a quick quiz to match you with the right approach!
          </p>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 space-y-4"
          >
            {[
              { icon: School, text: "Select Stage", completed: false },
              { icon: Target, text: "Take Assessment", completed: false },
              { icon: GraduationCap, text: "Start Learning", completed: false }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1 + idx * 0.1 }}
                className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -right-20 w-64 h-64 border-4 border-white/10 rounded-full"
        />
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          {/* Progress Bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-8 origin-left"
          >
            <div className="relative h-3 bg-white/60 backdrop-blur-sm rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '50%' }}
                transition={{ delay: 0.8, duration: 1 }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-primary via-blue-600 to-indigo-600 rounded-full shadow-lg"
              >
                <motion.div
                  animate={{ x: [0, 100, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </div>
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-4"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Step 1: Choose Your Stage</h2>
              <p className="text-gray-600 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Next, you'll take a quick assessment to determine your learning style
              </p>
            </motion.div>
          </motion.div>

          <form onSubmit={handleStageSubmit} className="space-y-6">
            {/* Stage Selection Only */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl text-white shadow-lg"
                  >
                    <School className="w-6 h-6" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900">Select Your Educational Stage</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* School */}
                  <motion.label
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${
                      selectedStage === 'school'
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-purple-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="stage"
                      value="school"
                      checked={selectedStage === 'school'}
                      onChange={(e) => setSelectedStage(e.target.value)}
                      className="sr-only"
                    />
                    <School className={`w-12 h-12 mx-auto mb-3 ${selectedStage === 'school' ? 'text-purple-600' : 'text-gray-400'}`} />
                    <h4 className="text-center font-bold text-gray-900">School</h4>
                    <p className="text-center text-sm text-gray-600 mt-1">K-12 Education</p>
                  </motion.label>

                  {/* College */}
                  <motion.label
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${
                      selectedStage === 'college'
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="stage"
                      value="college"
                      checked={selectedStage === 'college'}
                      onChange={(e) => setSelectedStage(e.target.value)}
                      className="sr-only"
                    />
                    <Building2 className={`w-12 h-12 mx-auto mb-3 ${selectedStage === 'college' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <h4 className="text-center font-bold text-gray-900">College</h4>
                    <p className="text-center text-sm text-gray-600 mt-1">Higher Education</p>
                  </motion.label>

                  {/* UPSC */}
                  <motion.label
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${
                      selectedStage === 'upsc'
                        ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-indigo-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="stage"
                      value="upsc"
                      checked={selectedStage === 'upsc'}
                      onChange={(e) => setSelectedStage(e.target.value)}
                      className="sr-only"
                    />
                    <Award className={`w-12 h-12 mx-auto mb-3 ${selectedStage === 'upsc' ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <h4 className="text-center font-bold text-gray-900">UPSC</h4>
                    <p className="text-center text-sm text-gray-600 mt-1">Civil Services</p>
                  </motion.label>
                </div>
              </div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              type="submit"
              disabled={!selectedStage}
              className="w-full bg-gradient-to-r from-brand-primary via-blue-600 to-indigo-600 text-white py-5 px-6 rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-200, 200] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <CheckCircle2 className="w-6 h-6" />
              <span className="relative z-10">
                Take Assessment
              </span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Sparkles className="w-6 h-6 relative z-10" />
              </motion.div>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
