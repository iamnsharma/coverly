const Loader = () => (
  <div className="flex items-center justify-center gap-3 rounded-2xl border border-primary/20 bg-white/80 px-6 py-4 text-primary shadow-soft">
    <span className="relative flex h-4 w-4">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
      <span className="relative inline-flex h-4 w-4 rounded-full bg-primary" />
    </span>
    <span className="text-sm font-medium">Coverly is crafting your text…</span>
  </div>
);

export default Loader;


