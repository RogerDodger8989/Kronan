import { LitElement, html, css } from "https://cdn.jsdelivr.net/npm/lit@3/+esm";

// --- Datastrukturer & Konstanter ---
const DAYS = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];
const COLORS = [
  { bg: '#fef08a', border: '#facc15', name: 'Gul' },
  { bg: '#bae6fd', border: '#38bdf8', name: 'Blå' },
  { bg: '#bbf7d0', border: '#22d3ee', name: 'Grön' },
  { bg: '#fbcfe8', border: '#ec4899', name: 'Rosa' },
  { bg: '#e9d5ff', border: '#a21caf', name: 'Lila' },
  { bg: '#fff', border: '#d1d5db', name: 'Vit' },
];

const ICONS = [
  // Special
  '👑', '⭐', '🌟', '💫', '☀️', '🌙', '❤️', '✅',
  // Cleaning & Chores
  '🧹', '🪣', '🧽', '🧼', '🧺', '🗑️', '🚽', '🪠', '🚿', '🛁', '🧴', '🧻',
  '🍽️', '🥣', '🍴', '🥄', '🥢', '🧊', '🧂',
  '🍳', '🥘', '🍲', '🧂', '🥦', '🥕', '🍎', '🍌',
  // Home & Maintenance
  '🛏️', '🛋️', '🪴', '📦', '🪜', '🔧', '🔨', '🪛', '✂️', '🔌', '💡',
  '👕', '👖', '👗', '👟', '🕶️',
  // People & Pets
  '👨', '👩', '🧑', '👧', '👦', '👶', '🐶', '🐱', '🐾',
  // Study/Work & Misc
  '📚', '✏️', '💻', '📱', '🎨', '🎮', '🚗', '🚲'
];

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// --- Date Helpers ---
function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return weekNo;
}

function getWeekIdentifier(d) {
  const week = getWeekNumber(d);
  const year = d.getFullYear(); // Uses local year, might mismatch near new year but good enough for simple ID
  return `${year}-W${week}`;
}

function getWeekRange(d) {
  const curr = new Date(d);
  const first = curr.getDate() - curr.getDay() + 1; // First day is Monday
  const last = first + 6; // last day is Sunday

  const firstDay = new Date(curr.setDate(first));
  const lastDay = new Date(curr.setDate(last));

  const format = (date) => date.toISOString().slice(0, 10);
  return `${format(firstDay)} till ${format(lastDay)}`;
}

class KronanPanel extends LitElement {
  static styles = css`
    ::-webkit-scrollbar {
      display: none;
    }
    :host {
      -ms-overflow-style: none;
      scrollbar-width: none;
      --bg-app: #f1f5f9;
      --bg-surface: #ffffff;
      --bg-surface-hover: #f8fafc;
      --text-primary: #1e293b;
      --text-secondary: #64748b;
      --border-color: #e5e7eb;
      --shadow-color: rgba(0, 0, 0, 0.05);
      --accent-color: #6366f1;
      --bg-footer: #ffffff;
      
      display: block;
      min-height: 100vh;
      background: var(--bg-app);
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      padding: 0;
      color: var(--text-primary);
      transition: background 0.3s, color 0.3s;
      overflow-x: hidden;
      box-sizing: border-box;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    :host(.dark) {
      --bg-app: #0f172a;
      --bg-surface: #1e293b;
      --bg-surface-hover: #334155;
      --text-primary: #f8fafc;
      --text-secondary: #94a3b8;
      --border-color: #334155;

      --shadow-color: rgba(0, 0, 0, 0.3);
      --bg-footer: #1e293b;
    }
    .main {
      height: 100vh; 
      overflow-y: hidden;
      display: flex;
      flex-direction: column;
      padding: 24px 0 0 0;
      background: var(--bg-app);
      transition: background 0.3s;
    }
    .header {
      max-width: 1100px;
      margin: 0 auto 32px auto;
      background: var(--bg-surface);
      border-radius: 32px;
      box-shadow: 0 4px 32px var(--shadow-color);
      border: 1px solid var(--border-color);
      padding: 32px 32px 24px 32px;
      display: flex;
      align-items: center;
      gap: 24px;
      flex-shrink: 0; /* Prevent header from shrinking */
    }
    .crown {
      background: #f59e0b;
      padding: 16px;
      border-radius: 18px;
      color: #fff;
      box-shadow: 0 2px 12px #fde68a;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .header-titles {
      flex: 1;
    }
    .header-titles h1 {
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0 0 4px 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-titles h2 {
      color: #f59e0b;
      font-size: 0.95rem;
      font-weight: 700;
      text-transform: uppercase;
      margin: 0 0 2px 0;
      letter-spacing: 1px;
    }
    .header-titles p {
      color: var(--text-secondary);
      font-size: 1rem;
      margin: 0;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .week-board {
      width: 100%;
      height: 100%;
      max-width: 100%;
      margin: 0;
      display: flex;
      gap: 12px;
      padding: 0 16px 16px 16px; /* Added bottom padding for scrollbar space */
      overflow-x: auto; /* Enable horizontal scrolling */
      overflow-y: hidden; /* Vertical scroll inside columns */
      align-items: stretch;
      /* Scroll Snap for nice feel on touch */
      scroll-snap-type: x mandatory; 
      -webkit-overflow-scrolling: touch;
    }
    .day-col {
      background: var(--bg-surface);
      border-radius: 22px;
      box-shadow: 0 2px 8px var(--shadow-color);
      border: 1px solid var(--border-color);
      padding: 18px 12px 12px 12px;
      flex: 1;
      min-width: 300px; /* Force minimum width to prevent squashing */
      flex-shrink: 0;   /* Don't let them shrink */
      display: flex;
      flex-direction: column;
      height: 100%;
      scroll-snap-align: start; /* Snap to start of column */
    }
    .day-header {
      font-weight: bold;
      color: var(--text-primary);
      font-size: 1.1rem;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .sticky {
      border-radius: 12px;
      border-width: 2px;
      padding: 10px 12px;
      margin-bottom: 10px;
      font-size: 1rem;
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      font-weight: 500;
      color: #1e293b;
      box-shadow: 0 2px 8px #0001;
      cursor: pointer;
      transition: transform 0.1s;
    }
    .sticky:hover {
      transform: scale(1.03);
    }
    .add-btn {
      background: #6366f1;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 4px 10px;
      font-size: 1.1rem;
      cursor: pointer;
      margin-left: 4px;
    }

    /* Mobile Responsive Adjustments */
    @media (max-width: 768px) {
      .main {
        /* Allow main container to scroll vertically if needed (though we aim for fit) */
        /* But specifically for mobile LANDSCAPE, we often lack height, so we must allow body scroll or better layout */
        height: 100vh; /* Keep it fixed viewport */
        padding-top: 12px;
      }
      
      .header {
        margin: 0 16px 16px 16px;
        padding: 16px;
        border-radius: 24px;
        flex-direction: row; /* Keep row but maybe smaller */
        flex-wrap: wrap; /* Allow wrapping */
      }
      
      .header-titles h1 {
        font-size: 1.5rem;
      }
      
      .crown {
        padding: 10px;
        border-radius: 12px;
      }

      /* Adjust day cols for mobile portrait */
      .day-col {
        min-width: 85vw; /* On portrait, take up almost full width */
      }
    }

    /* Landscape specific tweaks */
    @media (max-width: 900px) and (orientation: landscape) {
      .main {
        padding-top: 8px;
      }
      .header {
        margin: 0 16px 8px 16px;
        padding: 12px 20px;
        display: none; /* Hide huge header in landscape mobile to save space? Or just compact it? Let's compact it. */
        display: flex; 
      }
      .header-titles p, .header-titles h2 {
        display: none; /* Simplify header in landscape mobile */
      }
      .header-titles h1 {
        font-size: 1.2rem;
        margin: 0;
      }
      .crown {
        padding: 8px; }
      
      .day-col {
        min-width: 280px; /* Good width for landscape columns */
      }
    }
  `;

  static properties = {
    // BUT, "Måndag" is generic.
    // Ideally completedTasks should be part of the week object structure itself to self-contain it.
    // For now, let's keep it global but maybe clear it or namespace it?
    // Wait, the better approach for "completedTasks" is to store "done: true" on the task item itself inside the week object.
    // The current app stores it in a separate "completedTasks" object { "Måndag-t1": true }.
    // If we swap weeks, "Måndag-t1" might refer to a task in another week if not careful?
    // Actually, since we save "week" object, and "completedTasks" is separate...
    // If I load Week 51, "week" has tasks. "completedTasks" has status.
    // I should probably move completion status INTO the task item for safety in multi-week.
    // OR: key completedTasks by "WeekID-Day-TaskID"?
    // The current "completedTasks" logic: `_toggleTaskCompleted(day, id)` uses key `${day}-${id}`.
    // Since IDs are random (Math.random), collision is unlikely.
    // So global completedTasks object growing forever is the main risk.
    // Better: migrate completion status to the task object itself during migration?
    // Let's stick to the plan: `weeksData` stores `week` objects.
    // I will try to migrate "completedTasks" into the `week` items if possible, or just keep it as is for now and see if it breaks.
    // Actually, user just asked for navigation.
    // Let's add `weeksData` and `currentDate` properties.

    showMoveCopyModal: { type: Boolean },
    moveCopyData: { type: Object },
    newUserIcon: { type: String },
    newTaskIcon: { type: String },
    isFullscreen: { type: Boolean },
    isDarkMode: { type: Boolean },
    payouts: { type: Array },
    showPayoutModal: { type: Boolean },
    payoutUser: { type: Object },
    recurringRules: { type: Array },
    selectedRecurringDays: { type: Array },
  };

  constructor() {
    super();
    console.log("KronanPanel Loaded v2.3 - setConfig Ready");
    this.week = this._initWeek();
    this.weeksData = {}; // Format: { '2025-W1': { weekData... }, '2025-W2': ... }
    this.currentDate = new Date();

    // Initialize Dark Mode
    const storedTheme = localStorage.getItem('kronan_theme');
    this.isDarkMode = storedTheme === 'dark';
    if (this.isDarkMode) {
      this.classList.add('dark');
    }

    this.week = this._initWeek();
    this.loading = false;
    this.isFullscreen = false;
    this.newTasks = {};
    DAYS.forEach(day => {
      this.newTasks[day] = '';
    });

    this.isEditing = null;
    this.editData = { text: '', colorIndex: 0 };
    this.users = [
      { id: '1', name: 'Isak', fixedAllowance: 20, defaultColorIndex: 0 },
      { id: '2', name: 'Maja', fixedAllowance: 20, defaultColorIndex: 1 },
    ];
    this.showMoneyModal = false;
    this.moneyTab = 'users';
    this.newUserColor = 0;
    this.taskLibrary = [
      { id: 't1', text: 'Tömma diskmaskin', value: 5, colorIndex: 0 },
      { id: 't2', text: 'Duka bordet', value: 3, colorIndex: 1 },
    ];
    this.showTemplateModal = false;
    this.templates = [];
    this.editingUser = null;
    this.editingTask = null;
    this.newTaskColor = 0;
    this.showAddTaskModal = false;
    this.selectedDay = '';
    this.selectedTaskFromLibrary = null;
    this.selectedAssignee = '';
    this.completedTasks = {};
    this.showMoveCopyModal = false;
    this.moveCopyData = null;
    this.newUserIcon = ICONS[0];
    this.newTaskIcon = ICONS[0];
    this.payouts = [];
    this.showPayoutModal = false;
    this.payoutUser = null;
    this.recurringRules = [];
    this.selectedRecurringDays = [];
  }

