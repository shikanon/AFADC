import React, { useState } from 'react';
import styles from './SceneSelectDialog.module.css';

interface Scene {
  id: string;
  name: string;
  image: string;
}

interface SceneSelectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedScene: string) => void;
  availableScenes: Scene[];
  initiallySelected: string;
  storyboardId: string;
}

const SceneSelectDialog: React.FC<SceneSelectDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  availableScenes,
  initiallySelected,
  storyboardId
}) => {
  const [selectedScene, setSelectedScene] = useState<string>(initiallySelected);

  const handleSceneSelect = (sceneId: string) => {
    setSelectedScene(sceneId);
  };

  const handleConfirm = () => {
    onConfirm(selectedScene, storyboardId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        {/* 标题区 */}
        <div className={styles.header}>
          <h3 className={styles.title}>选择场景</h3>
        </div>

        {/* 场景卡片区 */}
        <div className={styles.sceneGrid}>
          {availableScenes.map(scene => (
            <div
              key={scene.id}
              className={`${styles.sceneCard} ${selectedScene === scene.id ? styles.selected : ''}`}
              onClick={() => handleSceneSelect(scene.id)}
            >
              {/* 选中标记 */}
              {selectedScene === scene.id && (
                <div className={styles.checkmark}>
                  <i className="fas fa-check"></i>
                </div>
              )}
              
              {/* 场景图片 - 垂直流式布局 */}
              <div className={`${styles.imageContainer} ${styles.verticalLayout}`}>
                <img 
                  src={scene.image} 
                  alt={scene.name}
                  className={styles.sceneImage}
                />
              </div>
              
              {/* 场景名称 - 图片居上文字居下 */}
              <div className={`${styles.sceneName} ${styles.textBottom}`}>{scene.name}</div>
            </div>
          ))}
        </div>

        {/* 操作按钮区 */}
        <div className={styles.footer}>
          <button 
            onClick={onClose}
            className={styles.cancelButton}
          >
            取消
          </button>
          <button 
            onClick={handleConfirm}
            className={styles.confirmButton}
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
};

export default SceneSelectDialog;