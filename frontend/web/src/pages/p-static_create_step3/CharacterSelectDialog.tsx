import React, { useState } from 'react';
import styles from './CharacterSelectDialog.module.css';

interface Character {
  id: string;
  name: string;
  avatar: string;
}

interface CharacterSelectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedCharacters: string[]) => void;
  availableCharacters: Character[];
  initiallySelected: string[];
  storyboardId: string;
}

const CharacterSelectDialog: React.FC<CharacterSelectDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  availableCharacters,
  initiallySelected,
  storyboardId
}) => {
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>(initiallySelected);

  const handleCharacterToggle = (characterId: string) => {
    setSelectedCharacters(prev => {
      if (prev.includes(characterId)) {
        return prev.filter(id => id !== characterId);
      } else {
        return [...prev, characterId];
      }
    });
  };

  const handleConfirm = () => {
    onConfirm(selectedCharacters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        {/* 标题区 */}
        <div className={styles.header}>
          <h3 className={styles.title}>选择角色</h3>
        </div>

        {/* 角色卡片区 */}
        <div className={styles.characterGrid}>
          {availableCharacters.map(character => (
            <div
              key={character.id}
              className={`${styles.characterCard} ${selectedCharacters.includes(character.id) ? styles.selected : ''}`}
              onClick={() => handleCharacterToggle(character.id)}
            >
              {/* 选中标记 */}
              {selectedCharacters.includes(character.id) && (
                <div className={styles.checkmark}>
                  <i className="fas fa-check"></i>
                </div>
              )}
              
              {/* 角色图片 - 垂直流式布局 */}
              <div className={`${styles.avatarContainer} ${styles.verticalLayout}`}>
                <img 
                  src={character.avatar} 
                  alt={character.name}
                  className={styles.avatar}
                />
              </div>
              
              {/* 角色名称 - 图片居上文字居下 */}
              <div className={`${styles.characterName} ${styles.textBottom}`}>{character.name}</div>
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

export default CharacterSelectDialog;