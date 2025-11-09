const SectionHeading = ({ children }) => (
  <h3 className="text-base font-semibold uppercase tracking-wide text-gray-500">
    {children}
  </h3>
);

const ResumeSection = ({ title, children }) => (
  <div className="space-y-3">
    <SectionHeading>{title}</SectionHeading>
    <div className="space-y-3 text-sm leading-relaxed text-gray-700">
      {children}
    </div>
  </div>
);

const OutputBox = ({
  output,
  resumeData,
  selectedOption,
  onCopy,
  onClear,
  onDownload,
}) => {
  const hasResume = selectedOption === "Resume" && Boolean(resumeData);
  const hasOutputText = Boolean(output.trim());
  const hasOutput = hasResume || hasOutputText;

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
        {hasResume && resumeData && (
          <div className="flex h-full flex-col gap-6 overflow-y-auto px-5 py-4 pr-6">
            <header className="border-b border-gray-200 pb-4">
              <h1 className="text-2xl font-semibold text-gray-900">
                {resumeData.contact?.name ?? "Candidate Name"}
              </h1>
              <p className="text-sm text-gray-600">
                {resumeData.contact?.headline ?? selectedOption}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500">
                {[resumeData.contact?.location, resumeData.contact?.email, resumeData.contact?.phone]
                  .filter(Boolean)
                  .map((item) => (
                    <span key={item}>{item}</span>
                  ))}
              </div>
              {Array.isArray(resumeData.contact?.links) &&
                resumeData.contact.links.length > 0 && (
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-primary">
                    {resumeData.contact.links.filter(Boolean).map((link) => (
                      <a
                        key={link}
                        href={link}
                        className="hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                )}
            </header>

            {resumeData.summary && (
              <ResumeSection title="Profile">
                <p>{resumeData.summary}</p>
              </ResumeSection>
            )}

            {Array.isArray(resumeData.experience) &&
              resumeData.experience.length > 0 && (
                <ResumeSection title="Professional Experience">
                  {resumeData.experience.map((item, index) => (
                    <div
                      key={`${item.company}-${index}`}
                      className="space-y-1 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {item.role ?? "Role"} · {item.company ?? "Company"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {[item.location, `${item.start ?? ""} - ${item.end ?? ""}`]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                      </div>
                      <ul className="mt-2 space-y-1 text-sm text-gray-700">
                        {Array.isArray(item.bullets) &&
                          item.bullets.map((bullet, bulletIndex) => (
                            <li key={`bullet-${index}-${bulletIndex}`} className="flex gap-2">
                              <span className="text-primary">•</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </ResumeSection>
              )}

            {Array.isArray(resumeData.education) &&
              resumeData.education.length > 0 && (
                <ResumeSection title="Education">
                  {resumeData.education.map((item, index) => (
                    <div key={`${item.institution}-${index}`} className="space-y-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.degree ?? "Degree"} · {item.institution ?? "Institution"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {[item.start, item.end].filter(Boolean).join(" – ")}
                      </p>
                      {item.details && (
                        <p className="text-sm text-gray-700">{item.details}</p>
                      )}
                    </div>
                  ))}
                </ResumeSection>
              )}

            {(resumeData.skills?.core?.length ||
              resumeData.skills?.soft?.length) && (
              <ResumeSection title="Skills">
                {resumeData.skills?.core?.length && (
                  <p>
                    <span className="font-semibold text-gray-800">Core:</span>{" "}
                    {resumeData.skills.core.join(", ")}
                  </p>
                )}
                {resumeData.skills?.soft?.length && (
                  <p>
                    <span className="font-semibold text-gray-800">Soft:</span>{" "}
                    {resumeData.skills.soft.join(", ")}
                  </p>
                )}
              </ResumeSection>
            )}

            {Array.isArray(resumeData.certifications) &&
              resumeData.certifications.length > 0 && (
                <ResumeSection title="Certifications">
                  <ul className="space-y-1 text-sm text-gray-700">
                    {resumeData.certifications.map((certification, index) => (
                      <li key={`cert-${index}`} className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{certification}</span>
                      </li>
                    ))}
                  </ul>
                </ResumeSection>
              )}

            {Array.isArray(resumeData.projects) &&
              resumeData.projects.length > 0 && (
                <ResumeSection title="Projects">
                  <ul className="space-y-1 text-sm text-gray-700">
                    {resumeData.projects.map((project, index) => (
                      <li key={`project-${index}`} className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{project}</span>
                      </li>
                    ))}
                  </ul>
                </ResumeSection>
              )}
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

