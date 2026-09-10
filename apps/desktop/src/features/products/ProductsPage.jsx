import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/crm/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/crm/StatusBadge';
import { api } from '../../services/api';
import { Package, Plus, DollarSign, Tag } from 'lucide-react';

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.products.getAll().then(setProducts);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products & Services Catalog"
        subtitle="Manage product SKUs, subscription tiers, and unit prices for deals & invoices."
        breadcrumbs={['CRM', 'Products']}
        actions={<Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>Add Product SKU</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((prod) => (
          <Card key={prod.id} className="flex flex-col justify-between p-5 border border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[11px] font-extrabold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 rounded">
                  {prod.sku}
                </span>
                <StatusBadge status={prod.status} />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mt-3">{prod.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{prod.description}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-2xl font-black text-slate-900 dark:text-slate-100">${prod.price}</span>
                <span className="text-xs text-slate-400 font-medium"> /{prod.billingType.toLowerCase()}</span>
              </div>
              <Button variant="outline" size="sm">Edit SKU</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
