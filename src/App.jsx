import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'one-drop-progress';
const STORAGE_VERSION = 3;
const PREVIEW_DAYS = 3;
const WEEKDAY_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const START_SEQUENCE_TASK_IDS = ['energie-reset', 'bewusstes-atmen', 'warmes-wasser'];
const APP_TABS = [
  { id: 'today', label: 'Heute' },
  { id: 'calendar', label: 'Kalender' },
  { id: 'progress', label: 'Fortschritt' },
  { id: 'tasks', label: 'Aufgaben' },
  { id: 'plan', label: 'Abo' },
];
const FREE_TASK_UNLOCK_LIMIT = 8;
const PREMIUM_PREVIEW_DAYS = 30;
const PLAN_DETAILS = {
  free: {
    name: 'Gratis',
    price: '0 €',
    summary: 'Täglicher Drop, Basis-Fortschritt und die ersten Gewohnheiten.',
  },
  premium: {
    name: 'Premium',
    price: '4,99 € / Monat',
    summary: 'Mehr Gewohnheiten, längere Vorschau und detaillierter Wochenrückblick.',
  },
};

const TASKS = [
  {
    id: 'energie-reset',
    unlockAt: 0,
    category: 'Sofort-Effekt',
    title: '60-Sekunden Energie-Reset',
    description: 'Steh auf, rolle die Schultern nach hinten und atme 5 Mal tief ein und aus.',
    benefit: 'Das geht direkt im Raum, bringt schnell mehr Wachheit und schenkt dir sofort ein kleines Erfolgserlebnis.',
    duration: '1 Minute',
  },
  {
    id: 'bewusstes-atmen',
    unlockAt: 0,
    category: 'Achtsamkeit',
    title: 'Bewusstes Atmen',
    description: 'Nimm dir für 5 tiefe Atemzüge Zeit und spüre, wie du ruhiger und klarer wirst.',
    benefit: 'Das reguliert deinen Fokus und gibt dir das Gefühl, bewusst in deinen Tag zu starten.',
    duration: '1 Minute',
  },
  {
    id: 'warmes-wasser',
    unlockAt: 0,
    category: 'Morgenroutine',
    title: 'Warmes Wasser am Morgen',
    description: 'Trinke direkt nach dem Aufstehen ein Glas warmes Wasser.',
    benefit: 'Das hilft dir, den Tag bewusst zu starten und deine Routine zu aktivieren.',
    duration: '2 Minuten',
  },
  {
    id: 'spaziergang',
    unlockAt: 2,
    category: 'Bewegung',
    title: '7 Minuten Spaziergang',
    description: 'Gehe heute nach einer Mahlzeit kurz und entspannt spazieren.',
    benefit: 'Leichte Bewegung bringt Kreislauf und Verdauung sanft in Schwung.',
    duration: '7 Minuten',
  },
  {
    id: 'tageslicht',
    unlockAt: 2,
    category: 'Licht',
    title: '2 Minuten Tageslicht',
    description: 'Gehe ans Fenster, auf den Balkon oder kurz vor die Tür und tanke bewusst Tageslicht.',
    benefit: 'Natürliches Licht kann deinen Wachheitsrhythmus unterstützen und dem Tag mehr Klarheit geben.',
    duration: '2 Minuten',
  },
  {
    id: 'protein-snack',
    unlockAt: 4,
    category: 'Ernährung',
    title: 'Eiweißreicher Snack',
    description: 'Plane heute einen kleinen Snack mit Protein, zum Beispiel Joghurt oder Nüsse.',
    benefit: 'Das kann für ein längeres Sättigungsgefühl sorgen.',
    duration: '5 Minuten',
  },
  {
    id: 'gemuese-zuerst',
    unlockAt: 4,
    category: 'Ernährung',
    title: 'Gemüse zuerst',
    description: 'Starte heute eine Hauptmahlzeit mit einer Portion Gemüse oder Salat.',
    benefit: 'Das macht gesunde Entscheidungen einfacher und alltagstauglich.',
    duration: 'Beim Essen',
  },
  {
    id: 'bewegungspause',
    unlockAt: 6,
    category: 'Alltag',
    title: '3 Mini-Bewegungspausen',
    description: 'Stehe dreimal am Tag auf und bewege dich jeweils eine Minute.',
    benefit: 'Kleine Unterbrechungen reduzieren langes Sitzen und bringen frische Energie zurück.',
    duration: '3 Minuten',
  },
  {
    id: 'dehnen',
    unlockAt: 6,
    category: 'Mobilität',
    title: '5 Minuten Dehnen',
    description: 'Dehne heute bewusst Nacken, Brust und Hüfte, damit dein Körper einmal durchatmen kann.',
    benefit: 'Das löst Spannung und lässt dich oft sofort aufrechter und beweglicher fühlen.',
    duration: '5 Minuten',
  },
  {
    id: 'wasser-vor-mahlzeit',
    unlockAt: 8,
    category: 'Verdauung',
    title: 'Ein Glas Wasser vor dem Essen',
    description: 'Trinke vor einer Hauptmahlzeit bewusst ein Glas Wasser und nimm dir einen ruhigen Startmoment.',
    benefit: 'Das schafft eine kleine Pause und unterstützt eine bewusstere Essroutine.',
    duration: '2 Minuten',
  },
  {
    id: 'langsamer-essen',
    unlockAt: 8,
    category: 'Achtsamkeit',
    title: 'Langsamer essen',
    description: 'Lege heute bei einer Mahlzeit einmal das Besteck zwischendurch ab und kaue bewusst langsamer.',
    benefit: 'So nimmst du Hunger und Sättigung oft klarer wahr.',
    duration: 'Bei einer Mahlzeit',
  },
  {
    id: 'eiweiss-fruehstueck',
    unlockAt: 10,
    category: 'Ernährung',
    title: 'Protein zum Frühstück',
    description: 'Ergänze dein Frühstück heute um eine Eiweißquelle wie Joghurt, Ei, Skyr oder Tofu.',
    benefit: 'Das kann dir helfen, länger satt und fokussiert in den Tag zu gehen.',
    duration: '5 Minuten',
  },
  {
    id: 'ballaststoff-boost',
    unlockAt: 10,
    category: 'Ernährung',
    title: 'Ballaststoff-Boost',
    description: 'Füge heute einer Mahlzeit Ballaststoffe hinzu, zum Beispiel Haferflocken, Bohnen, Beeren oder Leinsamen.',
    benefit: 'Das macht dein Essen oft sättigender und alltagstauglich ausgewogener.',
    duration: '5 Minuten',
  },
  {
    id: 'abendliche-ruhepause',
    unlockAt: 12,
    category: 'Schlaf',
    title: 'Abendliche Ruhepause',
    description: 'Lass 20 Minuten vor dem Schlafengehen das Handy weg.',
    benefit: 'Eine ruhigere Abendroutine kann deine Regeneration unterstützen.',
    duration: '20 Minuten',
  },
  {
    id: 'kueche-schliessen',
    unlockAt: 12,
    category: 'Abendroutine',
    title: 'Küche bewusst schließen',
    description: 'Beende dein Essen heute nach dem Abendessen bewusst und räume kurz auf.',
    benefit: 'Ein klarer Abschluss kann dir helfen, den Abend ruhiger und strukturierter zu gestalten.',
    duration: '5 Minuten',
  },
  {
    id: 'aktiv-minute',
    unlockAt: 14,
    category: 'Bewegung',
    title: '1 Minute kräftig aktiv',
    description: 'Gehe eine Minute zügig Treppen oder mache 10 bis 15 Kniebeugen in deinem Tempo.',
    benefit: 'Das weckt Muskulatur und Kreislauf in sehr kurzer Zeit.',
    duration: '1 Minute',
  },
  {
    id: 'feierabend-spaziergang',
    unlockAt: 14,
    category: 'Bewegung',
    title: '10 Minuten Feierabend-Spaziergang',
    description: 'Gehe nach Feierabend oder am Abend noch einmal entspannt raus.',
    benefit: 'Das hilft dir, vom Tag herunterzufahren und trotzdem in Bewegung zu bleiben.',
    duration: '10 Minuten',
  },
  {
    id: 'schlafzeit',
    unlockAt: 16,
    category: 'Schlaf',
    title: 'Konstante Schlafzeit',
    description: 'Lege für heute eine Uhrzeit fest, zu der du ungefähr ins Bett gehen willst, und halte sie bewusst ein.',
    benefit: 'Ein wiederkehrender Rhythmus kann Erholung und Energie am nächsten Tag stärken.',
    duration: '1 Minute Planung',
  },
];

function formatDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKey(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function getDayDifference(previous, current) {
  const previousDate = parseDateKey(previous);
  const currentDate = parseDateKey(current);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.round((currentDate - previousDate) / millisecondsPerDay);
}

function getTaskById(taskId) {
  return TASKS.find((task) => task.id === taskId) ?? TASKS[0];
}

function getUnlockedTasks(completedCount) {
  return TASKS.filter((task) => task.unlockAt <= completedCount);
}

function getAvailableTasks(completedCount, isPremium) {
  return getUnlockedTasks(completedCount).filter(
    (task) => isPremium || task.unlockAt <= FREE_TASK_UNLOCK_LIMIT,
  );
}

function getNextUnlockTask(completedCount, isPremium) {
  return TASKS.find(
    (task) =>
      task.unlockAt > completedCount &&
      (isPremium || task.unlockAt <= FREE_TASK_UNLOCK_LIMIT),
  ) ?? null;
}

function getTaskForOffset(dayOffset = 0, availableTasks = TASKS) {
  if (dayOffset >= 0 && dayOffset < START_SEQUENCE_TASK_IDS.length) {
    return getTaskById(START_SEQUENCE_TASK_IDS[dayOffset]);
  }

  const followUpPool = availableTasks.filter(
    (task) => !START_SEQUENCE_TASK_IDS.includes(task.id),
  );
  const taskPool =
    followUpPool.length > 0
      ? followUpPool
      : availableTasks.length > 0
        ? availableTasks
        : [TASKS[0]];
  const poolIndex = Math.max(dayOffset - START_SEQUENCE_TASK_IDS.length, 0) % taskPool.length;

  return taskPool[poolIndex];
}

function getInitialProgress() {
  const emptyProgress = {
    storageVersion: STORAGE_VERSION,
    startDateKey: formatDateKey(),
    streak: 0,
    bestStreak: 0,
    lastCompletedDate: null,
    completedDates: [],
    taskAssignments: {},
    plan: 'free',
  };

  const savedValue = localStorage.getItem(STORAGE_KEY);

  if (!savedValue) {
    return emptyProgress;
  }

  try {
    const parsedValue = JSON.parse(savedValue);

    if (parsedValue.storageVersion !== STORAGE_VERSION || !parsedValue.startDateKey) {
      return emptyProgress;
    }

    return {
      ...emptyProgress,
      ...parsedValue,
      completedDates: Array.isArray(parsedValue.completedDates)
        ? parsedValue.completedDates
        : [],
      startDateKey: parsedValue.startDateKey,
      taskAssignments:
        parsedValue.taskAssignments &&
        typeof parsedValue.taskAssignments === 'object' &&
        !Array.isArray(parsedValue.taskAssignments)
          ? parsedValue.taskAssignments
          : {},
      plan: parsedValue.plan === 'premium' ? 'premium' : 'free',
    };
  } catch {
    return emptyProgress;
  }
}

function getLastSevenDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return formatDateKey(date);
  });
}

function getDateKeyWithOffset(baseDateKey, offset) {
  const date = parseDateKey(baseDateKey);
  date.setDate(date.getDate() + offset);
  return formatDateKey(date);
}

function getMonthLabel(date) {
  return date.toLocaleDateString('de-DE', {
    month: 'long',
    year: 'numeric',
  });
}

function getDaysInMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getCalendarDays(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const startOffset = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = getDaysInMonth(date);
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const dayOffset = index - startOffset;
    const calendarDate = new Date(year, month, dayOffset + 1);

    return {
      key: formatDateKey(calendarDate),
      dayNumber: calendarDate.getDate(),
      isCurrentMonth: calendarDate.getMonth() === month,
    };
  });
}

function sortDateKeysDescending(dateKeys) {
  return [...new Set(dateKeys)].sort((firstDate, secondDate) =>
    secondDate.localeCompare(firstDate),
  );
}

