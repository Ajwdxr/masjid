export default function TVLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-screen h-screen overflow-hidden bg-dark">
      {children}
    </div>
  );
}
