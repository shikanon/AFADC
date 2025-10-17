# 画面预览区域优化计划

## 任务概述
优化 `/Users/bytedance/Documents/AFADC/frontend/web/src/pages/p-static_create_step3/` 文件中的画面预览区域，提升用户体验。

## 修改内容

### 1. 放大画面预览图尺寸
- 将预览图尺寸增至原尺寸的2倍
- 采用4:3的比例显示

### 2. 横向排列布局
- 一次展示3张预览图
- 间距均匀，无重叠
- 使用flex布局实现

### 3. 选中状态与交互
- 为预览图添加选中视觉标识
- 选中时边框为品牌主色「蓝色」高亮
- 未选中为浅灰色细边框
- 默认第一张预览图处于"选中"状态

### 4. 存入资产库按钮
- 在3张预览图的下方添加"存入资产库"按钮
- 按钮风格与全局风格统一
- 位置居中对齐
- 点击后给予"成功存入"的轻量反馈（Toast提示）

### 5. 每个分镜的画面预览独立选择
- 修改状态管理，为每个分镜单独管理预览图的选中状态
- 使用对象存储每个分镜的选中状态，以分镜ID为键
- 更新预览图选中处理函数，使其能够根据分镜ID更新对应的状态
- 初始化每个分镜的选中状态，确保默认第一张预览图处于选中状态

## 实现细节

### 代码修改
1. **index.tsx**:
   - 将 `selectedPreviewIndex` 状态改为 `selectedPreviewIndices` 对象，为每个分镜单独管理选中状态
   - 添加 `useEffect` 钩子初始化每个分镜的选中状态
   - 修改 `handlePreviewSelect` 函数，接收分镜ID和索引参数
   - 更新画面预览区域的JSX结构，使用分镜ID作为键来管理选中状态

2. **styles.module.css**:
   - 添加 `.previewContainer` 样式
   - 添加 `.previewImagesContainer` 样式实现横向排列
   - 添加 `.previewImageWrapper` 和 `.previewImageWrapper.selected` 样式实现选中状态
   - 添加 `.previewImage` 样式实现4:3比例
   - 添加 `.saveToAssetButtonContainer` 和 `.saveToAssetButton` 样式

## 完成状态
- [x] 修改画面预览区域，放大预览图尺寸（增至原尺寸的2倍，使用4:3的比例）
- [x] 采用横向排列布局，一次展示3张预览图（间距均匀，无重叠）
- [x] 为预览图添加选中视觉标识（选中时边框为蓝色高亮，未选中为浅灰色细边框）
- [x] 设置默认第一张预览图处于选中状态
- [x] 在3张预览图的下方，添加存入资产库按钮，并实现点击反馈### 完成状态
- [x] 修改状态管理，为每个分镜单独管理预览图的选中状态
- [x] 更新画面预览组件，使用分镜ID作为键来管理选中状态
- [x] 修改预览图选中处理函数，使其能够根据分镜ID更新对应的状态
- [x] 测试每个分镜的画面预览是否可以独立选择

---

## 新增修改内容：图片生成按钮位置调整

### 修改概述
将"图片生成"按钮从"生成提示词"区域迁移至"画面预览"模块下方，与"存入资产库"按钮横向排列，提升用户体验和界面美观性。

### 修改内容
1. 从生成提示词区域移除图片生成按钮
   - 移除了生成提示词文本框右侧的图片生成按钮
   - 简化了生成提示词区域的布局

2. 在画面预览模块下方添加图片生成按钮
   - 在预览图下方添加按钮容器，包含图片生成和存入资产库两个按钮
   - 图片生成按钮放置在存入资产库按钮的左侧

3. 调整按钮布局和样式
   - 使用flex布局实现两个按钮的横向排列
   - 设置按钮间距为10px，符合8-12px的要求
   - 确保按钮与画面预览区域对齐

4. 统一样式风格
   - 两个按钮使用相同的圆角(6px)、字体大小(14px)和内边距(8px 16px)
   - 保持按钮视觉风格统一，提升整体美观性

