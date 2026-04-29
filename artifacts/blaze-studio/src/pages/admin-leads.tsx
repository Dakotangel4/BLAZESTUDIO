import { useMemo, useState } from "react";
import { format, isToday, isThisMonth, parseISO } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  Inbox,
  Loader2,
  Mail,
  Phone,
  Search,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  useAdminListLeads,
  useAdminUpdateLead,
  useAdminDeleteLead,
  getAdminListLeadsQueryKey,
} from "@workspace/api-client-react";
import type {
  AdminLead,
  AdminLeadList,
  LeadStatus,
} from "@workspace/api-client-react";

import RequireAdmin from "@/components/admin/require-admin";
import AdminLayout from "@/components/admin/admin-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SortKey = "id" | "name" | "email" | "createdAt" | "status";
type SortDir = "asc" | "desc";

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "reviewed", label: "Reviewed" },
  { value: "responded", label: "Responded" },
];

const STATUS_BADGE: Record<LeadStatus, string> = {
  new: "bg-red-100 text-red-700 ring-1 ring-red-200",
  reviewed: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
  responded: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
};

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

function formatDateTime(iso: string): string {
  try {
    return format(parseISO(iso), "MMM d, yyyy · h:mm a");
  } catch {
    return iso;
  }
}

function csvEscape(value: string): string {
  const needsQuote = /[",\n\r]/.test(value);
  const escaped = value.replace(/"/g, '""');
  return needsQuote ? `"${escaped}"` : escaped;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function exportCsv(rows: AdminLead[]) {
  const headers = [
    "ID",
    "Name",
    "Email",
    "Phone",
    "Service",
    "Status",
    "Source",
    "Submitted",
    "Message",
  ];
  const lines = [headers.join(",")];
  for (const r of rows) {
    lines.push(
      [
        String(r.id),
        csvEscape(r.name),
        csvEscape(r.email),
        csvEscape(r.phone),
        csvEscape(r.service),
        r.status,
        csvEscape(r.source),
        csvEscape(formatDateTime(r.createdAt)),
        csvEscape(r.message),
      ].join(","),
    );
  }
  const blob = new Blob(["\uFEFF" + lines.join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const stamp = format(new Date(), "yyyy-MM-dd_HHmm");
  downloadBlob(blob, `blaze-leads_${stamp}.csv`);
}

function exportPdf(rows: AdminLead[]) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt" });
  const stamp = format(new Date(), "MMM d, yyyy h:mm a");
  doc.setFontSize(16);
  doc.text("Blaze Studio — Leads Export", 40, 40);
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`Generated ${stamp} · ${rows.length} record(s)`, 40, 58);

  autoTable(doc, {
    startY: 76,
    head: [
      ["ID", "Name", "Email", "Phone", "Service", "Status", "Submitted"],
    ],
    body: rows.map((r) => [
      String(r.id),
      r.name,
      r.email,
      r.phone,
      r.service,
      r.status,
      formatDateTime(r.createdAt),
    ]),
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [15, 23, 42], textColor: 255 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 40, right: 40 },
  });

  const fileStamp = format(new Date(), "yyyy-MM-dd_HHmm");
  doc.save(`blaze-leads_${fileStamp}.pdf`);
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: "slate" | "red" | "blue" | "emerald";
}) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
    emerald: "bg-emerald-100 text-emerald-700",
  } as const;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900 tabular-nums">
            {value.toLocaleString()}
          </p>
        </div>
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${tones[tone]}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function StatsRow({
  leads,
  filteredCount,
}: {
  leads: AdminLead[];
  filteredCount: number;
}) {
  const newCount = leads.filter((l) => l.status === "new").length;
  const todayCount = leads.filter((l) => {
    try {
      return isToday(parseISO(l.createdAt));
    } catch {
      return false;
    }
  }).length;
  const monthCount = leads.filter((l) => {
    try {
      return isThisMonth(parseISO(l.createdAt));
    } catch {
      return false;
    }
  }).length;

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard
        icon={Users}
        label={`Total leads (${filteredCount} shown)`}
        value={leads.length}
        tone="slate"
      />
      <StatCard icon={Inbox} label="New (unreviewed)" value={newCount} tone="red" />
      <StatCard icon={CalendarDays} label="Today" value={todayCount} tone="blue" />
      <StatCard
        icon={TrendingUp}
        label="This month"
        value={monthCount}
        tone="emerald"
      />
    </div>
  );
}

