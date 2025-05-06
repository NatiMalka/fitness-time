import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { useAppContext } from '../context/AppContext';

interface CompletionConfettiProps {
  show: boolean;
  duration?: number;
  message?: string;
  xpAmount?: number;
  onComplete?: () => void;
}

const CompletionConfetti: React.FC<CompletionConfettiProps> = ({
  show,
  duration = 3000,
  message,
  xpAmount,
  onComplete
}) => {
  const [visible, setVisible] = useState(false);
  const { language } = useAppContext();
  const isRtl = language === 'he';
  
  useEffect(() => {
    if (show) {
      setVisible(true);
      
      // Create canvas element for confetti if it doesn't exist
      let canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);
      }
      
      // Run confetti animation
      const myConfetti = confetti.create(canvas, {
        resize: true,
        useWorker: true
      });
      
      // First burst - centered from top
      myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.3 }
      });
      
      // Second burst - from left and right sides
      setTimeout(() => {
        myConfetti({
          particleCount: 50,
          angle: 60,
          spread: 50,
          origin: { x: 0 }
        });
        
        myConfetti({
          particleCount: 50,
          angle: 120,
          spread: 50,
          origin: { x: 1 }
        });
      }, 200);
      
      // Hide message and remove canvas after duration
      const timer = setTimeout(() => {
        setVisible(false);
        
        // Remove canvas after animation is complete
        setTimeout(() => {
          if (canvas && canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
          
          if (onComplete) {
            onComplete();
          }
        }, 500);
      }, duration);
      
      return () => {
        clearTimeout(timer);
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      };
    }
  }, [show, duration, onComplete]);
  
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-lg text-center pointer-events-auto animation-fade-in">
        <div className="mb-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-green-700 mb-1">
          {message || (isRtl ? 'כל הכבוד!' : 'Great job!')}
        </h3>
        
        {xpAmount && (
          <div className="text-indigo-600 font-medium">
            {isRtl ? `קיבלת ${xpAmount}+ נקודות ניסיון` : `You earned +${xpAmount} XP`}
          </div>
        )}
        
        <button 
          className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors text-sm"
          onClick={() => setVisible(false)}
        >
          {isRtl ? 'המשך' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default CompletionConfetti; 