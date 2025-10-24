interface StatCardsGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}

export function StatCardsGrid({ children, columns = 4 }: StatCardsGridProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
      {children}
    </div>
  );
}
