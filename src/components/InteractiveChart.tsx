import React, { useRef } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useHorizontalInView } from '../hooks/useHorizontalInView';

interface ChartProps {
  type: 'area' | 'bar' | 'line';
  data: any[];
  dataKey: string;
  xAxisKey: string;
  color: string;
}

export function InteractiveChart({ type, data, dataKey, xAxisKey, color }: ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useHorizontalInView(containerRef);

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart key={`area-${inView}`} data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" vertical={false} />
            <XAxis dataKey={xAxisKey} stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} tickMargin={10} />
            <YAxis stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} tickMargin={10} width={40} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: color }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={3}
              fill={color} 
              fillOpacity={0.3} 
              isAnimationActive={inView}
              animationDuration={1500}
            />
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart key={`bar-${inView}`} data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" vertical={false} />
            <XAxis dataKey={xAxisKey} stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} tickMargin={10} />
            <YAxis stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} tickMargin={10} width={40} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: color }}
              cursor={{ fill: '#ffffff10' }}
            />
            <Bar 
              dataKey={dataKey} 
              fill={color} 
              radius={[4, 4, 0, 0]}
              isAnimationActive={inView}
              animationDuration={1500}
            />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart key={`line-${inView}`} data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" vertical={false} />
            <XAxis dataKey={xAxisKey} stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} tickMargin={10} />
            <YAxis stroke="#ffffff50" tick={{ fill: '#ffffff50', fontSize: 12 }} tickMargin={10} width={40} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
              itemStyle={{ color: color }}
            />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={3}
              dot={{ fill: color, r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
              isAnimationActive={inView}
              animationDuration={1500}
            />
          </LineChart>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