### 实现细节
1. 在 `index.tsx` 中修改生成提示词区域：
   ```typescript
   // 原来
   <div className="flex items-start space-x-2">
     <textarea 
       value={item.prompt}
       onChange={(e) => handleStoryboardPromptChange(item.id, e.target.value)}
       className={`${styles.fixedHeightTextarea} ${styles.scriptTextarea}`}
     />
     <button 
       onClick={() => handleGenerateImage(item.id)}
       className="px-3 py-2 bg-tertiary text-white rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap"
       title="生成图片"
     >
       <i className="fas fa-image mr-1"></i>图片生成
     </button>
   </div>
   
   // 修改后
   <textarea 
     value={item.prompt}
     onChange={(e) => handleStoryboardPromptChange(item.id, e.target.value)}
     className={`${styles.fixedHeightTextarea} ${styles.scriptTextarea}`}
   />
   ```

2. 在 `index.tsx` 中修改画面预览区域：
   ```typescript
   // 原来
   {/* 存入资产库按钮 */}
   <div className={styles.saveToAssetButtonContainer}>
     <button 
       onClick={handleSaveToAssetLibrary}
       className={styles.saveToAssetButton}
     >
       <i className="fas fa-save mr-2"></i>存入资产库
     </button>
   </div>
   
   // 修改后
   {/* 按钮区域 - 图片生成和存入资产库 */}
   <div className={styles.buttonContainer}>
     <button 
       onClick={() => handleGenerateImage(item.id)}
       className={styles.generateImageButton}
       title="生成图片"
     >
       <i className="fas fa-image mr-2"></i>图片生成
     </button>
     <button 
       onClick={handleSaveToAssetLibrary}
       className={styles.saveToAssetButton}
     >
       <i className="fas fa-save mr-2"></i>存入资产库
     </button>
   </div>
   ```

3. 在 `styles.module.css` 中添加新的样式：
   ```css
   /* 按钮容器 - 图片生成和存入资产库 */
   .buttonContainer {
     display: flex;
     justify-content: center;
     margin-top: 8px;
     gap: 10px; /* 两个按钮之间的间距 */
   }
   
   /* 图片生成按钮 */
   .generateImageButton {
     display: flex;
     align-items: center;
     justify-content: center;
     padding: 8px 16px;
     background-color: #10B981; /* 绿色背景，与原按钮保持一致 */
     color: white;
     border: none;
     border-radius: 6px;
     font-size: 14px;
     font-weight: 500;
     cursor: pointer;
     transition: background-color 0.2s ease;
   }
   
   .generateImageButton:hover {
     background-color: #059669; /* 悬停时深绿色 */
   }
   ```

### 完成状态
- [x] 从生成提示词区域移除图片生成按钮
- [x] 在画面预览模块下方添加图片生成按钮
- [x] 调整按钮布局，使图片生成按钮与存入资产库按钮横向排列
- [x] 统一样式风格，确保两个按钮视觉一致
- [x] 设置按钮间距为8-12px，确保与画面预览区域对齐

---

## 新增修改内容：添加关联场景模块

### 修改概述
在「关联角色」模块右侧平行新增「关联场景」模块，通过"视觉统一+清晰交互"保障体验。在添加角色按钮旁边增加添加场景按钮，点击会弹出选择场景弹窗，样式和选择角色弹窗一样，选择场景为单选。

### 修改内容
1. 创建场景选择对话框组件
   - 创建 `SceneSelectDialog.tsx` 组件，支持单选场景
   - 创建 `SceneSelectDialog.module.css` 样式文件，与角色选择对话框保持视觉统一
   - 场景选择为单选模式，区别于角色选择的多选模式

2. 修改数据结构
   - 在 `StoryboardItem` 接口中添加 `scene` 字段，存储选中的场景
   - 添加场景数据类型 `Scene` 接口
   - 添加可用场景数据 `availableScenes` 状态

3. 添加场景相关状态和函数
   - 添加场景选择弹窗状态 `isSceneDialogOpen`
   - 添加当前分镜ID状态 `currentStoryboardId`（复用已有状态）
   - 添加处理场景选择确认的函数 `handleSceneSelectionConfirm`
   - 添加关闭场景选择弹窗的函数 `handleCloseSceneDialog`
   - 添加处理场景选择的函数 `handleAddScene`

4. 修改UI界面
   - 在「关联角色」模块右侧平行新增「关联场景」模块
   - 在添加角色按钮旁边增加添加场景按钮
   - 添加场景选择弹窗组件
   - 确保场景模块与角色模块视觉统一

### 实现细节
1. 创建场景选择对话框组件：
   ```typescript
   // SceneSelectDialog.tsx
   interface Scene {
     id: string;
     name: string;
     image: string;
   }
   
   // 单选模式，使用单个字符串存储选中的场景ID
   const [selectedScene, setSelectedScene] = useState<string>(initiallySelected);
   ```

