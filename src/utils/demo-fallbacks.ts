// Demo mode fallbacks for when API keys are not available

export const demoResponses = {
  'math-algebra': {
    'en': `Algebra is the branch of mathematics that deals with symbols and the rules for manipulating those symbols. 

Linear equations are fundamental in algebra. A linear equation in one variable has the form ax + b = 0, where a and b are constants and a ≠ 0.

Key concepts in algebra include:

1. Variables and Constants
Variables are symbols (like x, y) that represent unknown values. Constants are fixed numbers.

2. Equations and Inequalities  
Equations show that two expressions are equal. Inequalities show relationships like greater than or less than.

3. Functions
Functions are mathematical relationships where each input has exactly one output.

4. Factoring
Breaking down expressions into products of simpler expressions.

5. Graphing
Visual representation of equations and functions on coordinate planes.

Real-world applications:
- Engineering calculations
- Financial modeling
- Physics equations
- Computer programming
- Architecture and design

Practice problems help reinforce these concepts. Start with simple equations and gradually work toward more complex systems.`,
    'hi': `बीजगणित गणित की वह शाखा है जो प्रतीकों और उन प्रतीकों को संचालित करने के नियमों से संबंधित है।

रैखिक समीकरण बीजगणित में मौलिक हैं। एक चर में रैखिक समीकरण का रूप ax + b = 0 होता है।

बीजगणित की मुख्य अवधारणाएं:

1. चर और स्थिरांक
चर वे प्रतीक हैं जो अज्ञात मानों को दर्शाते हैं।

2. समीकरण और असमानताएं
समीकरण दिखाते हैं कि दो व्यंजक बराबर हैं।

3. फलन
फलन गणितीय संबंध हैं।

व्यावहारिक उपयोग:
- इंजीनियरिंग गणना
- वित्तीय मॉडलिंग
- भौतिकी समीकरण

अभ्यास समस्याएं इन अवधारणाओं को मजबूत बनाने में मदद करती हैं।`
  },
  'physics-mechanics': {
    'en': `Classical mechanics is the foundation of physics, describing the motion of objects from particles to planets.

Newton's Laws form the cornerstone:

First Law (Inertia): An object at rest stays at rest, and an object in motion stays in motion unless acted upon by a force.

Second Law: Force equals mass times acceleration (F = ma). This is the fundamental equation of motion.

Third Law: For every action, there is an equal and opposite reaction.

Key concepts:

1. Kinematics - Motion without considering forces
- Displacement, velocity, acceleration
- Equations of motion for constant acceleration

2. Dynamics - Motion with forces
- Force analysis and free body diagrams
- Equilibrium and Newton's laws

3. Energy and Work
- Kinetic energy: KE = ½mv²
- Potential energy: PE = mgh
- Conservation of energy

4. Momentum
- Linear momentum: p = mv
- Conservation of momentum in collisions

Applications:
- Automotive engineering
- Aerospace design
- Sports biomechanics
- Structural engineering

Understanding these principles helps explain everything from walking to rocket launches.`
  }
};

export const demoFAQs = [
  {
    id: 'demo-faq-1',
    question: 'How do I solve linear equations?',
    answer: 'To solve linear equations, isolate the variable by performing the same operations on both sides. For example, in 2x + 3 = 7, subtract 3 from both sides to get 2x = 4, then divide by 2 to get x = 2. Always check your answer by substituting back into the original equation.',
    isOpen: false
  },
  {
    id: 'demo-faq-2',
    question: 'What is the difference between speed and velocity?',
    answer: 'Speed is a scalar quantity that measures how fast an object moves, while velocity is a vector quantity that includes both speed and direction. For example, a car moving at 60 mph has a speed of 60 mph, but its velocity would be 60 mph north (including direction).',
    isOpen: false
  },
  {
    id: 'demo-faq-3',
    question: 'How do I factor quadratic expressions?',
    answer: 'To factor quadratics like x² + 5x + 6, find two numbers that multiply to give the constant term (6) and add to give the coefficient of x (5). Here, 2 and 3 work: 2×3=6 and 2+3=5. So x² + 5x + 6 = (x + 2)(x + 3).',
    isOpen: false
  },
  {
    id: 'demo-faq-4',
    question: 'What is Newton\'s First Law?',
    answer: 'Newton\'s First Law states that an object at rest will stay at rest, and an object in motion will stay in motion at constant velocity, unless acted upon by an external force. This is also known as the Law of Inertia. It explains why you feel pushed back when a car accelerates.',
    isOpen: false
  }
];

export function getDemoResponse(subject: string, topic: string, language: string = 'en'): string {
  const key = `${subject.toLowerCase()}-${topic.toLowerCase()}`;
  const responses = demoResponses[key as keyof typeof demoResponses];
  
  if (responses) {
    return responses[language as keyof typeof responses] || responses['en'];
  }
  
  // Generic response if specific topic not found
  return `This is a demo response about ${topic} in ${subject}. In a real environment with API keys configured, you would get comprehensive, personalized explanations from advanced AI models.

Key learning points:
- Understand the fundamental concepts
- Practice with examples
- Apply knowledge to real-world situations
- Ask questions when concepts are unclear

This platform supports multiple languages and provides detailed, educational responses to help you master the subject.

To enable full AI features, configure your API keys in the environment settings.`;
}

export function getDemoFAQs(): Array<{id: string; question: string; answer: string; isOpen: boolean}> {
  return [...demoFAQs];
}

export function getDemoSpeechResponse(text: string): string {
  return `Demo mode: "${text.substring(0, 50)}..." - Speech-to-text would process your audio here.`;
}