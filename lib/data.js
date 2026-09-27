// Mock data for the prototype. No backend yet — everything lives here so
// every page reads from one consistent source. Swap this file for real
// API calls once the backend exists; the components don't need to change.

export const CATEGORIES = ['อาชีพการงาน', 'สุขภาพ', 'การเงิน', 'ความสัมพันธ์', 'การเรียนรู้'];

export const SUBGOAL_TITLES = [
  'ทักษะเขียนโค้ด',
  'อ่านหนังสือเทคนิค',
  'ออกกำลังกาย',
  'สร้างเครือข่าย',
  'สุขภาพจิต',
  'วางแผนการเงิน',
  'ทำพอร์ตโฟลิโอ',
  'Soft skills',
];

const SUBGOAL_PERCENTS = [65, 40, 80, 25, 55, 90, 35, 60];

// "วิธีผ่าน" hint per sub-goal — the first of the 3 hint dots on each card.
const SUBGOAL_PASS_HINTS = [
  'ทำ action ให้ครบ 8 ข้อ และส่งโปรเจกต์ที่ใช้ React + API จริงได้ 1 ชิ้น',
  'อ่านจบ 4 เล่ม พร้อมสรุปสั้น ๆ เล่มละ 1 หน้า',
  'ออกกำลังกายอย่างน้อย 3 ครั้ง/สัปดาห์ ต่อเนื่อง 8 สัปดาห์',
  'รู้จักคนในสายงานใหม่ 10 คน และเข้าร่วม meetup อย่างน้อย 2 ครั้ง',
  'เช็กอินอารมณ์ทุกวัน และมีวันพักจริง ๆ สัปดาห์ละ 1 วัน',
  'ออมได้ 20% ของรายได้ติดต่อกัน 3 เดือน',
  'มีโปรเจกต์ในพอร์ต 3 ชิ้น พร้อม README และ demo ที่เปิดดูได้',
  'ได้ feedback ด้านการสื่อสารจากเพื่อนร่วมงาน 3 คน และนำไปปรับใช้',
];

const CODING_ACTIONS = [
  { label: 'อ่าน docs React 15 นาที', status: 'done' },
  { label: 'ทำโจทย์ JavaScript 1 ข้อ', status: 'done' },
  { label: 'ดูคลิปสอน TypeScript', status: 'pending' },
  { label: 'สร้าง component ใหม่', status: 'pending' },
  { label: '', status: 'empty' },
  { label: '', status: 'empty' },
  { label: '', status: 'empty' },
  { label: '', status: 'empty' },
];

// "ถ้าติดอยู่" hint — the smallest version that still counts, for low-energy days.
const SUBGOAL_STUCK_HINTS = [
  'ไม่มีเวลา? ลดเหลือวันละ 10 นาที เขียน component เล็ก ๆ 1 ตัวก็นับแล้ว',
  'อ่านไม่ไหว? อ่านแค่ 5 หน้า แล้วจดประโยคที่ชอบ 1 ประโยค',
  'ไม่มีแรง? เดินเร็ว 15 นาที หรือยืดเหยียด 5 นาทีก็นับ',
  'ไม่กล้าทัก? เริ่มจากคอมเมนต์โพสต์คนในสายงาน 1 คนก่อน',
  'รู้สึกหนัก? หายใจลึก ๆ 3 นาที แล้วเขียนความรู้สึกสั้น ๆ 1 บรรทัด',
  'เดือนนี้ช็อต? ออมให้ได้แม้ 50 บาท เพื่อรักษานิสัยไว้',
  'ไม่รู้จะทำอะไร? เอาโปรเจกต์เก่ามาเขียน README ให้ดีขึ้นก่อน',
  'ไม่มีโอกาสพูด? ฝึกสรุปงานวันนี้ให้เพื่อนฟังใน 1 นาที',
];

function nextStepHint(actions) {
  const next = actions.find((a) => a.status === 'pending');
  if (next) return next.label;
  if (actions.some((a) => a.status === 'empty')) return 'ยังไม่มี action ที่รออยู่ — เพิ่ม action ใหม่ 1 ข้อ';
  return 'ทำ action ครบแล้ว! ไปทำตามเงื่อนไขวิธีผ่านได้เลย';
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/(^-|-$)/g, '');
}

