"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate, getInitials, SuccessToast, ErrorToast } from "@/lib/utils";
import { User } from "@/types/users.type";
import { useState } from "react";
import { deleteUser, toggleUserBlock } from "@/services/users";
import { Button } from "@/components/ui/button";
import { Ban, LockOpen, Loader2, Trash2 } from "lucide-react";
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

const UserActions = ({ user }: { user: User }) => {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<"toggle" | "delete" | null>(null);

  const handleToggleBlock = async () => {
    setLoading(true);
    try {
      const res = await toggleUserBlock(user._id);
      if (res.success) {
        SuccessToast(`User ${user.isActive ? "blocked" : "unblocked"} successfully`);
        setAction(null);
      } else {
        ErrorToast(res.message || "Something went wrong");
      }
    } catch {
      ErrorToast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteUser(user._id);
      if (res.success) {
        SuccessToast("User deleted successfully");
        setAction(null);
      } else {
        ErrorToast(res.message || "Something went wrong");
      }
    } catch {
      ErrorToast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAction("toggle")}
          className={user.isActive ? "text-destructive hover:text-destructive hover:bg-destructive/10" : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"}
        >
          {user.isActive ? (
            <><Ban /> </>
          ) : (
            <><LockOpen /> </>
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAction("delete")}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 />
        </Button>
      </div>

      <AlertDialog open={action === "toggle"} onOpenChange={(open) => !open && setAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {user.isActive ? "Block User?" : "Unblock User?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {user.isActive ? "block" : "unblock"} this user? 
              {user.isActive 
                ? " They will no longer be able to access the platform." 
                : " They will regain access to the platform."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleToggleBlock();
              }} 
              disabled={loading}
              className={user.isActive ? "bg-destructive hover:bg-destructive/90" : "bg-blue-600 hover:bg-blue-700"}
            >
              {loading && <Loader2 className="animate-spin" />}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={action === "delete"} onOpenChange={(open) => !open && setAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the user from dashboard lists, delete any vendor profile tied to them, and archive their ads.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={loading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {loading && <Loader2 className="animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const usersColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground md:hidden">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground hidden md:inline-block">{row.getValue("email")}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.getValue("phone") || "N/A"}</span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.getValue("role")}
      </Badge>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge
          variant={isActive ? "default" : "destructive"}
          className="capitalize"
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDate(row.getValue("createdAt"))}
      </span>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right">
             <UserActions user={row.original} />
        </div>
      );
    },
  },
];