function SortHeader({
  label,
  column,
  sortKey,
  sortDir,
  onSort,
  className,
}: {
  label: string;
  column: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (k: SortKey) => void;
  className?: string;
}) {
  const active = sortKey === column;
  const Icon = !active ? ArrowUpDown : sortDir === "asc" ? ArrowUp : ArrowDown;
  return (
    <th
      scope="col"
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 ${
        className ?? ""
      }`}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        className="inline-flex items-center gap-1 hover:text-slate-900"
      >
        {label}
        <Icon
          className={`h-3 w-3 ${active ? "text-slate-900" : "text-slate-400"}`}
        />
      </button>
    </th>
  );
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const label =
    STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[status]}`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          status === "new"
            ? "bg-red-500"
            : status === "reviewed"
              ? "bg-amber-500"
              : "bg-emerald-500"
        }`}
      />
      {label}
    </span>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="space-y-2 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-28" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Inbox className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">
        {filtered ? "No leads match your filters" : "No leads yet"}
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        {filtered
          ? "Try clearing your search or date range."
          : "When people submit the contact form, they'll show up here."}
      </p>
    </div>
  );
}

function AdminLeadsContent() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useAdminListLeads({
    query: {
      queryKey: getAdminListLeadsQueryKey(),
      staleTime: 10_000,
    },
  });
  const allLeads: AdminLead[] = data?.leads ?? [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [openLead, setOpenLead] = useState<AdminLead | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminLead | null>(null);

  function onSort(k: SortKey) {
    if (k === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(k);
      setSortDir(k === "createdAt" || k === "id" ? "desc" : "asc");
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const fromTs = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : null;
    const toTs = toDate ? new Date(`${toDate}T23:59:59.999`).getTime() : null;

    return allLeads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (q) {
        const hay = `${l.name} ${l.email}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (fromTs !== null || toTs !== null) {
        const t = new Date(l.createdAt).getTime();
        if (fromTs !== null && t < fromTs) return false;
        if (toTs !== null && t > toTs) return false;
      }
      return true;
    });
  }, [allLeads, search, statusFilter, fromDate, toDate]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sortDir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (sortKey === "createdAt") {
        return (
          (new Date(av as string).getTime() -
            new Date(bv as string).getTime()) *
          dir
        );
      }
      if (typeof av === "number" && typeof bv === "number") {
        return (av - bv) * dir;
      }
      return String(av).localeCompare(String(bv)) * dir;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = sorted.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const updateLead = useAdminUpdateLead({
    mutation: {
      onMutate: async ({ id, data: patch }) => {
        const key = getAdminListLeadsQueryKey();
        await queryClient.cancelQueries({ queryKey: key });
        const previous = queryClient.getQueryData<AdminLeadList>(key);
        if (previous) {
          queryClient.setQueryData<AdminLeadList>(key, {
            leads: previous.leads.map((l) =>
              l.id === id && patch.status ? { ...l, status: patch.status } : l,
            ),
          });
        }
        return { previous };
      },
      onError: (_e, _v, ctx) => {
        if (ctx?.previous) {
          queryClient.setQueryData(getAdminListLeadsQueryKey(), ctx.previous);
        }
        toast.error("Could not update status. Please retry.");
      },
      onSuccess: () => {
        toast.success("Status updated");
      },
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: getAdminListLeadsQueryKey(),
        });
      },
    },
  });

  const deleteLead = useAdminDeleteLead({
    mutation: {
      onSuccess: (_res, vars) => {
        toast.success(`Lead #${vars.id} deleted`);
        setConfirmDelete(null);
        queryClient.invalidateQueries({
          queryKey: getAdminListLeadsQueryKey(),
        });
      },
      onError: () => {
        toast.error("Could not delete lead. Please retry.");
      },
    },
  });

  function changeStatus(lead: AdminLead, status: LeadStatus) {
    if (lead.status === status) return;
    updateLead.mutate({ id: lead.id, data: { status } });
  }

  const filtersActive =
    search.trim() !== "" ||
    statusFilter !== "all" ||
    fromDate !== "" ||
    toDate !== "";

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setFromDate("");
    setToDate("");
    setPage(1);
  }

  function handleExportCsv() {
    if (sorted.length === 0) {
      toast.info("Nothing to export.");
      return;
    }
    exportCsv(sorted);
    toast.success(`Exported ${sorted.length} lead(s) to CSV`);
  }

  function handleExportPdf() {
    if (sorted.length === 0) {
      toast.info("Nothing to export.");
      return;
    }
    try {
      exportPdf(sorted);
      toast.success(`Exported ${sorted.length} lead(s) to PDF`);
    } catch {
      toast.error("PDF export failed.");
    }
  }

  return (
    <AdminLayout
      title="Leads"
      subtitle="All contact form submissions"
      actions={
        <button
          type="button"
          onClick={() => refetch()}
          className="hidden sm:inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : null}
          Refresh
        </button>
      }
    >
      <div className="space-y-5">
        <StatsRow leads={allLeads} filteredCount={sorted.length} />

        {/* Toolbar */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-slate-500">
                Search
              </label>
              <div className="relative mt-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search name or email…"
                  className="w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            <div className="w-[150px]">
              <label className="block text-xs font-medium text-slate-500">
                Status
              </label>
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v as "all" | LeadStatus);
                  setPage(1);
                }}
              >
                <SelectTrigger className="mt-1 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500">
                From
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
                className="mt-1 h-9 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500">
                To
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                }}
                className="mt-1 h-9 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500">
                Page size
              </label>
              <Select
                value={String(pageSize)}
                onValueChange={(v) => {
                  setPageSize(Number(v));
                  setPage(1);
                }}
              >
                <SelectTrigger className="mt-1 h-9 w-[90px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((s) => (
                    <SelectItem key={s} value={String(s)}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="ml-auto flex items-end gap-2">
              {filtersActive ? (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="h-9 rounded-md px-3 text-sm text-slate-600 hover:bg-slate-100"
                >
                  Clear
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Download className="h-3.5 w-3.5" />
                CSV
              </button>
              <button
                type="button"
                onClick={handleExportPdf}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <FileText className="h-3.5 w-3.5" />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <TableSkeleton />
        ) : isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Failed to load leads.{" "}
            <button
              type="button"
              onClick={() => refetch()}
              className="font-medium underline"
            >
              Retry
            </button>
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState filtered={filtersActive} />
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <SortHeader
                      label="ID"
                      column="id"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={onSort}
                      className="w-16"
                    />
                    <SortHeader
                      label="Name"
                      column="name"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={onSort}
                    />
                    <SortHeader
                      label="Email"
                      column="email"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={onSort}
                    />
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Message
                    </th>
                    <SortHeader
                      label="Submitted"
                      column="createdAt"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={onSort}
                    />
                    <SortHeader
                      label="Status"
                      column="status"
                      sortKey={sortKey}
                      sortDir={sortDir}
                      onSort={onSort}
                    />
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pageRows.map((lead) => (
                    <tr
                      key={lead.id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => setOpenLead(lead)}
                    >
                      <td className="px-4 py-3 text-sm tabular-nums text-slate-500">
                        #{lead.id}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {lead.name}
                        <div className="text-xs text-slate-500">
                          {lead.service}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {lead.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {lead.phone}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 max-w-xs">
                        <span className="line-clamp-1">{lead.message}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                        {formatDateTime(lead.createdAt)}
                      </td>
                      <td
                        className="px-4 py-3 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Select
                          value={lead.status}
                          onValueChange={(v) =>
                            changeStatus(lead, v as LeadStatus)
                          }
                        >
                          <SelectTrigger className="h-8 w-[130px] border-0 bg-transparent p-0 hover:bg-slate-100 focus:ring-0">
                            <div className="px-2">
                              <StatusBadge status={lead.status} />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((o) => (
                              <SelectItem key={o.value} value={o.value}>
                                {o.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td
                        className="px-4 py-3 text-right text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(lead)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete lead ${lead.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <div>
                Showing{" "}
                <span className="font-medium text-slate-900">
                  {(safePage - 1) * pageSize + 1}–
                  {Math.min(safePage * pageSize, sorted.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-900">
                  {sorted.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage(1)}
                  disabled={safePage === 1}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs disabled:opacity-40"
                >
                  «
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="px-2 text-xs">
                  Page {safePage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={safePage >= totalPages}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs disabled:opacity-40"
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={() => setPage(totalPages)}
                  disabled={safePage >= totalPages}
                  className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs disabled:opacity-40"
                >
                  »
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      <Dialog
        open={openLead !== null}
        onOpenChange={(o) => (!o ? setOpenLead(null) : null)}
      >
        <DialogContent className="max-w-2xl">
          {openLead ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  Lead #{openLead.id} — {openLead.name}
                  <StatusBadge status={openLead.status} />
                </DialogTitle>
                <DialogDescription>
                  Submitted {formatDateTime(openLead.createdAt)} · via{" "}
                  {openLead.source}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </div>
                  <a
                    href={`mailto:${openLead.email}`}
                    className="font-medium text-slate-900 hover:underline break-all"
                  >
                    {openLead.email}
                  </a>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone className="h-3.5 w-3.5" /> Phone
                  </div>
                  <a
                    href={`tel:${openLead.phone}`}
                    className="font-medium text-slate-900 hover:underline"
                  >
                    {openLead.phone}
                  </a>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm sm:col-span-2">
                  <div className="text-slate-500">Service</div>
                  <div className="font-medium text-slate-900">
                    {openLead.service}
                  </div>
                </div>
                {openLead.website ? (
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm sm:col-span-2">
                    <div className="text-slate-500">Website</div>
                    <div className="font-medium text-slate-900 break-all">
                      {openLead.website}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-1">
                <div className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Message
                </div>
                <div className="mt-1 max-h-72 overflow-auto whitespace-pre-wrap rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-800">
                  {openLead.message}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span>Status</span>
                  <Select
                    value={openLead.status}
                    onValueChange={(v) =>
                      changeStatus(openLead, v as LeadStatus)
                    }
                  >
                    <SelectTrigger className="h-8 w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmDelete(openLead);
                      setOpenLead(null);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenLead(null)}
                    className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={confirmDelete !== null}
        onOpenChange={(o) => (!o ? setConfirmDelete(null) : null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDelete
                ? `Lead #${confirmDelete.id} from ${confirmDelete.name} (${confirmDelete.email}) will be permanently removed. This cannot be undone.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLead.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteLead.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (confirmDelete) {
                  deleteLead.mutate({ id: confirmDelete.id });
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLead.isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Deleting…
                </span>
              ) : (
                "Delete lead"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

export default function AdminLeadsPage() {
  return (
    <RequireAdmin>
      <AdminLeadsContent />
    </RequireAdmin>
  );
}
