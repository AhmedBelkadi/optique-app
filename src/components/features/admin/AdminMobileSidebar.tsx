'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminNavItem from './AdminNavItem';
import { filterNavigationByRole } from './navigationConfig';


interface AdminMobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
}

export default function AdminMobileSidebar({ isOpen, onClose, user }: AdminMobileSidebarProps) {
  const pathname = usePathname();
  
  // Scroll indicators
  const [showTopIndicator, setShowTopIndicator] = useState(false);
  const [showBottomIndicator, setShowBottomIndicator] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  
  // Initialize collapsed state based on defaultCollapsed property
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    filterNavigationByRole(user).forEach(group => {
      if (group.defaultCollapsed) {
        initial.add(group.title);
      }
    });
    return initial;
  });

  const navGroups = filterNavigationByRole(user);

  const toggleGroup = (groupTitle: string) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupTitle)) {
        newSet.delete(groupTitle);
      } else {
        newSet.add(groupTitle);
      }
      return newSet;
    });
  };

  // Handle scroll indicators
  const handleScroll = () => {
    if (!navRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = navRef.current;
    const scrollPercentage = scrollTop / (scrollHeight - clientHeight);
    
    setShowTopIndicator(scrollTop > 10);
    setShowBottomIndicator(scrollPercentage < 0.95);
  };

  // Check scroll indicators on mount and content change
  useEffect(() => {
    if (isOpen) {
      handleScroll();
    }
  }, [navGroups, isOpen]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      // Store original overflow value
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      // Cleanup function
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = '';
        document.body.style.width = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-80 bg-background/95 border-r border-border/60 mobile-sidebar flex flex-col" style={{ height: '100vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/60">
          <h2 className="text-lg font-semibold text-foreground">Administration</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>


        {/* Navigation */}
        <div className="flex-1 overflow-hidden relative">
          {/* Top scroll indicator */}
          {showTopIndicator && (
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-background/80 to-transparent z-10 pointer-events-none" />
          )}
          
          {/* Bottom scroll indicator */}
          {showBottomIndicator && (
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background/80 to-transparent z-10 pointer-events-none" />
          )}
          
          <nav 
            ref={navRef}
            onScroll={handleScroll}
            className="h-full overflow-y-auto overflow-x-hidden p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50"
          >
          {navGroups.map((group) => (
                  <div key={group.title} className="space-y-2">
                    <button
                      onClick={() => toggleGroup(group.title)}
                      className="flex items-center justify-between w-full text-left text-sm font-semibold text-muted-foreground py-2 px-2 rounded-md hover:text-foreground hover:bg-muted/50 transition-colors"
                      aria-label={`Toggle ${group.title} section`}
                      aria-expanded={!collapsedGroups.has(group.title)}
                    >
                      <span className="uppercase tracking-wide">{group.title}</span>
                      {collapsedGroups.has(group.title) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronUp className="h-4 w-4" />
                      )}
                    </button>
                    
                    {!collapsedGroups.has(group.title) && (
                      <div className="space-y-1 ml-2">
                        {group.items.map((item) => (
                            <AdminNavItem
                              key={item.href}
                              href={item.href}
                              label={item.label}
                              icon={item.icon}
                              description={item.description}
                              badge={item.badge}
                              isActive={pathname === item.href}
                            />          
                          ))}
                      </div>
                  )}

                  
                </div>
          ))}
          </nav>
        </div>
        
      </div>


    </div>
  );



} 


