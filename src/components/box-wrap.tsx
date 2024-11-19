interface BoxWrapProps {
  children: React.ReactNode;
}

export default function BoxWrap({ children }: BoxWrapProps) {
  return (
    <div className="flex flex-col gap-4 rounded-md bg-slate-800/50 p-6 shadow-lg backdrop-blur">
      {children}
    </div>
  );
}
