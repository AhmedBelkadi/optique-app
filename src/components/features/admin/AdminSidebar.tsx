'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, Home, ChevronDown, ChevronUp } from 'lucide-react';
import AdminNavItem from './AdminNavItem';
import Link from 'next/link';
import { filterNavigationByRole } from './navigationConfig';

interface AdminSidebarProps {
  user?: any;
  className?: string;
  onSidebarCollapse?: (collapsed: boolean) => void;
}

export default function AdminSidebar({ user, className = "", onSidebarCollapse }: AdminSidebarProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showTopIndicator, setShowTopIndicator] = useState(false);
  const [showBottomIndicator, setShowBottomIndicator] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  // measure header height (updates on resize)
  useEffect(() => {
    const update = () => {
      setHeaderHeight(headerRef.current?.getBoundingClientRect().height ?? 0);
    };
    update();
    window.addEventListener('resize', update);
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && headerRef.current) {
      ro = new ResizeObserver(update);
      ro.observe(headerRef.current);
    }
    return () => {
      window.removeEventListener('resize', update);
      if (ro) ro.disconnect();
    };
  }, []);

  // collapsed groups init
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    filterNavigationByRole(user).forEach(group => {
      if (group.defaultCollapsed) initial.add(group.title);
    });
    return initial;
  });

  const pathname = usePathname();
  const navGroups = filterNavigationByRole(user);

  useEffect(() => {
    if (onSidebarCollapse) onSidebarCollapse(isSidebarCollapsed);
  }, [isSidebarCollapsed, onSidebarCollapse]);

  const toggleGroup = (groupTitle: string) => {
    setCollapsedGroups(prev => {
      const n = new Set(prev);
      if (n.has(groupTitle)) n.delete(groupTitle);
      else n.add(groupTitle);
      return n;
    });
  };

  const toggleSidebar = () => setIsSidebarCollapsed(s => !s);

  const handleScroll = () => {
    if (!navRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = navRef.current;
    const pct = scrollTop / (scrollHeight - clientHeight || 1);
    setShowTopIndicator(scrollTop > 10);
    setShowBottomIndicator(pct < 0.95);
  };

  useEffect(() => {
    handleScroll();
  }, [navGroups, isSidebarCollapsed]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key.toLowerCase() === 'b') {
          e.preventDefault();
          toggleSidebar();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-50 bg-background/80 backdrop-blur-xl border-r border-border/60 flex flex-col min-h-0 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      } ${className}`}
    >
      {/* Header (we measure this) */}
      <div ref={headerRef} className="p-4 border-b border-border/60">
        <div className="flex items-center justify-between">
          {!isSidebarCollapsed && <h2 className="text-lg font-semibold text-foreground">Administration</h2>}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md hover:bg-muted/50 transition-colors"
              title={isSidebarCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? <ChevronRight className="h-4 w-4 text-muted-foreground" /> : <ChevronLeft className="h-4 w-4 text-muted-foreground" />}
            </button>
            {!isSidebarCollapsed && (
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Go to homepage">
                <Home className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Nav: force height = viewport - headerHeight so it MUST scroll */}
      <div className="relative flex-1 min-h-0">
        {showTopIndicator && !isSidebarCollapsed && (
          <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-background/80 to-transparent z-10 pointer-events-none" />
        )}

        {showBottomIndicator && !isSidebarCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background/80 to-transparent z-10 pointer-events-none" />
        )}

        <nav
          ref={navRef}
          onScroll={handleScroll}
          // IMPORTANT: fixed-height calc ensures scroll works even if flex styles elsewhere are wrong.
          style={{ height: `calc(100vh - ${headerHeight}px)` }}
          className="overflow-y-auto overflow-x-hidden p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/50"
        >
          {navGroups.map(group => (
            <div key={group.title} className="space-y-2">
              {!isSidebarCollapsed && (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="flex items-center justify-between w-full text-left text-sm font-semibold text-muted-foreground py-2 px-2 rounded-md hover:text-foreground hover:bg-muted/50 transition-colors"
                  aria-label={`Toggle ${group.title} section`}
                  aria-expanded={!collapsedGroups.has(group.title)}
                >
                  <span className="uppercase tracking-wide">{group.title}</span>
                  {collapsedGroups.has(group.title) ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                </button>
              )}

              {(!isSidebarCollapsed && !collapsedGroups.has(group.title)) && (
                <div className="space-y-1 ml-2">
                  {group.items.map(item => (
                    <AdminNavItem
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      description={item.description}
                      badge={item.badge}
                      isActive={pathname === item.href}
                      isCollapsed={isSidebarCollapsed}
                    />
                  ))}
                </div>
              )}

              {isSidebarCollapsed && (
                <div className="space-y-1">
                  {group.items.map(item => (
                    <AdminNavItem
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      description={item.description}
                      badge={item.badge}
                      isActive={pathname === item.href}
                      isCollapsed
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
