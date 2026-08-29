import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  UserCheck, 
  Clock, 
  Calendar, 
  Layers,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { Member } from '../../types';

export interface DashboardWidgetProps {
  members: Member[];
  className?: string;
  title?: string;
  subtitle?: string;
  showSummaryCards?: boolean;
}

type ViewMode = 'cumulative' | 'monthly' | 'status_breakdown';
type TimeRange = 'ALL' | '12M' | '6M' | 'YEARS';

interface MonthDataPoint {
  period: string; // e.g. "Jan 2026" or "2024"
  label: string;
  rawDate: Date;
  newRegistrations: number;
  activeCount: number;
  pendingCount: number;
  cumulativeTotal: number;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  members = [],
  className = '',
  title = 'Pertumbuhan Keanggotaan Saka Pariwisata',
  subtitle = 'Visualisasi tren pendaftaran dan akumulasi kader secara berkala',
  showSummaryCards = true
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('cumulative');
  const [timeRange, setTimeRange] = useState<TimeRange>('12M');
  const [selectedKrida, setSelectedKrida] = useState<string>('ALL');

  // Filter members by selected Krida if any
  const filteredMembers = useMemo(() => {
    if (selectedKrida === 'ALL') return members;
    return members.filter(m => m.krida === selectedKrida);
  }, [members, selectedKrida]);

  // Aggregate membership growth data over time
  const chartData = useMemo(() => {
    if (!filteredMembers || filteredMembers.length === 0) {
      // Provide a structured baseline timeline if database is initially empty
      const now = new Date();
      const baseline: MonthDataPoint[] = [];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
      
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = months[d.getMonth()];
        const year = d.getFullYear();
        baseline.push({
          period: `${monthName} ${year}`,
          label: `${monthName} '${String(year).slice(2)}`,
          rawDate: d,
          newRegistrations: 0,
          activeCount: 0,
          pendingCount: 0,
          cumulativeTotal: 0
        });
      }
      return baseline;
    }

    // Sort members chronologically by registration date or joinYear
    const sorted = [...filteredMembers].map(m => {
      let regDate: Date;
      if (m.registeredAt) {
        const parsed = new Date(m.registeredAt);
        regDate = isNaN(parsed.getTime()) ? new Date(m.joinYear || 2024, 0, 1) : parsed;
      } else if (m.joinYear) {
        regDate = new Date(m.joinYear, 0, 1);
      } else {
        regDate = new Date();
      }
      return { ...m, parsedDate: regDate };
    }).sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

    // Aggregate by Year-Month
    const monthMap = new Map<string, {
      period: string;
      label: string;
      rawDate: Date;
      newRegistrations: number;
      activeCount: number;
      pendingCount: number;
    }>();

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

    // If timeRange is YEARS, group by Year instead
    if (timeRange === 'YEARS') {
      const yearMap = new Map<string, {
        period: string;
        label: string;
        rawDate: Date;
        newRegistrations: number;
        activeCount: number;
        pendingCount: number;
      }>();

      sorted.forEach(m => {
        const y = String(m.parsedDate.getFullYear());
        if (!yearMap.has(y)) {
          yearMap.set(y, {
            period: `Tahun ${y}`,
            label: y,
            rawDate: new Date(m.parsedDate.getFullYear(), 0, 1),
            newRegistrations: 0,
            activeCount: 0,
            pendingCount: 0
          });
        }
        const bucket = yearMap.get(y)!;
        bucket.newRegistrations += 1;
        if (m.status === 'ACTIVE') bucket.activeCount += 1;
        if (m.status === 'PENDING') bucket.pendingCount += 1;
      });

      // Sort by year and compute cumulative total
      const sortedYears = Array.from(yearMap.values()).sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
      let runningTotal = 0;
      return sortedYears.map(item => {
        runningTotal += item.newRegistrations;
        return {
          ...item,
          cumulativeTotal: runningTotal
        };
      });
    }

    // Determine the min date and max date range for monthly view
    const now = new Date();
    let startMonthOffset = 11; // default 12M
    if (timeRange === '6M') startMonthOffset = 5;
    if (timeRange === 'ALL') startMonthOffset = 23; // up to 24 months

    // Pre-populate months to ensure continuous timeline
    for (let i = startMonthOffset; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = monthNames[d.getMonth()];
      const yearShort = String(d.getFullYear()).slice(2);
      
      monthMap.set(key, {
        period: `${monthLabel} ${d.getFullYear()}`,
        label: `${monthLabel} '${yearShort}`,
        rawDate: d,
        newRegistrations: 0,
        activeCount: 0,
        pendingCount: 0
      });
    }

    // Distribute members into month buckets
    sorted.forEach(m => {
      const d = m.parsedDate;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthMap.has(key)) {
        const bucket = monthMap.get(key)!;
        bucket.newRegistrations += 1;
        if (m.status === 'ACTIVE') bucket.activeCount += 1;
        if (m.status === 'PENDING') bucket.pendingCount += 1;
      } else {
        // If outside pre-populated window but within ALL range, add if needed
        if (timeRange === 'ALL') {
          const monthLabel = monthNames[d.getMonth()];
          const yearShort = String(d.getFullYear()).slice(2);
          monthMap.set(key, {
            period: `${monthLabel} ${d.getFullYear()}`,
            label: `${monthLabel} '${yearShort}`,
            rawDate: new Date(d.getFullYear(), d.getMonth(), 1),
            newRegistrations: 1,
            activeCount: m.status === 'ACTIVE' ? 1 : 0,
            pendingCount: m.status === 'PENDING' ? 1 : 0
          });
        }
      }
    });