function makeActions(percent) {
  const doneCount = Math.round((percent / 100) * 4);
  const actions = [];
  for (let i = 0; i < 8; i++) {
    let status = 'empty';
    if (i < doneCount) status = 'done';
    else if (i < doneCount + 2) status = 'pending';
    actions.push({
      id: 'a' + i,
      label: status === 'empty' ? '' : `แผนปฏิบัติข้อที่ ${i + 1}`,
      status,
    });
  }
  return actions;
}

function makeSubgoals() {
  return SUBGOAL_TITLES.map((title, i) => {
    const id = slugify(title) || 's' + i;
    const percent = SUBGOAL_PERCENTS[i];
    const actions = i === 0 ? CODING_ACTIONS.map((a, j) => ({ id: 'a' + j, ...a })) : makeActions(percent);
    // One hint per dot: when it's done → what to do next → what to do when stuck.
    const hints = [
      { label: 'วิธีผ่าน', text: SUBGOAL_PASS_HINTS[i] },
      { label: 'ก้าวถัดไป', text: nextStepHint(actions) },
      { label: 'ถ้าติดอยู่', text: SUBGOAL_STUCK_HINTS[i] },
    ];
    return { id, num: i + 1, title, percent, actions, hints };
  });
}

export const CHARTS = [
  {
    id: 'fullstack',
    title: 'เป็น Full-stack Developer ภายใน 1 ปี',
    category: 'อาชีพการงาน',
    percent: 58,
    updated: '2 ชม.ที่แล้ว',
    status: 'active',
    momentum: 3, // checked in most recently — weighted higher for notifications
    subgoals: makeSubgoals(),
  },
  {
    id: 'health',
    title: 'สุขภาพกายปี 2026',
    category: 'สุขภาพ',
    percent: 20,
    updated: 'เมื่อวาน',
    status: 'active',
    momentum: 2,
    subgoals: makeSubgoals(),
  },
  {
    id: 'reading',
    title: 'อ่านหนังสือ 24 เล่ม',
    category: 'การเรียนรู้',
    percent: 75,
    updated: '3 วันก่อน',
    status: 'active',
    momentum: 1, // gone quiet a few days — still eligible, just weighted lower
    subgoals: makeSubgoals(),
  },
  {
    id: 'japanese',
    title: 'เรียนภาษาญี่ปุ่นเบื้องต้น',
    category: 'การเรียนรู้',
    percent: 100,
    updated: '2 สัปดาห์ก่อน',
    status: 'done',
    momentum: 0,
    subgoals: makeSubgoals(),
  },
];

export function getChart(id) {
  return CHARTS.find((c) => c.id === id) || CHARTS[0];
}

export function getSubgoal(chartId, subId) {
  const chart = getChart(chartId);
  return chart.subgoals.find((s) => s.id === subId) || chart.subgoals[0];
}

// A small pool of alternate phrasings so the "regenerate" buttons in the
// prototype have something plausible-looking to swap in. A real backend
// would call an LLM here instead.
const ALT_SUBGOALS = [
  'ฝึกแก้ปัญหาโค้ดทุกวัน', 'อ่านบทความเทคนิคสัปดาห์ละ 2 ชิ้น', 'เดิน/วิ่งวันละ 20 นาที',
  'เข้าร่วมชุมชนนักพัฒนา', 'ฝึกสติ/นั่งสมาธิ', 'ตั้งงบรายเดือน', 'อัปเดต LinkedIn และเรซูเม่',
  'ฝึกพรีเซนต์งานต่อทีม', 'ทำโปรเจกต์ส่วนตัว 1 ชิ้น', 'เรียนคอร์สออนไลน์ใหม่', 'นอนให้ครบ 7-8 ชม.',
  'หาเมนเทอร์ในสายงาน',
];

export function regenerateSubgoal(currentTitle) {
  const pool = ALT_SUBGOALS.filter((t) => t !== currentTitle);
  return pool[Math.floor(Math.random() * pool.length)];
}

const ALT_ACTIONS = [
  'ฝึก 20 นาทีก่อนนอน', 'ทบทวนสิ่งที่เรียนไปเมื่อวาน', 'ลองทำแบบฝึกหัดสั้นๆ 1 ข้อ',
  'จดบันทึกสิ่งที่เรียนรู้วันนี้', 'แชร์ความคืบหน้าให้เพื่อนฟัง', 'ตั้งเวลาเตือน 15 นาที/วัน',
  'ดูวิดีโอสรุป 1 คลิป', 'ลองสอนคนอื่นเรื่องที่เพิ่งเรียน',
];

