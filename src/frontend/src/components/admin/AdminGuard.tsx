import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsCallerAdmin } from "@/state/useAdminRole";
import { ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import LoginButton from "../auth/LoginButton";

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isCheckingAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  if (isInitializing || isCheckingAdmin) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-slate-600 dark:text-slate-400">
              Loading...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Access Required</CardTitle>
            <CardDescription>
              Please log in to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6">
            <LoginButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <ShieldAlert className="h-6 w-6 text-red-500" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                You do not have administrator privileges to access this panel.
              </AlertDescription>
            </Alert>
            <div className="flex justify-center">
              <LoginButton />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
