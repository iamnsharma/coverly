const OPTIONS = ["Resume", "Cover Letter"];

const OptionSelector = ({ selectedOption, onSelect }) => (
  <div className="flex flex-col gap-4">
    <span className="text-sm font-semibold uppercase tracking-wide text-gray-500">
      Choose format
    </span>
    <div className="grid gap-3 md:grid-cols-2">
      {OPTIONS.map((option) => {
        const isActive = option === selectedOption;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className={`rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
              isActive
                ? "border-primary bg-primary/10 text-primary shadow-soft"
                : "border-gray-200 bg-white text-gray-600 hover:border-primary hover:bg-primary/5 hover:text-primary"
            }`}
          >
            <span className="block text-lg font-semibold">{option}</span>
            <span className="mt-1 block text-sm text-gray-500">
              {option === "Resume"
                ? "Polished resume layout with AI-refined sections."
                : "Thoughtful letter tailored to your role."}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

export default OptionSelector;


