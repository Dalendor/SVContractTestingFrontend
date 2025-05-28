export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="grow">
      {children}
    </div>
  );
}