2. 修改数据结构：
   ```typescript
   // 在 StoryboardItem 接口中添加 scene 字段
   interface StoryboardItem {
     // ... 其他字段
     scene: string; // 新增场景字段
   }
   ```

3. 添加场景相关状态和函数：
   ```typescript
   // 场景选择弹窗状态
   const [isSceneDialogOpen, setIsSceneDialogOpen] = useState(false);
   
   // 可用场景数据
   const [availableScenes] = useState<Scene[]>([
     { id: 'scene-001', name: '魔法学院', image: 'https://s.coze.cn/image/hXT9hwKARBE/' },
     { id: 'scene-002', name: '图书馆', image: 'https://s.coze.cn/image/TwWQkCHpzu0/' },
     { id: 'scene-003', name: '花园', image: 'https://s.coze.cn/image/5xjn0yDZY4Q/' },
     { id: 'scene-004', name: '教室', image: 'https://s.coze.cn/image/dDJ1MTK9Gr0/' },
   ]);
   
   // 处理场景选择
   const handleAddScene = (storyboardId: string) => {
     setCurrentStoryboardId(storyboardId);
     setIsSceneDialogOpen(true);
   };
   
   // 处理场景选择确认
   const handleSceneSelectionConfirm = (selectedSceneId: string) => {
     if (!currentStoryboardId) return;
     
     // 将选中的场景ID转换为场景名称
     const selectedSceneName = availableScenes.find(scene => scene.id === selectedSceneId)?.name || '';
     
     // 更新分镜项的场景
     setStoryboardItems(prevItems =>
       prevItems.map(item =>
         item.id === currentStoryboardId 
           ? { ...item, scene: selectedSceneName } 
           : item
       )
     );
     
     // 重置状态
     setCurrentStoryboardId(null);
   };
   ```

4. 修改UI界面：
   ```typescript
   // 在添加角色按钮旁边增加添加场景按钮
   <button 
     onClick={() => handleAddCharacter(item.id)}
     className="text-primary hover:text-blue-600 text-sm" 
     title="添加角色"
   >
     <i className="fas fa-user-plus"></i>
   </button>
   <button 
     onClick={() => handleAddScene(item.id)}
     className="text-primary hover:text-blue-600 text-sm" 
     title="添加场景"
   >
     <i className="fas fa-image"></i>
   </button>
   
   // 在「关联角色」模块右侧平行新增「关联场景」模块
   <div className={styles.rightColumn}>
     {/* 关联场景 */}
     <div>
       <label className={styles.unifiedLabel}>关联场景</label>
       <div className="flex flex-wrap gap-1">
         {item.scene && (
           <span className={styles.sceneTag}>{item.scene}</span>
         )}
       </div>
     </div>
     {/* ... 其他内容 */}
   </div>
   ```

5. 添加场景标签样式：
   ```css
   /* 场景标签样式 */
   .sceneTag {
     padding: 2px 6px;
     border-radius: 8px;
     font-size: 12px;
     background-color: #F3E8FF; /* 紫色背景，与角色标签区分 */
     color: #6B21A8;
   }
   ```

### 完成状态
- [ ] 创建场景选择对话框组件
- [ ] 修改数据结构，添加场景字段
- [ ] 添加场景相关状态和函数
- [ ] 修改UI界面，添加关联场景模块
- [ ] 添加场景标签样式
- [ ] 测试场景选择功能

---

## 新增修改内容：图片放大功能

### 修改概述
在画面预览区域下方的"图片生成"和"存入资产库"按钮之间添加一个"图片放大"按钮，点击后弹出模态框展示高清大图，支持关闭返回功能，提升用户查看图片细节的体验。

