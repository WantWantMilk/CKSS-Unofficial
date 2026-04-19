document.addEventListener('DOMContentLoaded', function() {
    // 1. 合规性提示逻辑
    const complianceModal = document.getElementById('complianceModal');
    
    // 检查是否已经同意过
    if (!localStorage.getItem('complianceAccepted')) {
        complianceModal.classList.add('active');
    }
    
    window.acceptCompliance = function() {
        complianceModal.classList.remove('active');
        localStorage.setItem('complianceAccepted', 'true');
    };

    // 2. 平台模式切换
    const body = document.body;
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const settingsPanel = document.getElementById('settingsPanel');
    const settingsBtn = document.getElementById('settingsBtn');

    // 初始化平台模式 (从 localStorage 读取)
    const savedPlatform = localStorage.getItem('platformMode') || 'desktop';
    body.classList.add(`platform-${savedPlatform}`);

    window.setPlatform = function(platform) {
        // 移除旧类
        body.classList.remove(`platform-desktop`, `platform-android`, `platform-ios`);
        // 添加新类
        body.classList.add(`platform-${platform}`);
        // 保存设置
        localStorage.setItem('platformMode', platform);
        // 关闭设置面板
        settingsPanel.classList.remove('open');
    };

    // 3. 无障碍设置
    const highContrast = document.getElementById('highContrast');
    const reduceMotion = document.getElementById('reduceMotion');
    const largeText = document.getElementById('largeText');

    // 读取用户偏好
    highContrast.checked = localStorage.getItem('highContrast') === 'true';
    reduceMotion.checked = localStorage.getItem('reduceMotion') === 'true';
    largeText.checked = localStorage.getItem('largeText') === 'true';

    // 应用样式
    if (highContrast.checked) document.body.classList.add('high-contrast');
    if (reduceMotion.checked) document.body.classList.add('reduce-motion');
    if (largeText.checked) document.body.classList.add('large-text');

    highContrast.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
        localStorage.setItem('highContrast', e.target.checked);
    });

    reduceMotion.addEventListener('change', (e) => {
        if (e.target.checked) {
            document