    // Convert map to sorted array & calculate running cumulative totals
    const sortedBuckets = Array.from(monthMap.values()).sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
    let cumulative = 0;
    
    // Count any members that registered before the timeline window to initialize baseline
    const firstBucketDate = sortedBuckets[0]?.rawDate;
    if (firstBucketDate) {
      const priorCount = sorted.filter(m => m.parsedDate.getTime() < firstBucketDate.getTime()).length;
      cumulative = priorCount;
    }

    return sortedBuckets.map(b => {
      cumulative += b.newRegistrations;
      return {
        ...b,
        cumulativeTotal: cumulative
      };
    });
  }, [filteredMembers, timeRange]);

  // Overall Statistics
  const totalRegistered = filteredMembers.length;
  const totalActive = filteredMembers.filter(m => m.status === 'ACTIVE').length;
  const totalPending = filteredMembers.filter(m => m.status === 'PENDING').length;
  const approvalRate = totalRegistered > 0 ? Math.round((totalActive / totalRegistered) * 100) : 0;

  // Growth in the last active period
  const latestBucket = chartData[chartData.length - 1];
  const prevBucket = chartData[chartData.length - 2];
  const periodGrowth = latestBucket?.newRegistrations ?? 0;
  const growthRatePct = prevBucket && prevBucket.newRegistrations > 0
    ? Math.round(((periodGrowth - prevBucket.newRegistrations) / prevBucket.newRegistrations) * 100)
    : (periodGrowth > 0 ? 100 : 0);

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: MonthDataPoint = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl border border-slate-800 shadow-2xl text-xs space-y-2 min-w-[190px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-emerald-400 font-heading">{data.period}</span>
            <span className="text-[10px] text-slate-400 font-mono">Periode</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Total Akumulasi:
              </span>
              <span className="font-bold font-mono text-white text-xs">
                {data.cumulativeTotal.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                Pendaftaran Baru:
              </span>
              <span className="font-bold font-mono text-teal-300">
                +{data.newRegistrations}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                Status Aktif:
              </span>
              <span className="font-bold font-mono text-indigo-200">
                {data.activeCount}
              </span>
            </div>

            {data.pendingCount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Status Pending:
                </span>
                <span className="font-bold font-mono text-amber-300">
                  {data.pendingCount}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-5 ${className}`}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-800 rounded-full text-[10px] font-bold tracking-wide uppercase">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>Statistik Dinamis</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-heading tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-500">
            {subtitle}
          </p>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setTimeRange('6M')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer text-[11px] ${
                timeRange === '6M'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              6 Bln
            </button>
            <button
              onClick={() => setTimeRange('12M')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer text-[11px] ${
                timeRange === '12M'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              12 Bln
            </button>
            <button
              onClick={() => setTimeRange('YEARS')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer text-[11px] ${
                timeRange === 'YEARS'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Tahunan
            </button>
            <button
              onClick={() => setTimeRange('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer text-[11px] ${
                timeRange === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              Semua
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
            <button
              onClick={() => setViewMode('cumulative')}
              title="Grafik Tren Akumulasi Total"
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer text-[11px] flex items-center gap-1 ${
                viewMode === 'cumulative'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Akumulasi</span>
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              title="Grafik Pendaftaran Baru per Periode"
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer text-[11px] flex items-center gap-1 ${
                viewMode === 'monthly'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pendaftaran</span>
            </button>
            <button
              onClick={() => setViewMode('status_breakdown')}
              title="Komposisi Status Aktif vs Pending"
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer text-[11px] flex items-center gap-1 ${
                viewMode === 'status_breakdown'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Status</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      {showSummaryCards && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total Kader */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold">Total Terdata</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-extrabold font-heading text-slate-900">
                {totalRegistered.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-slate-500">Anggota</span>
            </div>
          </div>

          {/* Kader Aktif */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold">Status Aktif</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-100/70 text-indigo-700 flex items-center justify-center">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-extrabold font-heading text-indigo-950">
                {totalActive.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 font-mono">
                {approvalRate}%
              </span>
            </div>
          </div>

          {/* Menunggu Verifikasi */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold">Menunggu Review</span>
              <div className="w-7 h-7 rounded-lg bg-amber-100/70 text-amber-700 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-extrabold font-heading text-amber-900">
                {totalPending.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-amber-700">Calon</span>
            </div>
          </div>

          {/* Tren Terkini */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold">Pertumbuhan Periode</span>
              <div className="w-7 h-7 rounded-lg bg-teal-100/70 text-teal-700 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-extrabold font-heading text-teal-950">
                +{periodGrowth}
              </span>
              <span className="text-[10px] font-bold text-teal-600 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {growthRatePct}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Recharts Visualization Canvas */}
      <div className="w-full h-64 sm:h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'cumulative' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} 
              />
              <Area
                type="monotone"
                name="Total Akumulasi Anggota"
                dataKey="cumulativeTotal"
                stroke="#059669"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#growthGradient)"
                activeDot={{ r: 6, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                name="Anggota Aktif Terverifikasi"
                dataKey="activeCount"
                stroke="#6366f1"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#activeGradient)"
              />
            </AreaChart>
          ) : viewMode === 'monthly' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} 
              />
              <Bar
                name="Pendaftaran Baru"
                dataKey="newRegistrations"
                fill="#0d9488"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} 
              />
              <Bar
                name="Aktif (Disetujui)"
                dataKey="activeCount"
                stackId="status"
                fill="#10b981"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                name="Menunggu Verifikasi (Pending)"
                dataKey="pendingCount"
                stackId="status"
                fill="#f59e0b"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Notes & Insights */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span>Data disinkronkan secara real-time dengan database keanggotaan & spreadsheet.</span>
        </div>
        <div className="font-medium text-slate-600">
          Rata-rata registrasi: <strong className="text-slate-900">{chartData.length > 0 ? (totalRegistered / chartData.length).toFixed(1) : 0}</strong> /periode
        </div>
      </div>
    </div>
  );
};
