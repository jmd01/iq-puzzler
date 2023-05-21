export const Board = ({
  setBoardRef,
}: {
  setBoardRef: (element: HTMLElement | null) => void;
}) => {
  return (
    <div className="grid grid-cols-1 items-center justify-items-center p-4">
      <div className="p-4 rounded-3xl bg-gradient-to-b from-slate-500 to-slate-600">
        <div className="inline-grid grid-cols-12 gap-2 " ref={setBoardRef}>
          {[...Array(72)].map((_, i) => (
            <span
              key={i}
              className="w-16 h-16 rounded-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-800 to-slate-400" />
          ))}
        </div>
      </div>
    </div>
  );
};
