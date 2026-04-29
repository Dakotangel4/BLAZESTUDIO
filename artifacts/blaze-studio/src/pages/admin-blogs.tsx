import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  useAdminListBlogPosts,
  useAdminListBlogCategories,
  useAdminDeleteBlogPost,
  useAdminBulkBlogPosts,
  getAdminListBlogPostsQueryKey,
  type AdminBlogPost,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  Search,
  CalendarClock,
  CheckCircle2,
  FilePen,
  Eye,
  Trash2,
  Pencil,
  ArrowUpDown,
} from "lucide-react";
import RequireAdmin from "@/components/admin/require-admin";
import AdminLayout from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type StatusFilter = "all" | "draft" | "published" | "scheduled";
type SortField = "updatedAt" | "title" | "status";

function StatusBadge({ status }: { status: AdminBlogPost["status"] }) {
  if (status === "published") {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Published
      </Badge>
    );
  }
  if (status === "scheduled") {
    return (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
        Scheduled
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="bg-slate-200 text-slate-700">
      Draft
    </Badge>
  );
}

function fmtDate(d: string | Date | null | undefined) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function AdminBlogsContent() {
  const [, navigate] = useLocation();
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("updatedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [bulkConfirm, setBulkConfirm] = useState(false);

  const postsQuery = useAdminListBlogPosts();
  const categoriesQuery = useAdminListBlogCategories();
  const deletePost = useAdminDeleteBlogPost();
  const bulkAction = useAdminBulkBlogPosts();

  const posts = postsQuery.data?.posts ?? [];
  const categories = categoriesQuery.data?.categories ?? [];

  const stats = useMemo(() => {
    const now = new Date();
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      total: posts.length,
      published: posts.filter((p) => p.status === "published").length,
      drafts: posts.filter((p) => p.status === "draft").length,
      thisMonth: posts.filter((p) => new Date(p.createdAt) >= startMonth).length,
    };
  }, [posts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = posts.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (categoryFilter !== "all") {
        if (categoryFilter === "none" && p.categoryId != null) return false;
        if (
          categoryFilter !== "none" &&
          String(p.categoryId ?? "") !== categoryFilter
        )
          return false;
      }
      if (q) {
        const hay =
          `${p.title} ${p.author} ${p.tags.join(" ")} ${p.categoryName ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortField === "title") cmp = a.title.localeCompare(b.title);
      else if (sortField === "status") cmp = a.status.localeCompare(b.status);
      else
        cmp =
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [posts, search, statusFilter, categoryFilter, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const allOnPageSelected =
    pageItems.length > 0 && pageItems.every((p) => selected.has(p.id));

  const toggleAllOnPage = (checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      pageItems.forEach((p) => {
        if (checked) next.add(p.id);
        else next.delete(p.id);
      });
      return next;
    });
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "title" ? "asc" : "desc");
    }
  };

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: getAdminListBlogPostsQueryKey() });
  };

  const handleDelete = async () => {
    if (deletingId == null) return;
    try {
      await deletePost.mutateAsync({ id: deletingId });
      toast.success("Post deleted");
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(deletingId);
        return next;
      });
      invalidate();
    } catch {
      toast.error("Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  const runBulk = async (action: "delete" | "publish" | "unpublish") => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    try {
      const res = await bulkAction.mutateAsync({
        data: { ids, action },
      });
      toast.success(
        `${res.affected} post${res.affected === 1 ? "" : "s"} ${
          action === "delete"
            ? "deleted"
            : action === "publish"
              ? "published"
              : "moved to draft"
        }`,
      );
      setSelected(new Set());
      invalidate();
    } catch {
      toast.error("Bulk action failed");
    } finally {
      setBulkConfirm(false);
    }
  };

  return (
    <AdminLayout
      title="Blog posts"
      subtitle="Create, edit, and publish content for the Blaze Studio blog."
      actions={
        <Button
          onClick={() => navigate("/admin/blogs/new")}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          New post
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="rounded-md bg-orange-100 p-3">
              <FileText className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total posts</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="rounded-md bg-green-100 p-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.published}</div>
              <div className="text-xs text-muted-foreground">Published</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="rounded-md bg-slate-200 p-3">
              <FilePen className="h-5 w-5 text-slate-700" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.drafts}</div>
              <div className="text-xs text-muted-foreground">Drafts</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="rounded-md bg-blue-100 p-3">
              <CalendarClock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.thisMonth}</div>
              <div className="text-xs text-muted-foreground">This month</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 items-center gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search title, tag, author…"
                className="pl-8"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v as StatusFilter);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={categoryFilter}
              onValueChange={(v) => {
                setCategoryFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="none">Uncategorized</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(Number(v));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="25">25 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk bar */}
      {selected.size > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-3 flex items-center justify-between gap-2">
            <div className="text-sm text-slate-700">
              <strong>{selected.size}</strong> selected
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => runBulk("publish")}
                disabled={bulkAction.isPending}
              >
                Publish
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => runBulk("unpublish")}
                disabled={bulkAction.isPending}
              >
                Move to draft
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => setBulkConfirm(true)}
                disabled={bulkAction.isPending}
              >
                Delete
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelected(new Set())}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {postsQuery.isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-3 text-lg font-semibold">No posts found</h3>
              <p className="text-sm text-muted-foreground">
                {posts.length === 0
                  ? "Create your first blog post to get started."
                  : "Try adjusting your filters."}
              </p>
              {posts.length === 0 && (
                <Button
                  className="mt-4 bg-orange-500 hover:bg-orange-600"
                  onClick={() => navigate("/admin/blogs/new")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New post
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={allOnPageSelected}
                        onCheckedChange={(v) => toggleAllOnPage(Boolean(v))}
                        aria-label="Select all on page"
                      />
                    </TableHead>
                    <TableHead className="w-14">Image</TableHead>
                    <TableHead>
                      <button
                        className="flex items-center gap-1 hover:text-foreground"
                        onClick={() => toggleSort("title")}
                      >
                        Title <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>
                      <button
                        className="flex items-center gap-1 hover:text-foreground"
                        onClick={() => toggleSort("status")}
                      >
                        Status <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        className="flex items-center gap-1 hover:text-foreground"
                        onClick={() => toggleSort("updatedAt")}
                      >
                        Updated <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </TableHead>
                    <TableHead className="w-32 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageItems.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <Checkbox
                          checked={selected.has(p.id)}
                          onCheckedChange={(v) => {
                            setSelected((prev) => {
                              const next = new Set(prev);
                              if (v) next.add(p.id);
                              else next.delete(p.id);
                              return next;
                            });
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {p.featuredImage ? (
                          <img
                            src={p.featuredImage}
                            alt=""
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-slate-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-slate-900 line-clamp-1">
                          {p.title}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          /{p.slug}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {p.categoryName ?? (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{p.author}</TableCell>
                      <TableCell>
                        <StatusBadge status={p.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {fmtDate(p.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            title="Preview"
                          >
                            <a
                              href={`/blog/${p.slug}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit"
                            onClick={() =>
                              navigate(`/admin/blogs/edit/${p.id}`)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete"
                            onClick={() => setDeletingId(p.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {filtered.length > 0 && (
            <div className="flex items-center justify-between border-t p-3">
              <div className="text-xs text-muted-foreground">
                Showing {(safePage - 1) * pageSize + 1}–
                {Math.min(safePage * pageSize, filtered.length)} of{" "}
                {filtered.length}
              </div>
              <Pagination className="m-0 w-auto justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.max(1, p - 1));
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages })
                    .slice(0, 5)
                    .map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          isActive={safePage === i + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(i + 1);
                          }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.min(totalPages, p + 1));
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground">
        Manage categories on the{" "}
        <Link
          href="/admin/blogs/categories"
          className="text-orange-600 hover:underline"
        >
          categories page
        </Link>
        .
      </div>

      {/* Single delete confirm */}
      <AlertDialog
        open={deletingId != null}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post and its content will be
              permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk delete confirm */}
      <AlertDialog open={bulkConfirm} onOpenChange={setBulkConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selected.size} posts?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => runBulk("delete")}
            >
              Delete all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}

export default function AdminBlogsPage() {
  return (
    <RequireAdmin>
      <AdminBlogsContent />
    </RequireAdmin>
  );
}