function getCurrentStreak(completedDates, todayKey) {
  if (completedDates.length === 0) {
    return 0;
  }

  const latestCompletedDate = completedDates[0];
  const distanceToToday = getDayDifference(latestCompletedDate, todayKey);

  if (distanceToToday < 0 || distanceToToday > 1) {
    return 0;
  }

  let streak = 1;

  for (let index = 1; index < completedDates.length; index += 1) {
    if (getDayDifference(completedDates[index], completedDates[index - 1]) === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

function getBestStreak(completedDates) {
  if (completedDates.length === 0) {
    return 0;
  }

  let bestStreak = 1;
  let currentStreak = 1;

  for (let index = 1; index < completedDates.length; index += 1) {
    if (getDayDifference(completedDates[index], completedDates[index - 1]) === 1) {
      currentStreak += 1;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return bestStreak;
}

function buildProgressState(
  completedDates,
  taskAssignments,
  todayKey,
  startDateKey,
  plan = 'free',
) {
  const sortedCompletedDates = sortDateKeysDescending(completedDates).slice(0, 365);

  return {
    storageVersion: STORAGE_VERSION,
    startDateKey,
    streak: getCurrentStreak(sortedCompletedDates, todayKey),
    bestStreak: getBestStreak(sortedCompletedDates),
    lastCompletedDate: sortedCompletedDates[0] ?? null,
    completedDates: sortedCompletedDates,
    taskAssignments,
    plan,
  };
}

function getProgressHighlight(
  currentStreak,
  bestStreak,
  completedCount,
  completedThisWeek,
  nextUnlockTask,
  tasksUntilNextUnlock,
  isPremium,
) {
  if (!isPremium && !nextUnlockTask && completedCount >= FREE_TASK_UNLOCK_LIMIT) {
    return {
      title: 'Deine Gratis-Basis steht.',
      text: 'Premium öffnet die erweiterten Gewohnheiten, längere Vorschau und deinen Wochenrückblick.',
    };
  }

  if (nextUnlockTask && tasksUntilNextUnlock === 1) {
    return {
      title: 'Du bist ganz nah an der nächsten Freischaltung.',
      text: `Nur noch eine erledigte Aufgabe bis "${nextUnlockTask.title}" dazukommt.`,
    };
  }

  if (currentStreak >= 7) {
    return {
      title: 'Fantastisch, du bist richtig im Flow.',
      text: `Seit ${currentStreak} Tagen bleibst du dran. Genau so entstehen starke Gewohnheiten.`,
    };
  }

  if (currentStreak >= 3) {
    return {
      title: 'Stark, deine Routine wird stabiler.',
      text: `${currentStreak} Tage in Folge sind ein echtes Signal, dass du dranbleibst.`,
    };
  }

  if (completedThisWeek >= 3) {
    return {
      title: 'Sehr guter Wochenrhythmus.',
      text: `Du hast diese Woche schon ${completedThisWeek} kleine Schritte gesammelt. Das baut Momentum auf.`,
    };
  }

  if (bestStreak >= 3) {
    return {
      title: 'Du hast schon gezeigt, dass du es kannst.',
      text: `Dein bester Lauf liegt bei ${bestStreak} Tagen. Darauf kannst du weiter aufbauen.`,
    };
  }

  if (completedCount >= 1) {
    return {
      title: 'Jeder Haken zählt.',
      text: 'Auch kleine Schritte sind echte Fortschritte. Du baust gerade eine hilfreiche Basis auf.',
    };
  }

  if (nextUnlockTask) {
    return {
      title: 'Deine ersten Gewohnheiten sind schon bereit.',
      text: `Mit ${nextUnlockTask.unlockAt} erledigten Aufgaben wird "${nextUnlockTask.title}" freigeschaltet.`,
    };
  }

  return {
    title: 'Heute ist ein guter Startpunkt.',
    text: 'Schon eine erledigte Kleinigkeit kann den Ton für eine gesunde Routine setzen.',
  };
}

function getDayWindowHighlight(
  selectedDayBeforeStart,
  selectedDayBeyondPreview,
  selectedDayCompleted,
  selectedDayIsFuture,
  selectedDayIsToday,
  currentStreak,
  startDateLabel,
  previewDays,
) {
  if (selectedDayBeforeStart) {
    return {
      title: 'Hier beginnt deine Routine noch nicht.',
      text: `Dein persönlicher Starttag ist der ${startDateLabel}. Vorher bleiben die Tage bewusst leer.`,
    };
  }

  if (selectedDayBeyondPreview) {
    return {
      title: 'Die Vorschau bleibt bewusst kurz.',
      text: `Du kannst aktuell bis zu ${previewDays} Tage im Voraus schauen. Danach wird der nächste Drop später sichtbar.`,
    };
  }

  if (selectedDayCompleted) {
    if (selectedDayIsToday && currentStreak >= 2) {
      return {
        title: 'Großartig gemacht.',
        text: `Du hast heute schon geliefert und bist jetzt ${currentStreak} Tage in Folge dran.`,
      };
    }

    return {
      title: 'Sehr gut erledigt.',
      text: 'Dieser Tag ist bereits positiv für dich verbucht. Solche kleinen Haken summieren sich.',
    };
  }

  if (selectedDayIsFuture) {
    return {
      title: 'Schön, dass du vorausplanst.',
      text: 'Du kannst dir den Tag schon anschauen und dich mental darauf vorbereiten.',
    };
  }

  if (selectedDayIsToday) {
    return {
      title: 'Heute reicht ein kleiner Schritt.',
      text: 'Du musst nicht alles perfekt machen. Ein bewusster Anfang ist heute schon stark.',
    };
  }

  return {
    title: 'Nachtragen ist vollkommen okay.',
    text: 'Wenn du den Schritt geschafft hast, darfst du dir die Anerkennung dafür auch im Nachhinein geben.',
  };
}

function App() {
  const todayKey = formatDateKey();
  const [progress, setProgress] = useState(getInitialProgress);
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);
  const [isDayWindowOpen, setIsDayWindowOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('today');
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const selectedDate = useMemo(() => parseDateKey(selectedDateKey), [selectedDateKey]);
  const lastSevenDays = getLastSevenDays();
  const sortedCompletedDates = useMemo(
    () => sortDateKeysDescending(progress.completedDates),
    [progress.completedDates],
  );
  const completedCount = sortedCompletedDates.length;
  const currentPlan = progress.plan === 'premium' ? 'premium' : 'free';
  const isPremium = currentPlan === 'premium';
  const currentPlanDetails = PLAN_DETAILS[currentPlan];
  const activePreviewDays = isPremium ? PREMIUM_PREVIEW_DAYS : PREVIEW_DAYS;
  const unlockedTasks = useMemo(
    () => getAvailableTasks(completedCount, isPremium),
    [completedCount, isPremium],
  );
  const nextUnlockTask = useMemo(
    () => getNextUnlockTask(completedCount, isPremium),
    [completedCount, isPremium],
  );
  const tasksUntilNextUnlock = nextUnlockTask
    ? Math.max(nextUnlockTask.unlockAt - completedCount, 0)
    : 0;
  const startDateKey = progress.startDateKey;
  const previewEndKey = getDateKeyWithOffset(todayKey, activePreviewDays);
  const selectedDayBeforeStart = selectedDateKey < startDateKey;
  const selectedDayBeyondPreview = selectedDateKey > previewEndKey;
  const selectedDayHasTask = !selectedDayBeforeStart && !selectedDayBeyondPreview;
  const selectedDayOffset = getDayDifference(startDateKey, selectedDateKey);
  const selectedTask = useMemo(() => {
    if (!selectedDayHasTask) {
      return null;
    }

    const assignedTaskId = progress.taskAssignments[selectedDateKey];
    if (assignedTaskId) {
      return getTaskById(assignedTaskId);
    }

    return getTaskForOffset(selectedDayOffset, unlockedTasks);
  }, [
    progress.taskAssignments,
    selectedDateKey,
    selectedDayHasTask,
    selectedDayOffset,
    unlockedTasks,
  ]);
  const completedDatesSet = useMemo(
    () => new Set(sortedCompletedDates),
    [sortedCompletedDates],
  );
  const currentStreak = getCurrentStreak(sortedCompletedDates, todayKey);
  const bestStreak = getBestStreak(sortedCompletedDates);
  const selectedDayCompleted = completedDatesSet.has(selectedDateKey);
  const selectedDayIsToday = selectedDateKey === todayKey;
  const selectedDayIsFuture = selectedDateKey > todayKey;
  const completedThisWeek = lastSevenDays.filter((day) =>
    completedDatesSet.has(day),
  ).length;
  const weeklyReviewEntries = [...lastSevenDays].reverse().map((dayKey) => {
    const date = parseDateKey(dayKey);
    const assignedTaskId = progress.taskAssignments[dayKey];
    const isCompleted = completedDatesSet.has(dayKey);
    const dayIsBeforeStart = dayKey < startDateKey;
    const taskOffset = getDayDifference(startDateKey, dayKey);
    const fallbackTask = dayIsBeforeStart
      ? null
      : getTaskForOffset(taskOffset, isCompleted ? TASKS : unlockedTasks);
    const task = assignedTaskId ? getTaskById(assignedTaskId) : fallbackTask;

    return {
      dayKey,
      dayLabel: date.toLocaleDateString('de-DE', { weekday: 'short' }),
      fullDateLabel: date.toLocaleDateString('de-DE', {
        day: 'numeric',
        month: 'long',
      }),
      isCompleted,
      isToday: dayKey === todayKey,
      isBeforeStart: dayIsBeforeStart,
      task,
    };
  });
  const calendarDays = getCalendarDays(calendarMonth);
  const completedThisMonth = calendarDays.filter(
    (day) => day.isCurrentMonth && completedDatesSet.has(day.key),
  ).length;
  const isCurrentCalendarMonth =
    calendarMonth.getFullYear() === new Date().getFullYear() &&
    calendarMonth.getMonth() === new Date().getMonth();
  const selectedDateLabel = selectedDate.toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const startDateLabel = parseDateKey(startDateKey).toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const unlockedTaskCount = unlockedTasks.length;
  const progressHighlight = getProgressHighlight(
    currentStreak,
    bestStreak,
    completedCount,
    completedThisWeek,
    nextUnlockTask,
    tasksUntilNextUnlock,
    isPremium,
  );
  const dayWindowHighlight = getDayWindowHighlight(
    selectedDayBeforeStart,
    selectedDayBeyondPreview,
    selectedDayCompleted,
    selectedDayIsFuture,
    selectedDayIsToday,
    currentStreak,
    startDateLabel,
    activePreviewDays,
  );
  const selectedDayStatus = selectedDayBeforeStart
    ? 'Noch nicht gestartet'
    : selectedDayBeyondPreview
      ? 'Später verfügbar'
      : selectedDayIsFuture
        ? 'Vorschau'
        : selectedDayCompleted
          ? 'Erledigt'
          : 'Offen';
  const premiumTaskCount = TASKS.filter((task) => task.unlockAt > FREE_TASK_UNLOCK_LIMIT).length;
  const freeTaskCount = TASKS.length - premiumTaskCount;

  useEffect(() => {
    if (progress.storageVersion !== STORAGE_VERSION || !progress.startDateKey) {
      setProgress(getInitialProgress());
    }
  }, [progress.storageVersion, progress.startDateKey]);

  useEffect(() => {
    if (selectedDateKey < startDateKey) {
      setSelectedDateKey(startDateKey);
    }
  }, [selectedDateKey, startDateKey]);

  useEffect(() => {
    if (selectedDateKey > previewEndKey && selectedDateKey > todayKey) {
      setSelectedDateKey(todayKey);
    }
  }, [previewEndKey, selectedDateKey, todayKey]);

  useEffect(() => {
    if (calendarMonth < new Date(parseDateKey(startDateKey).getFullYear(), parseDateKey(startDateKey).getMonth(), 1)) {
      const startMonth = parseDateKey(startDateKey);
      setCalendarMonth(new Date(startMonth.getFullYear(), startMonth.getMonth(), 1));
    }
  }, [calendarMonth, startDateKey]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  function handleSelectDate(dateKey, openWindow = false) {
    if (dateKey < startDateKey || dateKey > previewEndKey) {
      return;
    }

    const nextDate = parseDateKey(dateKey);
    setSelectedDateKey(dateKey);
    setCalendarMonth(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
    if (openWindow) {
      setIsDayWindowOpen(true);
    }
  }

  function changeCalendarMonth(direction) {
    setCalendarMonth((currentMonth) => {
      const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1);
      const startMonth = parseDateKey(startDateKey);
      const minMonth = new Date(startMonth.getFullYear(), startMonth.getMonth(), 1);
      return nextMonth < minMonth ? minMonth : nextMonth;
    });
  }

  function resetCalendarMonth() {
    const today = new Date();
    setCalendarMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  }

  function closeDayWindow() {
    setIsDayWindowOpen(false);
  }

  function handlePlanChange(nextPlan) {
    setProgress((currentProgress) => ({
      ...currentProgress,
      plan: nextPlan,
    }));
  }

  function handleComplete() {
    setProgress((currentProgress) => {
      if (
        selectedDayIsFuture ||
        selectedDayBeforeStart ||
        selectedDayBeyondPreview ||
        currentProgress.completedDates.includes(selectedDateKey) ||
        !selectedTask
      ) {
        return currentProgress;
      }

      return buildProgressState(
        [...currentProgress.completedDates, selectedDateKey],
        {
          ...currentProgress.taskAssignments,
          [selectedDateKey]: selectedTask.id,
        },
        todayKey,
        currentProgress.startDateKey,
        currentProgress.plan ?? 'free',
      );
    });
  }

  function handleUndoComplete() {
    setProgress((currentProgress) => {
      if (!currentProgress.completedDates.includes(selectedDateKey)) {
        return currentProgress;
      }

      const nextTaskAssignments = { ...currentProgress.taskAssignments };
      delete nextTaskAssignments[selectedDateKey];

      return buildProgressState(
        currentProgress.completedDates.filter((date) => date !== selectedDateKey),
        nextTaskAssignments,
        todayKey,
        currentProgress.startDateKey,
        currentProgress.plan ?? 'free',
      );
    });
  }

  return (
    <div className="app-shell">
      <div className="background-orb background-orb-left" />
      <div className="background-orb background-orb-right" />

      <main className="container">
        <section className="hero-card">
          <div className="hero-visual">
            <img
              src={`${import.meta.env.BASE_URL}hero-top.jpeg`}
              alt="Leuchtender Weg über Tropfen im Meer bei Sonnenaufgang"
            />
            <div className="hero-brand-overlay">
              <h1 className="hero-title">One Drop</h1>
              <p className="hero-image-slogan">One Drop a day keeps you on your way.</p>
            </div>
          </div>

          <div className="hero-copy-block">
            <p className="hero-copy">
              Diese App zeigt dir jeden Tag einen kleinen, machbaren Schritt.
              So entsteht aus wenig Druck mehr Energie, mehr Rhythmus und mehr Dranbleiben.
            </p>
          </div>

          <div className="hero-actions">
            <button
              className="primary-link"
              onClick={() => setActiveTab('today')}
              type="button"
            >
              Heutigen Tag öffnen
            </button>
            <span className="hero-note">Jeder Fortschritt wird direkt in deinem Browser gespeichert</span>
            <span className={`plan-badge ${isPremium ? 'is-premium' : ''}`}>
              {currentPlanDetails.name} · {currentPlanDetails.price}
            </span>
          </div>
        </section>

        <nav className="app-tabs" aria-label="App-Bereiche">
          {APP_TABS.map((tab) => (
            <button
              aria-selected={activeTab === tab.id}
              className={`app-tab ${activeTab === tab.id ? 'is-active' : ''}`}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <section className="app-page today-page" hidden={activeTab !== 'today'}>
          <article className="task-card" id="today-task">
            <div className="task-header">
              <div>
                <p className="section-label">
                  {selectedDayBeforeStart
                    ? 'Dein Start beginnt später'
                    : selectedDayBeyondPreview
                      ? 'Deine Vorschau ist begrenzt'
                      : selectedDayIsToday
                        ? 'Dein Daily Drop für heute'
                        : 'Dein Daily Drop für diesen Tag'}
                </p>
                <p className="task-selected-date">{selectedDateLabel}</p>
                <h2>
                  {selectedTask
                    ? selectedTask.title
                    : selectedDayBeforeStart
                      ? 'Vor deinem Starttag gibt es noch keinen Drop.'
                      : 'Dieser Tag liegt außerhalb deiner 3-Tage-Vorschau.'}
                </h2>
              </div>
              <span className="task-time">
                {selectedTask ? selectedTask.duration : selectedDayBeforeStart ? `Start: ${startDateLabel}` : `+${activePreviewDays} Tage Vorschau`}
              </span>
            </div>

            <div className="task-meta-row">
              <span className="task-category">
                {selectedTask
                  ? selectedTask.category
                  : selectedDayBeforeStart
                    ? 'App-Start'
                    : 'Vorschau'}
              </span>
              <span className="task-mini-note">
                {selectedDayBeforeStart
                  ? 'Dein persönlicher Kalender startet erst mit deinem ersten App-Tag.'
                  : selectedDayBeyondPreview
                    ? `Du kannst nur bis zu ${activePreviewDays} Tage im Voraus planen.`
                    : selectedDayIsToday
                      ? 'Ein guter Tag beginnt oft mit einem kleinen Drop.'
                      : 'Jeder kleine Drop bringt dich Schritt für Schritt weiter.'}
              </span>
            </div>

            <p className="task-description">
              {selectedTask
                ? selectedTask.description
                : selectedDayBeforeStart
                  ? `Deine erste Aufgabe startet am ${startDateLabel}. Frühere Tage bleiben bewusst leer, damit dein Fortschritt wirklich bei deinem Start beginnt.`
                  : `Die Aufgaben-Vorschau endet aktuell ${activePreviewDays} Tage in der Zukunft. Danach bleibt der Kalender offen, aber ohne konkrete Aufgabe.`}
            </p>
            <p className="task-benefit">
              {selectedTask
                ? selectedTask.benefit
                : selectedDayBeforeStart
                  ? 'So sieht dein Kalender nur echte Tage aus deiner eigenen Routine.'
                  : 'Sobald du weitermachst oder eine neue Gewohnheit freischaltest, aktualisiert sich die Vorschau automatisch.'}
            </p>

            <div className="task-actions-row">
              <button
                className="secondary-button"
                onClick={() => setIsDayWindowOpen(true)}
                type="button"
              >
                Drop-Fenster öffnen
              </button>
            </div>

            <button
              className={`complete-button ${selectedDayCompleted ? 'is-complete' : ''}`}
              onClick={handleComplete}
              disabled={
                selectedDayCompleted ||
                selectedDayIsFuture ||
                selectedDayBeforeStart ||
                selectedDayBeyondPreview ||
                !selectedTask
              }
            >
              {selectedDayBeforeStart
                ? 'Vor dem Start nicht verfügbar'
                : selectedDayBeyondPreview
                  ? 'Außerhalb der Vorschau'
                  : selectedDayIsFuture
                ? 'Noch nicht möglich'
                : selectedDayCompleted
                  ? 'Für diesen Tag erledigt'
                  : selectedDayIsToday
                    ? 'Erledigt'
                    : 'Für diesen Tag erledigt markieren'}
            </button>

            {selectedDayCompleted ? (
              <button
                className="undo-button"
                onClick={handleUndoComplete}
                type="button"
              >
                Erledigt-Markierung entfernen
              </button>
            ) : null}

            <p className="task-feedback">
              {selectedDayBeforeStart
                ? `Vor dem ${startDateLabel} wird noch nichts gezählt, damit dein Start sauber und persönlich bleibt.`
                : selectedDayBeyondPreview
                  ? `Die Vorschau ist bewusst auf ${activePreviewDays} Tage begrenzt. So bleiben neue Freischaltungen flexibel.`
                : selectedDayIsFuture
                ? 'Du kannst zukünftige Tage schon ansehen, aber noch nicht als erledigt markieren.'
                : selectedDayCompleted
                  ? 'Stark. Dieser Tag ist bereits abgehakt. Falls das ein Versehen war, kannst du es wieder entfernen.'
                  : selectedDayIsToday
                    ? 'Du musst nicht perfekt sein. Einmal anfangen reicht für heute.'
                    : 'Wenn du diese Gewohnheit geschafft hast, kannst du den Tag hier nachtragen.'}
            </p>
          </article>
        </section>

        <section className="app-page progress-page" hidden={activeTab !== 'progress'}>
          <aside className="progress-card">
            <p className="section-label">Fortschritt</p>
            <p className="progress-copy">
              Kleine Gewohnheiten wirken am besten, wenn du sie regelmäßig wiederholst.
            </p>
            <div className="progress-highlight">
              <p className="progress-highlight-title">{progressHighlight.title}</p>
              <p className="progress-highlight-text">{progressHighlight.text}</p>
            </div>
            <div className="stats-grid">
              <div className="stat-box">
                <span className="stat-value">{currentStreak}</span>
                <span className="stat-label">Tage in Folge</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">{bestStreak}</span>
                <span className="stat-label">Bester Lauf</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">{sortedCompletedDates.length}</span>
                <span className="stat-label">Gesamt erledigt</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">{completedThisWeek}/7</span>
                <span className="stat-label">Diese Woche</span>
              </div>
            </div>

            <div className="week-strip">
              {lastSevenDays.map((day) => {
                const isCompleted = completedDatesSet.has(day);
                const isToday = day === todayKey;
                const isSelected = day === selectedDateKey;

                return (
                  <button
                    className={`day-pill ${isCompleted ? 'done' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                    key={day}
                    onClick={() => handleSelectDate(day, true)}
                    type="button"
                  >
                    <span>{parseDateKey(day).toLocaleDateString('de-DE', { weekday: 'short' })}</span>
                  </button>
                );
              })}
            </div>
          </aside>
        </section>

        <section className="calendar-card app-page" hidden={activeTab !== 'calendar'}>
          <div className="calendar-header">
            <div>
              <p className="section-label">Kalender</p>
              <h3>{getMonthLabel(calendarMonth)}</h3>
              <p className="calendar-copy">
                {completedThisMonth} von {getDaysInMonth(calendarMonth)} Tagen in diesem Monat
                erledigt.
              </p>
              <p className="calendar-copy calendar-copy-secondary">
                Rückblick ab deinem Starttag, Vorschau bis zu {activePreviewDays} Tage in die Zukunft.
              </p>
            </div>

            <div className="calendar-controls">
              <button
                className="calendar-nav-button"
                type="button"
                onClick={() => changeCalendarMonth(-1)}
                aria-label="Vorherigen Monat anzeigen"
              >
                ←
              </button>
              <button
                className="calendar-today-button"
                type="button"
                onClick={resetCalendarMonth}
                disabled={isCurrentCalendarMonth}
              >
                Heute
              </button>
              <button
                className="calendar-nav-button"
                type="button"
                onClick={() => changeCalendarMonth(1)}
                aria-label="Nächsten Monat anzeigen"
              >
                →
              </button>
            </div>
          </div>

          {!isPremium ? (
            <div className="premium-note">
              <strong>Gratis-Vorschau:</strong> Du siehst aktuell {PREVIEW_DAYS} Tage im Voraus.
              Premium erweitert die Vorschau auf {PREMIUM_PREVIEW_DAYS} Tage.
            </div>
          ) : null}

          <div className="calendar-weekdays">
            {WEEKDAY_LABELS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          <div className="calendar-grid">
            {calendarDays.map((day) => {
              const isCompleted = completedDatesSet.has(day.key);
              const isToday = day.key === todayKey;
              const isSelected = day.key === selectedDateKey;
              const isBeforeStart = day.key < startDateKey;
              const isBeyondPreview = day.key > previewEndKey;
              const isDisabled = isBeforeStart || isBeyondPreview;

              return (
                <button
                  className={`calendar-day ${day.isCurrentMonth ? '' : 'is-muted'} ${isCompleted ? 'is-complete' : ''} ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''} ${isBeforeStart ? 'is-before-start' : ''} ${isBeyondPreview ? 'is-preview-locked' : ''}`}
                  disabled={isDisabled}
                  key={day.key}
                  onClick={() => handleSelectDate(day.key, true)}
                  type="button"
                >
                  <span className="calendar-day-number">{day.dayNumber}</span>
                  {isCompleted ? <span className="calendar-day-dot" /> : null}
                </button>
              );
            })}
          </div>

          <div className="calendar-legend">
            <span className="legend-item">
              <span className="legend-swatch is-complete" />
              Erledigt
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-today" />
              Heute
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-selected" />
              Ausgewählt
            </span>
            <span className="legend-item">
              <span className="legend-swatch is-limited" />
              Noch nicht verfügbar
            </span>
          </div>
        </section>

        <section className="unlock-card app-page" hidden={activeTab !== 'tasks'}>
          <div className="unlock-header">
            <div>
              <p className="section-label">Freischaltungen</p>
              <h3>{unlockedTaskCount} von {TASKS.length} Gewohnheiten sind offen</h3>
              <p className="unlock-copy">
                {nextUnlockTask
                  ? `Noch ${tasksUntilNextUnlock} erledigte ${
                      tasksUntilNextUnlock === 1 ? 'Aufgabe' : 'Aufgaben'
                    } bis "${nextUnlockTask.title}" freigeschaltet wird.`
                  : isPremium
                    ? 'Du hast alle Gewohnheiten freigeschaltet. Stark gemacht.'
                    : `${premiumTaskCount} weitere Gewohnheiten sind in Premium enthalten.`}
              </p>
            </div>
          </div>

          <div className="unlock-grid">
            {TASKS.map((task) => {
              const isPremiumOnly = task.unlockAt > FREE_TASK_UNLOCK_LIMIT;
              const isUnlocked = task.unlockAt <= completedCount && (isPremium || !isPremiumOnly);

              return (
                <article
                  className={`unlock-item ${isUnlocked ? 'is-unlocked' : 'is-locked'} ${isPremiumOnly ? 'is-premium-only' : ''}`}
                  key={task.id}
                >
                  <div className="unlock-item-top">
                    <span className={`unlock-state ${isUnlocked ? 'is-unlocked' : 'is-locked'}`}>
                      {isUnlocked ? 'Freigeschaltet' : isPremiumOnly && !isPremium ? 'Premium' : 'Gesperrt'}
                    </span>
                    <span className="unlock-threshold">
                      {isPremiumOnly && !isPremium
                        ? 'Premium-Version'
                        : task.unlockAt === 0
                        ? 'Ab Start'
                        : `Ab ${task.unlockAt} erledigten Aufgaben`}
                    </span>
                  </div>
                  <h4>{task.title}</h4>
                  <p>
                    {isUnlocked
                      ? 'Diese Gewohnheit ist jetzt in deiner Aufgabenrotation aktiv.'
                      : isPremiumOnly && !isPremium
                        ? 'Diese erweiterte Gewohnheit wird mit Premium geöffnet.'
                      : 'Mit weiteren kleinen Schritten wird diese Aufgabe automatisch geöffnet.'}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="weekly-review-card app-page" hidden={activeTab !== 'progress'}>
          {isPremium ? (
            <>
              <div className="weekly-review-header">
                <p className="section-label">Wochenrückblick</p>
                <h3>Das hast du in dieser Woche geschafft</h3>
                <p className="weekly-review-copy">
                  {completedThisWeek} von 7 Tagen sind bereits mit einem Drop gefüllt.
                  Hier siehst du deine Woche Tag für Tag.
                </p>
              </div>

              <div className="weekly-review-list">
                {weeklyReviewEntries.map((entry) => (
                  <article
                    className={`weekly-review-item ${entry.isBeforeStart ? 'is-before-start' : entry.isCompleted ? 'is-complete' : 'is-open'}`}
                    key={entry.dayKey}
                  >
                    <div className="weekly-review-date">
                      <span className="weekly-review-day">{entry.dayLabel}</span>
                      <span className="weekly-review-date-text">{entry.fullDateLabel}</span>
                    </div>

                    <div className="weekly-review-content">
                      <h4>
                        {entry.isBeforeStart
                          ? 'Noch nicht gestartet'
                          : entry.isCompleted
                            ? entry.task.title
                            : `Noch offen: ${entry.task.title}`}
                      </h4>
                      <p>
                        {entry.isBeforeStart
                          ? `Start ab ${startDateLabel}`
                          : `${entry.task.category} · ${entry.task.duration}`}
                        {entry.isToday ? ' · Heute' : ''}
                      </p>
                    </div>

                    <div className="weekly-review-status">
                      <span
                        className={`weekly-review-badge ${entry.isBeforeStart ? 'is-muted' : entry.isCompleted ? 'is-complete' : 'is-open'}`}
                      >
                        {entry.isBeforeStart ? 'Noch kein Start' : entry.isCompleted ? 'Geschafft' : 'Offen'}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="premium-gate">
              <p className="section-label">Premium</p>
              <h3>Wochenrückblick freischalten</h3>
              <p>
                In der Gratis-Version siehst du deine Basis-Zahlen. Premium zeigt dir deine
                Woche Tag für Tag und hilft dir, Erfolge bewusster wahrzunehmen.
              </p>
              <button
                className="primary-link"
                onClick={() => {
                  handlePlanChange('premium');
                  setActiveTab('progress');
                }}
                type="button"
              >
                Premium testen
              </button>
            </div>
          )}
        </section>

        <section className="tips-card app-page" hidden={activeTab !== 'tasks'}>
          <p className="section-label">Warum das hilfreich ist</p>
          <div className="tips-grid">
            <div>
              <h3>Klein starten</h3>
              <p>Mini-Gewohnheiten senken die Hürde und machen das Dranbleiben viel leichter.</p>
            </div>
            <div>
              <h3>Einfach wiederholen</h3>
              <p>Eine ruhige Routine bringt langfristig oft mehr als kurze Motivationsschübe.</p>
            </div>
            <div>
              <h3>Sichtbarer Fortschritt</h3>
              <p>Deine Serie zeigt dir direkt, dass du dranbleibst und weiterkommst.</p>
            </div>
          </div>
        </section>

        <section className="plan-card app-page" hidden={activeTab !== 'plan'}>
          <p className="section-label">Abo</p>
          <h3>Gratis starten, Premium vorbereiten</h3>
          <p className="plan-intro">
            Das ist aktuell ein MVP ohne echte Zahlung. Der Premium-Button schaltet die
            Funktionen als Demo frei. Für echte Zahlungen kann später Stripe, PayPal oder
            ein App-Store-Abo angebunden werden.
          </p>

          <div className="plan-grid">
            <article className={`plan-option ${!isPremium ? 'is-current' : ''}`}>
              <span className="plan-kicker">Aktueller Start</span>
              <h4>{PLAN_DETAILS.free.name}</h4>
              <strong>{PLAN_DETAILS.free.price}</strong>
              <p>{PLAN_DETAILS.free.summary}</p>
              <ul>
                <li>Täglicher Daily Drop</li>
                <li>{freeTaskCount} Basis-Gewohnheiten</li>
                <li>{PREVIEW_DAYS} Tage Vorschau</li>
                <li>Basis-Fortschritt</li>
              </ul>
              <button
                className="secondary-button"
                disabled={!isPremium}
                onClick={() => handlePlanChange('free')}
                type="button"
              >
                Gratis nutzen
              </button>
            </article>

            <article className={`plan-option plan-option-premium ${isPremium ? 'is-current' : ''}`}>
              <span className="plan-kicker">Mehr Dranbleiben</span>
              <h4>{PLAN_DETAILS.premium.name}</h4>
              <strong>{PLAN_DETAILS.premium.price}</strong>
              <p>{PLAN_DETAILS.premium.summary}</p>
              <ul>
                <li>Alle {TASKS.length} Gewohnheiten</li>
                <li>{PREMIUM_PREVIEW_DAYS} Tage Vorschau</li>
                <li>Wochenrückblick</li>
                <li>Erweiterte Freischaltungen</li>
              </ul>
              <button
                className="complete-button"
                disabled={isPremium}
                onClick={() => handlePlanChange('premium')}
                type="button"
              >
                Premium testen
              </button>
            </article>
          </div>
        </section>
      </main>

      {isDayWindowOpen ? (
        <div className="day-window-backdrop" onClick={closeDayWindow} role="presentation">
          <section
            aria-labelledby="day-window-title"
            aria-modal="true"
            className="day-window"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="day-window-header">
              <div>
                <p className="section-label">Tagesfenster</p>
                <h3 id="day-window-title">{selectedDateLabel}</h3>
                <span
                  className={`day-window-status ${selectedDayCompleted ? 'is-done' : ''} ${selectedDayIsFuture ? 'is-future' : ''} ${selectedDayBeforeStart || selectedDayBeyondPreview ? 'is-limited' : ''}`}
                >
                  {selectedDayStatus}
                </span>
              </div>

              <button className="day-window-close" onClick={closeDayWindow} type="button">
                Schließen
              </button>
            </div>

            <div className="day-window-grid">
              <section className="day-window-panel">
                <p className="section-label">Deine Aufgabe</p>
                <h4>
                  {selectedTask
                    ? selectedTask.title
                    : selectedDayBeforeStart
                      ? 'Dieser Tag liegt vor deinem Start.'
                      : 'Dieser Tag ist noch nicht in deiner Vorschau.'}
                </h4>
                <div className="day-window-tags">
                  <span className="task-category">
                    {selectedTask
                      ? selectedTask.category
                      : selectedDayBeforeStart
                        ? 'Starttag'
                        : 'Vorschau'}
                  </span>
                  <span className="task-time">
                    {selectedTask
                      ? selectedTask.duration
                      : selectedDayBeforeStart
                        ? startDateLabel
                        : `Bis +${activePreviewDays} Tage`}
                  </span>
                </div>
                <p className="day-window-text">
                  {selectedTask
                    ? selectedTask.description
                    : selectedDayBeforeStart
                      ? `Vor dem ${startDateLabel} zeigt die App keine Aufgaben an.`
                      : `Die konkrete Aufgaben-Vorschau wird erst in den nächsten ${activePreviewDays} Tagen sichtbar.`}
                </p>
              </section>

              <section className="day-window-panel">
                <p className="section-label">Warum das gut ist</p>
                <p className="day-window-text">
                  {selectedTask
                    ? selectedTask.benefit
                    : selectedDayBeforeStart
                      ? 'So bleibt dein Kalender ehrlich und startet genau mit deinem persönlichen Einstieg.'
                      : 'So kann sich deine Vorschau flexibel an neue Freischaltungen und echte Fortschritte anpassen.'}
                </p>
              </section>

              <section className="day-window-panel day-window-highlight-panel">
                <p className="section-label">Positive Anerkennung</p>
                <h4>{dayWindowHighlight.title}</h4>
                <p className="day-window-text">{dayWindowHighlight.text}</p>
              </section>

              <section className="day-window-panel">
                <p className="section-label">Dein Fortschritt</p>
                <div className="day-window-stats">
                  <div className="day-window-stat">
                    <strong>{currentStreak}</strong>
                    <span>Tage in Folge</span>
                  </div>
                  <div className="day-window-stat">
                    <strong>{bestStreak}</strong>
                    <span>Bester Lauf</span>
                  </div>
                  <div className="day-window-stat">
                    <strong>{completedCount}</strong>
                    <span>Gesamt erledigt</span>
                  </div>
                </div>
              </section>
            </div>

            <div className="day-window-actions">
              {selectedDayCompleted ? (
                <button
                  className="undo-button"
                  onClick={handleUndoComplete}
                  type="button"
                >
                  Erledigt-Markierung entfernen
                </button>
              ) : (
                <button
                  className={`complete-button ${selectedDayCompleted ? 'is-complete' : ''}`}
                  onClick={handleComplete}
                  disabled={
                    selectedDayCompleted ||
                    selectedDayIsFuture ||
                    selectedDayBeforeStart ||
                    selectedDayBeyondPreview ||
                    !selectedTask
                  }
                  type="button"
                >
                  {selectedDayBeforeStart
                    ? 'Vor dem Start nicht verfügbar'
                    : selectedDayBeyondPreview
                      ? 'Außerhalb der Vorschau'
                      : selectedDayIsFuture
                    ? 'Noch nicht möglich'
                    : 'Jetzt als erledigt markieren'}
                </button>
              )}
              <button className="secondary-button" onClick={closeDayWindow} type="button">
                Fenster schließen
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

export default App;
