import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Users, Star } from 'lucide-react';

export default function CustomersTab({ customers, onSelect }) {
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);

  const filtered = customers.filter((c) =>
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.name || '').toLowerCase().includes(search.toLowerCase())
  );
  const visible = showAll ? filtered : filtered.slice(0, 10);

  return (
    <Card className="border-0 shadow-xl shadow-slate-100 mb-8">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="w-5 h-5" /> Customers
          <Badge className="ml-2 bg-slate-100 text-slate-600">{customers.length}</Badge>
        </CardTitle>
        <p className="text-sm text-gray-500">One unified view per customer email — click a row for full details.</p>
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No customers found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-slate-100">
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Credits</th>
                  <th className="py-2 pr-4">Stories</th>
                  <th className="py-2 pr-4">Kita Alef</th>
                  <th className="py-2 pr-4">Tags</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((c) => (
                  <tr key={c.email} onClick={() => onSelect(c.email)} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                    <td className="py-2 pr-4 font-medium text-slate-700">{c.email}</td>
                    <td className="py-2 pr-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        {c.credits}
                      </div>
                    </td>
                    <td className="py-2 pr-4">{c.stories.length}</td>
                    <td className="py-2 pr-4">{c.kitaStories.length}</td>
                    <td className="py-2 pr-4">
                      <div className="flex flex-wrap gap-1">
                        {c.allTags.slice(0, 3).map((tag) => (
                          <Badge key={tag} className="bg-violet-50 text-violet-600 hover:bg-violet-50 text-xs">{tag}</Badge>
                        ))}
                        {c.allTags.length > 3 && <span className="text-xs text-gray-400">+{c.allTags.length - 3}</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {filtered.length > 10 && (
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={() => setShowAll(!showAll)} className="rounded-xl">
              {showAll ? 'Show less' : `Show all customers (${filtered.length})`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}