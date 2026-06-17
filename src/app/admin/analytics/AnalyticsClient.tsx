'use client';

import { useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  Calendar,
  Layers,
} from 'lucide-react';

interface BestSeller {
  name: string;
  image: string;
  quantity: number;
  totalSales: number;
}

interface SalesPoint {
  label: string;
  sales: number;
  count: number;
}

interface TrendPoint {
  date: string;
  amount: number;
  saleAmount: number;
}

interface AnalyticsClientProps {
  totalRevenue: number;
  totalOrders: number;
  customerCount: number;
  averageOrderValue: number;
  bestSellers: BestSeller[];
  monthlySales: SalesPoint[];
  dailySales: SalesPoint[];
  revenueTrend: TrendPoint[];
}

export function AnalyticsClient({
  totalRevenue,
  totalOrders,
  customerCount,
  averageOrderValue,
  bestSellers,
  monthlySales,
  dailySales,
  revenueTrend,
}: AnalyticsClientProps) {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('weekly');

  const activeSalesData = timeframe === 'weekly' ? dailySales : monthlySales;

  // Formatting helpers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // SVGs Dimensions
  const chartWidth = 500;
  const chartHeight = 220;
  const padding = 30;

  // Calculations for Active Sales Chart (Weekly / Monthly)
  const maxSales = Math.max(...activeSalesData.map((d) => d.sales), 100);
  const activeLength = activeSalesData.length;

  // Calculations for Cumulative Revenue Trend Chart
  const maxTrend = Math.max(...revenueTrend.map((d) => d.amount), 500);
  const trendLength = revenueTrend.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Title section */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
          Do'kon Analitikasi
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Sotuvlar, eng o'tgan mahsulotlar va umumiy ko'rsatkichlar tahlili.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Umumiy tushum
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950 dark:text-slate-50">
                {formatCurrency(totalRevenue)}
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600 dark:text-gold-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
            Bekor qilinmagan buyurtmalar yig'indisi
          </p>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Buyurtmalar soni
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950 dark:text-slate-50">
                {totalOrders}
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
            Barcha qabul qilingan faol buyurtmalar
          </p>
        </div>

        {/* Customer Count */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Mijozlar soni
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950 dark:text-slate-50">
                {customerCount}
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
            Ro'yxatdan o'tgan xaridorlar
          </p>
        </div>

        {/* Average Order Value */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                O'rtacha buyurtma qiymati
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950 dark:text-slate-50">
                {formatCurrency(averageOrderValue)}
              </h3>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
            Tushum / buyurtmalar nisbati
          </p>
        </div>
      </div>

      {/* Main Charts & Bestsellers Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Dynamic Sales Chart (Bar representation) */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-8">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
              Sotuvlar hajmi
            </h3>

            {/* Selector buttons */}
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setTimeframe('weekly')}
                className={`rounded px-2.5 py-1 text-xs font-semibold transition-all ${
                  timeframe === 'weekly'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-gold-400'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Haftalik (Oxirgi 7 kun)
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('monthly')}
                className={`rounded px-2.5 py-1 text-xs font-semibold transition-all ${
                  timeframe === 'monthly'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-gold-400'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                Oylik (Oxirgi 6 oy)
              </button>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="relative w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full overflow-visible"
            >
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pRatio, i) => {
                const yPos = padding + pRatio * (chartHeight - 2 * padding);
                const val = maxSales * (1 - pRatio);
                return (
                  <g key={i}>
                    <line
                      x1={padding * 1.5}
                      y1={yPos}
                      x2={chartWidth - padding}
                      y2={yPos}
                      stroke="#475569"
                      strokeWidth="0.5"
                      strokeDasharray="4 4"
                      opacity="0.2"
                    />
                    <text
                      x={padding * 1.2}
                      y={yPos + 4}
                      fill="#94a3b8"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="end"
                    >
                      {formatCurrency(val)}
                    </text>
                  </g>
                );
              })}

              {/* Draw Bars */}
              {activeSalesData.map((d, index) => {
                const usableWidth = chartWidth - padding * 2.5;
                const barSpacing = usableWidth / activeLength;
                const barWidth = Math.max(barSpacing * 0.5, 8);
                const xPos = padding * 1.8 + index * barSpacing + (barSpacing - barWidth) / 2;
                
                const barHeight = ((d.sales || 0) / maxSales) * (chartHeight - 2 * padding);
                const yPos = chartHeight - padding - barHeight;

                return (
                  <g key={index} className="group">
                    <rect
                      x={xPos}
                      y={yPos}
                      width={barWidth}
                      height={Math.max(barHeight, 3)}
                      rx={4}
                      fill="url(#barGrad)"
                      className="transition-all duration-300 hover:fill-amber-500"
                    />
                    {/* Tooltip on hover */}
                    <text
                      x={xPos + barWidth / 2}
                      y={yPos - 6}
                      fill="#d97706"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      {formatCurrency(d.sales)}
                    </text>
                    {/* Labels */}
                    <text
                      x={xPos + barWidth / 2}
                      y={chartHeight - padding + 16}
                      fill="#64748b"
                      fontSize="9"
                      fontWeight="semibold"
                      textAnchor="middle"
                    >
                      {d.label.split(' ')[0]}
                    </text>
                  </g>
                );
              })}

              {/* Bottom Baseline */}
              <line
                x1={padding * 1.5}
                y1={chartHeight - padding}
                x2={chartWidth - padding}
                y2={chartHeight - padding}
                stroke="#64748b"
                strokeWidth="1.5"
                opacity="0.3"
              />
            </svg>
          </div>
        </div>

        {/* Top Products Bestsellers */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Package className="h-4.5 w-4.5 text-amber-500" /> Eng ko'p sotilganlar
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sotilgan donalar soni bo'yicha top 5 mahsulot
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {bestSellers.length === 0 ? (
              <p className="py-6 text-center text-xs text-slate-400">
                Ma'lumotlar mavjud emas
              </p>
            ) : (
              bestSellers.map((prod, index) => {
                const maxQty = Math.max(...bestSellers.map((b) => b.quantity), 1);
                const percent = (prod.quantity / maxQty) * 100;
                return (
                  <div key={index} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 dark:bg-slate-850 dark:text-slate-400">
                          {index + 1}
                        </span>
                        <span className="truncate font-medium text-slate-800 dark:text-slate-200">
                          {prod.name}
                        </span>
                      </div>
                      <span className="shrink-0 font-semibold text-slate-950 dark:text-slate-100">
                        {prod.quantity} dona
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Revenue Growth Trend Chart (Area representations) */}
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-12">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
              Daromad Trendi (Jamg'arib boriladigan)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Buyurtmalar kelib tushishi bo'yicha tushumning o'sish dinamikasi
            </p>
          </div>

          {/* SVG Line / Area Chart */}
          <div className="relative w-full overflow-hidden">
            {revenueTrend.length < 2 ? (
              <p className="py-12 text-center text-xs text-slate-400">
                Ma'lumot kamligi sababli grafik ko'rsatilmadi
              </p>
            ) : (
              <svg
                viewBox={`0 0 ${chartWidth * 1.5} ${chartHeight}`}
                className="w-full overflow-visible"
              >
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pRatio, i) => {
                  const yPos = padding + pRatio * (chartHeight - 2 * padding);
                  const val = maxTrend * (1 - pRatio);
                  return (
                    <g key={i}>
                      <line
                        x1={padding * 1.5}
                        y1={yPos}
                        x2={chartWidth * 1.5 - padding}
                        y2={yPos}
                        stroke="#475569"
                        strokeWidth="0.5"
                        strokeDasharray="4 4"
                        opacity="0.2"
                      />
                      <text
                        x={padding * 1.2}
                        y={yPos + 4}
                        fill="#94a3b8"
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="end"
                      >
                        {formatCurrency(val)}
                      </text>
                    </g>
                  );
                })}

                {/* Calculate points path coordinates */}
                {(() => {
                  const chartW = chartWidth * 1.5;
                  const usableWidth = chartW - padding * 2.5;
                  const stepX = usableWidth / (trendLength - 1);
                  const stepY = (chartHeight - padding * 2);

                  const points = revenueTrend.map((d, index) => {
                    const x = padding * 1.8 + index * stepX;
                    const y = chartHeight - padding - (d.amount / maxTrend) * stepY;
                    return { x, y, ...d };
                  });

                  const linePath = points
                    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
                    .join(' ');
                  
                  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

                  return (
                    <g>
                      {/* Area Fill */}
                      <path d={areaPath} fill="url(#areaGrad)" />

                      {/* Line Stroke */}
                      <path
                        d={linePath}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Dots on hover nodes */}
                      {points.map((p, i) => (
                        <g key={i} className="group">
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r="4.5"
                            fill="#10b981"
                            stroke="#ffffff"
                            strokeWidth="2"
                            className="cursor-pointer hover:r-6 transition-all"
                          />
                          {/* Tooltip */}
                          <text
                            x={p.x}
                            y={p.y - 10}
                            fill="#10b981"
                            fontSize="9"
                            fontWeight="bold"
                            textAnchor="middle"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            {formatCurrency(p.amount)}
                          </text>
                          {/* Label bottom */}
                          {i % Math.ceil(trendLength / 6) === 0 && (
                            <text
                              x={p.x}
                              y={chartHeight - padding + 16}
                              fill="#64748b"
                              fontSize="8"
                              fontWeight="semibold"
                              textAnchor="middle"
                            >
                              {p.date}
                            </text>
                          )}
                        </g>
                      ))}
                    </g>
                  );
                })()}

                {/* Baseline */}
                <line
                  x1={padding * 1.5}
                  y1={chartHeight - padding}
                  x2={chartWidth * 1.5 - padding}
                  y2={chartHeight - padding}
                  stroke="#64748b"
                  strokeWidth="1.5"
                  opacity="0.3"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
