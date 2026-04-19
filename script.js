// script.js —— 原站交互保留 + 模式切换/设置/合规
(function() {
    'use strict';
    const body = document.body;
    const STORAGE_KEY = 'kxzx_prefs';

    // DOM 元素
    const modal = document.getElementById('complianceModal');
    const acceptBtn = document.getElementById('acceptModal');
    const declineBtn = document.getElementById('declineModal');
    const settingsPanel = document.getElementById('settingsPanel');
    const settingsToggle = document.getElementById('settingsToggle');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const menu = document.getElementById('menu');
    const highContrastToggle = document.getElementById('highContrastToggle');
    const reduceMotionToggle = document.getElementById('reduceMotionToggle');
    const modeBtns = document.querySelectorAll('[data-mode]');
    const resetSettings = document.getElementById('resetSettings');
    const showComplianceAgain = document.getElementById('showComplianceAgain');
    const a11yTrigger = document.getElementById('a11ySettingsTrigger');

    // 初始化
    function init() {
        // 合规弹窗
        if (!localStorage.getItem('complianceAccepted')) {
            modal.style.display = 'flex';
        } else {
            modal.style.display = 'none';
        }

        // 加载偏好
        const saved = localStorage.getItem(STORAGE_KEY);
        let prefs = { mode: 'desktop', highContrast: false, reduceMotion: false };
        if (saved) try { prefs = { ...prefs, ...JSON.parse(saved) }; } catch(e) {}
        applyMode(prefs.mode);
        body.classList.toggle('high-contrast', prefs.highContrast);
        body.classList.toggle('reduce-motion', prefs.reduceMotion);
        if (highContrastToggle) highContrastToggle.checked = prefs.highContrast;
        if (reduceMotionToggle) reduceMotionToggle.checked = prefs.reduceMotion;
        highlightActiveMode(prefs.mode);

        // 渲染新闻卡片
        renderNews();
    }

    function renderNews() {
        const grid = document.getElementById('newsGrid');
        if (!grid) return;
        const items = [
            { title: '秋季运动会圆满落幕', desc: '高三(3)班破校纪录', date: '2025.04' },
            { title: '缤纷节海选启动', desc: '歌手、舞蹈、话剧报名中', date: '2025.04' },
            { title: '校园摄影展征稿', desc: '用镜头记录开中瞬间', date: '2025.03' },
        ];
        grid.innerHTML = items.map(item => `
            <div style="background:white; border-radius:16px; padding:20px; box-shadow:0 5px 15px rgba(0,0,0,0.05);">
                <h4 style="font-family:var(--impact-font); font-size:24px;">${item.title}</h4>
                <p>${item.desc}</p>
                <small>${item.date}</small>
            </div>
        `).join('');
    }

    function applyMode(mode) {
        body.classList.remove('mode-ios', 'mode-android', 'mode-desktop', 'mode-touch');
        body.classList.add(`mode-${mode}`);
    }

    function highlightActiveMode(mode) {
        modeBtns.forEach(btn => {
            const isActive = btn.dataset.mode === mode;
            btn.style.background = isActive ? 'var(--primary-color)' : '#333';
            btn.style.color = isActive ? 'black' : 'white';
        });
    }

    function savePrefs() {
        const prefs = {
            mode: body.className.match(/mode-(\w+)/)?.[1] || 'desktop',
            highContrast: body.classList.contains('high-contrast'),
            reduceMotion: body.classList.contains('reduce-motion')
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    }

    // 事件绑定
    function bindEvents() {
        acceptBtn?.addEventListener('click', () => {
            localStorage.setItem('complianceAccepted', 'true');
            modal.style.display = 'none';
        });
        declineBtn?.addEventListener('click', () => {
            alert('请关注微信公众号: 重庆市开州中学');
            window.location.href = 'https://weixin.qq.com';
        });
        showComplianceAgain?.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
        });

        // 设置面板
        settingsToggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsPanel.classList.add('open');
        });
        closeSettingsBtn?.addEventListener('click', () => settingsPanel.classList.remove('open'));
        a11yTrigger?.addEventListener('click', (e) => {
            e.preventDefault();
            settingsPanel.classList.add('open');
        });

        // 模式切换
        modeBtns.forEach(btn => btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            applyMode(mode);
            highlightActiveMode(mode);
            savePrefs();
        }));

        highContrastToggle?.addEventListener('change', (e) => {
            body.classList.toggle('high-contrast', e.target.checked);
            savePrefs();
        });
        reduceMotionToggle?.addEventListener('change', (e) => {
            body.classList.toggle('reduce-motion', e.target.checked);
            savePrefs();
        });
        resetSettings?.addEventListener('click', () => {
            body.classList.remove('high-contrast', 'reduce-motion');
            if (highContrastToggle) highContrastToggle.checked = false;
            if (reduceMotionToggle) reduceMotionToggle.checked = false;
            applyMode('desktop');
            highlightActiveMode('desktop');
            savePrefs();
        });

        // 汉堡菜单（原站圆形展开）
        hamburgerBtn?.addEventListener('click', () => {
            menu.classList.add('open');
            body.classList.add('menu');
            hamburgerBtn.setAttribute('aria-expanded', 'true');
        });
        menu?.addEventListener('click', (e) => {
            if (e.target === menu || e.target.closest('a')) {
                menu.classList.remove('open');
                body.classList.remove('menu');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // 点击其他区域关闭设置
        document.addEventListener('click', (e) => {
            if (!settingsPanel.contains(e.target) && e.target !== settingsToggle) {
                settingsPanel.classList.remove('open');
            }
        });

        // iOS底栏链接平滑滚动
        document.querySelectorAll('.ios-tabbar a, .css-ha8q1x a').forEach(link => {
            link.addEventListener('click', (e) => {
                const hash = link.getAttribute('href');
                if (hash && hash !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(hash);
                    if (target) target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    init();
    bindEvents();
})();