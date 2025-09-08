'use client';

import { useState } from 'react';
import { Edit, Trash2, RotateCcw, Eye, Mail, Phone, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Customer } from '@/features/customers/schema/customerSchema';
import { softDeleteCustomerAction } from '@/features/customers/actions/softDeleteCustomer';
import { restoreCustomerAction } from '@/features/customers/actions/restoreCustomer';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { formatDateShort } from '@/lib/shared/utils/dateUtils';
import { useCSRF } from '@/components/common/CSRFProvider';

interface CustomerTableProps {
  customers: Customer[];
  onDelete?: (customerId: string) => void;
  onUpdate?: (updatedCustomer: Customer) => void;
}

export default function CustomerTable({ customers, onDelete, onUpdate }: CustomerTableProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const { csrfToken } = useCSRF();

  const handleDelete = async (id: string) => {
    if (!csrfToken) {
      toast.error('CSRF token not available. Please refresh the page.');
      return;
    }

    setIsLoading(id);
    try {
      // Create FormData with customerId and CSRF token
      const formData = new FormData();
      formData.append('customerId', id);
      formData.append('csrf_token', csrfToken);
      
      const result = await softDeleteCustomerAction(null, formData);
      if (result.success) {
        toast.success('Customer deleted successfully!', {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
        onDelete?.(id);
      } else {
        toast.error(result.error || 'Failed to delete customer', {
          icon: '❌',
          style: {
            background: '#ef4444',
            color: '#ffffff',
          },
        });
      }
    } catch (error) {
      toast.error('Failed to delete customer', {
        icon: '❌',
        style: {
          background: '#ef4444',
          color: '#ffffff',
        },
      });
    } finally {
      setIsLoading(null);
      setConfirmDeleteId(null);
    }
  };

  const handleRestore = async (id: string) => {
    if (!csrfToken) {
      toast.error('CSRF token not available. Please refresh the page.');
      return;
    }

    setIsLoading(id);
    try {
      // Create FormData with customerId and CSRF token
      const formData = new FormData();
      formData.append('customerId', id);
      formData.append('csrf_token', csrfToken);
      
      const result = await restoreCustomerAction(null, formData);
      if (result.success) {
        toast.success('Customer restored successfully!', {
          icon: '✅',
          style: {
            background: '#10b981',
            color: '#ffffff',
          },
        });
        onUpdate?.(customers.find(c => c.id === id)!);
      } else {
        toast.error(result.error || 'Failed to restore customer', {
          icon: '❌',
          style: {
            background: '#ef4444',
            color: '#ffffff',
          },
        });
      }
    } catch (error) {
      toast.error('Failed to restore customer', {
        icon: '❌',
        style: {
          background: '#ef4444',
          color: '#ffffff',
        },
      });
    } finally {
      setIsLoading(null);
    }
  };

  const formatDate = (date: Date) => {
    return formatDateShort(date);
  };

  return (
    <div className="bg-background rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Appointments</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{customer.name}</div>
                  {customer.address && (
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {customer.address}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <Mail className="w-3 h-3 mr-1 text-muted-foreground/60" />
                    {customer.email}
                  </div>
                  {customer.phone && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="w-3 h-3 mr-1" />
                      {customer.phone}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {customer._count?.appointments || 0} appointments
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(customer.createdAt)}
              </TableCell>
              <TableCell>
                {customer.isDeleted ? (
                  <Badge variant="destructive">Deleted</Badge>
                ) : (
                  <Badge variant="default">Active</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/customers/${customer.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/customers/${customer.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Customer
                      </Link>
                    </DropdownMenuItem>
                    {customer.isDeleted ? (
                      <DropdownMenuItem
                        onClick={() => handleRestore(customer.id)}
                        disabled={isLoading === customer.id}
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Restore
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => setConfirmDeleteId(customer.id)}
                        disabled={isLoading === customer.id}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation */}
      <AlertDialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <AlertDialogContent className="sm:max-w-md w-[95vw] sm:w-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le client</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action va marquer ce client comme supprimé. Vous pourrez le restaurer plus tard.
              Confirmez-vous la suppression ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-gray-300 text-black font-medium py-2 px-6 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 transition-all duration-200"
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 