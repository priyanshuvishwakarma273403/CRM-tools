import React from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FileBox, Upload, FileText, Download, Trash2, HardDrive } from 'lucide-react';

export const FilesPage = () => {
  const files = [
    { id: 1, name: 'Apex_Global_SLA_Master_Agreement_v3.pdf', size: '2.4 MB', type: 'PDF Document', uploadedBy: 'Marcus Chen', date: '2026-09-02', entity: 'Deal: Apex Global' },
    { id: 2, name: 'CloudScale_Architecture_Diagram.png', size: '4.1 MB', type: 'PNG Image', uploadedBy: 'Sarah Jenkins', date: '2026-08-28', entity: 'Lead: CloudScale' },
    { id: 3, name: 'BioGenix_Security_Compliance_Attestation.pdf', size: '1.8 MB', type: 'PDF Document', uploadedBy: 'Elena Rostova', date: '2026-08-15', entity: 'Company: BioGenix' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Files & Attachment Vault"
        subtitle="S3 & MinIO compatible object storage abstraction for deal contracts & collateral."
        breadcrumbs={['CRM', 'Files Vault']}
        actions={<Button variant="primary" size="sm" leftIcon={<Upload className="w-4 h-4" />}>Upload Document</Button>}
      />

      <Card className="p-4 bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HardDrive className="w-6 h-6 text-brand-600" />
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">AWS S3 / Cloudflare R2 / Local Filesystem Abstraction</h4>
            <p className="text-xs text-slate-500">Storage abstraction provider configured for multi-tenant bucket isolation.</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {files.map((file) => (
          <Card key={file.id} className="p-4 flex flex-col justify-between border border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">{file.name}</h4>
                  <p className="text-[11px] text-slate-400">{file.size} • {file.type}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3">Ref: {file.entity}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">By {file.uploadedBy}</span>
              <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />}>Download</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
