'use client';

import { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  User,
  Mail,
  Calendar,
  Inbox,
  Filter,
} from 'lucide-react';

export interface Ticket {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
  response: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SupportClientProps {
  initialTickets: Ticket[];
}

export function SupportClient({ initialTickets }: SupportClientProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(
    initialTickets.length > 0 ? initialTickets[0].id : null
  );
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Reply form states
  const [replyText, setReplyText] = useState<string>('');
  const [replyStatus, setReplyStatus] = useState<'NEW' | 'IN_PROGRESS' | 'RESOLVED'>('RESOLVED');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || null;

  // Filter and Search tickets
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus = filterStatus === 'ALL' || ticket.status === filterStatus;
    const matchesSearch =
      ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicketId(ticket.id);
    setReplyText(ticket.response || '');
    setReplyStatus(ticket.status === 'NEW' ? 'IN_PROGRESS' : ticket.status);
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const res = await fetch(`/api/admin/support/${selectedTicket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: replyStatus,
          response: replyText,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Xatolik yuz berdi');
      }

      // Update local state
      setTickets((prev) =>
        prev.map((t) => (t.id === selectedTicket.id ? data : t))
      );
      setSubmitSuccess(true);
      
      // Auto-hide success alert
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err: any) {
      setSubmitError(err.message || 'Murojaatni saqlashda xatolik yuz berdi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('uz-UZ', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: Ticket['status']) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-500 dark:text-rose-400">
            <AlertCircle className="h-3 w-3" /> Yangi
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-500 dark:text-amber-400">
            <Clock className="h-3 w-3" /> Ko'rilmoqda
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-500 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Hal etilgan
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
            Qo'llab-quvvatlash
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Mijozlardan kelgan murojaatlar va so'rovlar ro'yxati.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80 sm:self-center">
          {[
            { key: 'ALL', label: 'Barchasi' },
            { key: 'NEW', label: 'Yangi' },
            { key: 'IN_PROGRESS', label: 'Jarayonda' },
            { key: 'RESOLVED', label: 'Hal qilingan' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterStatus(tab.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                filterStatus === tab.key
                  ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-gold-400'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Ticket List Pane */}
        <div className="flex flex-col gap-4 lg:col-span-5 xl:col-span-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Qidirish (ism, email, mavzu)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-950 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-gold-400/50"
            />
          </div>

          {/* List */}
          <div className="flex flex-col gap-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredTickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
                <Inbox className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Murojaatlar topilmadi
                </p>
              </div>
            ) : (
              filteredTickets.map((ticket) => {
                const isSelected = ticket.id === selectedTicketId;
                const isNew = ticket.status === 'NEW';
                return (
                  <button
                    key={ticket.id}
                    type="button"
                    onClick={() => handleSelectTicket(ticket)}
                    className={`flex flex-col gap-2.5 rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-gold-500/40 bg-gold-500/5 dark:border-gold-400/40 dark:bg-gold-400/5 ring-1 ring-gold-500/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50/50 dark:border-slate-850 dark:bg-slate-900 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`line-clamp-1 text-sm font-semibold leading-tight ${
                        isNew ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {ticket.subject}
                      </h3>
                      {getStatusBadge(ticket.status)}
                    </div>
                    
                    <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                      {ticket.message}
                    </p>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800/50">
                      <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                        {ticket.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatDate(ticket.createdAt)}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Ticket Details & Action Pane */}
        <div className="lg:col-span-7 xl:col-span-8">
          {selectedTicket ? (
            <div className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {/* Header */}
              <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 dark:border-slate-800 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                    <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                      {selectedTicket.subject}
                    </h2>
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                  
                  <div className="flex flex-col gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-slate-400" />
                      <span>{selectedTicket.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-slate-400" />
                      <a href={`mailto:${selectedTicket.email}`} className="text-gold-600 hover:underline dark:text-gold-400">
                        {selectedTicket.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <span>Yuborilgan vaqt: {formatDate(selectedTicket.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950/40">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                  {selectedTicket.message}
                </p>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="flex flex-col gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="replyText" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Javob yozish
                  </label>
                  <textarea
                    id="replyText"
                    rows={5}
                    placeholder="Mijozga yoziladigan javob matnini kiriting..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-950 outline-none transition-all focus:border-gold-500/50 focus:ring-2 focus:ring-gold-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-gold-400/50"
                  />
                </div>

                {/* Form Controls */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Status Picker */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status:</span>
                    <div className="flex items-center gap-2">
                      {[
                        { key: 'NEW', label: 'Yangi', color: 'text-rose-500 border-rose-500/30' },
                        { key: 'IN_PROGRESS', label: 'Ko\'rilmoqda', color: 'text-amber-500 border-amber-500/30' },
                        { key: 'RESOLVED', label: 'Hal etilgan', color: 'text-emerald-500 border-emerald-500/30' },
                      ].map((st) => (
                        <button
                          key={st.key}
                          type="button"
                          onClick={() => setReplyStatus(st.key as any)}
                          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                            replyStatus === st.key
                              ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-gold-400 border-slate-900 dark:border-slate-800 shadow-sm'
                              : 'bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:self-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow transition-all hover:bg-slate-800 focus:outline-none disabled:opacity-50 dark:bg-gold-500 dark:text-slate-950 dark:hover:bg-gold-400"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-white" />
                          <span>Yuborilmoqda...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Saqlash va Yuborish</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Feedback Messages */}
                {submitError && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
                    {submitError}
                  </div>
                )}
                {submitSuccess && (
                  <div className="rounded-xl border border-emerald-250 bg-emerald-50 p-3 text-xs font-semibold text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                    Javob muvaffaqiyatli saqlandi!
                  </div>
                )}
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900 h-96">
              <Inbox className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
              <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
                Murojaat tanlanmagan
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                Chap tarafdagi ro'yxatdan murojaatni tanlab, uning to'liq matnini o'qing va javob yo'llang.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