  firstUpdated() {
    // Skapa dold filinput för import
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.accept = '.json,application/json';
    this.fileInput.style.display = 'none';
    this.fileInput.addEventListener('change', e => this._importData(e));
    this.shadowRoot.appendChild(this.fileInput);
  }

  _exportData() {
    const data = {
      week: this.week,
      users: this.users,
      taskLibrary: this.taskLibrary,
      templates: this.templates,
      completedTasks: this.completedTasks
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kronan_data_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  _triggerImport() {
    if (this.fileInput) this.fileInput.value = '';
    this.fileInput && this.fileInput.click();
  }

  _importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (window.confirm('Detta skriver över all nuvarande data. Fortsätt?')) {
          if (parsed.week) this.week = parsed.week;
          if (parsed.users) this.users = parsed.users;
          if (parsed.taskLibrary) this.taskLibrary = parsed.taskLibrary;
          if (parsed.templates) this.templates = parsed.templates;
          if (parsed.completedTasks) this.completedTasks = parsed.completedTasks;
          this._saveData(); // Spara direkt efter import
        }
      } catch (err) { window.alert('Fel vid inläsning.'); }
    };
    reader.readAsText(file);
    e.target.value = null;
  }

  _onDragStart(e, item, day) {
    this.draggedItem = { item, sourceDay: day };
    e.dataTransfer.effectAllowed = 'move';
  }

  _onDrop(e, targetDay) {
    e.preventDefault();
    if (!this.draggedItem) return;
    const { item, sourceDay } = this.draggedItem;
    if (sourceDay === targetDay) { this.draggedItem = null; return; }

    // Spara data för modalen
    this.moveCopyData = { item, sourceDay, targetDay };
    this.showMoveCopyModal = true;
  }

  _onDragOver(e) {
    e.preventDefault();
  }

  _saveTemplate(name) {
    if (!name) return;
    const weekCopy = JSON.parse(JSON.stringify(this.week));
    this.templates = [
      ...this.templates,
      { id: generateId(), name, data: weekCopy }
    ];
    this._saveData();
  }

  _loadTemplate(template) {
    const deepCopy = JSON.parse(JSON.stringify(template.data));
    this.week = deepCopy;
    this.showTemplateModal = false;
    this._saveData();
  }

  _deleteTemplate(id) {
    this.templates = this.templates.filter(t => t.id !== id);
    this._saveData();
  }

  _addUser(name, allowance) {
    if (!name) return;
    this.users = [
      ...this.users,
      {
        id: generateId(),
        name,
        fixedAllowance: Number(allowance) || 0,
        defaultColorIndex: this.newUserColor,
        icon: this.newUserIcon
      }
    ];
    this.newUserColor = Math.floor(Math.random() * 5);
    this.newUserIcon = ICONS[Math.floor(Math.random() * ICONS.length)];
    this._saveData();
  }

  _deleteUser(id) {
    this.users = this.users.filter(u => u.id !== id);
    this._saveData();
  }

  _setNewUserColor(idx) {
    this.newUserColor = idx;
  }

  _addTaskToLibrary(text, value) {
    if (!text) return;
    this.taskLibrary = [
      ...this.taskLibrary,
      {
        id: generateId(),
        text,
        value: Number(value) || 0,
        // colorIndex remove: uses assignee color
        icon: this.newTaskIcon
      }
    ];
    this.newTaskIcon = ICONS[Math.floor(Math.random() * ICONS.length)];
    this._saveData();
  }

  _deleteTaskFromLibrary(id) {
    this.taskLibrary = this.taskLibrary.filter(t => t.id !== id);
    this._saveData();
  }

  _startEditUser(user) {
    this.editingUser = { ...user };
  }

  _saveEditUser() {
    if (!this.editingUser) return;
    this.users = this.users.map(u =>
      u.id === this.editingUser.id ? this.editingUser : u
    );
    this.editingUser = null;
    this._saveData();
  }

  _startEditTask(task) {
    this.editingTask = { ...task };
  }

  _saveEditTask() {
    if (!this.editingTask) return;

    // Hitta originalet för att jämföra namn
    const original = this.taskLibrary.find(t => t.id === this.editingTask.id);

    if (original) {
      // Hitta alla matchande uppgifter i veckovyn
      const matches = [];
      Object.entries(this.week).forEach(([day, tasks]) => {
        tasks.forEach((task, idx) => {
          // 1. Match by ID (robust link)
          if (task.libraryId === original.id) {
            matches.push({ day, idx });
          }
          // 2. Fallback: Match by Name (legacy/broken link) - Robust check
          // We allow this even if task has a libraryId, to catch "zombie" links (e.g. if original was deleted and re-created)
          else if (task.text.trim().toLowerCase() === original.text.trim().toLowerCase()) {
            matches.push({ day, idx });
          }
        });
      });

      // Fråga om vi ska uppdatera dem
      if (matches.length > 0) {
        if (window.confirm(`Vill du uppdatera ${matches.length} befintliga uppgifter på veckovyn med den nya informationen?`)) {
          const newWeek = { ...this.week };
          matches.forEach(({ day, idx }) => {
            const task = newWeek[day][idx];
            newWeek[day][idx] = {
              ...task,
              libraryId: original.id, // Ensure link is preserved
              text: this.editingTask.text, // Uppdatera namn (om ändrat)
              value: this.editingTask.value, // Uppdatera pris
              // colorIndex removed: inherited from assignee
              icon: this.editingTask.icon // Uppdatera ikon
            };
          });
          this.week = newWeek;
        }
      }
    }

    this.taskLibrary = this.taskLibrary.map(t =>
      t.id === this.editingTask.id ? this.editingTask : t
    );
    this.editingTask = null;
    this._saveData();
  }

  _setEditingUserColor(idx) {
    if (this.editingUser) {
      this.editingUser = { ...this.editingUser, defaultColorIndex: idx };
    }
  }

  _setEditingUserIcon(icon) {
    if (this.editingUser) {
      this.editingUser = { ...this.editingUser, icon: icon };
    }
  }

  _setEditingTaskColor(idx) {
    // Deprecated
  }

  _setEditingTaskIcon(icon) {
    if (this.editingTask) {
      this.editingTask = { ...this.editingTask, icon: icon };
    }
  }

  _toggleTaskCompleted(day, id) {
    const taskKey = `${day}-${id}`;
    const newCompletedTasks = { ...this.completedTasks };

    if (newCompletedTasks[taskKey]) {
      delete newCompletedTasks[taskKey];
    } else {
      newCompletedTasks[taskKey] = true;
      // Trigger Confetti!
      if (window.confetti) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#fff', '#facc15', '#a855f7', '#ec4899', '#3b82f6'] // Party colors
        });
      }
    }

    this.completedTasks = newCompletedTasks;
    this._saveData();
  }

  _handleMoveTask() {
    if (!this.moveCopyData) return;
    const { item, sourceDay, targetDay } = this.moveCopyData;

    // Ta bort från källan och lägg till i målet (flytta)
    const newSource = this.week[sourceDay].filter(i => i.id !== item.id);
    const newTarget = [...this.week[targetDay], item];
    this.week = { ...this.week, [sourceDay]: newSource, [targetDay]: newTarget };

    this.showMoveCopyModal = false;
    this.moveCopyData = null;
    this.draggedItem = null;
    this._saveData();
  }

  _handleCopyTask() {
    if (!this.moveCopyData) return;
    const { item, sourceDay, targetDay } = this.moveCopyData;

    // Skapa en kopia med nytt ID
    const copiedItem = { ...item, id: generateId() };
    const newTarget = [...this.week[targetDay], copiedItem];
    this.week = { ...this.week, [targetDay]: newTarget };

    this.showMoveCopyModal = false;
    this.moveCopyData = null;
    this.draggedItem = null;
    this._saveData();
  }

  _confirmAddTask() {
    if (!this.selectedTaskFromLibrary || !this.selectedDay) return;

    const newTask = {
      id: generateId(),
      libraryId: this.selectedTaskFromLibrary.id, // Store link to library
      text: this.selectedTaskFromLibrary.text,
      value: this.selectedTaskFromLibrary.value,
      // colorIndex removed
      icon: this.selectedTaskFromLibrary.icon || '',
      assignee: this.selectedAssignee || undefined
    };

    this.week = {
      ...this.week,
      [this.selectedDay]: [...this.week[this.selectedDay], newTask]
    };

    this.showAddTaskModal = false;
    this.selectedDay = '';
    this.selectedTaskFromLibrary = null;
    this.selectedAssignee = '';
    this._saveData();
  }

  _cleanupOldData() {
    const KEEP_COUNT = 10;
    const allWeeks = Object.keys(this.weeksData).sort();

    // 1. Hantera Veckor
    if (allWeeks.length > KEEP_COUNT) {
      const weeksToPrune = allWeeks.slice(0, allWeeks.length - KEEP_COUNT);
      const weeksToKeep = allWeeks.slice(allWeeks.length - KEEP_COUNT);
      console.log(`Archiving ${weeksToPrune.length} weeks...`);

      weeksToPrune.forEach(weekId => {
        const weekObj = this.weeksData[weekId];
        if (!weekObj || !weekObj.week) return;

        const tasks = weekObj.week;
        const completed = weekObj.completedTasks || {};

        this.users.forEach(user => {
          let weekEarnings = 0;

          // A: Veckopeng (Fixed)
          weekEarnings += Number(user.fixedAllowance || 0);

          // B: Tasks
          Object.entries(tasks).forEach(([day, taskList]) => {
            if (Array.isArray(taskList)) {
              taskList.forEach(task => {
                const taskKey = `${day}-${task.id}`;
                if (completed[taskKey] && task.assignee === user.name) {
                  weekEarnings += Number(task.value || 0);
                }
              });
            }
          });

          // Lägg till i arkivet
          user.archivedBalance = (user.archivedBalance || 0) + weekEarnings;
        });
      });

      // Spara bara de veckor vi ska behålla
      const prunedData = {};
      weeksToKeep.forEach(id => {
        prunedData[id] = this.weeksData[id];
      });
      this.weeksData = prunedData;
    }

    // 2. Hantera Utbetalningar (Behåll 50 senaste)
    if (this.payouts && this.payouts.length > 50) {
      const keptPayouts = this.payouts.slice(-50);
      const removedPayouts = this.payouts.slice(0, this.payouts.length - 50);

      removedPayouts.forEach(p => {
        const user = this.users.find(u => u.id === p.userId);
        if (user) {
          // Dra av utbetalningen från arkivet (eftersom vi tar bort "minusposten" från listan, måste vi minska "nettot")
          // Total = (ArkivEarned - ArkivPaid) + (CurrEarned - CurrPaid)
          // Om p flyttas från CurrPaid till ArkivPaid:
          // ArkivNet -= p
          user.archivedBalance = (user.archivedBalance || 0) - Number(p.amount);
        }
      });
      this.payouts = keptPayouts;
    }
  }

  _calculateTotals() {
    const totals = {};
    this.users.forEach(u => {
      totals[u.name] = {
        fixed: u.fixedAllowance,
        tasks: 0,
        total: u.fixedAllowance,
        colorIndex: u.defaultColorIndex
      };
    });

    // Räkna bara AVKLARADE uppgifter (överstrukna)
    Object.entries(this.week).forEach(([day, tasks]) => {
      tasks.forEach(item => {
        const taskKey = `${day}-${item.id}`;
        // Om uppgiften ÄR avklarad (överstruken), räkna med den
        if (this.completedTasks[taskKey] && item.assignee && totals[item.assignee]) {
          totals[item.assignee].tasks += Number(item.value || 0);
          totals[item.assignee].total += Number(item.value || 0);
        }
      });
    });

    return totals;
  }

  _calculateBalance(userId) {
    // 1. Starta med Arkiverat Saldo (historik som rensats bort)
    const user = this.users.find(u => u.id === userId);
    let totalEarned = user && user.archivedBalance ? Number(user.archivedBalance) : 0;

    // NOTERA: archivedBalance är "Netto" (Intäkter - Utbetalningar) för den rensade perioden.
    // Men för enkelhetens skull i denna funktion räknar vi det som "Intäkt" här, 
    // och drar av ALLA KVARVARANDE utbetalningar nedan.
    // Om vi rensar utbetalningar också, måste vi ha dragit av dem från archivedBalance vid rensningstillfället.

    // 2. Summera intäkter från KVARVARANDE historik (Fixed + Tasks)
    if (this.weeksData) {
      Object.entries(this.weeksData).forEach(([weekId, weekObj]) => {
        const tasks = weekObj.week;
        const completed = weekObj.completedTasks || {};

        if (user) {
          totalEarned += user.fixedAllowance;
        }

        if (tasks) {
          Object.entries(tasks).forEach(([day, taskList]) => {
            taskList.forEach(task => {
              const taskKey = `${day}-${task.id}`;
              if (completed[taskKey] && task.assignee) {
                const u = this.users.find(usr => usr.name === task.assignee);
                if (u && u.id === userId) {
                  totalEarned += Number(task.value || 0);
                }
              }
            });
          });
        }
      });
    }

    // 3. Summera KVARVARANDE utbetalningar
    let totalPaid = 0;
    if (this.payouts) {
      this.payouts.forEach(p => {
        if (p.userId === userId) {
          totalPaid += Number(p.amount || 0);
        }
      });
    }

    return { earned: totalEarned, paid: totalPaid, balance: totalEarned - totalPaid };
  }

  _registerPayout(userId, amount) {
    if (!amount || amount <= 0) return;
    this.payouts = [...this.payouts, {
      id: generateId(),
      date: new Date().toISOString(),
      userId,
      amount: Number(amount)
    }];
    this._saveData();
  }

  _initWeek() {
    const week = { market: [] };
    DAYS.forEach(day => { week[day] = []; });

    // Populate with Recurring Tasks
    if (this.recurringRules && this.recurringRules.length > 0) {
      this.recurringRules.forEach(rule => {
        if (rule.days && Array.isArray(rule.days)) {
          // New format: Multiple days
          rule.days.forEach(d => {
            const newTask = {
              id: generateId(),
              text: rule.text,
              value: Number(rule.value) || 0,
              icon: rule.icon || '',
              assignee: rule.assignee || undefined
            };
            if (week[d]) {
              week[d].push(newTask);
            } else if (d === 'market') {
              week.market.push(newTask);
            }
          });
        } else if (rule.day) {
          // Legacy format: Single day
          const newTask = {
            id: generateId(),
            text: rule.text,
            value: Number(rule.value) || 0,
            icon: rule.icon || '',
            assignee: rule.assignee || undefined
          };
          if (week[rule.day]) {
            week[rule.day].push(newTask);
          } else if (rule.day === 'market') {
            week.market.push(newTask);
          }
        }
      });
    }

    return week;
  }

  connectedCallback() {
    super.connectedCallback();
    this._loadData();
    document.addEventListener('fullscreenchange', this._handleFullscreenChange.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('fullscreenchange', this._handleFullscreenChange.bind(this));
  }

  _handleFullscreenChange() {
    this.isFullscreen = !!document.fullscreenElement;
  }

  _toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.classList.add('dark');
      localStorage.setItem('kronan_theme', 'dark');
    } else {
      this.classList.remove('dark');
      localStorage.setItem('kronan_theme', 'light');
    }
  }

  _toggleFullscreen() {
    const doc = window.document;
    const docEl = doc.documentElement;

    const requestFullScreen = docEl.requestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.webkitRequestFullScreen ||
      docEl.msRequestFullscreen;

    const cancelFullScreen = doc.exitFullscreen ||
      doc.mozCancelFullScreen ||
      doc.webkitExitFullscreen ||
      doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      if (requestFullScreen) {
        requestFullScreen.call(docEl).catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
          window.alert(`Kunde inte starta helskärm: ${err.message}\n(Om du kör via Home Assistant kan detta vara begränsat av webbläsaren/appen)`);
        });
      } else {
        window.alert("Helskärm stöds inte av din webbläsare.");
      }
    } else {
      if (cancelFullScreen) {
        cancelFullScreen.call(doc);
      }
    }
  }

  // --- DATALAGRING (HA + LocalStorage) ---
  async _loadData() {
    this.loading = true;
    let loaded = false;

    // 1. Försök ladda från Home Assistant (/local/kronan_data.json)
    try {
      const response = await fetch('/local/kronan_data.json?v=' + new Date().getTime());
      if (response.ok) {
        const parsed = await response.json();
        this._applyLoadedData(parsed);
        loaded = true;
        console.log("Data laddad från HA.");
      }
    } catch (e) {
      console.log("Kunde inte ladda från HA (körs antagligen standalone).");
    }

    // 2. Om HA misslyckades, försök ladda från LocalStorage
    if (!loaded) {
      try {
        const local = localStorage.getItem('kronan_data');
        if (local) {
          const parsed = JSON.parse(local);
          this._applyLoadedData(parsed);
          loaded = true;
          console.log("Data laddad från LocalStorage.");
        }
      } catch (e) {
        console.error("Fel vid laddning från LocalStorage:", e);
      }
    }

    // 3. Om inget hittades, starta ny vecka
    if (!loaded) {
      console.log("Ingen sparad data hittades, startar ny.");
      this.week = this._initWeek();
      // Init weeksData för "nu"
      const currentId = getWeekIdentifier(this.currentDate);
      this.weeksData = { [currentId]: { week: this.week, completedTasks: {} } };
    }

    // Sätt vy till aktuell vecka om `this.week` laddades men inte `weeksData` (gammal data)
    // Detta hanteras i `_applyLoadedData`

    this.loading = false;
  }

  _applyLoadedData(parsed) {
    if (parsed.users) this.users = parsed.users;
    if (parsed.taskLibrary) this.taskLibrary = parsed.taskLibrary;
    if (parsed.templates) this.templates = parsed.templates;

    // Hantera historik (om den finns)
    if (parsed.weeksData) {
      this.weeksData = parsed.weeksData;
    }

    if (parsed.payouts) {
      this.payouts = parsed.payouts;
    }

    if (parsed.recurringRules) {
      this.recurringRules = parsed.recurringRules;
    }

    // Hantera gammal data utan historik (migrering)
    if (!this.weeksData || Object.keys(this.weeksData).length === 0) {
      // Om vi laddade en "gammal" fil som bara hade 'week' och 'completedTasks'
      // Spara den som "NUVARANDE" vecka
      const currentId = getWeekIdentifier(new Date()); // Antag att sparad data är "nu"
      this.weeksData = {
        [currentId]: {
          week: { ...this._initWeek(), ...(parsed.week || {}) }, // Merge with empty week to ensure 'market' exists
          completedTasks: parsed.completedTasks || {}
        }
      };

      // Säkerställ att market finns även om week laddades från gammal fil
      if (this.weeksData[currentId].week && !this.weeksData[currentId].week.market) {
        this.weeksData[currentId].week.market = [];
      }
    }

    // Robust migration: Gå igenom ALL historik och se till att 'market' finns
    if (this.weeksData) {
      Object.values(this.weeksData).forEach(data => {
        if (data.week && !data.week.market) {
          data.week.market = [];
        }
      });
    }

    // Sätt vyn till currentDate
    this._refreshView();
  }

  async _saveData() {
    // Spara först ner nuvarande vy till weeksData direkt (för att säkerställa att vi har senaste state)
    this._persistCurrentView();

    // Kör resten asynkront i nästa "tick" för att inte blockera UI (knapptryckningar etc)
    setTimeout(async () => {
      try {
        // --- PRUNING: Arkivera och rensa gammal data (behåll ca 10 veckor) ---
        this._cleanupOldData();
        // ---------------------------------------------------

        // Samla all data vi vill spara
        const dataToSave = {
          weeksData: this.weeksData,
          users: this.users,
          taskLibrary: this.taskLibrary,
          templates: this.templates,
          payouts: this.payouts,
          recurringRules: this.recurringRules,
        };

        const dataStr = JSON.stringify(dataToSave);

        // 1. Spara till Home Assistant om tillgängligt (utan await för att inte blockera)
        if (this.hass) {
          this.hass.callService('shell_command', 'save_kronan_data', {
            data: dataStr
          }).catch(e => console.warn("Kunde inte spara till HA (ignorerar):", e));
        }

        // 2. Spara alltid till LocalStorage
        localStorage.setItem('kronan_data', dataStr);
        console.log("Data sparad.");
      } catch (e) {
        console.error("Fel vid sparande av data:", e);
      }
    }, 0);
  }

  // --- Navigering ---

  _prevWeek() {
    this._persistCurrentView(); // Spara undan det vi gjort
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.currentDate = new Date(this.currentDate); // Trigga uppdatering
    this._refreshView();
  }

  _nextWeek() {
    this._persistCurrentView();
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.currentDate = new Date(this.currentDate);
    this._refreshView();
  }

  _persistCurrentView() {
    const id = getWeekIdentifier(this.currentDate);
    this.weeksData = {
      ...this.weeksData,
      [id]: {
        week: this.week,
        completedTasks: this.completedTasks
      }
    };
  }

  _refreshView() {
    const id = getWeekIdentifier(this.currentDate);
    const data = this.weeksData[id];

    if (data) {
      this.week = data.week;
      this.completedTasks = data.completedTasks || {};
    } else {
      // Ny vecka
      this.week = this._initWeek();
      this.completedTasks = {};
    }
    this.requestUpdate();
  }

  _onInput(e, day) {
    this.newTasks = { ...this.newTasks, [day]: e.target.value };
  }

  _addTask(day) {
    this.selectedDay = day;
    this.selectedTaskFromLibrary = null;
    this.selectedAssignee = '';
    this.showAddTaskModal = true;
  }

  _startEdit(day, id) {
    const item = this.week[day].find(t => t.id === id);
    if (!item) return;
    this.isEditing = { day, id };
    this.editData = {
      text: item.text,
      // colorIndex removed
      value: item.value || '',
      icon: item.icon || '',
      assignee: item.assignee || ''
    };
  }

  _closeEdit() {
    this.isEditing = null;
    this.editData = { text: '', colorIndex: 0, value: '', assignee: '', icon: '' };
  }

  _saveEdit() {
    const { day, id } = this.isEditing;

    // --- Two-Way Sync Logic (Board -> Library) ---
    const currentTask = this.week[day].find(t => t.id === id);
    if (currentTask) {
      // 1. Try to find match in library by ID
      let libraryMatch = this.taskLibrary.find(t => t.id === currentTask.libraryId);

      // 2. Fallback: match by NAME if no ID match (compatibility with old tasks)
      if (!libraryMatch && currentTask.text) {
        libraryMatch = this.taskLibrary.find(t => t.text === currentTask.text);
      }

      if (libraryMatch) {
        const nameChanged = libraryMatch.text !== this.editData.text;
        const priceChanged = Number(libraryMatch.value) !== Number(this.editData.value);
        const iconChanged = libraryMatch.icon !== this.editData.icon;

        if (nameChanged || priceChanged || iconChanged) {
          if (window.confirm(`Vill du även uppdatera den sparade uppgiften i biblioteket ("${libraryMatch.text}") med dessa ändringar?`)) {
            this.taskLibrary = this.taskLibrary.map(t => {
              if (t.id === libraryMatch.id) {
                return { ...t, text: this.editData.text, value: Number(this.editData.value) || 0, icon: this.editData.icon };
              }
              return t;
            });
            this.week[day] = this.week[day].map(item =>
              item.id === id ? { ...item, libraryId: libraryMatch.id } : item
            );
          }
        }
      }
    }

    this.week = {
      ...this.week,
      [day]: this.week[day].map(item =>
        item.id === id ? { ...item, ...this.editData } : item
      )
    };
    this._saveData();
    this._closeEdit();
  }

  _addRecurringRule(days, text, value, icon, assignee) {
    if (!text || !days || days.length === 0) return;
    this.recurringRules = [
      ...this.recurringRules,
      {
        id: generateId(),
        days: Array.isArray(days) ? days : [days],
        text,
        value: Number(value) || 0,
        icon: icon || '',
        assignee: assignee || undefined
      }
    ];
    this._saveData();
  }

  _deleteRecurringRule(id) {
    this.recurringRules = this.recurringRules.filter(r => r.id !== id);
    this._saveData();
  }

  _deleteTask(day, id) {
    this.week = { ...this.week, [day]: this.week[day].filter(t => t.id !== id) };
    this._saveData();
    if (this.isEditing && this.isEditing.day === day && this.isEditing.id === id) {
      this._closeEdit();
    }
  }

  _onEditInput(e, field) {
    this.editData = { ...this.editData, [field]: e.target.value };
  }

  _setEditColor(idx) {
    // Deprecated
  }

  _setEditIcon(icon) {
    this.editData = { ...this.editData, icon: icon };
  }

  render() {
    const totals = this._calculateTotals();
    return html`
      <div class="main">
        <header class="header">
          <div class="crown">${this._crownIcon()}</div>
          <div class="header-titles">
            <div style="display:flex;align-items:center;gap:12px;">
              <button @click="${() => this._prevWeek()}" style="background:none;border:none;cursor:pointer;font-size:1.5rem;color:var(--text-secondary);padding:4px 8px;border-radius:8px;" class="nav-btn">◀</button>
              
              <div style="display:flex;flex-direction:column;gap:2px;">
                <h1 style="margin:0;font-size:1.8rem;color:var(--text-primary);display:flex;align-items:center;gap:10px;">
                  Vecka ${getWeekNumber(this.currentDate)}
                  ${getWeekIdentifier(this.currentDate) === getWeekIdentifier(new Date())
        ? html`<span style="background:#10b981;color:#fff;font-size:0.9rem;padding:2px 8px;border-radius:12px;font-weight:bold;vertical-align:middle;">NU</span>`
        : ''}
                </h1>
                <p style="margin:0;color:var(--text-secondary);font-size:0.95rem;font-weight:500;">
                  ${getWeekRange(this.currentDate)}
                </p>
              </div>

              <button @click="${() => this._nextWeek()}" style="background:none;border:none;cursor:pointer;font-size:1.5rem;color:var(--text-secondary);padding:4px 8px;border-radius:8px;" class="nav-btn">▶</button>
            </div>
          </div>
          <div style="display:flex;gap:10px;">
            <button @click="${() => this._toggleDarkMode()}" style="background:var(--bg-surface);border:1px solid var(--border-color);color:var(--text-secondary);padding:8px;border-radius:12px;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;width:40px;height:40px;" title="${this.isDarkMode ? 'Ljust läge' : 'Mörkt läge'}">
              ${this.isDarkMode ? '☀️' : '🌙'}
            </button>
            <button @click="${() => this._toggleFullscreen()}" style="background:var(--bg-surface);border:1px solid var(--border-color);color:var(--text-secondary);padding:8px;border-radius:12px;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;width:40px;height:40px;" title="${this.isFullscreen ? 'Avsluta helskärm' : 'Helskärm'}">
              ${this.isFullscreen ? '↙️' : '⛶'}
            </button>
            <button style="background:#10b981;color:#fff;padding:8px 18px;border-radius:12px;border:none;font-weight:bold;font-size:1rem;cursor:pointer;" @click="${() => { this.showMoneyModal = true; this.moneyTab = 'users'; }}">Inställningar</button>
          </div>

          ${this.showTemplateModal ? html`
            <div style="position:fixed;inset:0;z-index:2100;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;">
              <div style="background:var(--bg-surface);border-radius:24px;box-shadow:0 8px 40px var(--shadow-color);padding:32px;min-width:320px;max-width:96vw;width:400px;max-height:90vh;overflow-y:auto;display:flex;flex-direction:column;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
                  <h2 style="font-size:1.2rem;font-weight:bold;color:#f59e0b;">Veckomallar</h2>
                  <button style="background:none;border:none;font-size:1.5rem;color:var(--text-secondary);cursor:pointer;" @click="${() => this.showTemplateModal = false}">✕</button>
                </div>
                <button @click="${() => { const name = window.prompt('Vad ska mallen heta?'); if (name) this._saveTemplate(name); }}" style="width:100%;padding:12px 0;border:2px dashed #f59e0b;border-radius:12px;color:#f59e0b;font-weight:bold;font-size:1rem;background:#fff;cursor:pointer;margin-bottom:18px;">+ Spara denna vecka som mall</button>
                <div style="overflow-y:auto;max-height:300px;">
                  ${this.templates.length === 0 ? html`<span style="color:#64748b;font-size:0.95rem;">Inga mallar sparade än.</span>` : ''}
                  ${this.templates.map(t => html`
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;background:#fff;border-radius:8px;margin-bottom:6px;">
                      <span style="font-weight:bold;color:#334155;">${t.name}</span>
                      <div style="display:flex;gap:6px;">
                        <button @click="${() => this._loadTemplate(t)}" style="background:#6366f1;color:#fff;padding:4px 10px;border-radius:8px;border:none;font-size:0.9rem;cursor:pointer;">Ladda</button>
                        <button @click="${() => this._deleteTemplate(t.id)}" style="background:#ef4444;color:#fff;padding:4px 10px;border-radius:8px;border:none;font-size:0.9rem;cursor:pointer;">✕</button>
                      </div>
                    </div>
                  `)}
                </div>
              </div>
            </div>
          ` : ''}



          ${this.showMoneyModal ? html`
            <div style="position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;">
              <div style="background:var(--bg-surface);border-radius:24px;box-shadow:0 8px 40px var(--shadow-color);padding:32px;min-width:340px;max-width:96vw;width:800px;max-height:90vh;overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
                  <h2 style="font-size:1.2rem;font-weight:bold;color:var(--text-primary);">Inställningar</h2>
                  <button style="background:none;border:none;font-size:1.5rem;color:var(--text-secondary);cursor:pointer;" @click="${() => this.showMoneyModal = false}">✕</button>
                </div>
                <div style="display:flex;gap:4px;background:#f1f5f9;padding:4px;border-radius:12px;width:100%;overflow-x:auto;margin-bottom:18px;">
                  <button @click="${() => this.moneyTab = 'users'}" style="flex:1;padding:6px 12px;white-space:nowrap;border-radius:8px;border:none;font-weight:bold;font-size:0.9rem;cursor:pointer;${this.moneyTab === 'users' ? 'background:#fff;color:#6366f1;box-shadow:0 2px 4px #6366f133;' : 'background:none;color:#64748b;'}">Personer</button>
                  <button @click="${() => this.moneyTab = 'tasks'}" style="flex:1;padding:6px 12px;white-space:nowrap;border-radius:8px;border:none;font-weight:bold;font-size:0.9rem;cursor:pointer;${this.moneyTab === 'tasks' ? 'background:#fff;color:#10b981;box-shadow:0 2px 4px #10b98133;' : 'background:none;color:#64748b;'}">Bibliotek</button>
                  <button @click="${() => this.moneyTab = 'payouts'}" style="flex:1;padding:6px 12px;white-space:nowrap;border-radius:8px;border:none;font-weight:bold;font-size:0.9rem;cursor:pointer;${this.moneyTab === 'payouts' ? 'background:#fff;color:#ef4444;box-shadow:0 2px 4px #ef444433;' : 'background:none;color:#64748b;'}">Utbetalning</button>
                  <button @click="${() => this.moneyTab = 'recurring'}" style="flex:1;padding:6px 12px;white-space:nowrap;border-radius:8px;border:none;font-weight:bold;font-size:0.9rem;cursor:pointer;${this.moneyTab === 'recurring' ? 'background:#fff;color:#8b5cf6;box-shadow:0 2px 4px #8b5cf633;' : 'background:none;color:#64748b;'}">Återkommande</button>
                  <button @click="${() => this.moneyTab = 'data'}" style="flex:1;padding:6px 12px;white-space:nowrap;border-radius:8px;border:none;font-weight:bold;font-size:0.9rem;cursor:pointer;${this.moneyTab === 'data' ? 'background:#fff;color:#f59e0b;box-shadow:0 2px 4px #f59e0b33;' : 'background:none;color:#64748b;'}">Data</button>
                </div>
                <div style="flex:1;overflow-y:auto;">
                  ${this.moneyTab === 'users' ? html`
                    <div style="background:#eef2ff;padding:18px;border-radius:14px;margin-bottom:18px;">
                      <h4 style="font-weight:bold;color:#3730a3;font-size:1rem;margin-bottom:10px;">Lägg till person</h4>
                      <form @submit="${e => { e.preventDefault(); this._addUser(e.target.name.value, e.target.allowance.value); e.target.reset(); }}" style="display:flex;flex-direction:column;gap:10px;">
                        <div style="display:flex;gap:10px;">
                          <input name="name" placeholder="Namn (t.ex. Isak)" style="flex:1;padding:8px 10px;border-radius:8px;border:1px solid #c7d2fe;font-size:1rem;" required />
                          <input name="allowance" type="number" placeholder="Fast veckopeng" style="width:110px;padding:8px 10px;border-radius:8px;border:1px solid #c7d2fe;font-size:1rem;" />
                        </div>
                        <div style="display:flex;align-items:center;gap:10px;background:#fff;padding:6px 10px;border-radius:8px;">
                          <span style="font-size:0.8rem;font-weight:bold;color:#64748b;">Välj färg:</span>
                          <div style="display:flex;gap:6px;">
                            ${COLORS.map((col, idx) => html`
                              <button type="button" @click="${() => this._setNewUserColor(idx)}" style="width:24px;height:24px;border-radius:50%;border:2px solid ${this.newUserColor === idx ? '#6366f1' : '#e5e7eb'};background:${col.bg};cursor:pointer;"></button>
                            `)}
                          </div>
                        </div>
                        <div style="display:flex;align-items:center;gap:10px;background:#fff;padding:6px 10px;border-radius:8px;">
                          <span style="font-size:0.8rem;font-weight:bold;color:#64748b;">Välj ikon:</span>
                          <div style="display:flex;gap:4px;overflow-x:auto;width:100%;padding-bottom:4px;">
                            ${ICONS.map(icon => html`
                              <button type="button" @click="${() => this.newUserIcon = icon}" style="flex-shrink:0;width:44px;height:44px;border-radius:8px;border:2px solid ${this.newUserIcon === icon ? '#6366f1' : '#e5e7eb'};background:#fff;font-size:1.6rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">${icon}</button>
                            `)}
                          </div>
                        </div>
                        <button type="submit" style="background:#6366f1;color:#fff;padding:10px 0;border-radius:8px;border:none;font-weight:bold;font-size:1rem;cursor:pointer;">Lägg till Person</button>
                      </form>
                    </div>
                    <div style="margin-bottom:10px;">
                      <h4 style="font-size:0.9rem;font-weight:bold;color:#64748b;margin-bottom:6px;">Aktiva personer</h4>
                      ${this.users.length === 0 ? html`<span style="color:#64748b;font-size:0.95rem;">Inga personer tillagda.</span>` : ''}
                      ${this.users.map(u => html`
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0 8px 0;background:#fff;border-radius:8px;margin-bottom:6px;">
                          <div style="display:flex;align-items:center;gap:10px;">
                            <div style="width:16px;height:16px;border-radius:50%;background:${COLORS[u.defaultColorIndex || 0].bg};border:1px solid #e5e7eb;"></div>
                            <div>
                              <span style="font-weight:bold;color:#334155;">${u.icon || ''} ${u.name}</span><br>
                              <span style="font-size:0.8rem;color:#64748b;">Fast veckopeng: ${u.fixedAllowance} kr</span>
                            </div>
                          </div>
                          <div style="display:flex;gap:4px;">
                            <button @click="${() => this._startEditUser(u)}" style="background:none;border:none;color:#6366f1;font-size:1.2rem;cursor:pointer;">✏️</button>
                            <button @click="${() => this._deleteUser(u.id)}" style="background:none;border:none;color:#ef4444;font-size:1.2rem;cursor:pointer;">✕</button>
                          </div>
                        </div>
                      `)}
                    </div>
                  ` : this.moneyTab === 'tasks' ? html`
                    <div style="background:#d1fae5;padding:18px;border-radius:14px;margin-bottom:18px;">
                      <h4 style="font-weight:bold;color:#047857;font-size:1rem;margin-bottom:10px;">Lägg till i biblioteket</h4>
                      <form @submit="${e => { e.preventDefault(); this._addTaskToLibrary(e.target.desc.value, e.target.val.value); e.target.reset(); }}" style="display:flex;flex-direction:column;gap:10px;">
                        <div style="display:flex;gap:10px;">
                          <input name="desc" placeholder="Uppgift (t.ex. Tömma diskmaskin)" style="flex:1;padding:8px 10px;border-radius:8px;border:1px solid #6ee7b7;font-size:1rem;" required />
                          <input name="val" type="number" placeholder="Pris (kr)" style="width:90px;padding:8px 10px;border-radius:8px;border:1px solid #6ee7b7;font-size:1rem;" required />
                        </div>
                        <div style="display:flex;align-items:center;gap:10px;background:#fff;padding:6px 10px;border-radius:8px;">
                          <span style="font-size:0.8rem;font-weight:bold;color:#64748b;">Välj ikon:</span>
                          <div style="display:flex;gap:4px;overflow-x:auto;width:100%;padding-bottom:4px;">
                            ${ICONS.map(icon => html`
                              <button type="button" @click="${() => this.newTaskIcon = icon}" style="flex-shrink:0;width:44px;height:44px;border-radius:8px;border:2px solid ${this.newTaskIcon === icon ? '#10b981' : '#e5e7eb'};background:#fff;font-size:1.6rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">${icon}</button>
                            `)}
                          </div>
                        </div>
                        <button type="submit" style="background:#10b981;color:#fff;padding:10px 0;border-radius:8px;border:none;font-weight:bold;font-size:1rem;cursor:pointer;">Lägg till Uppgift</button>
                      </form>
                    </div>
                    <div style="margin-bottom:10px;">
                      <h4 style="font-size:0.9rem;font-weight:bold;color:#64748b;margin-bottom:6px;">Sparade uppgifter</h4>
                      ${this.taskLibrary.length === 0 ? html`<span style="color:#64748b;font-size:0.95rem;">Inga uppgifter i biblioteket än.</span>` : ''}
                      ${this.taskLibrary.map(t => html`
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0 8px 0;background:#fff;border-radius:8px;margin-bottom:6px;">
                          <div style="display:flex;align-items:center;gap:10px;">
                            <div style="background:#bbf7d0;color:#047857;padding:2px 8px;border-radius:6px;font-size:0.95rem;font-weight:bold;">${t.value} kr</div>
                            <span style="font-weight:500;color:#334155;">${t.icon || ''} ${t.text}</span>
                          </div>
                          <div style="display:flex;gap:4px;">
                            <button @click="${() => this._startEditTask(t)}" style="background:none;border:none;color:#10b981;font-size:1.2rem;cursor:pointer;">✏️</button>
                            <button @click="${() => this._deleteTaskFromLibrary(t.id)}" style="background:none;border:none;color:#ef4444;font-size:1.2rem;cursor:pointer;">✕</button>
                          </div>
                        </div>
                      `)}
                    </div>
                  ` : this.moneyTab === 'payouts' ? html`
                    <div style="display:flex;flex-direction:column;gap:16px;">
                      <h4 style="font-weight:bold;color:#1e293b;font-size:1rem;margin-bottom:6px;">Saldo & Utbetalning</h4>
                      ${this.users.map(u => {
          const bal = this._calculateBalance(u.id);
          return html`
                          <div style="background:#fff;padding:16px;border-radius:14px;border:1px solid #e5e7eb;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                              <div style="display:flex;align-items:center;gap:10px;">
                                <span style="font-size:1.5rem;">${u.icon || '👤'}</span>
                                <div>
                                  <div style="font-weight:bold;font-size:1.1rem;color:#1e293b;">${u.name}</div>
                                  <div style="font-size:0.85rem;color:#64748b;">Saldo: <span style="font-weight:bold;color:${bal.balance >= 0 ? '#10b981' : '#ef4444'}">${bal.balance} kr</span></div>
                                </div>
                              </div>
                              <button @click="${() => {
              this.payoutUser = u;
              this.showPayoutModal = true;
            }}" style="background:#ef4444;color:#fff;padding:6px 14px;border-radius:8px;border:none;font-weight:bold;cursor:pointer;">Betala ut</button>
                            </div>
                            <div style="display:flex;gap:12px;font-size:0.85rem;background:#f8fafc;padding:8px;border-radius:8px;">
                              <div style="flex:1;">
                                <span style="color:#64748b;display:block;">Totalt intjänat:</span>
                                <span style="font-weight:bold;color:#10b981;">+${bal.earned} kr</span>
                              </div>
                              <div style="flex:1;">
                                <span style="color:#64748b;display:block;">Totalt utbetalat:</span>
                                <span style="font-weight:bold;color:#ef4444;">-${bal.paid} kr</span>
                              </div>
                            </div>
                          </div>
                        `;
        })}
                      
                      <div style="margin-top:12px;">
                        <h4 style="font-weight:bold;color:#64748b;font-size:0.9rem;margin-bottom:8px;">Senaste utbetalningar</h4>
                        ${this.payouts.slice().reverse().slice(0, 5).map(p => {
          const u = this.users.find(usr => usr.id === p.userId);
          return html`
                            <div style="display:flex;justify-content:space-between;border-bottom:1px solid #e5e7eb;padding:6px 0;font-size:0.9rem;">
                              <span style="color:var(--text-primary);">${u ? u.name : 'Okänd'}</span>
                              <span style="color:#64748b;">${p.date.slice(0, 10)}</span>
                              <span style="font-weight:bold;color:#ef4444;">-${p.amount} kr</span>
                            </div>
                          `;
        })}
                        ${this.payouts.length === 0 ? html`<div style="color:#94a3b8;font-size:0.9rem;">Inga utbetalningar registrerade än.</div>` : ''}
                      </div>
                    </div>
                  ` : this.moneyTab === 'recurring' ? html`
                    <div style="background:#f3e8ff;padding:18px;border-radius:14px;margin-bottom:18px;">
                      <h4 style="font-weight:bold;color:#6b21a8;font-size:1rem;margin-bottom:10px;">Skapa regel</h4>
                      <form @submit="${e => {
            e.preventDefault();
            if (this.selectedRecurringDays.length === 0) {
              alert('Välj minst en dag!');
              return;
            }
            const formData = new FormData(e.target);
            this._addRecurringRule(
              this.selectedRecurringDays, // Pass array
              formData.get('text'),
              formData.get('value'),
              formData.get('icon'),
              formData.get('assignee')
            );
            this.selectedRecurringDays = []; // Reset days
            e.target.reset();
          }}" style="display:flex;flex-direction:column;gap:10px;">
                        
                        <!-- Day Chips Selector -->
                        <div>
                          <label style="font-size:0.8rem;font-weight:bold;color:#6b21a8;margin-bottom:4px;display:block;">Välj dagar:</label>
                          <div style="display:flex;flex-wrap:wrap;gap:6px;">
                            ${[...DAYS, 'market'].map(d => {
            const isSelected = this.selectedRecurringDays.includes(d);
            const label = d === 'market' ? '🛒 Marknad' : d.substring(0, 3);
            return html`
                                <button type="button" 
                                  @click="${() => {
                if (isSelected) {
                  this.selectedRecurringDays = this.selectedRecurringDays.filter(day => day !== d);
                } else {
                  this.selectedRecurringDays = [...this.selectedRecurringDays, d];
                }
              }}"
                                  style="padding:6px 10px;border-radius:12px;border:1px solid ${isSelected ? '#8b5cf6' : '#e9d5ff'};background:${isSelected ? '#8b5cf6' : '#fff'};color:${isSelected ? '#fff' : '#6b21a8'};font-size:0.85rem;font-weight:bold;cursor:pointer;transition:all 0.1s;">
                                  ${label}
                                </button>
                              `;
          })}
                          </div>
                        </div>

                        <div style="display:flex;gap:10px;">
                          <select name="assignee" style="flex:1;padding:8px 10px;border-radius:8px;border:1px solid #c084fc;font-size:1rem;">
                            <option value="">-- Vem? (Valfritt) --</option>
                            ${this.users.map(u => html`<option value="${u.name}">${u.name}</option>`)}
                          </select>
                        </div>
                        
                        <!-- Helper to pick from library -->
                        <select style="width:100%;padding:8px 10px;border-radius:8px;border:1px solid #e9d5ff;font-size:0.9rem;color:#6b21a8;" 
                          @change="${e => {
            const t = this.taskLibrary.find(x => x.id === e.target.value);
            if (t) {
              const form = e.target.closest('form');
              form.querySelector('[name=text]').value = t.text;
              form.querySelector('[name=value]').value = t.value;
              form.querySelector('[name=icon]').value = t.icon || '';
            }
          }}">
                          <option value="">-- Hämta info från biblioteket (fyller i nedan) --</option>
                          ${this.taskLibrary.map(t => html`<option value="${t.id}">${t.icon} ${t.text} (${t.value} kr)</option>`)}
                        </select>

                        <div style="display:flex;gap:10px;">
                          <input name="text" placeholder="Uppgift" style="flex:2;padding:8px 10px;border-radius:8px;border:1px solid #c084fc;font-size:1rem;" required />
                          <input name="value" type="number" placeholder="Kr" style="width:70px;padding:8px 10px;border-radius:8px;border:1px solid #c084fc;font-size:1rem;" />
                          <input name="icon" placeholder="Ikon" style="width:50px;padding:8px 10px;border-radius:8px;border:1px solid #c084fc;font-size:1rem;" />
                        </div>

                        <button type="submit" style="background:#8b5cf6;color:#fff;padding:10px 0;border-radius:8px;border:none;font-weight:bold;font-size:1rem;cursor:pointer;">Lägg till Regel</button>
                      </form>
                    </div>

                    <div style="margin-bottom:10px;">
                      <h4 style="font-size:0.9rem;font-weight:bold;color:#64748b;margin-bottom:6px;">Aktiva regler</h4>
                      ${(this.recurringRules || []).length === 0 ? html`<span style="color:#64748b;font-size:0.95rem;">Inga regler sparade än.</span>` : ''}
                      ${(this.recurringRules || []).map(r => html`
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#fff;border-radius:8px;margin-bottom:6px;border:1px solid #f3e8ff;">
                          <div>
                            <span style="font-size:0.8rem;font-weight:bold;color:#8b5cf6;text-transform:uppercase;">
                              ${(() => {
              if (r.days && Array.isArray(r.days)) {
                return r.days.map(d => d === 'market' ? '🛒' : d.substring(0, 3)).join(', ');
              }
              return r.day === 'market' ? '🛒 Marknad' : r.day;
            })()}
                            </span>
                            <div style="font-weight:500;color:#334155;">${r.icon} ${r.text} <span style="color:#94a3b8;font-size:0.9rem;">(${r.value} kr)</span></div>
                            ${r.assignee ? html`<div style="font-size:0.8rem;color:#64748b;">👤 ${r.assignee}</div>` : ''}
                          </div>
                          <button @click="${() => this._deleteRecurringRule(r.id)}" style="background:none;border:none;color:#ef4444;font-size:1.2rem;cursor:pointer;">✕</button>
                        </div>
                      `)}
                    </div>
                  ` : this.moneyTab === 'data' ? html`
                    <div style="display:flex;flex-direction:column;gap:16px;">
                      <div style="background:#fef3c7;padding:18px;border-radius:14px;">
                        <h4 style="font-weight:bold;color:#92400e;font-size:1rem;margin-bottom:10px;">📁 Mallar</h4>
                        <p style="color:#92400e;font-size:0.9rem;margin-bottom:12px;">Spara nuvarande vecka som mall eller ladda en sparad mall.</p>
                        <button @click="${() => { this.showMoneyModal = false; this.showTemplateModal = true; }}" style="width:100%;background:#f59e0b;color:#fff;padding:12px 0;border:none;border-radius:10px;font-weight:bold;font-size:1rem;cursor:pointer;">
                          Hantera Mallar
                        </button>
                      </div>
                      
                      <div style="background:#dbeafe;padding:18px;border-radius:14px;">
                        <h4 style="font-weight:bold;color:#1e40af;font-size:1rem;margin-bottom:10px;">💾 Exportera Data</h4>
                        <p style="color:#1e40af;font-size:0.9rem;margin-bottom:12px;">Spara en backup av all data till din dator.</p>
                        <button @click="${() => { this.showMoneyModal = false; this._exportData(); }}" style="width:100%;background:#3b82f6;color:#fff;padding:12px 0;border:none;border-radius:10px;font-weight:bold;font-size:1rem;cursor:pointer;">
                          Exportera Backup
                        </button>
                      </div>
                      
                      <div style="background:#dcfce7;padding:18px;border-radius:14px;">
                        <h4 style="font-weight:bold;color:#166534;font-size:1rem;margin-bottom:10px;">📥 Importera Data</h4>
                        <p style="color:#166534;font-size:0.9rem;margin-bottom:12px;">Ladda en tidigare sparad backup.</p>
                        <button @click="${() => { this.showMoneyModal = false; this._triggerImport(); }}" style="width:100%;background:#10b981;color:#fff;padding:12px 0;border:none;border-radius:10px;font-weight:bold;font-size:1rem;cursor:pointer;">
                          Importera Backup
                        </button>
                      </div>
                      

                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          ` : ''
      }

          ${this.showPayoutModal && this.payoutUser ? html`
            <div style="position:fixed;inset:0;z-index:2500;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;">
              <div style="background:var(--bg-surface);border-radius:24px;box-shadow:0 8px 40px var(--shadow-color);padding:32px;min-width:320px;max-width:96vw;width:400px;display:flex;flex-direction:column;">
                <h2 style="font-size:1.2rem;font-weight:bold;color:var(--text-primary);margin-bottom:18px;">Betala ut till ${this.payoutUser.name}</h2>
                <div style="margin-bottom:18px;">
                  <label style="font-size:0.9rem;font-weight:600;color:var(--text-secondary);">Belopp (kr)</label><br>
                  <div style="display:flex;gap:10px;align-items:center;margin-top:4px;">
                    <input id="payoutInput" type="number" min="1" max="${this._calculateBalance(this.payoutUser.id).balance}" 
                      style="flex:1;font-size:1.2rem;padding:8px 12px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-app);color:var(--text-primary);" autofocus>
                    <button style="background:var(--accent-color);color:#fff;border:none;border-radius:8px;padding:8px 12px;cursor:pointer;font-weight:bold;"
                      @click="${() => {
          const balance = this._calculateBalance(this.payoutUser.id).balance;
          const input = this.shadowRoot.getElementById('payoutInput');
          input.value = balance;
        }}">Max</button>
                  </div>
                  <div style="font-size:0.8rem;color:var(--text-secondary);margin-top:4px;">
                    Max belopp: ${this._calculateBalance(this.payoutUser.id).balance} kr
                  </div>
                </div>
                <div style="display:flex;gap:10px;">
                  <button style="flex:1;background:var(--bg-app);color:var(--text-primary);padding:10px 0;border:none;border-radius:10px;font-weight:bold;font-size:1rem;cursor:pointer;"
                    @click="${() => { this.showPayoutModal = false; this.payoutUser = null; }}">Avbryt</button>
                  <button style="flex:1;background:#ef4444;color:#fff;padding:10px 0;border:none;border-radius:10px;font-weight:bold;font-size:1rem;cursor:pointer;"
                    @click="${() => {
          const input = this.shadowRoot.getElementById('payoutInput');
          const amount = Number(input.value);
          if (amount > 0) {
            this._registerPayout(this.payoutUser.id, amount);
            this.showPayoutModal = false;
            this.payoutUser = null;
          }
        }}">Bekräfta</button>
                </div>
              </div>
            </div>
          ` : ''
      }

          ${this.editingUser ? html`
            <div style="position:fixed;inset:0;z-index:2500;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;">
              <div style="background:var(--bg-surface);border-radius:24px;box-shadow:0 8px 40px var(--shadow-color);padding:32px;min-width:320px;max-width:96vw;width:400px;display:flex;flex-direction:column;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
                  <h2 style="font-size:1.2rem;font-weight:bold;color:#6366f1;">Redigera person</h2>
                  <button style="background:none;border:none;font-size:1.5rem;color:var(--text-secondary);cursor:pointer;" @click="${() => this.editingUser = null}">✕</button>
                </div>
                <div style="margin-bottom:18px;">
                  <label style="font-size:0.9rem;font-weight:600;color:#64748b;">Namn</label><br>
                  <input style="width:100%;font-size:1.1rem;padding:8px 12px;border-radius:8px;border:1px solid #ddd;margin-top:4px;" 
                    .value="${this.editingUser.name}" @input="${e => this.editingUser = { ...this.editingUser, name: e.target.value }}">
                </div>
                <div style="margin-bottom:18px;">
                  <label style="font-size:0.9rem;font-weight:600;color:#64748b;">Fast veckopeng (kr)</label><br>
                  <input type="number" style="width:100%;font-size:1.1rem;padding:8px 12px;border-radius:8px;border:1px solid #ddd;margin-top:4px;" 
                    .value="${this.editingUser.fixedAllowance}" @input="${e => this.editingUser = { ...this.editingUser, fixedAllowance: Number(e.target.value) }}">
                </div>
                <div style="margin-bottom:18px;">
                  <label style="font-size:0.9rem;font-weight:600;color:#64748b;">Färg</label><br>
                  <div style="display:flex;gap:10px;margin-top:6px;">
                    ${COLORS.map((col, idx) => html`
                      <button style="width:32px;height:32px;border-radius:50%;border:2px solid ${this.editingUser.defaultColorIndex === idx ? '#6366f1' : '#e5e7eb'};background:${col.bg};cursor:pointer;"
                        @click="${() => this._setEditingUserColor(idx)}"></button>
                    `)}
                  </div>
                </div>
                <div style="margin-bottom:18px;">
                  <label style="font-size:0.9rem;font-weight:600;color:#64748b;">Ikon</label><br>
                  <div style="display:flex;gap:4px;overflow-x:auto;width:100%;margin-top:6px;padding-bottom:10px;">
                    ${ICONS.map(icon => html`
                      <button style="flex-shrink:0;width:44px;height:44px;border-radius:8px;border:2px solid ${this.editingUser.icon === icon ? '#6366f1' : '#e5e7eb'};background:#fff;font-size:1.6rem;cursor:pointer;display:flex;align-items:center;justify-content:center;"
                        @click="${() => this._setEditingUserIcon(icon)}">${icon}</button>
                    `)}
                  </div>
                </div>
                <div style="display:flex;gap:10px;margin-top:24px;">
                  <button style="flex:1;background:#6366f1;color:#fff;padding:10px 0;border:none;border-radius:10px;font-weight:bold;font-size:1rem;"
                    @click="${() => this._saveEditUser()}">Spara</button>
                  <button style="flex:1;background:#e5e7eb;color:#334155;padding:10px 0;border:none;border-radius:10px;font-weight:bold;font-size:1rem;"
                    @click="${() => this.editingUser = null}">Avbryt</button>
                </div>
              </div>
            </div>
          ` : ''
      }

          ${this.editingTask ? html`
            <div style="position:fixed;inset:0;z-index:2500;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;">
              <div style="background:#fff;border-radius:24px;box-shadow:0 8px 40px #0003;padding:32px;min-width:320px;max-width:96vw;width:400px;display:flex;flex-direction:column;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
                  <h2 style="font-size:1.2rem;font-weight:bold;color:#10b981;">Redigera uppgift</h2>
                  <button style="background:none;border:none;font-size:1.5rem;color:#64748b;cursor:pointer;" @click="${() => this.editingTask = null}">✕</button>
                </div>
                <div style="margin-bottom:18px;">
                  <label style="font-size:0.9rem;font-weight:600;color:#64748b;">Uppgift</label><br>
                  <input style="width:100%;font-size:1.1rem;padding:8px 12px;border-radius:8px;border:1px solid #ddd;margin-top:4px;" 
                    .value="${this.editingTask.text}" @input="${e => this.editingTask = { ...this.editingTask, text: e.target.value }}">
                </div>
                <div style="margin-bottom:18px;">
                  <label style="font-size:0.9rem;font-weight:600;color:#64748b;">Pris (kr)</label><br>
                  <input type="number" style="width:100%;font-size:1.1rem;padding:8px 12px;border-radius:8px;border:1px solid #ddd;margin-top:4px;" 
                    .value="${this.editingTask.value}" @input="${e => this.editingTask = { ...this.editingTask, value: Number(e.target.value) }}">
                </div>
                <div style="margin-bottom:18px;">
                  <label style="font-size:0.9rem;font-weight:600;color:#64748b;">Ikon</label><br>
                  <div style="display:flex;gap:4px;overflow-x:auto;width:100%;margin-top:6px;padding-bottom:10px;">
                    ${ICONS.map(icon => html`
                      <button style="flex-shrink:0;width:44px;height:44px;border-radius:8px;border:2px solid ${this.editingTask.icon === icon ? '#10b981' : '#e5e7eb'};background:#fff;font-size:1.6rem;cursor:pointer;display:flex;align-items:center;justify-content:center;"
                        @click="${() => this._setEditingTaskIcon(icon)}">${icon}</button>
                    `)}
                  </div>
                </div>
                <div style="display:flex;gap:10px;margin-top:24px;">
                  <button style="flex:1;background:#10b981;color:#fff;padding:10px 0;border:none;border-radius:10px;font-weight:bold;font-size:1rem;"
                    @click="${() => this._saveEditTask()}">Spara</button>
                  <button style="flex:1;background:#e5e7eb;color:#334155;padding:10px 0;border:none;border-radius:10px;font-weight:bold;font-size:1rem;"
                    @click="${() => this.editingTask = null}">Avbryt</button>
                </div>
              </div>
            </div>
          ` : ''
      }

          ${this.showAddTaskModal ? html`
            <div style="position:fixed;inset:0;z-index:2500;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;">
              <div style="background:#fff;border-radius:24px;box-shadow:0 8px 40px #0003;padding:32px;min-width:320px;max-width:96vw;width:400px;display:flex;flex-direction:column;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
                  <h2 style="font-size:1.2rem;font-weight:bold;color:#6366f1;">Lägg till uppgift på ${this.selectedDay}</h2>
                  <button style="background:none;border:none;font-size:1.5rem;color:#64748b;cursor:pointer;" @click="${() => this.showAddTaskModal = false}">✕</button>
                </div>
                
                <div style="margin-bottom:18px;">
                  <label style="font-size:0.9rem;font-weight:600;color:#64748b;">Välj från lista</label><br>
                  <select style="width:100%;font-size:1.1rem;padding:8px 12px;border-radius:8px;border:1px solid #ddd;margin-top:4px;"
                    @change="${e => this.selectedTaskFromLibrary = this.taskLibrary.find(t => t.id === e.target.value)}">
                    <option value="">-- Välj en uppgift --</option>
                    ${this.taskLibrary.map(t => html`
                      <option value="${t.id}">${t.icon ? t.icon + ' ' : ''}${t.text} (${t.value} kr)</option>
                    `)}
                  </select>
                </div>
                
                ${this.selectedTaskFromLibrary ? html`
                  <div style="background:#bbf7d0;border:2px solid #10b981;border-radius:12px;padding:12px;margin-bottom:18px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                      <span style="font-weight:bold;color:#047857;">${this.selectedTaskFromLibrary.icon ? this.selectedTaskFromLibrary.icon + ' ' : ''}${this.selectedTaskFromLibrary.text}</span>
                      <span style="background:#10b981;color:#fff;padding:4px 12px;border-radius:8px;font-weight:bold;">${this.selectedTaskFromLibrary.value} kr</span>
                    </div>
                  </div>
                  
                  <div style="margin-bottom:18px;">
                    <label style="font-size:0.9rem;font-weight:600;color:#64748b;">Vem ska göra detta?</label><br>
                    <select style="width:100%;font-size:1.1rem;padding:8px 12px;border-radius:8px;border:1px solid #ddd;margin-top:4px;"
                      @change="${e => this.selectedAssignee = e.target.value}">
                      <option value="">-- Välj person --</option>
                      ${this.users.map(u => html`
                        <option value="${u.name}">${u.name}</option>
                      `)}
                    </select>
                  </div>
                ` : ''}
                
                <div style="display:flex;gap:10px;margin-top:24px;">
                  <button style="flex:1;background:#e5e7eb;color:#334155;padding:10px 0;border:none;border-radius:10px;font-weight:bold;font-size:1rem;"
                    @click="${() => this.showAddTaskModal = false}">Avbryt</button>
                  <button style="flex:1;background:#6366f1;color:#fff;padding:10px 0;border:none;border-radius:10px;font-weight:bold;font-size:1rem;"
                    @click="${() => this._confirmAddTask()}"
                    ?disabled="${!this.selectedTaskFromLibrary}">Lägg till</button>
                </div>
              </div>
            </div>
          ` : ''
      }

          ${this.showMoveCopyModal && this.moveCopyData ? html`
            <div style="position:fixed;inset:0;z-index:2600;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;">
              <div style="background:#fff;border-radius:24px;box-shadow:0 8px 40px #0003;padding:32px;min-width:320px;max-width:96vw;width:400px;display:flex;flex-direction:column;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
                  <h2 style="font-size:1.2rem;font-weight:bold;color:#6366f1;">Flytta eller kopiera?</h2>
                  <button style="background:none;border:none;font-size:1.5rem;color:#64748b;cursor:pointer;" @click="${() => { this.showMoveCopyModal = false; this.moveCopyData = null; this.draggedItem = null; }}">✕</button>
                </div>
                
                <div style="text-align:center;margin-bottom:24px;">
                  <div style="font-size:1.1rem;color:#334155;margin-bottom:8px;">
                    <strong>"${this.moveCopyData.item.icon ? this.moveCopyData.item.icon + ' ' : ''}${this.moveCopyData.item.text}"</strong>
                  </div>
                  <div style="font-size:0.9rem;color:#64748b;">
                    Från <strong>${this.moveCopyData.sourceDay}</strong> till <strong>${this.moveCopyData.targetDay}</strong>
                  </div>
                </div>
                
                <div style="display:flex;flex-direction:column;gap:12px;">
                  <button style="background:#10b981;color:#fff;padding:14px 0;border:none;border-radius:12px;font-weight:bold;font-size:1.1rem;cursor:pointer;"
                    @click="${() => this._handleCopyTask()}">
                    <div style="display:flex;align-items:center;justify-content:center;gap:8px;">
                      <span>📋 Kopiera</span>
                    </div>
                    <div style="font-size:0.8rem;font-weight:normal;opacity:0.9;">(Uppgiften finns kvar på ${this.moveCopyData.sourceDay})</div>
                  </button>
                  
                  <button style="background:#6366f1;color:#fff;padding:14px 0;border:none;border-radius:12px;font-weight:bold;font-size:1.1rem;cursor:pointer;"
                    @click="${() => this._handleMoveTask()}">
                    <div style="display:flex;align-items:center;justify-content:center;gap:8px;">
                      <span>➡️ Flytta</span>
                    </div>
                    <div style="font-size:0.8rem;font-weight:normal;opacity:0.9;">(Uppgiften flyttas från ${this.moveCopyData.sourceDay})</div>
                  </button>
                  
                  <button style="background:#e5e7eb;color:#334155;padding:14px 0;border:none;border-radius:12px;font-weight:bold;font-size:1.1rem;cursor:pointer;"
                    @click="${() => { this.showMoveCopyModal = false; this.moveCopyData = null; this.draggedItem = null; }}">
                    Avbryt
                  </button>
                </div>
              </div>
            </div>
          ` : ''
      }
        </header >

        <main class="week-board">
          <!-- MARKNAD COLUMN -->
          <div class="day-col" style="background:#f8fafc;border:2px dashed #cbd5e1;"
              @drop="${e => this._onDrop(e, 'market')}"
              @dragover="${this._onDragOver}">
              <div class="day-header" style="color:#64748b;">
                <span>🛒 Marknad</span>
                <button class="add-btn" style="background:#94a3b8;" @click="${() => this._addTask('market')}">+</button>
              </div>
              <div>
                ${(this.week.market || []).map((item, i) => html`
                  <div class="sticky" style="background:#fff;border-color:#cbd5e1;border-style:dashed;color:#64748b;"
                    draggable="true"
                    @dragstart="${e => this._onDragStart(e, item, 'market')}"
                    @click="${() => this._toggleTaskCompleted('market', item.id)}"
                    @dblclick="${() => this._startEdit('market', item.id)}">
                    <div style="margin-bottom: 4px;">${item.icon ? item.icon + ' ' : ''}${item.text}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                       <span style="font-size:0.8rem;text-transform:uppercase;font-weight:bold;color:#94a3b8;">Ledig</span>
                      ${item.value ? html`<span style="background:#94a3b8;color:#fff;padding:2px 8px;border-radius:6px;font-size:0.9rem;font-weight:bold;">${item.value} kr</span>` : html`<div></div>`}
                    </div>
                  </div>
                `)}
              </div>
          </div>

          ${DAYS.map((day, idx) => html`
            <div class="day-col"
              @drop="${e => this._onDrop(e, day)}"
              @dragover="${this._onDragOver}">
              <div class="day-header">
                <span>${day}</span>
                <button class="add-btn" @click="${() => this._addTask(day)}">+</button>
              </div>
              <div>
                ${this.week[day].map((item, i) => html`
                  <div class="sticky" style="${(() => { const u = this.users.find(us => us.name === item.assignee); const cIdx = u ? u.defaultColorIndex : 5; return `background:${COLORS[cIdx].bg};border-color:${COLORS[cIdx].border};border-style:solid;`; })()}${this.completedTasks[`${day}-${item.id}`] ? 'opacity:0.6;text-decoration:line-through;' : ''}"
                    draggable="true"
                    @dragstart="${e => this._onDragStart(e, item, day)}"
                    @click="${() => this._toggleTaskCompleted(day, item.id)}"
                    @dblclick="${() => this._startEdit(day, item.id)}">
                    <div style="margin-bottom: 4px;">${item.icon ? item.icon + ' ' : ''}${item.text}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      ${item.assignee ? html`<div style="font-size:0.95rem;font-weight:bold;color:#334155;">
                        ${(() => {
            const u = this.users.find(user => user.name === item.assignee);
            return u && u.icon ? u.icon + ' ' : '👤 ';
          })()}${item.assignee}</div>` : html`<div></div>`}
                      ${item.value ? html`<span style="background:#10b981;color:#fff;padding:2px 8px;border-radius:6px;font-size:0.9rem;font-weight:bold;">${item.value} kr</span>` : html`<div></div>`}
                    </div>
                  </div>
                `)}
            </div>
          `)}
        </main>

        <footer style="position:fixed;bottom:0;left:0;right:0;background:var(--bg-footer);border-top:1px solid var(--border-color);padding:12px 24px;z-index:100;box-shadow:0 -4px 20px var(--shadow-color);">
          <div style="max-width:1800px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;gap:24px;align-items:center;">
              <h3 style="font-size:1rem;font-weight:bold;color:#10b981;margin:0;">Veckosummering</h3>
              <div style="display:flex;gap:18px;flex-wrap:wrap;">
              ${Object.entries(totals).map(([name, data]) => {
            const userColor = data.colorIndex !== undefined ? COLORS[data.colorIndex].bg : '#f1f5f9';
            return html`
                  <div style="display:flex;align-items:center;gap:10px;background:${userColor};border:1px solid #e5e7eb;padding:8px 18px;border-radius:14px;">
                    <div style="display:flex;flex-direction:column;">
                      <span style="font-size:0.95rem;font-weight:bold;color:#334155;">
                        ${(() => {
                const u = this.users.find(user => user.name === name);
                return u && u.icon ? u.icon + ' ' : '';
              })()}${name}
                      </span>
                      <span style="font-size:0.8rem;color:#64748b;">Fast: ${data.fixed} kr</span>
                    </div>
                    <div style="width:1px;height:32px;background:#e5e7eb;margin:0 10px;"></div>
                    <div style="text-align:right;">
                      <span style="font-weight:bold;color:#047857;font-size:1.2rem;">
                        ${(() => {
                const u = this.users.find(user => user.name === name);
                if (u) {
                  const bal = this._calculateBalance(u.id);
                  return bal.balance;
                }
                return data.total;
              })()} kr
                      </span>
                      <span style="display:block;font-size:0.75rem;color:#64748b;">(${data.tasks} kr sysslor)</span>
                    </div>
                  </div>
                `;
          })}
              ${Object.keys(totals).length === 0 ? html`<span style="color:#64748b;font-size:0.95rem;">Lägg till personer och uppgifter för att se summering.</span>` : ''}
            </div>
            </div>
            <div style="font-size:0.8rem;color:#64748b;text-align:right;">
              Skapad av Dennis West 2025
            </div>
          </div>
        </footer>

        ${this.isEditing ? (() => {
        const currentItem = this.week[this.isEditing.day]?.find(t => t.id === this.isEditing.id);
        return html`
          <div style="position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;">
            <div style="background:#fff;border-radius:24px;box-shadow:0 8px 40px #0003;padding:32px;min-width:320px;max-width:90vw;">
              <h2 style="font-size:1.5rem;font-weight:bold;color:#1e293b;margin-bottom:18px;">Redigera uppgift</h2>
              <div style="margin-bottom:18px;">
                <label style="font-size:0.9rem;font-weight:600;color:#64748b;">Text</label><br>
                <input style="width:100%;font-size:1.1rem;padding:8px 12px;border-radius:8px;border:1px solid #ddd;margin-top:4px;" 
                  .value="${this.editData.text}" @input="${e => this._onEditInput(e, 'text')}">
              </div>
              
              <div style="margin-bottom:18px;">
                <label style="font-size:0.9rem;font-weight:600;color:#64748b;">Ikon</label><br>
                <div style="display:flex;gap:4px;overflow-x:auto;width:100%;margin-top:6px;padding-bottom:10px;">
                  ${ICONS.map(icon => html`
                    <button style="flex-shrink:0;width:44px;height:44px;border-radius:8px;border:2px solid ${this.editData.icon === icon ? '#6366f1' : '#e5e7eb'};background:#fff;font-size:1.6rem;cursor:pointer;display:flex;align-items:center;justify-content:center;"
                      @click="${() => this._setEditIcon(icon)}">${icon}</button>
                  `)}
                </div>
              </div>

              <div style="margin-bottom:18px;">
              <div style="margin-bottom:18px;">
                <label style="font-size:0.9rem;font-weight:600;color:#64748b;">Pris (kr)</label><br>
                <input type="number" style="width:100%;font-size:1.1rem;padding:8px 12px;border-radius:8px;border:1px solid #ddd;margin-top:4px;" 
                  .value="${this.editData.value || ''}" @input="${e => this._onEditInput(e, 'value')}">
              </div>
              <div style="margin-bottom:18px;">
                <label style="font-size:0.9rem;font-weight:600;color:#64748b;">Vem ska göra detta?</label><br>
                <select style="width:100%;font-size:1.1rem;padding:8px 12px;border-radius:8px;border:1px solid #ddd;margin-top:4px;"
                  .value="${this.editData.assignee || ''}" @input="${e => this._onEditInput(e, 'assignee')}">
                  <option value="">-- Ingen --</option>
                  ${this.users.map(u => html`
                    <option value="${u.name}">${u.name}</option>
                  `)}
                </select>
              </div>
              <div style="display:flex;gap:10px;margin-top:24px;">
                <button style="flex:1;background:#ef4444;color:#fff;padding:10px 0;border:none;border-radius:10px;font-weight:bold;font-size:1rem;"
                  @click="${() => this._deleteTask(this.isEditing.day, this.isEditing.id)}">Ta bort</button>
                <button style="flex:2;background:#6366f1;color:#fff;padding:10px 0;border:none;border-radius:10px;font-weight:bold;font-size:1rem;"
                  @click="${() => this._saveEdit()}">Spara</button>
                <button style="flex:1;background:#e5e7eb;color:#334155;padding:10px 0;border:none;border-radius:10px;font-weight:bold;font-size:1rem;"
                  @click="${() => this._closeEdit()}">Avbryt</button>
              </div>
            </div>
          </div>
          `;
      })() : ''
      }
      </div >
  `;
  }

  _crownIcon() {
    return html`
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2.5 9l5 2.5L12 3l4.5 8.5L21.5 9l-2 11h-15l-2-11z" fill="currentColor" fill-opacity="0.2"/>
        <path d="M2 9l5 3 5-9 5 9 5-3-2 12H4L2 9z" />
        <path d="M12 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="currentColor"/>
      </svg>
    `;
  }
}

customElements.define('kronan-panel-v3', KronanPanel);