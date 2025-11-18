import { TasksIcon, HabitsIcon, ScheduleIcon, TimerIcon, JournalIcon, SparklesIcon, ClockIcon, CalculatorIcon, WeatherIcon, AmbianceIcon, SettingsIcon, GridIcon } from './components/icons/Icons.js';

export const WIDGET_HEADER_HEIGHT = 32; // h-8 in Widget.jsx is 2rem = 32px
export const DOCK_AREA_HEIGHT = 100; // Account for dock and bottom margin

export const NAV_ITEMS = [
    { key: 'tasks', icon: TasksIcon },
    { key: 'habits', icon: HabitsIcon },
    { key: 'schedule', icon: ScheduleIcon },
    { key: 'pomodoro', icon: TimerIcon },
    { key: 'journal', icon: JournalIcon },
    { key: 'chatbot', icon: SparklesIcon },
    { 
        key: 'utilities', 
        icon: GridIcon,
        children: [
            { key: 'clock', icon: ClockIcon },
            { key: 'calculator', icon: CalculatorIcon },
            { key: 'weather', icon: WeatherIcon },
            { key: 'ambiance', icon: AmbianceIcon },
            { key: 'settings', icon: SettingsIcon },
        ]
    },
];

export const translations = {
    // General UI
    dashboard: { en: 'Dashboard', zh: '仪表盘', ja: 'ダッシュボード' },
    tasks: { en: 'Tasks', zh: '任务', ja: 'タスク' },
    schedule: { en: 'Schedule', zh: '日程表', ja: 'スケジュール' },
    pomodoro: { en: 'Pomodoro', zh: '番茄钟', ja: 'ポモドーロ' },
    habits: { en: 'Habits', zh: '习惯', ja: '習慣' },
    journal: { en: 'Journal', zh: '日志', ja: 'ジャーナル' },
    study_rooms: { en: 'Study Rooms', zh: '自习室', ja: '自習室' },
    chatbot: { en: 'AI Assistant', zh: 'AI 助手', ja: 'AIアシスタント' },
    logout: { en: 'Logout', zh: '登出', ja: 'ログアウト' },
    clock: { en: 'Clock', zh: '时钟', ja: '時計' },
    calculator: { en: 'Calculator', zh: '计算器', ja: '電卓' },
    weather: { en: 'Weather', zh: '天气', ja: '天気' },
    ambiance: { en: 'Ambiance', zh: '氛围', ja: 'アンビエンス' },
    settings: { en: 'Settings', zh: '设置', ja: '設定' },
    utilities: { en: 'Utilities', zh: '工具', ja: 'ユーティリティ' },
    
    // Login Page
    login_title: { en: 'Welcome to StudyPro', zh: '欢迎来到 StudyPro', ja: 'StudyPro へようこそ' },
    login_subtitle: { en: 'Your all-in-one productivity platform.', zh: '您的一站式生产力平台。', ja: 'あなたのためのオールインワン生産性プラットフォーム。' },
    login_button: { en: 'Login as Guest', zh: '以访客身份登录', ja: 'ゲストとしてログイン' },
    
    // Dashboard / Desktop
    welcome_back: { en: 'Welcome Back, Alex!', zh: '欢迎回来, Alex!', ja: 'おかえりなさい, Alex!' },
    dashboard_greeting: { en: "Here's your plan for today.", zh: '这是您今天的计划。', ja: '今日のあなたの計画です。' },
    tasks_due_soon: { en: 'Tasks Due Soon', zh: '即将到期的任务', ja: '締め切り間近のタスク' },
    add_a_task: { en: 'Add a task...', zh: '添加任务...', ja: 'タスクを追加...' },
    ai_assistant: { en: 'AI Assistant', zh: 'AI 助手', ja: 'AIアシスタント' },
    
    // Chatbot
    chatbot_placeholder: { en: 'Ask me anything...', zh: '问我任何问题...', ja: '何でも聞いてください…' },
    deep_think_mode: { en: 'Deep Think Mode', zh: '深度思考模式', ja: 'ディープシンクモード' },
    thinking: { en: 'Thinking...', zh: '思考中...', ja: '考え中…' },
    deep_think_tooltip: { 
        en: 'Handles complex queries using a more powerful model.', 
        zh: '使用更强大的模型处理复杂查询。', 
        ja: 'より強力なモデルを使用して複雑なクエリを処理します。' 
    },

    // Habit Tracker
    habit_tracker: { en: 'Habit Tracker', zh: '习惯追踪', ja: '習慣トラッカー' },
    current_streak: { en: 'Current Streak', zh: '当前连续纪录', ja: '現在のストリーク' },
    days: { en: 'days', zh: '天', ja: '日' },
    completed_today: { en: 'Completed today!', zh: '今天已完成!', ja: '今日完了！' },
    great_job: { en: 'Great job!', zh: '干得漂亮！', ja: '素晴らしい！' },
    streak_kept: { en: 'Streak kept alive!', zh: '连续纪录保持中！', ja: 'ストリーク継続中！' },

    // Pomodoro Timer
    pomo_start: { en: 'Start', zh: '开始', ja: '開始' },
    pomo_pause: { en: 'Pause', zh: '暂停', ja: '一時停止' },
    pomo_reset: { en: 'Reset', zh: '重置', ja: 'リセット' },
    pomo_focus: { en: 'Time to focus!', zh: '专注时间！', ja: '集中する時間です！' },
    pomo_break: { en: 'Time for a break!', zh: '休息一下！', ja: '休憩の時間です！' },

    // Journal
    journal_new_entry: { en: 'New Entry', zh: '新条目', ja: '新しいエントリー' },
    journal_placeholder_title: { en: 'Title of your entry', zh: '日志标题', ja: 'エントリーのタイトル' },
    journal_placeholder_content: { en: 'Start writing...', zh: '开始写作...', ja: '書き始める...' },
    journal_mood: { en: 'How was your day?', zh: '今天过得怎么样？', ja: '今日はどんな日でしたか？' },
    
    // Schedule
    schedule_today: { en: 'Today', zh: '今天', ja: '今日' },
    schedule_month: { en: 'Month', zh: '月', ja: '月' },
    schedule_week: { en: 'Week', zh: '周', ja: '週' },
    schedule_day: { en: 'Day', zh: '日', ja: '日' },

    // Settings
    appearance: { en: 'Appearance', zh: '外观', ja: '外観' },
    general: { en: 'General', zh: '通用', ja: '一般' },
    accent_color: { en: 'Accent Color', zh: '强调色', ja: 'アクセントカラー' },
    wallpaper: { en: 'Wallpaper', zh: '壁纸', ja: '壁紙' },
};