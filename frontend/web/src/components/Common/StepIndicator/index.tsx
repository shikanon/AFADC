import React from 'react';
import styles from './styles.module.css';
import { StepIndicatorProps } from './types';

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  steps,
  direction = 'vertical',
  showStepNumbers = true,
  className = '',
  onStepClick
}) => {
  // 获取步骤状态
  const getStepStatus = (index: number): 'pending' | 'active' | 'completed' => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  // 处理步骤点击
  const handleStepClick = (index: number) => {
    if (onStepClick && index !== currentStep) {
      onStepClick(index);
    }
  };

  return (
    <div className={`${styles.container} ${styles[direction]} ${className}`}>
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const isClickable = !!onStepClick;
        
        return (
          <div
            key={step.id}
            className={`${styles.step} ${styles[status]} ${isClickable ? styles.clickable : ''}`}
            onClick={() => handleStepClick(index)}
          >
            <div className={styles.stepIndicator}>
              {showStepNumbers && (
                <div className={styles.stepNumber}>
                  {status === 'completed' ? '✓' : index + 1}
                </div>
              )}
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>{step.title}</div>
                <div className={styles.stepDescription}>{step.description}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;