import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Loader2 } from 'lucide-react';

function downloadBase64Xlsx(base64, filename) {
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function ExportSamples() {
  const [loading, setLoading] = useState(null);

  const handleDownload = async (lang) => {
    setLoading(lang);
    try {
      const res = await base44.functions.invoke('generateQuestionnaireExcelSample', { lang });
      downloadBase64Xlsx(res.data.base64, res.data.filename);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-16">
      <Card className="border-0 shadow-xl shadow-slate-100">
        <CardContent className="p-8 space-y-4">
          <h1 className="text-xl font-bold text-slate-800">Questionnaire Export Samples</h1>
          <p className="text-sm text-slate-500">
            Sample .xlsx files with header + one example row, matching the current CreateStory questionnaire field-for-field, for review before connecting them as the real export.
          </p>
          <Button onClick={() => handleDownload('he')} disabled={loading === 'he'} className="w-full h-12 rounded-xl">
            {loading === 'he' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download Hebrew Sample (.xlsx)
          </Button>
          <Button onClick={() => handleDownload('en')} disabled={loading === 'en'} variant="outline" className="w-full h-12 rounded-xl">
            {loading === 'en' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download English Sample (.xlsx)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}