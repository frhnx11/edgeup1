import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClassTestLoadingTransition } from '../../../../components/upsc/common/ClassTestLoadingTransition';
import { TestAcknowledgment } from '../../../../components/upsc/common/TestAcknowledgment';

export function ClassTestPage() {
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(true);
  const [showAcknowledgment, setShowAcknowledgment] = useState(false);

  const handleLoadingComplete = () => {
    setShowLoading(false);
    setShowAcknowledgment(true);
  };

  const handleAcknowledgment = () => {
    navigate('/test');
  };

  if (showLoading) {
    return <ClassTestLoadingTransition onComplete={handleLoadingComplete} />;
  }

  if (showAcknowledgment) {
    return <TestAcknowledgment onConfirm={handleAcknowledgment} />;
  }

  return null;
}