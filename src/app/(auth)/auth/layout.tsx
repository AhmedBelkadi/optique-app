// Force dynamic rendering
export const dynamic = 'force-dynamic';


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <main className="flex-1">{children}</main>
    </>
  );
} 