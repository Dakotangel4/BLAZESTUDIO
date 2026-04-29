import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  useAdminListBlogCategories,
  useAdminCreateBlogCategory,
  useAdminUpdateBlogCategory,
  useAdminDeleteBlogCategory,
  getAdminListBlogCategoriesQueryKey,
  getAdminListBlogPostsQueryKey,
  type AdminBlogCategory,
} from "@workspace/api-client-react";
import {
  FolderTree,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Loader2,
} from "lucide-react";
import RequireAdmin from "@/components/admin/require-admin";
import AdminLayout from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

function AdminBlogCategoriesContent() {
  const qc = useQueryClient();
  const list = useAdminListBlogCategories();
  const createCat = useAdminCreateBlogCategory();
  const updateCat = useAdminUpdateBlogCategory();
  const deleteCat = useAdminDeleteBlogCategory();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<AdminBlogCategory | null>(
    null,
  );

  const categories = list.data?.categories ?? [];

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: getAdminListBlogCategoriesQueryKey() });
    qc.invalidateQueries({ queryKey: getAdminListBlogPostsQueryKey() });
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      await createCat.mutateAsync({
        data: { name: name.trim(), description: desc.trim() || null },
      });
      setName("");
      setDesc("");
      toast.success("Category created");
      invalidate();
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? "A category with that name may already exist"
          : "Failed to create category";
      toast.error(msg);
    }
  };

  const startEdit = (c: AdminBlogCategory) => {
    setEditingId(c.id);
    setEditName(c.name);
    setEditDesc(c.description ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDesc("");
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;
    try {
      await updateCat.mutateAsync({
        id,
        data: { name: editName.trim(), description: editDesc.trim() || null },
      });
      toast.success("Category updated");
      cancelEdit();
      invalidate();
    } catch {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteCat.mutateAsync({ id: confirmDelete.id });
      toast.success("Category deleted");
      invalidate();
    } catch {
      toast.error("Failed to delete category");
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <AdminLayout
      title="Blog categories"
      subtitle="Group blog posts under topical categories."
    >
      <Card>
        <CardContent className="p-5 grid gap-3 md:grid-cols-[1fr_2fr_auto] md:items-end">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Branding"
              className="mt-1"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
          <div>
            <Label htmlFor="desc">Description (optional)</Label>
            <Input
              id="desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="What's this category about?"
              className="mt-1"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || createCat.isPending}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {createCat.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Add
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {list.isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center">
              <FolderTree className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-3 text-lg font-semibold">No categories yet</h3>
              <p className="text-sm text-muted-foreground">
                Add your first category above.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-24">Posts</TableHead>
                  <TableHead className="w-32 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((c) => {
                  const isEditing = editingId === c.id;
                  return (
                    <TableRow key={c.id}>
                      <TableCell>
                        {isEditing ? (
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8"
                          />
                        ) : (
                          <div className="font-medium">{c.name}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        /{c.slug}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Textarea
                            rows={1}
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                          />
                        ) : (
                          <span className="text-sm">
                            {c.description ?? (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {c.postCount} {c.postCount === 1 ? "post" : "posts"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleUpdate(c.id)}
                              disabled={updateCat.isPending}
                              title="Save"
                            >
                              <Save className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={cancelEdit}
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => startEdit(c)}
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setConfirmDelete(c)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={confirmDelete != null}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete category “{confirmDelete?.name}”?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDelete && confirmDelete.postCount > 0 ? (
                <>
                  <strong>Heads up:</strong> this category currently has{" "}
                  {confirmDelete.postCount}{" "}
                  {confirmDelete.postCount === 1 ? "post" : "posts"}. Those
                  posts will become uncategorized.
                </>
              ) : (
                "This action cannot be undone."
              )}
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
    </AdminLayout>
  );
}

export default function AdminBlogCategoriesPage() {
  return (
    <RequireAdmin>
      <AdminBlogCategoriesContent />
    </RequireAdmin>
  );
}
