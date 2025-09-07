import ResetPasswordForm from '@/components/features/auth/ResetPasswordForm';

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted/50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <ResetPasswordForm />
    </div>
  );
}
