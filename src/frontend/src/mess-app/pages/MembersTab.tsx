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
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import type { Member } from "../types";
import type { useMessStore } from "../useMessStore";
import { formatINR, getInitials } from "../utils";

type Store = ReturnType<typeof useMessStore>;

const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-700",
  "bg-blue-100 text-blue-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
  "bg-cyan-100 text-cyan-700",
];

interface Props {
  store: Store;
  addDialogOpen?: boolean;
  onAddDialogOpenChange?: (open: boolean) => void;
}

export function MembersTab({
  store,
  addDialogOpen = false,
  onAddDialogOpenChange,
}: Props) {
  const {
    store: data,
    totalContributions,
    memberExpenseMap,
    addMember,
    updateMember,
    deleteMember,
  } = store;

  const [internalAddOpen, setInternalAddOpen] = useState(false);
  const isAddOpen = onAddDialogOpenChange ? addDialogOpen : internalAddOpen;
  const setAddOpen = onAddDialogOpenChange ?? setInternalAddOpen;

  const [addName, setAddName] = useState("");
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [editName, setEditName] = useState("");
  const [editContrib, setEditContrib] = useState("");

  const handleAdd = () => {
    if (!addName.trim()) return;
    addMember(addName.trim());
    setAddName("");
    setAddOpen(false);
  };

  const openEdit = (m: Member) => {
    setEditMember(m);
    setEditName(m.name);
    setEditContrib(String(m.contribution));
  };

  const handleEdit = () => {
    if (!editMember || !editName.trim()) return;
    updateMember(editMember.id, {
      name: editName.trim(),
      contribution: Math.max(0, Number(editContrib) || 0),
    });
    setEditMember(null);
  };

  return (
    <div className="animate-fade-in space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Members</h2>
          <p className="text-xs text-muted-foreground">
            {data.members.length} registered
          </p>
        </div>
        <Button
          size="sm"
          className="bg-primary text-white rounded-xl"
          onClick={() => setAddOpen(true)}
          data-ocid="members.add_member.button"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Member
        </Button>
      </div>

      {data.members.length === 0 ? (
        <Card
          className="border-dashed shadow-card"
          data-ocid="members.empty_state"
        >
          <CardContent className="py-10 text-center text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-25" />
            <p className="font-medium">No members yet</p>
            <p className="text-sm mt-1">
              Add your first mess member to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {data.members.map((m, i) => (
            <Card
              key={m.id}
              className="shadow-card"
              data-ocid={`members.item.${i + 1}`}
            >
              <CardContent className="px-4 py-3 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                >
                  {getInitials(m.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{m.name}</p>
                  <div className="flex gap-3 mt-0.5">
                    <span className="text-xs text-emerald-600 font-medium">
                      Paid: {formatINR(m.contribution)}
                    </span>
                    <span className="text-xs text-orange-500 font-medium">
                      Spent: {formatINR(memberExpenseMap[m.id] ?? 0)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 text-muted-foreground hover:text-primary"
                    onClick={() => openEdit(m)}
                    data-ocid={`members.edit_button.${i + 1}`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 text-muted-foreground hover:text-destructive"
                        data-ocid={`members.delete_button.${i + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Member?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove <strong>{m.name}</strong> and all
                          their associated expenses.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel data-ocid="members.delete.cancel_button">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-white hover:bg-destructive/90"
                          onClick={() => deleteMember(m.id)}
                          data-ocid="members.delete.confirm_button"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Total row */}
          <Card className="shadow-card border-primary/20 bg-secondary">
            <CardContent className="px-4 py-3 flex items-center justify-between">
              <span className="font-semibold text-sm text-primary">
                Total Contributions
              </span>
              <span className="font-bold text-base text-primary">
                {formatINR(totalContributions)}
              </span>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Member Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setAddOpen}>
        <DialogContent data-ocid="members.add_member.dialog">
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="member-name">Name</Label>
              <Input
                id="member-name"
                placeholder="Enter member name"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                data-ocid="members.add_member.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              data-ocid="members.add_member.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!addName.trim()}
              data-ocid="members.add_member.submit_button"
            >
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog
        open={!!editMember}
        onOpenChange={(open) => !open && setEditMember(null)}
      >
        <DialogContent data-ocid="members.edit_member.dialog">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Member name"
                data-ocid="members.edit_member.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Contribution (₹)</Label>
              <Input
                type="number"
                min={0}
                value={editContrib}
                onChange={(e) => setEditContrib(e.target.value)}
                placeholder="0"
                data-ocid="members.edit_member.contribution_input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditMember(null)}
              data-ocid="members.edit_member.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={!editName.trim()}
              data-ocid="members.edit_member.save_button"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
