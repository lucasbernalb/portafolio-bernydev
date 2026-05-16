"use client";

export default function NavigationLoader() {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#0A0A0F]">
      <div className="relative flex flex-col items-center gap-6">
        {/* Spinner simple con la paleta de colores */}
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin" />
          <div className="absolute inset-0 rounded-full blur-sm opacity-50">
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-400 animate-spin" />
          </div>
        </div>

        <p className="text-xs font-medium text-zinc-500 tracking-widest uppercase animate-pulse">
          Cargando
        </p>
      </div>
    </div>
  );
}
