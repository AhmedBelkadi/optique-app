'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, User, Phone, Mail, Plus, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAllCustomersAction } from '@/features/customers/actions/getAllCustomersAction';
import { useDebounce } from '@/hooks/useDebounce';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CustomerSelectorProps {
  onCustomerSelect: (customer: Customer) => void;
  onCreateNew: () => void;
  selectedCustomer?: Customer | null;
  disabled?: boolean;
}

export default function CustomerSelector({
  onCustomerSelect,
  onCreateNew,
  selectedCustomer,
  disabled = false
}: CustomerSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch customers when search term changes
  useEffect(() => {
    const fetchCustomers = async () => {
      // If search term is empty but dropdown is open, show recent customers
      if (debouncedSearchTerm.length === 0 && isOpen) {
        setIsLoading(true);
        setError(null);

        try {
          const result = await getAllCustomersAction({
            isDeleted: false,
            sortBy: 'updatedAt',
            sortOrder: 'desc',
            limit: 5
          });

          if (result.success && result.data) {
            setCustomers(result.data);
          } else {
            setError(result.error || 'Erreur lors de la récupération des clients');
          }
        } catch (error) {
          console.error('Error fetching recent customers:', error);
          setError('Erreur lors de la récupération des clients');
        } finally {
          setIsLoading(false);
        }
        return;
      }

      // If search term is too short, clear results
      if (debouncedSearchTerm.length < 2) {
        setCustomers([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await getAllCustomersAction({
          search: debouncedSearchTerm,
          isDeleted: false,
          sortBy: 'name',
          sortOrder: 'asc',
          limit: 10
        });

        if (result.success && result.data) {
          setCustomers(result.data);
        } else {
          setError(result.error || 'Erreur lors de la recherche');
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Erreur lors de la recherche des clients');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [debouncedSearchTerm, isOpen]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleCustomerSelect = (customer: Customer) => {
    onCustomerSelect(customer);
    setSearchTerm(customer.name);
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    onCreateNew();
    setIsOpen(false);
  };

  const handleClearSelection = () => {
    onCustomerSelect(null as any);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    if (searchTerm.length >= 2) {
      setIsOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }

    // Clear selection if user is typing
    if (selectedCustomer && value !== selectedCustomer.name) {
      onCustomerSelect(null as any);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                     <Input
             ref={inputRef}
             placeholder="Rechercher un client par nom, email ou téléphone..."
             value={searchTerm}
             onChange={handleInputChange}
             onFocus={handleInputFocus}
             disabled={disabled}
             className="pl-10 pr-10"
             autoComplete="off"
             autoCorrect="off"
             autoCapitalize="off"
             spellCheck="false"
             data-lpignore="true"
             data-form-type="other"
           />
          {selectedCustomer && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearSelection}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

                 {/* Dropdown Results */}
         {isOpen && (
           <Card 
             ref={dropdownRef}
             className="absolute top-full left-0 right-0 z-[9999] mt-1 shadow-lg border bg-background"
           >
             <CardContent className="p-0">
              <ScrollArea className="max-h-80">
                {isLoading ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Recherche en cours...</p>
                  </div>
                ) : error ? (
                  <div className="p-4 text-center">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                                 ) : customers.length === 0 ? (
                   <div className="p-4 text-center">
                     <p className="text-sm text-muted-foreground mb-3">
                       {searchTerm.length === 0
                         ? 'Cliquez pour voir les clients récents ou tapez pour rechercher'
                         : searchTerm.length < 2 
                         ? 'Tapez au moins 2 caractères pour rechercher'
                         : 'Aucun client trouvé'
                       }
                     </p>
                     <Button
                       type="button"
                       variant="default"
                       size="sm"
                       onClick={handleCreateNew}
                       className="w-full"
                     >
                       <Plus className="h-4 w-4 mr-2" />
                       Créer un nouveau client
                     </Button>
                   </div>
                ) : (
                  <div className="p-2">
                    {customers.map((customer) => (
                      <div
                        key={customer.id}
                        className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => handleCustomerSelect(customer)}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium truncate">{customer.name}</span>
                            {selectedCustomer?.id === customer.id && (
                              <Badge variant="secondary" className="text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Sélectionné
                              </Badge>
                            )}
                          </div>
                                                     <div className="flex items-center gap-4 text-sm text-muted-foreground">
                             <div className="flex items-center gap-1">
                               <Mail className="h-3 w-3" />
                               <span className="truncate">{customer.email}</span>
                             </div>
                             {customer.phone && (
                               <div className="flex items-center gap-1">
                                 <Phone className="h-3 w-3" />
                                 <span className="truncate">{customer.phone}</span>
                               </div>
                             )}
                           </div>
                          {customer.notes && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              {customer.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {/* Create New Customer Option */}
                    <div className="border-t border-border/50 mt-2 pt-2">
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={handleCreateNew}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Créer un nouveau client
                      </Button>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Selected Customer Display */}
      {selectedCustomer && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{selectedCustomer.name}</h4>
                                     <div className="flex items-center gap-4 text-sm text-muted-foreground">
                     <span>{selectedCustomer.email}</span>
                     {selectedCustomer.phone && <span>{selectedCustomer.phone}</span>}
                   </div>
                </div>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Check className="h-3 w-3 mr-1" />
                Client sélectionné
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
