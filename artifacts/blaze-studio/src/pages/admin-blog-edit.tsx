import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminListBlogCategories,
  useAdminCreateBlogCategory,
  useAdminGetBlogPost,
  useAdminCreateBlogPost,
  useAdminUpdateBlogPost,
  getAdminListBlogPostsQueryKey,
  getAdminListBlogCategoriesQueryKey,
  getAdminGetBlogPostQueryKey,
  type AdminBlogPost,
} from "@workspace/api-client-react";
import {
  ArrowLeft,
  Eye,
  Image as ImageIcon,
  Loader2,
  Plus,
  Save,
  Send,
  X,
  CalendarClock,
  ChevronDown,
} from "lucide-react";
import RequireAdmin from "@/components/admin/require-admin";
import AdminLayout from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TipTapEditor } from "@/components/admin/tiptap-editor";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 200);
}

function readingTimeOf(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text === "" ? 0 : text.split(" ").length;
  return Math.max(1, Math.round(words / 200));
}

interface FormState {
  title: string;
  slug: string;
  slugManual: boolean;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  metaTitle: string;
  metaDescription: string;
  categoryId: number | null;
  tags: string[];
  author: string;
  status: AdminBlogPost["status"];
  scheduledAt: string | null;
}

const empty: FormState = {
  title: "",
  slug: "",
  slugManual: false,
  excerpt: "",
  content: "",
  featuredImage: null,
  metaTitle: "",
  metaDescription: "",
  categoryId: null,
  tags: [],
  author: "Akpomovine Jerrison",
  status: "draft",
  scheduledAt: null,
};

function fromPost(p: AdminBlogPost): FormState {
  return {
    title: p.title,
    slug: p.slug,
    slugManual: true,
    excerpt: p.excerpt,
    content: p.content,
    featuredImage: p.featuredImage ?? null,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    categoryId: p.categoryId ?? null,
    tags: p.tags,
    author: p.author,
    status: p.status,
    scheduledAt: p.scheduledAt
      ? new Date(p.scheduledAt).toISOString().slice(0, 16)
      : null,
  };
}

function buildPayload(f: FormState) {
  return {
    title: f.title.trim(),
    slug: f.slug.trim(),
    excerpt: f.excerpt,
    content: f.content,
    featuredImage: f.featuredImage,
    metaTitle: f.metaTitle,
    metaDescription: f.metaDescription,
    categoryId: f.categoryId,
    tags: f.tags,
    author: f.author,
    status: f.status,
    scheduledAt: f.scheduledAt ? new Date(f.scheduledAt).toISOString() : null,
  };
}

