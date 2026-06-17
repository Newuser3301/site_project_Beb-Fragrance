'use client';

import { useEffect, useState, useRef } from 'react';
import { Bell, Check, CircleDot, Mail, ShoppingBag, UserPlus, FileText } from 'lucide-react';

interface Notification {
  id: string;
  userId: string | null;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Poll for notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hozirgina';
    if (diffMins < 60) return `${diffMins} daqiqa avval`;
    if (diffHours < 24) return `${diffHours} soat avval`;
    return `${diffDays} kun avval`;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'NEW_ORDER':
        return <ShoppingBag className="h-4 w-4 text-emerald-500" />;
      case 'NEW_USER':
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case 'NEW_TICKET':
        return <Mail className="h-4 w-4 text-amber-500" />;
      case 'ORDER_STATUS_CHANGE':
        return <FileText className="h-4 w-4 text-purple-500" />;
      default:
        return <CircleDot className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(13,28,48,0.08)] bg-[#f7f9fd] text-[#17355d] transition-colors hover:bg-[#edf4ff] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-950 z-50">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 dark:border-slate-850">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Bildirishnomalar
            </h4>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="text-[10px] font-semibold text-gold-600 hover:underline dark:text-gold-450"
              >
                Hammasini o'qish
              </button>
            )}
          </div>

          <div className="mt-2.5 max-h-64 overflow-y-auto flex flex-col gap-2">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                Sizda bildirishnomalar yo'q
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 rounded-xl p-2.5 transition-all text-left ${
                    n.isRead
                      ? 'bg-transparent opacity-70'
                      : 'bg-slate-50 dark:bg-slate-900/50'
                  }`}
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-normal break-words ${
                      n.isRead ? 'text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'
                    }`}>
                      {n.message}
                    </p>
                    <span className="mt-1 block text-[9px] text-slate-400">
                      {formatRelativeTime(n.createdAt)}
                    </span>
                  </div>
                  {!n.isRead && (
                    <button
                      type="button"
                      onClick={() => handleMarkAsRead(n.id)}
                      className="shrink-0 rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      title="O'qilgan deb belgilash"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
