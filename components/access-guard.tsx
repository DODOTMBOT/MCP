// Server-side no-op guard placeholder: checks are enforced by Sidebar filtering and middleware login protection.
export default function AccessGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
