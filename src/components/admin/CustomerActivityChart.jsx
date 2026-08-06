import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, startOfDay, startOfWeek, addDays, addWeeks, subDays } from 'date-fns';
import { TrendingUp } from 'lucide-react';

const RANGE_PRESETS = [
  { key: '7', label: '7 ימים', days: 7 },
  { key: '30', label: '30 ימים', days: 30 },
  { key: '90', label: '90 ימים', days: 90 },
  { key: 'custom', label: 'טווח מותאם', days: null },
];

function buildBuckets(start, end, granularity) {
  const buckets = [];
  let cursor = granularity === 'week' ? startOfWeek(start, { weekStartsOn: 0 }) : startOfDay(start);
  const endBoundary = startOfDay(end);
  while (cursor <= endBoundary) {
    const next = granularity === 'week' ? addWeeks(cursor, 1) : addDays(cursor, 1);
    buckets.push({ start: cursor, end: next, label: format(cursor, granularity === 'week' ? 'dd/MM' : 'dd/MM') });
    cursor = next;
  }
  return buckets;
}

export default function CustomerActivityChart({ users = [] }) {
  const [rangeKey, setRangeKey] = useState('30');
  const [customStart, setCustomStart] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [customEnd, setCustomEnd] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [metric, setMetric] = useState('signups'); // 'signups' | 'logins'
  const [granularity, setGranularity] = useState('day'); // 'day' | 'week'

  const { start, end } = useMemo(() => {
    const preset = RANGE_PRESETS.find((r) => r.key === rangeKey);
    if (preset?.days) {
      return { start: startOfDay(subDays(new Date(), preset.days - 1)), end: new Date() };
    }
    return { start: startOfDay(new Date(customStart)), end: new Date(customEnd) };
  }, [rangeKey, customStart, customEnd]);

  const usersWithLogin = useMemo(() => users.filter((u) => !!u.last_login).length, [users]);

  const chartData = useMemo(() => {
    const buckets = buildBuckets(start, end, granularity);
    const field = metric === 'signups' ? 'created_date' : 'last_login';
    return buckets.map((b) => {
      const count = users.filter((u) => {
        const raw = u[field];
        if (!raw) return false;
        const d = new Date(raw);
        return d >= b.start && d < b.end;
      }).length;
      return { label: b.label, count };
    });
  }, [users, start, end, granularity, metric]);

  return (
    <Card className="border-0 shadow-xl shadow-slate-100 mb-8">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5" /> פעילות משתמשים לאורך זמן
        </CardTitle>
        <p className="text-sm text-gray-500">
          {metric === 'logins'
            ? `מבוסס על מועד ההתחברות האחרון (last_login). מתוך ${users.length} משתמשים, ${usersWithLogin} כבר נרשמו לרישום התחברות (מעקב חדש, נתונים היסטוריים לא קיימים).`
            : 'מבוסס על תאריך יצירת החשבון.'}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            <button onClick={() => setMetric('signups')} className={`px-3 py-1.5 text-sm ${metric === 'signups' ? 'bg-slate-800 text-white' : 'bg-white text-gray-600'}`}>הרשמות</button>
            <button onClick={() => setMetric('logins')} className={`px-3 py-1.5 text-sm ${metric === 'logins' ? 'bg-slate-800 text-white' : 'bg-white text-gray-600'}`}>התחברויות</button>
          </div>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            <button onClick={() => setGranularity('day')} className={`px-3 py-1.5 text-sm ${granularity === 'day' ? 'bg-slate-800 text-white' : 'bg-white text-gray-600'}`}>יומי</button>
            <button onClick={() => setGranularity('week')} className={`px-3 py-1.5 text-sm ${granularity === 'week' ? 'bg-slate-800 text-white' : 'bg-white text-gray-600'}`}>שבועי</button>
          </div>
          <div className="flex rounded-xl border border-gray-200 overflow-hidden">
            {RANGE_PRESETS.map((r) => (
              <button key={r.key} onClick={() => setRangeKey(r.key)}
                className={`px-3 py-1.5 text-sm ${rangeKey === r.key ? 'bg-amber-500 text-white' : 'bg-white text-gray-600'}`}>
                {r.label}
              </button>
            ))}
          </div>
          {rangeKey === 'custom' && (
            <div className="flex items-center gap-2">
              <Input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="w-auto" />
              <span className="text-gray-400 text-sm">עד</span>
              <Input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="w-auto" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill={metric === 'signups' ? '#1C2A48' : '#FDB654'} radius={[4, 4, 0, 0]} name={metric === 'signups' ? 'הרשמות' : 'התחברויות'} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 max-h-56 overflow-y-auto border border-gray-100 rounded-xl">
          <Table>
            <TableHeader>
              <TableRow className="sticky top-0 bg-white z-10">
                <TableHead className="text-right">תאריך</TableHead>
                <TableHead className="text-right">{metric === 'signups' ? 'הרשמות' : 'התחברויות'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartData.map((row) => (
                <TableRow key={row.label}>
                  <TableCell className="text-sm">{row.label}</TableCell>
                  <TableCell className="font-medium">{row.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}