import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Block, MealPlan, Student, StudentStatus } from "../types";

interface StudentsProps {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

const BLANK: Omit<Student, "id"> = {
  name: "",
  roomNumber: "",
  block: "A",
  mealPlan: "Full",
  status: "Active",
};

export function Students({ students, setStudents }: StudentsProps) {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Student, "id">>(BLANK);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.roomNumber.includes(search),
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(BLANK);
    setDialogOpen(true);
  };

  const openEdit = (s: Student) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      roomNumber: s.roomNumber,
      block: s.block,
      mealPlan: s.mealPlan,
      status: s.status,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.roomNumber.trim()) {
      toast.error("Name and Room Number are required");
      return;
    }
    if (editingId) {
      setStudents((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...form } : s)),
      );
      toast.success("Student updated");
    } else {
      const newId = `STU${String(students.length + 1).padStart(3, "0")}`;
      setStudents((prev) => [...prev, { id: newId, ...form }]);
      toast.success("Student added");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setDeleteId(null);
    toast.success("Student removed");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Students</h2>
          <p className="text-muted-foreground text-sm">
            Manage hostel student records
          </p>
        </div>
        <Button
          data-ocid="students.add_button"
          onClick={openAdd}
          className="bg-[oklch(0.22_0.09_253)] hover:bg-[oklch(0.27_0.09_253)]"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Student
        </Button>
      </div>

      <Card className="border border-border shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                data-ocid="students.search_input"
                placeholder="Search by name, ID, room..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {filtered.length} students
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-semibold">ID</TableHead>
                  <TableHead className="text-xs font-semibold">Name</TableHead>
                  <TableHead className="text-xs font-semibold">Block</TableHead>
                  <TableHead className="text-xs font-semibold">Room</TableHead>
                  <TableHead className="text-xs font-semibold">
                    Meal Plan
                  </TableHead>
                  <TableHead className="text-xs font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground py-10"
                      data-ocid="students.empty_state"
                    >
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((s, i) => (
                    <TableRow key={s.id} data-ocid={`students.item.${i + 1}`}>
                      <TableCell className="text-xs font-mono font-medium">
                        {s.id}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {s.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          Block {s.block}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{s.roomNumber}</TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs ${
                            s.mealPlan === "Full"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : s.mealPlan === "Partial"
                                ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                : "bg-muted text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {s.mealPlan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs ${
                            s.status === "Active"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : "bg-red-100 text-red-700 hover:bg-red-100"
                          }`}
                        >
                          {s.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            data-ocid={`students.edit_button.${i + 1}`}
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => openEdit(s)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            data-ocid={`students.delete_button.${i + 1}`}
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(s.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-ocid="students.dialog" className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Student" : "Add New Student"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Full Name</Label>
              <Input
                data-ocid="students.name.input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="Student name"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Room Number</Label>
                <Input
                  data-ocid="students.room.input"
                  value={form.roomNumber}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, roomNumber: e.target.value }))
                  }
                  placeholder="e.g. 101"
                />
              </div>
              <div className="space-y-1">
                <Label>Block</Label>
                <Select
                  value={form.block}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, block: v as Block }))
                  }
                >
                  <SelectTrigger data-ocid="students.block.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["A", "B", "C", "D"].map((b) => (
                      <SelectItem key={b} value={b}>
                        Block {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Meal Plan</Label>
                <Select
                  value={form.mealPlan}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, mealPlan: v as MealPlan }))
                  }
                >
                  <SelectTrigger data-ocid="students.mealplan.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full">Full</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, status: v as StudentStatus }))
                  }
                >
                  <SelectTrigger data-ocid="students.status.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="students.cancel_button"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="students.save_button"
              onClick={handleSave}
              className="bg-[oklch(0.22_0.09_253)] hover:bg-[oklch(0.27_0.09_253)]"
            >
              {editingId ? "Update" : "Add Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent data-ocid="students.delete.dialog" className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove this student? This action cannot be
            undone.
          </p>
          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              data-ocid="students.delete.cancel_button"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="students.delete.confirm_button"
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