function AdminBlogEditContent({ id }: { id: number | null }) {
  const [, navigate] = useLocation();
  const qc = useQueryClient();

  const isNew = id == null;
  const postQuery = useAdminGetBlogPost(id ?? 0, {
    query: {
      enabled: !isNew,
      queryKey: getAdminGetBlogPostQueryKey(id ?? 0),
    },
  });
  const categoriesQuery = useAdminListBlogCategories();
  const createPost = useAdminCreateBlogPost();
  const updatePost = useAdminUpdateBlogPost();
  const createCategory = useAdminCreateBlogCategory();

  const [form, setForm] = useState<FormState>(empty);
  const [tagInput, setTagInput] = useState("");
  const [seoOpen, setSeoOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [newCatOpen, setNewCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [currentId, setCurrentId] = useState<number | null>(id);
  const [hydrated, setHydrated] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (postQuery.data && !hydrated) {
      setForm(fromPost(postQuery.data));
      setCurrentId(postQuery.data.id);
      setLastSavedAt(new Date(postQuery.data.updatedAt));
      setHydrated(true);
    }
    if (isNew && !hydrated) setHydrated(true);
  }, [postQuery.data, isNew, hydrated]);

  // Auto-slug from title
  useEffect(() => {
    if (!form.slugManual && form.title) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.title) }));
    }
  }, [form.title, form.slugManual]);

  const readingTime = useMemo(() => readingTimeOf(form.content), [form.content]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const invalidate = (postId?: number) => {
    qc.invalidateQueries({ queryKey: getAdminListBlogPostsQueryKey() });
    qc.invalidateQueries({
      queryKey: getAdminListBlogCategoriesQueryKey(),
    });
    if (postId)
      qc.invalidateQueries({ queryKey: getAdminGetBlogPostQueryKey(postId) });
  };

  const persist = async (overrideStatus?: FormState["status"]) => {
    const payloadForm: FormState = overrideStatus
      ? { ...form, status: overrideStatus }
      : form;
    if (!payloadForm.title.trim()) {
      toast.error("Please enter a title before saving");
      return null;
    }
    try {
      const data = buildPayload(payloadForm);
      let saved: AdminBlogPost;
      if (currentId == null) {
        saved = await createPost.mutateAsync({ data });
      } else {
        saved = await updatePost.mutateAsync({ id: currentId, data });
      }
      setCurrentId(saved.id);
      setForm(fromPost(saved));
      setLastSavedAt(new Date());
      invalidate(saved.id);
      return saved;
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to save post");
      return null;
    }
  };

  const handleSaveDraft = async () => {
    const saved = await persist("draft");
    if (saved) {
      toast.success("Draft saved");
      if (isNew) navigate(`/admin/blogs/edit/${saved.id}`, { replace: true });
    }
  };

  const handlePublish = async () => {
    const saved = await persist("published");
    if (saved) toast.success("Post published");
    if (saved && isNew) navigate(`/admin/blogs/edit/${saved.id}`, { replace: true });
  };

  const handleSchedule = async () => {
    if (!form.scheduledAt) {
      toast.error("Pick a date and time first");
      return;
    }
    const saved = await persist("scheduled");
    if (saved) {
      toast.success("Post scheduled");
      setScheduleOpen(false);
      if (isNew) navigate(`/admin/blogs/edit/${saved.id}`, { replace: true });
    }
  };

  // Autosave every 60s for existing posts when there's a title
  useEffect(() => {
    if (currentId == null) return;
    const t = setInterval(() => {
      if (!form.title.trim()) return;
      void persist();
    }, 60_000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, form]);

  const onPickImage = () => fileRef.current?.click();
  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1_500_000) {
      toast.error("Image too large (max 1.5MB)");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      set("featuredImage", reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (form.tags.includes(t)) {
      setTagInput("");
      return;
    }
    if (form.tags.length >= 20) {
      toast.error("Max 20 tags");
      return;
    }
    set("tags", [...form.tags, t]);
    setTagInput("");
  };

  const removeTag = (t: string) =>
    set(
      "tags",
      form.tags.filter((x) => x !== t),
    );

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      const cat = await createCategory.mutateAsync({
        data: {
          name: newCatName.trim(),
          description: newCatDesc.trim() || null,
        },
      });
      qc.invalidateQueries({
        queryKey: getAdminListBlogCategoriesQueryKey(),
      });
      set("categoryId", cat.id);
      setNewCatName("");
      setNewCatDesc("");
      setNewCatOpen(false);
      toast.success("Category created");
    } catch {
      toast.error("Failed to create category");
    }
  };

  const isSaving = createPost.isPending || updatePost.isPending;
  const categories = categoriesQuery.data?.categories ?? [];

  if (!isNew && postQuery.isLoading) {
    return (
      <AdminLayout title="Edit post" subtitle="Loading…">
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading post…
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={isNew ? "New blog post" : "Edit blog post"}
      subtitle={
        lastSavedAt
          ? `Last saved ${lastSavedAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`
          : "Not saved yet"
      }
      actions={
        <Button variant="ghost" onClick={() => navigate("/admin/blogs")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left: editor */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-5 space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="Your captivating headline…"
                  className="mt-1 text-lg font-medium"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/blog/</span>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => {
                      set("slug", slugify(e.target.value));
                      set("slugManual", true);
                    }}
                    placeholder="post-url-slug"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={form.excerpt}
                  onChange={(e) => set("excerpt", e.target.value.slice(0, 500))}
                  placeholder="One- or two-sentence summary shown in lists and previews."
                  className="mt-1"
                  rows={2}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {form.excerpt.length}/500
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 space-y-2">
              <Label>Content</Label>
              <TipTapEditor
                value={form.content}
                onChange={(html) => set("content", html)}
                placeholder="Write your story…"
              />
              <div className="text-xs text-muted-foreground">
                ~{readingTime} min read
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <Collapsible open={seoOpen} onOpenChange={setSeoOpen}>
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between text-left"
                  >
                    <div>
                      <div className="font-medium">SEO settings</div>
                      <div className="text-xs text-muted-foreground">
                        Override title and description for search engines
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        seoOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="metaTitle">Meta title</Label>
                    <Input
                      id="metaTitle"
                      value={form.metaTitle}
                      onChange={(e) =>
                        set("metaTitle", e.target.value.slice(0, 200))
                      }
                      placeholder={form.title}
                      className="mt-1"
                    />
                    <div
                      className={`text-xs text-right ${
                        form.metaTitle.length > 60
                          ? "text-orange-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {form.metaTitle.length}/60 recommended
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="metaDesc">Meta description</Label>
                    <Textarea
                      id="metaDesc"
                      value={form.metaDescription}
                      onChange={(e) =>
                        set("metaDescription", e.target.value.slice(0, 400))
                      }
                      placeholder={form.excerpt}
                      className="mt-1"
                      rows={3}
                    />
                    <div
                      className={`text-xs text-right ${
                        form.metaDescription.length > 160
                          ? "text-orange-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {form.metaDescription.length}/160 recommended
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </div>

        {/* Right: sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Status</div>
                <Badge
                  className={
                    form.status === "published"
                      ? "bg-green-100 text-green-800"
                      : form.status === "scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-slate-200 text-slate-700"
                  }
                >
                  {form.status}
                </Badge>
              </div>
              <Button
                onClick={handleSaveDraft}
                disabled={isSaving}
                variant="outline"
                className="w-full"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save as draft
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isSaving}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Publish now
              </Button>
              <Button
                onClick={() => setScheduleOpen(true)}
                disabled={isSaving}
                variant="outline"
                className="w-full"
              >
                <CalendarClock className="mr-2 h-4 w-4" />
                Schedule…
              </Button>
              {currentId != null && form.status === "published" && (
                <Button
                  asChild
                  variant="ghost"
                  className="w-full"
                >
                  <a
                    href={`/blog/${form.slug}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview live
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <Label>Featured image</Label>
              {form.featuredImage ? (
                <div className="relative">
                  <img
                    src={form.featuredImage}
                    alt=""
                    className="w-full rounded-md border object-cover"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute right-2 top-2 h-7 w-7"
                    onClick={() => set("featuredImage", null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onPickImage}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-slate-200 p-6 text-sm text-muted-foreground hover:border-orange-300 hover:bg-orange-50"
                >
                  <ImageIcon className="h-8 w-8 text-slate-300" />
                  Click to upload
                  <span className="text-xs">PNG, JPG up to 1.5MB</span>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onImageChange}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <Label>Category</Label>
              <Select
                value={form.categoryId == null ? "none" : String(form.categoryId)}
                onValueChange={(v) =>
                  set("categoryId", v === "none" ? null : Number(v))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Uncategorized</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setNewCatOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                New category
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-1">
                {form.tags.map((t) => (
                  <Badge
                    key={t}
                    variant="secondary"
                    className="bg-slate-100 hover:bg-slate-200"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="ml-1 text-slate-500 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {form.tags.length === 0 && (
                  <span className="text-xs text-muted-foreground">
                    No tags yet
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add tag…"
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-3">
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={form.author}
                  onChange={(e) => set("author", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Reading time auto-computed: ~{readingTime} min
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Schedule dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule publication</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="scheduledAt">Publish at</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              value={form.scheduledAt ?? ""}
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) => set("scheduledAt", e.target.value || null)}
            />
            <p className="text-xs text-muted-foreground">
              Post will be saved as scheduled. (Background publishing requires a
              cron job — for now this acts as a planning marker.)
            </p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setScheduleOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleSchedule}
              disabled={!form.scheduledAt || isSaving}
            >
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New category dialog */}
      <Dialog open={newCatOpen} onOpenChange={setNewCatOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New category</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="newCatName">Name</Label>
              <Input
                id="newCatName"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Branding"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="newCatDesc">Description (optional)</Label>
              <Textarea
                id="newCatDesc"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                rows={2}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setNewCatOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleCreateCategory}
              disabled={!newCatName.trim() || createCategory.isPending}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

export function AdminBlogNewPage() {
  return (
    <RequireAdmin>
      <AdminBlogEditContent id={null} />
    </RequireAdmin>
  );
}

export default function AdminBlogEditPage() {
  const [, params] = useRoute<{ id: string }>("/admin/blogs/edit/:id");
  const id = params?.id ? Number(params.id) : null;
  return (
    <RequireAdmin>
      <AdminBlogEditContent id={Number.isFinite(id) ? id : null} />
    </RequireAdmin>
  );
}
