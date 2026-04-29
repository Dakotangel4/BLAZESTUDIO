import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Pencil,
  Plus,
  Quote as QuoteIcon,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import {
  getAdminListTestimonialsQueryKey,
  getListPublicTestimonialsQueryKey,
  useAdminCreateTestimonial,
  useAdminDeleteTestimonial,
  useAdminListTestimonials,
  useAdminReorderTestimonials,
  useAdminUpdateTestimonial,
  type AdminTestimonial,
} from "@workspace/api-client-react";
import RequireAdmin from "@/components/admin/require-admin";
import AdminLayout from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CompanyLogo, { clearbitLogoUrl } from "@/components/ui/company-logo";

type FormState = {
  clientName: string;
  jobTitle: string;
  companyName: string;
  companyDomain: string;
  companyLogoUrl: string;
  profileImage: string;
  quote: string;
  rating: number;
  industry: string;
  resultLabel: string;
  published: boolean;
};

const EMPTY_FORM: FormState = {
  clientName: "",
  jobTitle: "",
  companyName: "",
  companyDomain: "",
  companyLogoUrl: "",
  profileImage: "",
  quote: "",
  rating: 5,
  industry: "",
  resultLabel: "",
  published: true,
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          className="p-1 -m-1 rounded hover:bg-slate-100"
        >
          <Star
            className={
              n <= value
                ? "h-5 w-5 fill-amber-400 text-amber-400"
                : "h-5 w-5 text-slate-300"
            }
          />
        </button>
      ))}
    </div>
  );
}

