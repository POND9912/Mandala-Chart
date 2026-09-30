'use client';

import { useState } from 'react';
import { Check, Sparkles, Plus, X, Wand2 } from 'lucide-react';
import Header from '@/components/Header';
import Drawer from '@/components/Drawer';
import UserMenu from '@/components/UserMenu';
import { getChart, getSubgoal, suggestAction, suggestSubtaskPlan } from '@/lib/data';

const LEGEND = [
  { label: 'เสร็จแล้ว', dot: 'bg-coral' },
  { label: 'กำลังทำ', dot: 'bg-white border-2 border-coral' },
  { label: 'ยังไม่ได้เพิ่ม', dot: 'bg-white border-2 border-dashed border-line' },
];

// When an action has sub-steps, its status is derived from them instead of
// being toggled directly — finish all the small steps and the box closes itself.
function effectiveStatus(action) {
  if (action.subtasks && action.subtasks.length > 0) {
    const doneN = action.subtasks.filter((s) => s.done).length;
    if (doneN === action.subtasks.length) return 'done';
    if (doneN > 0) return 'pending';
    return action.label ? 'pending' : 'empty';
  }
  return action.status;
}

let subtaskSeq = 0;
function newSubtask() {
  subtaskSeq += 1;
  return { id: 'st' + subtaskSeq, text: '', done: false };
}

export default function SubgoalPage({ params }) {
  const chart = getChart(params.id);
  const subgoal = getSubgoal(params.id, params.subId);
  const [actions, setActions] = useState(subgoal.actions.map((a) => ({ note: '', subtasks: [], ...a })));
  const [openIndex, setOpenIndex] = useState(null);

  const doneCount = actions.filter((a) => effectiveStatus(a) === 'done').length;
  const subIndex = chart.subgoals.findIndex((s) => s.id === subgoal.id);

  function updateAction(i, patch) {
    setActions((prev) => prev.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));
  }
  function addSubtask(i) {
    setActions((prev) => prev.map((a, idx) => (idx === i ? { ...a, subtasks: [...a.subtasks, newSubtask()] } : a)));
  }
  function updateSubtask(i, subId, patch) {
    setActions((prev) =>
      prev.map((a, idx) =>
        idx === i ? { ...a, subtasks: a.subtasks.map((s) => (s.id === subId ? { ...s, ...patch } : s)) } : a
      )
    );
  }
  function removeSubtask(i, subId) {
    setActions((prev) =>
      prev.map((a, idx) => (idx === i ? { ...a, subtasks: a.subtasks.filter((s) => s.id !== subId) } : a))
    );
  }

  // Big "manage the whole plan" button: make sure there's a topic, then
  // generate a fresh, right-sized checklist for it in one go.
  function aiManageWholePlan(i) {
    setActions((prev) =>
      prev.map((a, idx) => {
        if (idx !== i) return a;
        const label = a.label || suggestAction(idx);
        const plan = suggestSubtaskPlan().map((text) => ({ ...newSubtask(), text }));
        return { ...a, label, status: 'pending', subtasks: plan };
      })
    );
  }

  // Gentler version: add a batch of AI-suggested steps onto whatever
  // checklist already exists, instead of replacing it.
  function aiAddSubtasks(i) {
    setActions((prev) =>
      prev.map((a, idx) => {
        if (idx !== i) return a;
        const extra = suggestSubtaskPlan().map((text) => ({ ...newSubtask(), text }));
        return { ...a, subtasks: [...a.subtasks, ...extra] };
      })
    );
  }

  function fillAll() {
    setActions((prev) =>
      prev.map((a, idx) => (effectiveStatus(a) === 'empty' ? { ...a, status: 'pending', label: suggestAction(idx) } : a))
    );
  }

  const first4 = actions.slice(0, 4);
  const last4 = actions.slice(4);
  const active = openIndex === null ? null : actions[openIndex];

  return (
    <main className="min-h-dvh flex flex-col bg-cream">
      <Header backHref={`/chart/${chart.id}`} title={subgoal.title} right={<UserMenu className="hidden sm:block" />} />

      <div className="flex-1 overflow-y-auto px-4 md:px-10 py-5 md:py-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-5">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white shadow-soft self-start">
            <div className="grid grid-cols-3 gap-[3px]">
              {Array.from({ length: 9 }, (_, i) => {
                let color = '#EDF2F9';
                if (i === 4) color = '#0B5CB8';
                else {
                  const otherIndex = i < 4 ? i : i - 1;
                  if (otherIndex === subIndex) color = '#1E9BE8';
                }
                return <div key={i} className="w-2 h-2 rounded-sm" style={{ background: color }} />;
              })}
            </div>
            <span className="text-xs font-semibold text-muted">ตำแหน่งของคุณในแผนทั้งหมด</span>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-display font-semibold text-lg md:text-xl">{subgoal.title}</h1>
            <div className="h-3 rounded-full bg-chip overflow-hidden">
              <div className="h-full bg-coral rounded-full transition-all" style={{ width: `${(doneCount / 8) * 100}%` }} />
            </div>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-semibold text-muted">{doneCount} จาก 8 การกระทำเสร็จแล้ว</span>
              <div className="flex items-center gap-3.5">
                {LEGEND.map((l) => (
                  <span key={l.label} className="flex items-center gap-1.5 text-[11px] text-muted">
                    <span className={'w-2.5 h-2.5 rounded-full flex-shrink-0 ' + l.dot} />
                    {l.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {first4.map((a, i) => (
              <ActionCell key={a.id} action={a} onOpen={() => setOpenIndex(i)} />
            ))}
            <div className="aspect-square rounded-2xl bg-lavender-bg2 flex flex-col items-center justify-center gap-1 p-2 text-center">
              <span className="font-display font-semibold text-sm sm:text-base md:text-xl text-lavender-dark leading-snug">{subgoal.title}</span>
              <span className="text-[11px] md:text-[13px] text-lavender-text">8 การกระทำ</span>
            </div>
            {last4.map((a, i) => (
              <ActionCell key={a.id} action={a} onOpen={() => setOpenIndex(i + 4)} />
            ))}
          </div>

          <button
            type="button"
            onClick={fillAll}
            className="tap flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-lavender shadow-lavenderGlow"
          >
            <Sparkles size={15} className="text-white" />
            <span className="font-display font-semibold text-sm text-white">ให้ AI ช่วยคิด action ที่เหลือ</span>
          </button>
        </div>
      </div>

      <Drawer
        open={openIndex !== null}
        onClose={() => setOpenIndex(null)}
        subtitle={subgoal.title}
        title={`การกระทำข้อที่ ${openIndex !== null ? openIndex + 1 : ''}`}
      >
        {active && (
          <div className="flex flex-col gap-5">
            {active.subtasks.length === 0 ? (
              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-cream cursor-pointer">
                <input
                  type="checkbox"
                  checked={active.status === 'done'}
                  onChange={(e) => updateAction(openIndex, { status: e.target.checked ? 'done' : active.label ? 'pending' : 'empty' })}
                  className="w-5 h-5 rounded-md accent-[#0B5CB8] flex-shrink-0"
                />
                <span className="text-sm font-semibold">ทำข้อนี้เสร็จแล้ว</span>
              </label>
            ) : (
              <div className="p-3.5 rounded-2xl bg-cream flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {active.subtasks.filter((s) => s.done).length} จาก {active.subtasks.length} ขั้นตอนย่อยเสร็จแล้ว
                </span>
                {effectiveStatus(active) === 'done' && (
                  <span className="w-6 h-6 rounded-full bg-coral flex items-center justify-center flex-shrink-0">
                    <Check size={12} strokeWidth={3} className="text-white" />
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-muted">รายละเอียด action</span>
              <textarea
                value={active.label}
                onChange={(e) =>
                  updateAction(openIndex, {
                    label: e.target.value,
                    status: e.target.value ? (active.status === 'empty' ? 'pending' : active.status) : 'empty',
                  })
                }
                placeholder="พิมพ์สิ่งที่จะทำ เช่น อ่าน docs React 15 นาที"
                rows={3}
                className="w-full bg-white border border-line rounded-2xl p-3.5 text-sm font-semibold placeholder:text-faint placeholder:font-medium resize-none shadow-soft"
              />
              <button
                type="button"
                onClick={() => updateAction(openIndex, { label: suggestAction(openIndex), status: 'pending' })}
                className="tap self-start flex items-center gap-2 px-3.5 py-2 rounded-full bg-lavender-bg"
              >
                <Sparkles size={12} className="text-lavender-text" />
                <span className="text-[12px] font-bold text-lavender-text">ให้ AI แนะนำให้</span>
              </button>
              <button
                type="button"
                onClick={() => aiManageWholePlan(openIndex)}
                className="tap flex items-center justify-center gap-2 py-3 rounded-2xl bg-lavender shadow-lavenderGlow"
              >
                <Wand2 size={14} className="text-white" />
                <span className="font-display font-semibold text-[13px] text-white">ให้ AI จัดการแผนทั้งหมด</span>
              </button>
              <span className="text-[11px] text-faint -mt-1">ใส่แค่หัวข้อด้านบน แล้วให้ AI คิดทั้ง description และขั้นตอนย่อยให้ครบ</span>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-muted">
                  ขั้นตอนย่อย {active.subtasks.length > 0 ? `(${active.subtasks.length})` : '(ถ้าต้องการแบ่งเป็นหลายขั้น)'}
                </span>
              </div>

              {active.subtasks.map((s) => (
                <div key={s.id} className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={s.done}
                    onChange={(e) => updateSubtask(openIndex, s.id, { done: e.target.checked })}
                    className="w-[18px] h-[18px] rounded accent-[#0B5CB8] flex-shrink-0"
                  />
                  <input
                    value={s.text}
                    onChange={(e) => updateSubtask(openIndex, s.id, { text: e.target.value })}
                    placeholder="พิมพ์ขั้นตอนย่อย"
                    className={
                      'flex-1 min-w-0 bg-transparent text-[13px] font-semibold placeholder:text-faint placeholder:font-medium ' +
                      (s.done ? 'line-through text-faint' : 'text-ink')
                    }
                  />
                  <button
                    type="button"
                    aria-label="ลบขั้นตอนนี้"
                    onClick={() => removeSubtask(openIndex, s.id)}
                    className="tap flex-shrink-0 w-6 h-6 rounded-full bg-chip flex items-center justify-center"
                  >
                    <X size={11} className="text-muted" />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => addSubtask(openIndex)}
                  className="tap flex items-center gap-1.5 text-[12px] font-bold text-muted"
                >
                  <Plus size={13} /> เพิ่มขั้นตอนย่อย
                </button>
                <button
                  type="button"
                  onClick={() => aiAddSubtasks(openIndex)}
                  className="tap flex items-center gap-1.5 text-[12px] font-bold text-lavender-text"
                >
                  <Sparkles size={12} /> ให้ AI ช่วยคิดเพิ่ม
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-muted">บันทึกเพิ่มเติม (ถ้ามี)</span>
              <textarea
                value={active.note}
                onChange={(e) => updateAction(openIndex, { note: e.target.value })}
                placeholder="เช่น ลิงก์อ้างอิง หรือเหตุผลที่ตั้งข้อนี้"
                rows={2}
                className="w-full bg-cream rounded-2xl p-3.5 text-[13px] placeholder:text-faint resize-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              className="tap flex items-center justify-center py-3.5 rounded-2xl bg-coral shadow-coral mt-1"
            >
              <span className="font-display font-semibold text-sm text-white">เสร็จสิ้น</span>
            </button>
          </div>
        )}
      </Drawer>
    </main>
  );
}

// Outer cell: title on top, then the action's checklist (if it has one).
// The cell is a button that opens the drawer, so the checklist here is read-only.
function ActionCell({ action, onOpen }) {
  const status = effectiveStatus(action);
  const isEmpty = status === 'empty';
  const subtasks = action.subtasks || [];
  const subDone = subtasks.filter((s) => s.done).length;

  return (
    <button
      type="button"
      onClick={onOpen}
      className={
        'tap aspect-square rounded-2xl p-2.5 md:p-3.5 flex flex-col gap-1.5 md:gap-2 text-left overflow-hidden ' +
        (isEmpty ? 'bg-white border-2 border-dashed border-line' : 'bg-white shadow-soft')
      }
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={
            'font-display font-semibold text-[12px] sm:text-sm md:text-base leading-snug line-clamp-3 ' +
            (status === 'done' ? 'text-faint line-through decoration-1' : isEmpty ? 'text-muted' : 'text-ink')
          }
        >
          {isEmpty ? '+ เพิ่ม action' : action.label}
        </span>
        {status === 'done' ? (
          <span className="w-5 h-5 rounded-full bg-coral flex items-center justify-center flex-shrink-0">
            <Check size={11} strokeWidth={3} className="text-white" />
          </span>
        ) : status === 'pending' ? (
          <span className="w-5 h-5 rounded-full border-2 border-coral flex-shrink-0" />
        ) : (
          <span className="text-[9px] font-bold text-lavender-text bg-lavender-bg px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
            <Sparkles size={9} /> AI
          </span>
        )}
      </div>

      {subtasks.length > 0 && (
        <>
          <ul className="hidden sm:flex flex-col gap-1 flex-1 min-h-0 overflow-hidden">
            {subtasks.map((st) => (
              <li key={st.id} className="flex items-start gap-1.5 text-[11px] md:text-[12px] leading-snug">
                <span
                  className={
                    'mt-[2px] w-3 h-3 rounded-[4px] flex-shrink-0 flex items-center justify-center ' +
                    (st.done ? 'bg-coral' : 'border-[1.5px] border-faint')
                  }
                >
                  {st.done && <Check size={8} strokeWidth={3.5} className="text-white" />}
                </span>
                <span className={'line-clamp-1 ' + (st.done ? 'text-faint line-through' : 'text-ink')}>
                  {st.text || 'ขั้นตอนย่อย'}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center gap-1.5">
            <div className="flex-1 h-1 rounded-full bg-chip overflow-hidden">
              <div className="h-full bg-coral rounded-full" style={{ width: `${(subDone / subtasks.length) * 100}%` }} />
            </div>
            <span className="text-[10px] font-bold text-muted flex-shrink-0">
              {subDone}/{subtasks.length}
            </span>
          </div>
        </>
      )}
    </button>
  );
}
