import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Ticket, Plus, Trash2, Loader2, Power } from 'lucide-react';
import { format, parseISO, isAfter } from 'date-fns';

const PURPLE = '#7c3aed';

export default function CouponManager() {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    code: '',
    type: 'discount',
    price_ils: '',
    price_usd: '',
    max_uses: '',
    max_per_user: '1',
    expiration_date: ''
  });

  useEffect(() => { loadCoupons(); }, []);

  const loadCoupons = async () => {
    setIsLoading(true);
    try {
      const list = await base44.entities.Coupon.list('-created_date');
      setCoupons(list);
    } catch (e) {
      console.error('Failed to load coupons', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.price_ils || !form.price_usd) return;
    setIsSaving(true);
    try {
      const payload = {
        code: form.code.trim().toUpperCase(),
        type: 'discount',
        price_ils: Number(form.price_ils),
        price_usd: Number(form.price_usd),
        max_uses: form.max_uses === '' ? null : Number(form.max_uses),
        max_per_user: Number(form.max_per_user) || 1,
        expiration_date: form.expiration_date || null,
        is_active: true,
        used_count: 0
      };
      await base44.entities.Coupon.create(payload);
      setForm({ code: '', type: 'discount', price_ils: '', price_usd: '', max_uses: '', max_per_user: '1', expiration_date: '' });
      await loadCoupons();
    } catch (err) {
      alert('שגיאה ביצירת קופון: ' + (err.message || ''));
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (coupon) => {
    try {
      await base44.entities.Coupon.update(coupon.id, { is_active: !coupon.is_active });
      setCoupons(coupons.map(c => c.id === coupon.id ? { ...c, is_active: !coupon.is_active } : c));
    } catch (err) {
      alert('שגיאה: ' + (err.message || ''));
    }
  };

  const handleDelete = async (coupon) => {
    if (!confirm(`למחוק את הקופון "${coupon.code}"?`)) return;
    try {
      await base44.entities.Coupon.delete(coupon.id);
      setCoupons(coupons.filter(c => c.id !== coupon.id));
    } catch (err) {
      alert('שגיאה: ' + (err.message || ''));
    }
  };

  const isExpired = (c) => {
    if (!c.expiration_date) return false;
    try { return !isAfter(parseISO(c.expiration_date), new Date()); } catch { return false; }
  };

  const fmtDate = (d) => d ? format(parseISO(d), 'dd/MM/yyyy') : '—';

  return (
    <Card className="border-0 shadow-xl shadow-slate-100 mt-8">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Ticket className="w-5 h-5" style={{ color: PURPLE }} /> ניהול קופונים
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create form */}
        <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200">
          <h3 className="text-base font-semibold mb-4 text-gray-800">יצירת קופון חדש</h3>
          <form onSubmit={handleCreate}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm">קוד</Label>
                <Input value={form.code} onChange={(e) => handleChange('code', e.target.value)} placeholder="SUMMER25" className="h-10" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">סוג</Label>
                <select value={form.type} onChange={(e) => handleChange('type', e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="discount">הנחה</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">מחיר ILS ₪</Label>
                <Input type="number" value={form.price_ils} onChange={(e) => handleChange('price_ils', e.target.value)} placeholder="15" className="h-10" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">מחיר USD $</Label>
                <Input type="number" value={form.price_usd} onChange={(e) => handleChange('price_usd', e.target.value)} placeholder="5" className="h-10" required />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">מקסימום שימושים (ריק = ללא הגבלה)</Label>
                <Input type="number" value={form.max_uses} onChange={(e) => handleChange('max_uses', e.target.value)} placeholder="ללא הגבלה" className="h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">מקסימום למשתמש</Label>
                <Input type="number" value={form.max_per_user} onChange={(e) => handleChange('max_per_user', e.target.value)} placeholder="1" className="h-10" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">תאריך תפוגה (אופציונלי)</Label>
                <Input type="date" value={form.expiration_date} onChange={(e) => handleChange('expiration_date', e.target.value)} className="h-10" />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={isSaving} className="h-10 w-full text-white" style={{ background: PURPLE }}>
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Plus className="w-4 h-4 ml-2" />}
                  צור קופון
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Coupons table */}
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
        ) : coupons.length === 0 ? (
          <p className="text-center text-gray-500 py-8">אין קופונים עדיין</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="text-right">קוד</TableHead>
                  <TableHead className="text-right">סוג</TableHead>
                  <TableHead className="text-right">פרטים</TableHead>
                  <TableHead className="text-right">הגבלות</TableHead>
                  <TableHead className="text-right">תפוגה</TableHead>
                  <TableHead className="text-right">סטטוס</TableHead>
                  <TableHead className="text-right">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((c) => {
                  const expired = isExpired(c);
                  const active = c.is_active && !expired;
                  return (
                    <TableRow key={c.id}>
                      <TableCell className="font-bold text-gray-800">{c.code}</TableCell>
                      <TableCell>הנחה</TableCell>
                      <TableCell className="text-sm text-gray-600">${c.price_usd} / ₪{c.price_ils}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {c.max_uses ? `${c.used_count || 0}/${c.max_uses}` : 'ללא הגבלה'} / {c.max_per_user || 1} למשתמש
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{fmtDate(c.expiration_date)}</TableCell>
                      <TableCell>
                        {active ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">פעיל</Badge>
                        ) : expired ? (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">פג תוקף</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100">כבוי</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => toggleActive(c)} className="h-8">
                            <Power className="w-3.5 h-3.5 ml-1" />
                            {c.is_active ? 'כבוי' : 'הפעל'}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(c)} className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}