function AdminTestimonialsContent() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "hidden">("all");
  const [editing, setEditing] = useState<AdminTestimonial | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const listQuery = useAdminListTestimonials();
  const createMutation = useAdminCreateTestimonial();
  const updateMutation = useAdminUpdateTestimonial();
  const deleteMutation = useAdminDeleteTestimonial();
  const reorderMutation = useAdminReorderTestimonials();

  const all = listQuery.data?.testimonials ?? [];
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return all.filter((t) => {
      if (statusFilter === "published" && !t.published) return false;
      if (statusFilter === "hidden" && t.published) return false;
      if (!q) return true;
      return (
        t.clientName.toLowerCase().includes(q) ||
        t.companyName.toLowerCase().includes(q) ||
        t.industry.toLowerCase().includes(q) ||
        t.jobTitle.toLowerCase().includes(q)
      );
    });
  }, [all, search, statusFilter]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditing(null);
    setCreating(true);
  }

  function openEdit(t: AdminTestimonial) {
    setForm({
      clientName: t.clientName,
      jobTitle: t.jobTitle,
      companyName: t.companyName,
      companyDomain: t.companyDomain,
      companyLogoUrl: t.companyLogoUrl ?? "",
      profileImage: t.profileImage ?? "",
      quote: t.quote,
      rating: t.rating,
      industry: t.industry,
      resultLabel: t.resultLabel,
      published: t.published,
    });
    setEditing(t);
    setCreating(true);
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
  }

  async function invalidate() {
    await Promise.all([
      qc.invalidateQueries({ queryKey: getAdminListTestimonialsQueryKey() }),
      qc.invalidateQueries({ queryKey: getListPublicTestimonialsQueryKey() }),
    ]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedClient = form.clientName.trim();
    const trimmedCompany = form.companyName.trim();
    const trimmedQuote = form.quote.trim();
    if (!trimmedClient || !trimmedCompany || !trimmedQuote) {
      toast.error("Client name, company and quote are required");
      return;
    }

    const data = {
      clientName: trimmedClient,
      jobTitle: form.jobTitle.trim(),
      companyName: trimmedCompany,
      companyDomain: form.companyDomain.trim(),
      companyLogoUrl: form.companyLogoUrl.trim() || null,
      profileImage: form.profileImage.trim() || null,
      quote: trimmedQuote,
      rating: form.rating,
      industry: form.industry.trim(),
      resultLabel: form.resultLabel.trim(),
      published: form.published,
    };

    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, data });
        toast.success("Testimonial updated");
      } else {
        await createMutation.mutateAsync({ data });
        toast.success("Testimonial added");
      }
      await invalidate();
      closeForm();
    } catch {
      toast.error(editing ? "Could not update" : "Could not create");
    }
  }

  async function onDelete(id: number) {
    try {
      await deleteMutation.mutateAsync({ id });
      await invalidate();
      toast.success("Testimonial deleted");
      setDeletingId(null);
    } catch {
      toast.error("Could not delete");
    }
  }

  async function togglePublished(t: AdminTestimonial, next: boolean) {
    try {
      await updateMutation.mutateAsync({
        id: t.id,
        data: { published: next },
      });
      await invalidate();
      toast.success(next ? "Published" : "Hidden");
    } catch {
      toast.error("Could not update status");
    }
  }

  async function move(id: number, dir: -1 | 1) {
    const ids = filtered.map((t) => t.id);
    const idx = ids.indexOf(id);
    const target = idx + dir;
    if (idx === -1 || target < 0 || target >= ids.length) return;
    [ids[idx], ids[target]] = [ids[target], ids[idx]];
    // Build full list ordering by interleaving moved subset back into full list
    const fullIds = all.map((t) => t.id);
    const filteredSet = new Set(ids);
    let cursor = 0;
    const newFull = fullIds.map((fid) => {
      if (filteredSet.has(fid)) {
        const next = ids[cursor++];
        return next;
      }
      return fid;
    });
    try {
      await reorderMutation.mutateAsync({ data: { ids: newFull } });
      await invalidate();
    } catch {
      toast.error("Could not reorder");
    }
  }

  async function onProfileFile(file: File | null) {
    if (!file) return;
    if (file.size > 1_500_000) {
      toast.error("Image too large. Use under 1.5MB.");
      return;
    }
    try {
      const url = await fileToDataUrl(file);
      setForm((f) => ({ ...f, profileImage: url }));
    } catch {
      toast.error("Could not read image");
    }
  }

  const previewLogoFromDomain = clearbitLogoUrl(form.companyDomain);

  const stats = useMemo(() => {
    return {
      total: all.length,
      published: all.filter((t) => t.published).length,
      hidden: all.filter((t) => !t.published).length,
      avgRating:
        all.length > 0
          ? (all.reduce((s, t) => s + t.rating, 0) / all.length).toFixed(1)
          : "—",
    };
  }, [all]);

  return (
    <AdminLayout
      title="Testimonials"
      subtitle="Manage client stories shown across the site"
      actions={
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Add testimonial
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
              Total
            </p>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
              Published
            </p>
            <p className="text-2xl font-bold mt-1 text-emerald-600">
              {stats.published}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
              Hidden
            </p>
            <p className="text-2xl font-bold mt-1 text-slate-500">
              {stats.hidden}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
              Avg rating
            </p>
            <p className="text-2xl font-bold mt-1 flex items-center gap-1.5">
              {stats.avgRating}
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client, company or industry"
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="hidden">Hidden</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {listQuery.isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <QuoteIcon className="h-10 w-10 mx-auto text-slate-300 mb-3" />
            <p className="text-slate-600 font-medium">No testimonials yet</p>
            <p className="text-sm text-slate-500 mt-1">
              Add your first client story to start building social proof.
            </p>
            <Button onClick={openCreate} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Add testimonial
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((t, idx) => (
            <Card key={t.id} className={t.published ? "" : "opacity-70"}>
              <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-4">
                {/* Avatar */}
                <div className="shrink-0">
                  {t.profileImage ? (
                    <img
                      src={t.profileImage}
                      alt={t.clientName}
                      className="h-14 w-14 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                      {t.clientName.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-semibold text-slate-900 truncate">
                      {t.clientName}
                    </p>
                    {t.published ? (
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Hidden</Badge>
                    )}
                    {t.industry ? (
                      <Badge variant="outline" className="text-[10px] uppercase tracking-widest">
                        {t.industry}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-xs text-slate-500 mb-2">
                    {t.jobTitle ? `${t.jobTitle} · ` : ""}
                    {t.companyName}
                  </p>
                  <p className="text-sm text-slate-700 line-clamp-2">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < t.rating
                            ? "h-3.5 w-3.5 fill-amber-400 text-amber-400"
                            : "h-3.5 w-3.5 text-slate-300"
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Logo */}
                <div className="shrink-0">
                  <CompanyLogo
                    companyName={t.companyName}
                    companyDomain={t.companyDomain}
                    companyLogoUrl={t.companyLogoUrl}
                    variant="light"
                    size="lg"
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => move(t.id, -1)}
                    disabled={idx === 0 || reorderMutation.isPending}
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => move(t.id, 1)}
                    disabled={idx === filtered.length - 1 || reorderMutation.isPending}
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <div className="w-px h-6 bg-slate-200 mx-1" />
                  <Switch
                    checked={t.published}
                    onCheckedChange={(v) => togglePublished(t, v)}
                    aria-label="Toggle published"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(t)}
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeletingId(t.id)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit dialog */}
      <Dialog
        open={creating}
        onOpenChange={(open) => {
          if (!open) closeForm();
        }}
      >
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit testimonial" : "Add testimonial"}
            </DialogTitle>
            <DialogDescription>
              Client logo is auto-fetched from the company domain.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client name *</Label>
                <Input
                  id="clientName"
                  value={form.clientName}
                  onChange={(e) =>
                    setForm({ ...form, clientName: e.target.value })
                  }
                  placeholder="Tunde Adebayo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job title</Label>
                <Input
                  id="jobTitle"
                  value={form.jobTitle}
                  onChange={(e) =>
                    setForm({ ...form, jobTitle: e.target.value })
                  }
                  placeholder="CEO"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company name *</Label>
                <Input
                  id="companyName"
                  value={form.companyName}
                  onChange={(e) =>
                    setForm({ ...form, companyName: e.target.value })
                  }
                  placeholder="Adebayo Logistics"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyDomain">
                  Company domain
                  <span className="text-slate-400 font-normal ml-1">
                    (auto-fetches logo)
                  </span>
                </Label>
                <Input
                  id="companyDomain"
                  value={form.companyDomain}
                  onChange={(e) =>
                    setForm({ ...form, companyDomain: e.target.value })
                  }
                  placeholder="adebayologistics.com"
                />
              </div>
            </div>

            {/* Live logo preview */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 flex items-center gap-3">
              <span className="text-xs uppercase tracking-wide font-semibold text-slate-500">
                Logo preview
              </span>
              <div className="flex-1">
                <CompanyLogo
                  companyName={form.companyName || "—"}
                  companyDomain={form.companyDomain}
                  companyLogoUrl={form.companyLogoUrl}
                  variant="light"
                  size="lg"
                />
              </div>
              {previewLogoFromDomain && !form.companyLogoUrl ? (
                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[160px]">
                  via Clearbit
                </span>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyLogoUrl">
                Company logo URL
                <span className="text-slate-400 font-normal ml-1">
                  (optional override)
                </span>
              </Label>
              <Input
                id="companyLogoUrl"
                value={form.companyLogoUrl}
                onChange={(e) =>
                  setForm({ ...form, companyLogoUrl: e.target.value })
                }
                placeholder="https://example.com/logo.svg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profileImage">Profile photo</Label>
              <div className="flex items-center gap-3">
                {form.profileImage ? (
                  <img
                    src={form.profileImage}
                    alt="Preview"
                    className="h-14 w-14 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                    {form.clientName.charAt(0) || "?"}
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => onProfileFile(e.target.files?.[0] ?? null)}
                  />
                  {form.profileImage ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setForm({ ...form, profileImage: "" })}
                    >
                      Remove photo
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote">Testimonial quote *</Label>
              <Textarea
                id="quote"
                value={form.quote}
                onChange={(e) => setForm({ ...form, quote: e.target.value })}
                rows={4}
                placeholder="Working with the team transformed our online presence..."
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Star rating</Label>
                <StarPicker
                  value={form.rating}
                  onChange={(n) => setForm({ ...form, rating: n })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={form.industry}
                  onChange={(e) =>
                    setForm({ ...form, industry: e.target.value })
                  }
                  placeholder="Logistics"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resultLabel">Result label</Label>
                <Input
                  id="resultLabel"
                  value={form.resultLabel}
                  onChange={(e) =>
                    setForm({ ...form, resultLabel: e.target.value })
                  }
                  placeholder="200% increase in leads"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <div>
                <Label htmlFor="published" className="font-medium">
                  Published
                </Label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visible on the public site
                </p>
              </div>
              <Switch
                id="published"
                checked={form.published}
                onCheckedChange={(v) => setForm({ ...form, published: v })}
              />
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="gap-2"
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                {editing ? "Save changes" : "Create testimonial"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog
        open={deletingId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete testimonial?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the client story from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (deletingId !== null) onDelete(deletingId);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

export default function AdminTestimonialsPage() {
  // Wait for vite HMR-friendly mount
  useEffect(() => undefined, []);
  return (
    <RequireAdmin>
      <AdminTestimonialsContent />
    </RequireAdmin>
  );
}
