import { motion } from 'framer-motion';
import { Brain, Activity, Zap } from 'lucide-react';

/**
 * Analysis Visualization - Neural network animation showing active processing
 * Features: neural connections, data flow, brain activity patterns
 */
export function AnalysisVisualization() {
  // Node positions for neural network
  const nodes = [
    { x: 20, y: 20 },
    { x: 50, y: 15 },
    { x: 80, y: 25 },
    { x: 35, y: 50 },
    { x: 65, y: 55 },
    { x: 20, y: 80 },
    { x: 50, y: 75 },
    { x: 80, y: 85 }
  ];

  // Connection lines between nodes
  const connections = [
    [0, 1], [1, 2], [0, 3], [1, 4], [2, 4],
    [3, 5], [3, 6], [4, 6], [4, 7], [6, 7]
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(16, 172, 139, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 172, 139, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Neural network connections */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map(([ startIdx, endIdx], i) => {
          const start = nodes[startIdx];
          const end = nodes[endIdx];

          return (
            <motion.line
              key={i}
              x1={`${start.x}%`}
              y1={`${start.y}%`}
              x2={`${end.x}%`}
              y2={`${end.y}%`}
              stroke="rgba(16, 172, 139, 0.4)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 1],
                opacity: [0, 0.8, 0.3]
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
          );
        })}

        {/* Data packets moving along connections */}
        {connections.map(([startIdx, endIdx], i) => {
          const start = nodes[startIdx];
          const end = nodes[endIdx];

          return (
            <motion.circle
              key={`packet-${i}`}
              r="3"
              fill="#10ac8b"
              initial={{
                cx: `${start.x}%`,
                cy: `${start.y}%`,
                opacity: 0
              }}
              animate={{
                cx: [`${start.x}%`, `${end.x}%`],
                cy: [`${start.y}%`, `${end.y}%`],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 1.5
              }}
            />
          );
        })}
      </svg>

      {/* Neural nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2,
            delay: i * 0.15,
            repeat: Infinity
          }}
        />
      ))}

      {/* Central brain icon with pulse */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity
        }}
      >
        <div className="relative">
          <Brain className="w-8 h-8 text-cyan-400" />
          <motion.div
            className="absolute inset-0 bg-cyan-400 rounded-full blur-xl"
            animate={{
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          />
        </div>
      </motion.div>

      {/* Activity indicators */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={`activity-${i}`}
          className="absolute"
          style={{
            left: `${25 + i * 20}%`,
            bottom: '10%'
          }}
          initial={{ scaleY: 0 }}
          animate={{
            scaleY: [0, 1, 0.5, 1, 0]
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.2,
            repeat: Infinity
          }}
        >
          <div className="w-1 h-8 bg-gradient-to-t from-cyan-400 to-green-400 rounded-full" />
        </motion.div>
      ))}

      {/* Scanning waveform */}
      <motion.div
        className="absolute bottom-4 left-4 right-4 h-12 flex items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="flex-1 bg-cyan-400/40 rounded-full"
            animate={{
              height: ['20%', '100%', '20%']
            }}
            transition={{
              duration: 1,
              delay: i * 0.05,
              repeat: Infinity,
              repeatDelay: 1
            }}
          />
        ))}
      </motion.div>

      {/* Zap icons for processing */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`zap-${i}`}
          className="absolute"
          style={{
            left: `${30 + i * 15}%`,
            top: `${35 + (i % 2) * 30}%`
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            rotate: [0, 180]
          }}
          transition={{
            duration: 1,
            delay: i * 0.25,
            repeat: Infinity,
            repeatDelay: 2
          }}
        >
          <Zap className="w-4 h-4 text-yellow-400" />
        </motion.div>
      ))}

      {/* Processing text */}
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-mono text-cyan-400"
        animate={{
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity
        }}
      >
        [ ANALYZING DATA ]
      </motion.div>
    </div>
  );
}
