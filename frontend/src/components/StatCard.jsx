export default function StatCard({ icon: Icon, label, value, sublabel, gradient }) {
  return (
    <div className="stat-card group cursor-pointer overflow-hidden relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
        
        <h3 className="text-sm font-medium text-slate-600 mb-2">{label}</h3>
        <p className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-1">
          {value}
        </p>
        {sublabel && (
          <p className="text-sm text-slate-500">{sublabel}</p>
        )}
      </div>
    </div>
  );
}