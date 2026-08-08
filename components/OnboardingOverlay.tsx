
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface Step {
  targetId: string;
  title: string;
  content: string;
}

interface OnboardingOverlayProps {
  steps: Step[];
  onComplete: () => void;
  onSkip?: () => void;
}

const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({ steps, onComplete, onSkip }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  
  const currentStep = steps[currentStepIndex];

  const updateTargetRect = () => {
    const element = document.getElementById(currentStep.targetId);
    if (element) {
      // Scroll element into view if needed
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
    } else {
      // If element not found (e.g. mobile hidden), skip or complete
      console.warn(`Target element ${currentStep.targetId} not found.`);
      // For robustness, we could auto-advance, but let's just stay put or finish
      // to avoid infinite loops if nothing is found.
    }
  };

  useEffect(() => {
    // Initial calculation with a slight delay for rendering
    const timer = setTimeout(updateTargetRect, 500);
    
    const handleResize = () => {
        if (targetRect) updateTargetRect();
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [currentStepIndex, currentStep.targetId]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  if (!targetRect) return null;

  // Determine tooltip position (top or bottom relative to target)
  const isBottomHalf = targetRect.top > window.innerHeight / 2;
  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    left: Math.max(10, Math.min(window.innerWidth - 330, targetRect.left)), // Keep inside screen
    zIndex: 60,
  };

  if (isBottomHalf) {
    tooltipStyle.bottom = window.innerHeight - targetRect.top + 20;
  } else {
    tooltipStyle.top = targetRect.bottom + 20;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Spotlight Effect - using a massive box-shadow on a div placed over the target */}
      <div 
        className="absolute transition-all duration-300 ease-in-out pointer-events-auto"
        style={{
          top: targetRect.top - 5,
          left: targetRect.left - 5,
          width: targetRect.width + 10,
          height: targetRect.height + 10,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
          borderRadius: '8px',
        }}
      />

      {/* Tooltip Card */}
      <div 
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-[320px] pointer-events-auto border border-gray-200 dark:border-gray-700 transition-all duration-300"
        style={tooltipStyle}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-green-700 dark:text-green-400">{currentStep.title}</h3>
          <span className="text-xs text-gray-500 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {currentStepIndex + 1} / {steps.length}
          </span>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
          {currentStep.content}
        </p>
        
        <div className="flex justify-between items-center">
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-medium px-2"
          >
            Skip
          </button>
          
          <div className="flex gap-2">
            {currentStepIndex > 0 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-lg text-sm font-bold text-white bg-green-600 hover:bg-green-700 shadow-md transition-transform transform active:scale-95"
            >
              {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
        
        {/* Decorative Arrow */}
        <div 
          className="absolute w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45 border-l border-t border-gray-200 dark:border-gray-700"
          style={{
            left: Math.min(Math.max(20, targetRect.left - (tooltipStyle.left as number) + targetRect.width / 2), 280),
            [isBottomHalf ? 'bottom' : 'top']: -8,
            borderTop: isBottomHalf ? 'none' : undefined,
            borderLeft: isBottomHalf ? 'none' : undefined,
            borderBottom: isBottomHalf ? '1px solid #e5e7eb' : undefined,
            borderRight: isBottomHalf ? '1px solid #e5e7eb' : undefined,
            borderColor: 'inherit'
          }}
        />
      </div>
    </div>,
    document.body
  );
};

export default OnboardingOverlay;
