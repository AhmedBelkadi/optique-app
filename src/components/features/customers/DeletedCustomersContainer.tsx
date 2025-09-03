'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, RotateCcw } from 'lucide-react';
import { Customer } from '@/features/customers/schema/customerSchema';
import { restoreCustomerAction } from '@/features/customers/actions/restoreCustomer';
import { formatDateShort } from '@/lib/shared/utils/dateUtils';
import { useCSRF } from '@/components/common/CSRFProvider';

interface DeletedCustomersContainerProps {
  initialDeletedCustomers: Customer[];
}

export default function DeletedCustomersContainer({ initialDeletedCustomers }: DeletedCustomersContainerProps) {
  const [deletedCustomers, setDeletedCustomers] = useState<Customer[]>(initialDeletedCustomers);
  const [restoring, setRestoring] = useState<string | null>(null);
  const { csrfToken } = useCSRF();

  const handleRestore = async (customerId: string) => {
    if (!csrfToken) {
      toast.error('CSRF token not available. Please refresh the page.');
      return;
    }

    setRestoring(customerId);
    try {
      // Create FormData with customerId and CSRF token
      const formData = new FormData();
      formData.append('customerId', customerId);
      formData.append('csrf_token', csrfToken);
      
      const result = await restoreCustomerAction(null, formData);
      
      if (result.success) {
        setDeletedCustomers(prev => prev.filter(c => c.id !== customerId));
        toast.success('Customer restored successfully!', {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
      } else {
        toast.error(result.error || 'Failed to restore customer');
      }
    } catch (error) {
      console.error('Error restoring customer:', error);
      toast.error('Failed to restore customer');
    } finally {
      setRestoring(null);
    }
  };

  if (deletedCustomers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground/60 text-6xl mb-4">🗑️</div>
        <h3 className="text-lg font-medium text-foreground mb-2">No deleted customers</h3>
        <p className="text-muted-foreground">Deleted customers will appear here and can be restored.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Deleted Customers ({deletedCustomers.length})</h2>
      </div>

      <div className="grid gap-4">
        {deletedCustomers.map((customer) => (
          <Card key={customer.id} className="border-destructive/20 bg-destructive/5">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {customer.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      Customer
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Deleted on {formatDateShort(customer.deletedAt!)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRestore(customer.id)}
                  disabled={restoring === customer.id}
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  {restoring === customer.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                  ) : (
                    <RotateCcw className="w-4 h-4 mr-2" />
                  )}
                  Restore
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-3 h-3" />
                  {customer.email}
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    {customer.phone}
                  </div>
                )}
                {customer.address && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {customer.address}
                  </p>
                )}
                {customer.notes && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    <span className="font-medium">Notes:</span> {customer.notes}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
