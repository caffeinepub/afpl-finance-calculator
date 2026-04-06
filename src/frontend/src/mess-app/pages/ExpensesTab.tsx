import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Pencil, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Expense } from "../types";
import type { useMessStore } from "../useMessStore";
import { formatDate, formatINR, getInitials, todayISO } from "../utils";

type Store = ReturnType<typeof useMessStore>;

const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-700",
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
];

interface Props {
  store: Store;
  addDialogOpen?: boolean;
  onAddDialogOpenChange?: (open: boolean) => void;
}

const EMPTY_FORM = { item: "", amount: "", date: todayISO(), paidById: "" };

export function ExpensesTab({
  store,
  addDialogOpen = false,
  onAddDialogOpenChange,
}: Props) {
  const {
    store: data,
    totalExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
  } = store;

  const [internalAddOpen, setInternalAddOpen] = useState(false);
  const isAddOpen = onAddDialogOpenChange ? addDialogOpen : internalAddOpen;
  const setAddOpen = onAddDialogOpenChange ?? setInternalAddOpen;

  const [form, setForm] = useState(EMPTY_FORM);
  const [editExp, setEditExp] = useState<Expense | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);

  const getMemberName = (id: string) =>
    data.members.find((m) => m.id === id)?.name ?? "Unknown";

  const getMemberIndex = (id: string) =>
    data.members.findIndex((m) => m.id === id);

  const handleAdd = () => {
    if (!form.item.trim() || !form.amount || !form.paidById) return;
    addExpense({
      item: form.item.trim(),
      amount: Number(form.amount),
      date: form.date,
      paidById: form.paidById,
    });
    setForm(EMPTY_FORM);
    setAddOpen(false);
  };

  const openEdit = (e: Expense) => {
    setEditExp(e);
    setEditForm({
      item: e.item,
      amount: String(e.amount),
      date: e.date,
      paidById: e.paidById,
    });
  };

  const handleEdit = () => {
    if (
      !editExp ||
      !editForm.item.trim() ||
      !editForm.amount ||
      !editForm.paidById
    )
      return;
    updateExpense(editExp.id, {
      item: editForm.item.trim(),
      amount: Number(editForm.amount),
      date: editForm.date,
      paidById: editForm.paidById,
    });
    setEditExp(null);
  };

  const sortedExpenses = [...data.expenses].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <div className="animate-fade-in space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Expenses</h2>
          <p className="text-xs text-muted-foreground">
            {data.expenses.length} records
          </p>
        </div>
        <Button
          size="sm"
          className="bg-primary text-white rounded-xl"
          onClick={() => setAddOpen(true)}
          data-ocid="expenses.add_expense.button"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Expense
        </Button>
      </div>

      {sortedExpenses.length === 0 ? (
        <Card
          className="border-dashed shadow-card"
          data-ocid="expenses.empty_state"
        >
          <CardContent className="py-10 text-center text-muted-foreground">
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-25" />
            <p className="font-medium">No expenses yet</p>
            <p className="text-sm mt-1">Record your first mess expense.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {sortedExpenses.map((exp, i) => {
            const mIdx = getMemberIndex(exp.paidById);
            const colorCls =
              AVATAR_COLORS[mIdx % AVATAR_COLORS.length] || AVATAR_COLORS[0];
            return (
              <Card
                key={exp.id}
                className="shadow-card"
                data-ocid={`expenses.item.${i + 1}`}
              >
                <CardContent className="px-4 py-3 flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${colorCls}`}
                  >
                    {getInitials(getMemberName(exp.paidById))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{exp.item}</p>
                    <p className="text-xs text-muted-foreground">
                      {getMemberName(exp.paidById)} · {formatDate(exp.date)}
                    </p>
                  </div>
                  <span className="font-bold text-sm text-orange-600 flex-shrink-0 mr-1">
                    {formatINR(exp.amount)}
                  </span>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-7 h-7 text-muted-foreground hover:text-primary"
                      onClick={() => openEdit(exp)}
                      data-ocid={`expenses.edit_button.${i + 1}`}
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="w-7 h-7 text-muted-foreground hover:text-destructive"
                          data-ocid={`expenses.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Expense?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Remove <strong>{exp.item}</strong> (
                            {formatINR(exp.amount)}) from records?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel data-ocid="expenses.delete.cancel_button">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-white hover:bg-destructive/90"
                            onClick={() => deleteExpense(exp.id)}
                            data-ocid="expenses.delete.confirm_button"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Total */}
          <Card className="shadow-card border-orange-200 bg-orange-50">
            <CardContent className="px-4 py-3 flex items-center justify-between">
              <span className="font-semibold text-sm text-orange-700">
                Total Expenses
              </span>
              <span className="font-bold text-base text-orange-700">
                {formatINR(totalExpenses)}
              </span>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Expense Dialog */}
      <Dialog
        open={isAddOpen}
        onOpenChange={(open) => {
          setAddOpen(open);
          if (!open) setForm(EMPTY_FORM);
        }}
      >
        <DialogContent data-ocid="expenses.add_expense.dialog">
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>
          <ExpenseForm form={form} setForm={setForm} members={data.members} />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              data-ocid="expenses.add_expense.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!form.item.trim() || !form.amount || !form.paidById}
              data-ocid="expenses.add_expense.submit_button"
            >
              Add Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Expense Dialog */}
      <Dialog
        open={!!editExp}
        onOpenChange={(open) => !open && setEditExp(null)}
      >
        <DialogContent data-ocid="expenses.edit_expense.dialog">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <ExpenseForm
            form={editForm}
            setForm={setEditForm}
            members={data.members}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditExp(null)}
              data-ocid="expenses.edit_expense.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={
                !editForm.item.trim() || !editForm.amount || !editForm.paidById
              }
              data-ocid="expenses.edit_expense.save_button"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ExpenseForm({
  form,
  setForm,
  members,
}: {
  form: { item: string; amount: string; date: string; paidById: string };
  setForm: React.Dispatch<React.SetStateAction<typeof form>>;
  members: { id: string; name: string }[];
}) {
  return (
    <div className="space-y-3 py-2">
      <div className="space-y-1.5">
        <Label>Item Name</Label>
        <Input
          placeholder="e.g. Rice & Dal"
          value={form.item}
          onChange={(e) => setForm((f) => ({ ...f, item: e.target.value }))}
          data-ocid="expenses.form.item.input"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Amount (₹)</Label>
        <Input
          type="number"
          min={0}
          placeholder="0"
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          data-ocid="expenses.form.amount.input"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Date</Label>
        <Input
          type="date"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          data-ocid="expenses.form.date.input"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Paid By</Label>
        <Select
          value={form.paidById}
          onValueChange={(v) => setForm((f) => ({ ...f, paidById: v }))}
        >
          <SelectTrigger data-ocid="expenses.form.paid_by.select">
            <SelectValue placeholder="Select member" />
          </SelectTrigger>
          <SelectContent>
            {members.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
