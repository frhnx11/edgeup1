import { useEffect, useRef } from 'react';
import type { MultimediaQuestion } from '../../../utils/questionBank';

interface MultimediaQuestionProps {
  question: MultimediaQuestion;
  selectedAnswer: number | null;
  onAnswer: (index: number) => void;
}

export function MultimediaQuestionComponent({ question, selectedAnswer, onAnswer }: MultimediaQuestionProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play audio if specified
    if (question.media?.type === 'audio' && question.media.autoplay && audioRef.current) {
      audioRef.current.play();
    }
    // Auto-play video if specified
    if (question.media?.type === 'video' && question.media.autoplay && videoRef.current) {
      videoRef.current.play();
    }
  }, [question]);

  const renderMedia = () => {
    if (!question.media) return null;

    switch (question.media.type) {
      case 'animation':
      case 'image':
        if (question.media.data) {
          return (
            <div className="w-full max-w-2xl mx-auto mb-6">
              <div dangerouslySetInnerHTML={{ __html: question.media.data }} />
            </div>
          );
        } else if (question.media.url) {
          return (
            <div className="w-full max-w-2xl mx-auto mb-6">
              <img src={question.media.url} alt="Question visual" className="w-full rounded-lg shadow-lg" />
            </div>
          );
        }
        break;

      case 'audio':
        return (
          <div className="w-full max-w-md mx-auto mb-6">
            <audio
              ref={audioRef}
              controls
              className="w-full"
              src={question.media.url}
            >
              Your browser does not support the audio element.
            </audio>
            {question.media.duration && (
              <p className="text-sm text-gray-600 mt-2">
                Duration: {question.media.duration} seconds
              </p>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="w-full max-w-2xl mx-auto mb-6">
            <video
              ref={videoRef}
              controls
              className="w-full rounded-lg shadow-lg"
              src={question.media.url}
            >
              Your browser does not support the video element.
            </video>
          </div>
        );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Question Text */}
      <h3 className="text-xl font-semibold text-gray-800">{question.text}</h3>
      
      {/* Media Content */}
      {renderMedia()}
      
      {/* Answer Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              selectedAnswer === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswer === index
                    ? 'border-blue-500'
                    : 'border-gray-300'
                }`}
              >
                {selectedAnswer === index && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                )}
              </div>
              <span className="text-gray-700">{option}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}