interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  valueColor?: string;
}

export default function StatCard({ 
  title, 
  value, 
  icon, 
  iconBg = "bg-emerald-50", 
  iconColor = "text-primary",
  valueColor = "text-[#585858]"
}: StatCardProps) {
  return (
    <div className="bg-white border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4 min-h-[120px] w-full">
      {icon && (
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl shrink-0 ${iconBg} ${iconColor}`}>
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#6D6D6D]">{title}</p>
        <p className={`text-3xl font-semibold mt-1 tracking-tight ${valueColor}`}>{value}</p>
      </div>
    </div>
  );
}
