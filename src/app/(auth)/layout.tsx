// src/app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center w-full"
      style={{ backgroundImage: "url('')" }}>
      {children}
    </div>
  );
}
