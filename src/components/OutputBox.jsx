const OutputBox = ({
  output,
  resumeData,
  selectedOption,
  selectedTemplate,
  onCopy,
  onClear,
  onDownload,
}) => {
  const hasResume = selectedOption === "Resume" && Boolean(resumeData);
  const hasOutputText = Boolean(output.trim());
  const hasOutput = hasResume || hasOutputText;
  const Illustration = selectedTemplate?.Illustration;

  return (
    <section className="flex h-[720px] flex-col gap-4 rounded-3xl border border-gray-100 bg-white/90 p-6 shadow-lg shadow-gray-200/30 backdrop-blur-md md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Your AI draft</h2>
          <p className="text-sm text-gray-500">
            Refine as needed, then copy or download instantly.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onCopy}
            disabled={!hasOutput}
            className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-2 text-sm font-semibold text-primary transition-all duration-200 hover:border-primary hover:bg-primary/20 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
          >
            Copy
          </button>
          <button
            type="button"
            onClick={onClear}
            disabled={!hasOutput}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 transition-all duration-200 hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={!hasOutput}
            className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-primary/50"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden rounded-2xl border border-dashed border-primary/30 bg-white/70">
        {!hasOutput && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-gray-400">
            <span className="text-lg font-semibold">Your content appears here</span>
            <p className="max-w-sm text-sm">
              Select an option, fill in your details, and let Coverly craft the perfect
              wording for you.
            </p>
          </div>
        )}
        {hasResume && resumeData && Illustration && (
          <div className="flex h-full w-full justify-center overflow-auto bg-gray-50 p-4">
            <div
              className="pointer-events-none origin-top"
              style={{
                width: "620px",
                minWidth: "620px",
                transform: "scale(0.78)",
                transformOrigin: "top center",
              }}
            >
              <Illustration resume={resumeData} />
            </div>
          </div>
        )}

        {!hasResume && hasOutputText && (
          <article className="prose max-w-none overflow-y-auto px-5 py-4 pr-6 text-gray-700">
            {output.split("\n").map((paragraph, index) => (
              <p key={`paragraph-${index}`} className="mb-3 last:mb-0">
                {paragraph}
              </p>
            ))}
          </article>
        )}
      </div>
    </section>
  );
};

export default OutputBox;