### 修改内容
1. 添加图片放大按钮
   - 在"图片生成"和"存入资产库"按钮之间添加"图片放大"按钮
   - 使用紫色背景(#8B5CF6)与其他按钮区分
   - 添加放大镜图标(fa-search-plus)和"图片放大"文字

2. 实现图片放大模态框
   - 创建全屏半透明黑色背景的模态框
   - 模态框中展示高清大图，保持图片比例
   - 图片最大尺寸为视口的90%，确保完整显示
   - 添加关闭按钮，支持点击关闭和点击背景关闭

3. 添加状态管理
   - 添加模态框显示状态(isImageModalOpen)
   - 添加模态框图片URL状态(modalImageUrl)
   - 实现打开和关闭模态框的处理函数

### 实现细节
1. 在 `index.tsx` 中添加状态管理：
   ```typescript
   // 图片放大模态框状态
   const [isImageModalOpen, setIsImageModalOpen] = useState(false);
   const [modalImageUrl, setModalImageUrl] = useState<string>('');
   
   // 打开图片放大模态框
   const handleOpenImageModal = (imageUrl: string) => {
     setModalImageUrl(imageUrl);
     setIsImageModalOpen(true);
   };
   
   // 关闭图片放大模态框
   const handleCloseImageModal = () => {
     setIsImageModalOpen(false);
     setModalImageUrl('');
   };
   ```

2. 在 `index.tsx` 中添加图片放大按钮：
   ```typescript
   <button 
     onClick={() => handleOpenImageModal(storyboardItems[selectedPreviewIndices[item.id]]?.imageUrl)}
     className={styles.enlargeImageButton}
     title="放大图片"
   >
     <i className="fas fa-search-plus mr-2"></i>图片放大
   </button>
   ```

3. 在 `index.tsx` 中添加图片放大模态框组件：
   ```typescript
   {isImageModalOpen && (
     <div className={styles.imageModalOverlay} onClick={handleCloseImageModal}>
       <div className={styles.imageModalContent} onClick={(e) => e.stopPropagation()}>
         <button 
           className={styles.imageModalCloseButton}
           onClick={handleCloseImageModal}
           title="关闭"
         >
           <i className="fas fa-times"></i>
         </button>
         <div className={styles.imageModalImageContainer}>
           <img 
             src={modalImageUrl} 
             alt="放大图片" 
             className={styles.imageModalImage}
           />
         </div>
       </div>
     </div>
   )}
   ```

4. 在 `styles.module.css` 中添加图片放大按钮和模态框样式：
   ```css
   /* 图片放大按钮 */
   .enlargeImageButton {
     display: flex;
     align-items: center;
     justify-content: center;
     padding: 8px 16px;
     background-color: #8B5CF6; /* 紫色背景，与其他按钮区分 */
     color: white;
     border: none;
     border-radius: 6px;
     font-size: 14px;
     font-weight: 500;
     cursor: pointer;
     transition: background-color 0.2s ease;
   }
   
   .enlargeImageButton:hover {
     background-color: #7C3AED; /* 悬停时深紫色 */
   }
   
   /* 图片放大模态框样式 */
   .imageModalOverlay {
     position: fixed;
     top: 0;
     left: 0;
     right: 0;
     bottom: 0;
     background-color: rgba(0, 0, 0, 0.8); /* 半透明黑色背景 */
     display: flex;
     align-items: center;
     justify-content: center;
     z-index: 1000; /* 确保在最上层 */
   }
   
   .imageModalContent {
     position: relative;
     max-width: 90vw;
     max-height: 90vh;
     display: flex;
     flex-direction: column;
     align-items: center;
   }
   
   .imageModalCloseButton {
     position: absolute;
     top: -40px;
     right: 0;
     background: none;
     border: none;
     color: white;
     font-size: 24px;
     cursor: pointer;
     padding: 8px;
     transition: transform 0.2s ease;
   }
   
   .imageModalCloseButton:hover {
     transform: scale(1.1);
   }
   
   .imageModalImageContainer {
     display: flex;
     align-items: center;
     justify-content: center;
     width: 100%;
     height: 100%;
     overflow: hidden;
     border-radius: 8px;
   }
   
   .imageModalImage {
     max-width: 100%;
     max-height: 80vh;
     object-fit: contain; /* 保持图片比例，完整显示 */
     border-radius: 4px;
   }
   ```

### 完成状态
- [x] 在图片生成和存入资产库按钮之间添加图片放大按钮
- [x] 创建图片放大模态框组件
- [x] 实现模态框的显示和隐藏逻辑
- [x] 在模态框中展示高清大图
- [x] 添加模态框关闭功能

## 测试结果
- 页面正常加载，无编译错误
- 预览图尺寸放大，采用4:3比例
- 横向排列3张预览图，间距均匀
- 选中状态正常工作，第一张默认选中
- 存入资产库按钮正常显示和交互
- 每个分镜的画面预览可以独立选择，相互不影响
- 图片生成按钮成功迁移至画面预览区域下方
- 图片放大按钮正常显示和交互，点击后弹出模态框
- 模态框中高清大图正常显示，支持关闭返回功能