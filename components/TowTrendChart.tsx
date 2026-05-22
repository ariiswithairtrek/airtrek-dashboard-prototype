import React, { useState } from 'react';
import { DAILY_30D, HOURLY_AVG } from '../constants';

type Mode = '30d' | 'daily';

const TowTrendChart: React.FC = () => {
  const [mode, setMode] = useState<Mode>('30d');
  const [hover, setHover] = useState<number | null>(null);

  const data = mode === '30d' ? DAILY_30D : HOURLY_AVG;
  const rawMax = Math.max(...data);
  const yMax = mode === '30d' ? Math.ceil(rawMax / 4) * 4 : Math.ceil(rawMax * 2) / 2;
  const gridVals = [1, 0.75, 0.5, 0.25, 0].map((f) => yMax * f);

  const today = new Date();
  const dateLabel = (i: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (DAILY_30D.length - 1 - i));
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  const isPeak = (i: number) =>
    mode === 'daily'
      ? (i >= 6 && i <= 9) || (i >= 16 && i <= 19)
      : data[i] === rawMax;

  const xLabel = (i: number) =>
    mode === '30d' ? dateLabel(i) : `${String(i).padStart(2, '0')}:00`;

  const valLabel = (i: number) =>
    mode === '30d' ? `${data[i]} tows` : `${data[i].toFixed(1)} tows/hr`;

  const fmtGrid = (v: number) => (mode === '30d' ? Math.round(v).toString() : v.toFixed(1));
  const ticks = mode === '30d' ? [0, 7, 14, 21, 29] : [0, 6, 12, 18, 23];

  return (
    <div className="bg-[#161B22]/60 border border-gray-800/60 rounded-2xl p-6 mt-8">
      {/* Header + toggle */}
      <div className="flex items-end justify-between gap-4 flex-wrap mb-6">
        <div>
          <h3 className="text-white text-sm font-bold mono uppercase tracking-tight">
            {mode === '30d' ? 'Last 30 Days' : 'Daily Pattern'}
          </h3>
          <p className="text-gray-500 text-[11px] mt-1">
            {mode === '30d'
              ? 'Daily tow counts · 538 total'
              : 'Avg tows per hour · 30-day average'}
          </p>
        </div>
        <div className="flex bg-gray-900/60 rounded-lg p-1 border border-gray-800">
          {([['30d', '30 Days'], ['daily', 'Daily']] as [Mode, string][]).map(([m, label]) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setHover(null);
              }}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] rounded-md transition-colors ${
                mode === m ? 'bg-[#FF4D00] text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="flex gap-3">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between h-56 text-[9px] text-gray-600 mono text-right w-7 shrink-0">
          {gridVals.map((g, i) => (
            <span key={i}>{fmtGrid(g)}</span>
          ))}
        </div>

        {/* Plot */}
        <div className="flex-1 min-w-0">
          <div className="relative h-56">
            {/* Gridlines */}
            {gridVals.map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 border-t border-gray-800/40"
                style={{ top: `${(i / (gridVals.length - 1)) * 100}%` }}
              />
            ))}
            {/* Bars */}
            <div className="absolute inset-0 flex items-end gap-[2px]">
              {data.map((v, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  className="flex-1 h-full flex items-end relative cursor-pointer"
                >
                  <div
                    className={`w-full rounded-t-[2px] transition-all ${
                      isPeak(i) ? 'bg-[#FF4D00]' : 'bg-[#2F6FED]'
                    } ${hover === i ? 'brightness-125' : ''}`}
                    style={{ height: `${(v / yMax) * 100}%` }}
                  />
                  {hover === i && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-20 whitespace-nowrap bg-[#0B0E14] border border-gray-700 rounded px-2 py-1 text-[9px] mono shadow-lg pointer-events-none">
                      <span className="text-gray-400">{xLabel(i)}</span>{' '}
                      <span className="text-white font-bold">{valLabel(i)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* X-axis ticks */}
          <div className="flex justify-between mt-2 text-[9px] text-gray-600 mono">
            {ticks.map((i) => (
              <span key={i}>{xLabel(i)}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TowTrendChart;
