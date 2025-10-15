export interface Step {
  id: number;
  title: string;
  description: string;
}

export interface StepIndicatorProps {
  // 当前步骤索引（从0开始）
  currentStep: number;
  // 步骤列表
  steps: Step[];
  // 布局方向：vertical（垂直）或 horizontal（水平）
  direction?: 'vertical' | 'horizontal';
  // 是否显示步骤编号
  showStepNumbers?: boolean;
  // 自定义类名
  className?: string;
  // 点击步骤时的回调函数
  onStepClick?: (stepIndex: number) => void;
}