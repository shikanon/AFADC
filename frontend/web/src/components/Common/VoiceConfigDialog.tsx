import React, { useState } from 'react';

interface VoiceConfigDialogProps {
  /** 对话框是否可见 */
  visible: boolean;
  /** 当前角色数据 */
  character: {
    id: string;
    name: string;
    voice: string;
    speed: number;
    previewText: string;
    characterPrompt?: string; // 新增角色IP提示词字段
  };
  /** 确认回调函数 */
  onConfirm: (data: {
    voice: string;
    speed: number;
    previewText: string;
    characterPrompt?: string;
  }) => void;
  /** 取消回调函数 */
  onClose: () => void;
  /** 是否为女性角色（影响音色选项） */
  isFemaleCharacter?: boolean;
}

/**
 * 配音配置弹窗组件
 * 用于配置角色的音色、速率、试听文本和角色IP提示词
 */
const VoiceConfigDialog: React.FC<VoiceConfigDialogProps> = ({
  visible,
  character,
  onConfirm,
  onClose,
  isFemaleCharacter = true
}) => {
  // 内部状态管理
  const [voice, setVoice] = useState(character?.voice || '');
  const [speed, setSpeed] = useState(character?.speed || 1.0);
  const [previewText, setPreviewText] = useState(character?.previewText || '');
  const [characterPrompt, setCharacterPrompt] = useState(character?.characterPrompt || '');

  // 重置表单数据
  const resetForm = () => {
    setVoice(character?.voice || '');
    setSpeed(character?.speed || 1.0);
    setPreviewText(character?.previewText || '');
    setCharacterPrompt(character?.characterPrompt || '');
  };

  // 处理确认按钮点击
  const handleConfirm = () => {
    onConfirm({
      voice,
      speed,
      previewText,
      characterPrompt
    });
  };

  // 处理取消按钮点击
  const handleCancel = () => {
    resetForm();
    onClose();
  };

  // 处理弹窗关闭
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // 处理背景点击
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // 如果弹窗不可见，返回null
  if (!visible || !character) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
        {/* 弹窗头部 */}
        <div className="px-6 py-4 border-b border-border-light flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">配音配置</h3>
          <button 
            onClick={handleClose}
            className="p-1 rounded-lg hover:bg-bg-secondary transition-colors"
          >
            <i className="fas fa-times text-text-secondary"></i>
          </button>
        </div>
        
        {/* 弹窗内容 */}
        <div className="px-6 py-4 space-y-4">
          {/* 角色名称显示 */}
          <div className="text-sm text-text-secondary">
            配置角色：<span className="font-medium text-text-primary">{character.name}</span>
          </div>
          
          {/* 音色选择 */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">音色选择</label>
            <select 
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {isFemaleCharacter ? (
                <>
                  <option value="voice1">甜美少女音</option>
                  <option value="voice2">温柔女声</option>
                  <option value="voice3">活泼少女音</option>
                  <option value="voice4">成熟女声</option>
                  <option value="custom">自定义声音</option>
                </>
              ) : (
                <>
                  <option value="voice5">沉稳男声</option>
                  <option value="voice6">温和男声</option>
                  <option value="voice7">威严男声</option>
                  <option value="voice8">苍老男声</option>
                  <option value="custom">自定义声音</option>
                </>
              )}
            </select>
          </div>
          
          {/* 音频速率 */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">音频速率</label>
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary">0.5x</span>
              <input 
                type="range" 
                min="0.5" 
                max="2.0" 
                step="0.1" 
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="flex-1 min-w-[100px]"
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((speed - 0.5) / 1.5) * 100}%, #E5E7EB ${((speed - 0.5) / 1.5) * 100}%, #E5E7EB 100%)`
                }}
              />
              <span className="text-sm text-text-secondary">2.0x</span>
              <span className="text-sm font-medium text-text-primary">{speed}x</span>
            </div>
          </div>
          
          {/* 试听文本 */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">试听文本</label>
            <textarea 
              rows={2}
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="请输入试听文本..."
            />
          </div>
          
        </div>
        
        {/* 弹窗底部 */}
        <div className="px-6 py-4 border-t border-border-light flex justify-end space-x-3">
          <button 
            onClick={handleCancel}
            className="px-4 py-2 border border-border-light rounded-lg text-text-secondary hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button 
            onClick={handleConfirm}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceConfigDialog;