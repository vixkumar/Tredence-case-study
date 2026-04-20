import type { DragEvent } from 'react';
import type { NodeVariant } from '../types/workflow';

const NODE_ITEMS: { variant: NodeVariant; label: string; description: string; color: string; icon: string }[] = [
  {
    variant: 'start',
    label: 'Start',
    description: 'Entry point',
    color: 'emerald',
    icon: 'M5 3l14 9-14 9V3z',
  },
  {
    variant: 'task',
    label: 'Task',
    description: 'Manual step',
    color: 'blue',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  },
  {
    variant: 'approval',
    label: 'Approval',
    description: 'Gate check',
    color: 'amber',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    variant: 'automated',
    label: 'Automated',
    description: 'Auto action',
    color: 'violet',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    variant: 'end',
    label: 'End',
    description: 'Terminal',
    color: 'rose',
    icon: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; iconBg: string; hoverBorder: string; shadow: string }> = {
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/20',
    hoverBorder: 'hover:border-emerald-500/50',
    shadow: 'hover:shadow-emerald-500/10',
  },
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    iconBg: 'bg-blue-500/20',
    hoverBorder: 'hover:border-blue-500/50',
    shadow: 'hover:shadow-blue-500/10',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    iconBg: 'bg-amber-500/20',
    hoverBorder: 'hover:border-amber-500/50',
    shadow: 'hover:shadow-amber-500/10',
  },
  violet: {
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
    border: 'border-violet-500/20',
    iconBg: 'bg-violet-500/20',
    hoverBorder: 'hover:border-violet-500/50',
    shadow: 'hover:shadow-violet-500/10',
  },
  rose: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/20',
    iconBg: 'bg-rose-500/20',
    hoverBorder: 'hover:border-rose-500/50',
    shadow: 'hover:shadow-rose-500/10',
  },
};

const Sidebar = () => {
  const onDragStart = (e: DragEvent, variant: NodeVariant) => {
    e.dataTransfer.setData('application/reactflow-variant', variant);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-700/50 bg-slate-900">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 border-b border-slate-700/50 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-tight">FlowCraft</h1>
          <p className="text-[10px] text-slate-500">Workflow Builder</p>
        </div>
      </div>

      {/* Node palette */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Components
        </p>

        <div className="space-y-2">
          {NODE_ITEMS.map((item) => {
            const c = COLOR_MAP[item.color];
            return (
              <div
                key={item.variant}
                draggable
                onDragStart={(e) => onDragStart(e, item.variant)}
                className={`
                  group flex cursor-grab items-center gap-3 rounded-xl border px-3 py-2.5
                  transition-all duration-200 active:cursor-grabbing
                  ${c.bg} ${c.border} ${c.hoverBorder} ${c.shadow}
                  hover:shadow-lg hover:-translate-y-0.5
                `}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${c.iconBg} ${c.text} transition-transform group-hover:scale-110`}>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-semibold ${c.text}`}>{item.label}</p>
                  <p className="text-[10px] text-slate-500">{item.description}</p>
                </div>
                <svg className="ml-auto h-4 w-4 shrink-0 text-slate-600 opacity-0 transition group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-700/50 px-5 py-3">
        <p className="text-[10px] text-slate-600 text-center">Drag & drop to canvas</p>
      </div>
    </aside>
  );
};

export default Sidebar;