export function suggestAction(index) {
  return ALT_ACTIONS[index % ALT_ACTIONS.length];
}

// Mock "AI" plan generator for the sub-step checklist inside an action's
// drawer. A real backend would call an LLM with the action label as context
// and return a right-sized list instead of a random pick from this pool.
const PLAN_STEP_POOL = [
  'เตรียมอุปกรณ์/เปิดเอกสารที่ต้องใช้',
  'ลงมือทำจริง 15-20 นาที',
  'ทบทวนสิ่งที่ทำไปว่าตรงเป้าไหม',
  'จดบันทึกสิ่งที่เรียนรู้หรือผลลัพธ์',
  'ขอ feedback จากเพื่อนหรือเมนเทอร์',
  'ตั้งเวลาทำซ้ำรอบถัดไป',
  'แชร์ความคืบหน้าให้คนใกล้ตัวรู้',
  'เช็คว่าติดขัดตรงไหนแล้วแก้ก่อนรอบหน้า',
];

function pickRandom(pool, count) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function suggestSubtaskPlan() {
  const count = 3 + Math.floor(Math.random() * 3); // 3–5 steps, AI decides how many
  return pickRandom(PLAN_STEP_POOL, count);
}

export const ADMIN = {
  kpis: [
    { label: 'ผู้ใช้งานทั้งหมด', value: '4,208' },
    { label: 'Chart ที่สร้างแล้ว', value: '9,614' },
    { label: 'อัตราสำเร็จเฉลี่ย', value: '47%' },
    { label: 'Streak เฉลี่ย', value: '6.2 วัน' },
  ],
  categories: [
    { label: 'การเงิน', percent: 42 },
    { label: 'สุขภาพ', percent: 35 },
    { label: 'อาชีพการงาน', percent: 30 },
    { label: 'ความสัมพันธ์', percent: 22 },
    { label: 'การเรียนรู้', percent: 18 },
  ],
  topActions: [
    { label: 'อ่านหนังสือเทคนิค 30 นาที/วัน', count: 812 },
    { label: 'ออกกำลังกาย 20 นาที', count: 754 },
    { label: 'ทำ To-do list ตอนเช้า', count: 690 },
    { label: 'บันทึกรายรับ-รายจ่าย', count: 588 },
    { label: 'นั่งสมาธิ 10 นาที', count: 511 },
  ],
  experts: [
    { name: 'กมล ส.', category: 'การเงิน', score: 96 },
    { name: 'พิมพ์ ว.', category: 'สุขภาพ', score: 93 },
    { name: 'ธนกร อ.', category: 'อาชีพการงาน', score: 91 },
    { name: 'สุดา ก.', category: 'การเรียนรู้', score: 88 },
    { name: 'อารีย์ จ.', category: 'ความสัมพันธ์', score: 85 },
  ],
};

export const HEAT_RAMP = ['#EDF2F9', '#CFE3F8', '#7FBDF0', '#0B5CB8'];

export function heatColorFor(percent) {
  if (percent >= 75) return HEAT_RAMP[3];
  if (percent >= 50) return HEAT_RAMP[2];
  if (percent >= 25) return HEAT_RAMP[1];
  return HEAT_RAMP[0];
}

// Picks 1 action to surface as today's reminder, across every ACTIVE chart
// (a finished chart has nothing left worth nudging about, so it's excluded
// entirely). Charts are weighted by `momentum` so one you checked into
// recently is more likely to come up than one you haven't touched in days —
// this keeps a streak you're building without ever fully dropping the
// quieter charts (they can still be picked, just less often).
//
// Returns enough context to both write a chart-aware notification body and
// deep-link the click straight to that sub-goal:
// { chartId, chartTitle, subgoalId, subgoalTitle, id, label }
export function randomDailyAction() {
  const candidates = CHARTS.filter((c) => c.status === 'active').flatMap((chart) =>
    chart.subgoals.flatMap((s) =>
      s.actions
        .filter((a) => a.label && a.status !== 'done')
        .map((a) => ({
          ...a,
          chartId: chart.id,
          chartTitle: chart.title,
          subgoalId: s.id,
          subgoalTitle: s.title,
          weight: Math.max(chart.momentum, 1),
        }))
    )
  );
  if (candidates.length === 0) return null;

  const totalWeight = candidates.reduce((sum, c) => sum + c.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const c of candidates) {
    roll -= c.weight;
    if (roll <= 0) return c;
  }
  return candidates[candidates.length - 1];
}
