import { useState } from 'react';

interface Activity {
  id: string;
  name: string;
  category: 'coding' | 'sports' | 'arts' | 'science' | 'languages' | 'leadership';
  description: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  schedule: string;
  instructor: string;
  enrollmentStatus: 'enrolled' | 'available' | 'full';
  progress?: number;
  studentsEnrolled: number;
  maxCapacity: number;
  achievements?: string[];
}

const Skills = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const activities: Activity[] = [
    {
      id: '1',
      name: 'Python Programming',
      category: 'coding',
      description: 'Learn Python from basics to advanced concepts including data structures, algorithms, and web development.',
      skillLevel: 'beginner',
      duration: '12 weeks',
      schedule: 'Mon & Wed, 4:00 PM',
      instructor: 'Prof. Sarah Martinez',
      enrollmentStatus: 'enrolled',
      progress: 65,
      studentsEnrolled: 24,
      maxCapacity: 30,
      achievements: ['Completed 3 projects', 'Python Basics Certified']
    },
    {
      id: '2',
      name: 'Basketball Training',
      category: 'sports',
      description: 'Professional basketball training covering fundamentals, team strategies, and competitive gameplay.',
      skillLevel: 'intermediate',
      duration: '16 weeks',
      schedule: 'Tue & Thu, 5:00 PM',
      instructor: 'Coach Michael Jordan',
      enrollmentStatus: 'enrolled',
      progress: 45,
      studentsEnrolled: 18,
      maxCapacity: 20,
      achievements: ['Team Captain', 'MVP Award']
    },
    {
      id: '3',
      name: 'Guitar Masterclass',
      category: 'arts',
      description: 'Master acoustic and electric guitar with focus on music theory, technique, and performance.',
      skillLevel: 'intermediate',
      duration: '20 weeks',
      schedule: 'Wed & Fri, 3:30 PM',
      instructor: 'Ms. Priya Lakshmi',
      enrollmentStatus: 'available',
      studentsEnrolled: 12,
      maxCapacity: 15
    },
    {
      id: '4',
      name: 'Robotics & AI',
      category: 'science',
      description: 'Build and program robots using Arduino, Raspberry Pi, and explore artificial intelligence concepts.',
      skillLevel: 'advanced',
      duration: '14 weeks',
      schedule: 'Sat, 10:00 AM',
      instructor: 'Dr. Vishnu Prasad',
      enrollmentStatus: 'enrolled',
      progress: 80,
      studentsEnrolled: 15,
      maxCapacity: 15,
      achievements: ['National Robotics Competition Winner', 'AI Project Excellence']
    },
    {
      id: '5',
      name: 'Spanish Language',
      category: 'languages',
      description: 'Comprehensive Spanish course focusing on conversation, grammar, and cultural immersion.',
      skillLevel: 'beginner',
      duration: '24 weeks',
      schedule: 'Mon, Wed & Fri, 2:00 PM',
      instructor: 'Prof. Maria Rodriguez',
      enrollmentStatus: 'available',
      studentsEnrolled: 20,
      maxCapacity: 25
    },
    {
      id: '6',
      name: 'Debate Club',
      category: 'leadership',
      description: 'Develop critical thinking, public speaking, and argumentation skills through competitive debates.',
      skillLevel: 'intermediate',
      duration: 'Ongoing',
      schedule: 'Thursday, 4:00 PM',
      instructor: 'Prof. David Thompson',
      enrollmentStatus: 'enrolled',
      progress: 55,
      studentsEnrolled: 16,
      maxCapacity: 20,
      achievements: ['State Debate Champion', 'Best Speaker Award']
    },
    {
      id: '7',
      name: 'Football Academy',
      category: 'sports',
      description: 'Elite football training program with focus on skills, tactics, and physical conditioning.',
      skillLevel: 'intermediate',
      duration: '20 weeks',
      schedule: 'Tue, Thu & Sat, 5:30 PM',
      instructor: 'Coach Robert Brown',
      enrollmentStatus: 'available',
      studentsEnrolled: 22,
      maxCapacity: 25
    },
    {
      id: '8',
      name: 'Digital Art & Design',
      category: 'arts',
      description: 'Create stunning digital artwork using Photoshop, Illustrator, and digital painting techniques.',
      skillLevel: 'beginner',
      duration: '10 weeks',
      schedule: 'Mon & Wed, 3:00 PM',
      instructor: 'Ms. Meenakshi Sundaram',
      enrollmentStatus: 'available',
      studentsEnrolled: 18,
      maxCapacity: 20
    },
    {
      id: '9',
      name: 'Chess Mastery',
      category: 'leadership',
      description: 'Advanced chess strategies, tactics, and competitive tournament preparation.',
      skillLevel: 'advanced',
      duration: 'Ongoing',
      schedule: 'Friday, 3:30 PM',
      instructor: 'Grandmaster Surya Prakash',
      enrollmentStatus: 'full',
      studentsEnrolled: 12,
      maxCapacity: 12
    },
    {
      id: '10',
      name: 'Web Development',
      category: 'coding',
      description: 'Full-stack web development with HTML, CSS, JavaScript, React, and Node.js.',
      skillLevel: 'advanced',
      duration: '16 weeks',
      schedule: 'Tue & Thu, 4:30 PM',
      instructor: 'Prof. Anna Lee',
      enrollmentStatus: 'available',
      studentsEnrolled: 14,
      maxCapacity: 20
    },
    {
      id: '11',
      name: 'Physics Lab Projects',
      category: 'science',
      description: 'Hands-on physics experiments and projects exploring mechanics, electronics, and thermodynamics.',
      skillLevel: 'intermediate',
      duration: '12 weeks',
      schedule: 'Wednesday, 2:30 PM',
      instructor: 'Dr. Vishnu Prasad',
      enrollmentStatus: 'available',
      studentsEnrolled: 16,
      maxCapacity: 18
    },
    {
      id: '12',
      name: 'French Conversation',
      category: 'languages',
      description: 'Interactive French language course with emphasis on speaking and listening skills.',
      skillLevel: 'intermediate',
      duration: '20 weeks',
      schedule: 'Mon & Thu, 3:00 PM',
      instructor: 'Prof. Sophie Laurent',
      enrollmentStatus: 'enrolled',
      progress: 35,
      studentsEnrolled: 15,
      maxCapacity: 18,
      achievements: ['French Poetry Recitation Award']
    }
  ];

  const categoryColors = {
    coding: '#06b6d4',
    sports: '#10ac8b',
    arts: '#f59e0b',
    science: '#8b5cf6',
    languages: '#ef4444',
    leadership: '#3b82f6'
  };

  const categoryIcons = {
    coding: 'fa-code',
    sports: 'fa-basketball-ball',
    arts: 'fa-palette',
    science: 'fa-flask',
    languages: 'fa-language',
    leadership: 'fa-users'
  };

  const levelColors = {
    beginner: '#10ac8b',
    intermediate: '#f59e0b',
    advanced: '#ef4444'
  };

  const filteredActivities = activities.filter(activity => {
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || activity.skillLevel === selectedLevel;
    const matchesStatus = selectedStatus === 'all' || activity.enrollmentStatus === selectedStatus;
    return matchesCategory && matchesLevel && matchesStatus;
  });

  const enrolledActivities = activities.filter(a => a.enrollmentStatus === 'enrolled').length;
  const totalHours = enrolledActivities * 24; // Assume 24 hours per activity
  const skillsMastered = activities.filter(a => a.progress && a.progress >= 80).length;
  const totalAchievements = activities.reduce((sum, a) => sum + (a.achievements?.length || 0), 0);

  const handleEnroll = (activity: Activity) => {
    if (activity.enrollmentStatus === 'available') {
      alert(`Enrolling in: ${activity.name}`);
    } else if (activity.enrollmentStatus === 'full') {
      alert('This activity is currently full. You can join the waitlist.');
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>
              <i className="fas fa-star" style={{ marginRight: '1rem', color: '#10ac8b' }}></i>
              Skills & Activities
            </h1>
            <p>Explore and develop your talents through extracurricular activities</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-info">
              <h4>Activities Enrolled</h4>
              <p className="stat-value">
                {enrolledActivities} <span className="stat-total">active</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-info">
              <h4>Hours Completed</h4>
              <p className="stat-value">
                {totalHours} <span className="stat-total">hours</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-trophy"></i>
            </div>
            <div className="stat-info">
              <h4>Skills Mastered</h4>
              <p className="stat-value">
                {skillsMastered} <span className="stat-total">skills</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-award"></i>
            </div>
            <div className="stat-info">
              <h4>Achievements</h4>
              <p className="stat-value">
                {totalAchievements} <span className="stat-total">earned</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section - Professional */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
              <i className="fas fa-filter"></i> Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#2d3748',
                background: 'white',
                cursor: 'pointer',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            >
              <option value="all">All Categories</option>
              <option value="coding">Coding & Technology</option>
              <option value="sports">Sports & Fitness</option>
              <option value="arts">Arts & Music</option>
              <option value="science">Science & Innovation</option>
              <option value="languages">Languages</option>
              <option value="leadership">Leadership & Clubs</option>
            </select>
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
              <i className="fas fa-layer-group"></i> Filter by Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#2d3748',
                background: 'white',
                cursor: 'pointer',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
              <i className="fas fa-user-check"></i> Filter by Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#2d3748',
                background: 'white',
                cursor: 'pointer',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            >
              <option value="all">All Activities</option>
              <option value="enrolled">My Activities</option>
              <option value="available">Available</option>
              <option value="full">Full</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedLevel('all');
                setSelectedStatus('all');
              }}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#f7fafc',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                color: '#2d3748',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <i className="fas fa-redo"></i> Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ margin: 0, color: '#718096', fontSize: '1rem', fontWeight: 600 }}>
          Showing <span style={{ color: '#10ac8b', fontWeight: 700 }}>{filteredActivities.length}</span> of {activities.length} activities
        </p>
      </div>

      {/* Activities Grid */}
      {filteredActivities.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              style={{
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                border: `2px solid ${categoryColors[activity.category]}20`,
                transition: 'all 0.3s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.12)';
                e.currentTarget.style.borderColor = categoryColors[activity.category];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = `${categoryColors[activity.category]}20`;
              }}
            >
              {/* Status Badge */}
              <div style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: activity.enrollmentStatus === 'enrolled' ? '#10ac8b' : activity.enrollmentStatus === 'full' ? '#ef4444' : '#3b82f6',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                zIndex: 10
              }}>
                {activity.enrollmentStatus === 'enrolled' ? 'Enrolled' : activity.enrollmentStatus === 'full' ? 'Full' : 'Available'}
              </div>

              {/* Activity Header */}
              <div style={{
                background: '#f7fafc',
                padding: '1.5rem',
                paddingTop: '3.5rem',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#094d88',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <i className={`fas ${categoryIcons[activity.category]}`} style={{ color: 'white', fontSize: '1.5rem' }}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.3 }}>
                      {activity.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{
                        background: '#e2e8f0',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '6px',
                        color: '#2d3748',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}>
                        {activity.category}
                      </span>
                      <span style={{
                        background: '#e2e8f0',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '6px',
                        color: '#2d3748',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}>
                        {activity.skillLevel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Content */}
              <div style={{ padding: '1.5rem' }}>
                <p style={{ margin: '0 0 1.5rem 0', color: '#718096', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {activity.description}
                </p>

                {/* Activity Info Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    background: '#f7fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>
                      Duration
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#2d3748', fontWeight: 700 }}>
                      <i className="fas fa-hourglass-half" style={{ marginRight: '0.5rem', color: categoryColors[activity.category] }}></i>
                      {activity.duration}
                    </p>
                  </div>

                  <div style={{
                    background: '#f7fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>
                      Schedule
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#2d3748', fontWeight: 700 }}>
                      <i className="fas fa-calendar-alt" style={{ marginRight: '0.5rem', color: categoryColors[activity.category] }}></i>
                      {activity.schedule}
                    </p>
                  </div>

                  <div style={{
                    background: '#f7fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    gridColumn: '1 / -1'
                  }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>
                      Instructor
                    </p>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#2d3748', fontWeight: 700 }}>
                      <i className="fas fa-chalkboard-teacher" style={{ marginRight: '0.5rem', color: categoryColors[activity.category] }}></i>
                      {activity.instructor}
                    </p>
                  </div>
                </div>

                {/* Enrollment Info */}
                <div style={{
                  background: '#f7fafc',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '0.85rem', color: '#2d3748', fontWeight: 600 }}>
                    <i className="fas fa-users" style={{ marginRight: '0.5rem', color: categoryColors[activity.category] }}></i>
                    Enrollment: {activity.studentsEnrolled}/{activity.maxCapacity}
                  </span>
                  <div style={{
                    width: '100px',
                    height: '6px',
                    background: '#e2e8f0',
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(activity.studentsEnrolled / activity.maxCapacity) * 100}%`,
                      height: '100%',
                      background: categoryColors[activity.category],
                      borderRadius: '10px'
                    }}></div>
                  </div>
                </div>

                {/* Progress (if enrolled) */}
                {activity.enrollmentStatus === 'enrolled' && activity.progress !== undefined && (
                  <div style={{
                    background: `${categoryColors[activity.category]}10`,
                    border: `2px solid ${categoryColors[activity.category]}30`,
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#2d3748', fontWeight: 600 }}>
                        Your Progress
                      </span>
                      <span style={{ fontSize: '1.25rem', color: categoryColors[activity.category], fontWeight: 700 }}>
                        {activity.progress}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '10px',
                      background: '#e2e8f0',
                      borderRadius: '10px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${activity.progress}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${categoryColors[activity.category]} 0%, ${categoryColors[activity.category]}dd 100%)`,
                        borderRadius: '10px',
                        transition: 'width 1s ease'
                      }}></div>
                    </div>
                  </div>
                )}

                {/* Achievements (if enrolled and has achievements) */}
                {activity.enrollmentStatus === 'enrolled' && activity.achievements && activity.achievements.length > 0 && (
                  <div style={{
                    background: '#fef3c7',
                    border: '2px solid #fbbf24',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#92400e', fontWeight: 700, textTransform: 'uppercase' }}>
                      <i className="fas fa-trophy" style={{ marginRight: '0.5rem' }}></i>
                      Your Achievements
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {activity.achievements.map((achievement, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <i className="fas fa-star" style={{ color: '#f59e0b', fontSize: '0.875rem' }}></i>
                          <span style={{ fontSize: '0.85rem', color: '#78350f', fontWeight: 600 }}>
                            {achievement}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {activity.enrollmentStatus === 'enrolled' ? (
                  <button
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(9, 77, 136, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(9, 77, 136, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(9, 77, 136, 0.3)';
                    }}
                  >
                    <i className="fas fa-play-circle"></i>
                    Continue Learning
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnroll(activity)}
                    disabled={activity.enrollmentStatus === 'full'}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: activity.enrollmentStatus === 'full' ? '#e2e8f0' : `linear-gradient(90deg, ${categoryColors[activity.category]} 0%, ${categoryColors[activity.category]}dd 100%)`,
                      border: 'none',
                      borderRadius: '12px',
                      color: activity.enrollmentStatus === 'full' ? '#718096' : 'white',
                      fontSize: '1rem',
                      fontWeight: 700,
                      cursor: activity.enrollmentStatus === 'full' ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: activity.enrollmentStatus === 'full' ? 'none' : `0 4px 12px ${categoryColors[activity.category]}40`
                    }}
                    onMouseEnter={(e) => {
                      if (activity.enrollmentStatus !== 'full') {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = `0 6px 16px ${categoryColors[activity.category]}50`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activity.enrollmentStatus !== 'full') {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = `0 4px 12px ${categoryColors[activity.category]}40`;
                      }
                    }}
                  >
                    {activity.enrollmentStatus === 'full' ? (
                      <>
                        <i className="fas fa-lock"></i>
                        Class Full
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus"></i>
                        Enroll Now
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '4rem 2rem',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#f7fafc',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <i className="fas fa-inbox" style={{ fontSize: '2rem', color: '#718096' }}></i>
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            No Activities Found
          </h3>
          <p style={{ margin: 0, color: '#718096', fontSize: '1rem' }}>
            Try adjusting your filters to see more activities
          </p>
        </div>
      )}
    </>
  );
};

export default Skills;
