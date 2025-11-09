import React from "react";
import { jsPDF } from "jspdf";

const ensureArray = (value) => (Array.isArray(value) ? value : []);
const joinMeta = (items, separator = " · ") => items.filter(Boolean).join(separator);

const TemplateWrapper = ({ children, className = "", style = {} }) => (
  <div
    className={`min-h-[880px] w-[620px] bg-white text-gray-900 ${className}`}
    style={style}
  >
    {children}
  </div>
);

const DefaultResume = ({ resume }) => {
  const experience = ensureArray(resume.experience);
  const education = ensureArray(resume.education);
  const certifications = ensureArray(resume.certifications);
  const projects = ensureArray(resume.projects);

  return (
    <TemplateWrapper className="flex flex-col gap-6 p-8 text-sm leading-relaxed">
      <header className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold uppercase tracking-tight">
          {resume.contact?.name ?? "Candidate Name"}
        </h1>
        <p className="text-lg text-gray-600">
          {resume.contact?.headline ?? "Professional Headline"}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500">
          {joinMeta([
            resume.contact?.location,
            resume.contact?.email,
            resume.contact?.phone,
          ])}
        </div>
      </header>

      {resume.summary && (
        <section>
          <h2 className="mb-1 text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Profile
          </h2>
          <p>{resume.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Experience
          </h2>
          {experience.map((role, index) => (
            <article
              key={`${role.company}-${index}`}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">
                    {role.role ?? "Role"}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {joinMeta([
                      role.company,
                      role.location,
                      joinMeta([role.start, role.end], " – "),
                    ])}
                  </p>
                </div>
              </div>
              <ul className="mt-2 space-y-1 text-sm">
                {ensureArray(role.bullets).map((bullet, bulletIdx) => (
                  <li key={`default-bullet-${index}-${bulletIdx}`} className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Education
          </h2>
          {education.map((item, index) => (
            <div key={`${item.institution}-${index}`}>
              <p className="text-sm font-semibold">
                {item.degree ?? "Degree"} · {item.institution ?? "Institution"}
              </p>
              <p className="text-xs text-gray-500">
                {joinMeta([item.start, item.end], " – ")}
              </p>
              {item.details && <p>{item.details}</p>}
            </div>
          ))}
        </section>
      )}

      {(ensureArray(resume.skills?.core).length > 0 ||
        ensureArray(resume.skills?.soft).length > 0) && (
        <section className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Skills
          </h2>
          {ensureArray(resume.skills?.core).length > 0 && (
            <p>
              <span className="font-semibold">Core:</span> {resume.skills.core.join(", ")}
            </p>
          )}
          {ensureArray(resume.skills?.soft).length > 0 && (
            <p>
              <span className="font-semibold">Soft:</span> {resume.skills.soft.join(", ")}
            </p>
          )}
        </section>
      )}

      {certifications.length > 0 && (
        <section className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Certifications
          </h2>
          <ul className="space-y-1">
            {certifications.map((certification, index) => (
              <li key={`default-cert-${index}`} className="flex gap-2">
                <span className="text-primary">•</span>
                <span>{certification}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {projects.length > 0 && (
        <section className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-primary">
            Projects
          </h2>
          <ul className="space-y-1">
            {projects.map((project, index) => (
              <li key={`default-project-${index}`} className="flex gap-2">
                <span className="text-primary">•</span>
                <span>{project}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </TemplateWrapper>
  );
};

const CreativeResume = ({ resume }) => {
  const experience = ensureArray(resume.experience);
  const education = ensureArray(resume.education);
  const certifications = ensureArray(resume.certifications);

  return (
    <TemplateWrapper className="grid h-full grid-cols-[220px_1fr] text-sm">
      <aside className="flex h-full flex-col gap-6 rounded-r-[36px] bg-gradient-to-b from-[#0f3c7a] to-[#122958] p-6 text-white shadow-xl">
        <div className="space-y-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
          <span>Contact</span>
          <div className="space-y-2 text-[13px] font-medium normal-case tracking-normal text-white">
            {resume.contact?.email && <p>{resume.contact.email}</p>}
            {resume.contact?.phone && <p>{resume.contact.phone}</p>}
            {resume.contact?.location && <p>{resume.contact.location}</p>}
            {resume.contact?.links?.[0] && <p>{resume.contact.links[0]}</p>}
          </div>
        </div>
        <div className="space-y-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
          <span>Hard Skills</span>
          <ul className="space-y-1 text-[13px] font-medium tracking-normal text-white">
            {ensureArray(resume.skills?.core).slice(0, 8).map((skill, index) => (
              <li key={`creative-skill-${index}`}>{skill}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
          <span>Soft Skills</span>
          <ul className="space-y-1 text-[13px] font-medium tracking-normal text-white">
            {ensureArray(resume.skills?.soft).slice(0, 6).map((skill, index) => (
              <li key={`creative-soft-${index}`}>{skill}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
          <span>Languages</span>
          <ul className="space-y-1 text-[13px] font-medium tracking-normal text-white">
            {ensureArray(resume.languages).slice(0, 4).map((language, index) => (
              <li key={`creative-language-${index}`}>{language}</li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex flex-col gap-8 rounded-bl-[36px] bg-[#edf3ff] p-10">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.5em] text-[#0f3c7a]">
            {resume.contact?.headline ?? "Role"}
          </p>
          <h1 className="mt-2 text-4xl font-extrabold uppercase tracking-tight text-[#0b2458]">
            {resume.contact?.name ?? "Candidate Name"}
          </h1>
          {resume.summary && (
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-700">
              {resume.summary}
            </p>
          )}
        </header>

        {experience.length > 0 && (
          <section className="space-y-4">
            <h2 className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.4em] text-[#0f3c7a]">
              <span className="h-1 w-6 rounded-full bg-[#0f3c7a]" /> Work Experience
            </h2>
            {experience.map((role, index) => (
              <article key={`creative-exp-${index}`} className="space-y-1 rounded-xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-[#0b2458]">
                      {role.role ?? "Role"}
                    </h3>
                    <p className="text-sm text-[#0f3c7a]">{role.company}</p>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#0f3c7a]/60">
                    {joinMeta([role.start, role.end], " – ")}
                  </p>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  {ensureArray(role.bullets).map((bullet, bulletIdx) => (
                    <li key={`creative-bullet-${index}-${bulletIdx}`} className="flex gap-2">
                      <span className="text-[#0f3c7a]">●</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="space-y-3">
            <h2 className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.4em] text-[#0f3c7a]">
              <span className="h-1 w-6 rounded-full bg-[#0f3c7a]" /> Education
            </h2>
            {education.map((item, index) => (
              <div key={`creative-edu-${index}`} className="rounded-lg border border-white/40 bg-white/70 p-4">
                <h3 className="text-base font-semibold text-[#0b2458]">
                  {item.degree}
                </h3>
                <p className="text-sm text-[#0f3c7a]">{item.institution}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#0f3c7a]/60">
                  {joinMeta([item.start, item.end], " – ")}
                </p>
              </div>
            ))}
          </section>
        )}

        {certifications.length > 0 && (
          <section className="space-y-3">
            <h2 className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.4em] text-[#0f3c7a]">
              <span className="h-1 w-6 rounded-full bg-[#0f3c7a]" /> Certificates
            </h2>
            <ul className="space-y-1 text-sm text-gray-700">
              {certifications.map((certification, index) => (
                <li key={`creative-cert-${index}`} className="flex gap-2">
                  <span className="text-[#0f3c7a]">●</span>
                  <span>{certification}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </TemplateWrapper>
  );
};

const PastelResume = ({ resume }) => {
  const experience = ensureArray(resume.experience);
  const education = ensureArray(resume.education);
  const skills = ensureArray(resume.skills?.core);
  const languages = ensureArray(resume.languages);

  return (
    <TemplateWrapper className="flex min-h-full flex-col gap-8 bg-gradient-to-b from-[#f4fbf8] via-white to-[#e7f5ef] p-10 text-sm text-gray-800">
      <header className="flex flex-col gap-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.5em] text-emerald-600">
          {resume.contact?.headline ?? "Job Title"}
        </p>
        <h1 className="text-4xl font-black uppercase tracking-widest text-gray-900">
          {resume.contact?.name ?? "Candidate Name"}
        </h1>
        <div className="mt-2 flex flex-wrap justify-center gap-4 text-xs text-gray-600">
          {joinMeta([
            resume.contact?.email,
            resume.contact?.phone,
            ensureArray(resume.contact?.links)[0],
          ])}
        </div>
        {resume.summary && (
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed">
            {resume.summary}
          </p>
        )}
      </header>

      <main className="grid gap-6 md:grid-cols-[1.3fr_0.7fr]">
        <section className="space-y-5">
          <div className="space-y-3 rounded-2xl bg-white/80 p-6 shadow-inner">
            <h2 className="text-sm font-semibold uppercase tracking-[0.4em] text-emerald-600">
              Work History
            </h2>
            {experience.map((role, index) => (
              <article key={`pastel-exp-${index}`} className="space-y-2 border-b border-emerald-100 pb-3 last:border-none">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-base font-semibold text-gray-900">
                    {role.role ?? "Role"}
                  </h3>
                  <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600/60">
                    {joinMeta([role.start, role.end], " – ")}
                  </span>
                </div>
                <p className="text-sm font-medium text-emerald-700">
                  {role.company}
                </p>
                <ul className="space-y-1 text-sm text-gray-700">
                  {ensureArray(role.bullets).map((bullet, bulletIdx) => (
                    <li key={`pastel-bullet-${index}-${bulletIdx}`} className="flex gap-2">
                      <span className="text-emerald-500">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="space-y-3 rounded-2xl bg-white/80 p-6 shadow-inner">
            <h2 className="text-sm font-semibold uppercase tracking-[0.4em] text-emerald-600">
              Education
            </h2>
            {education.map((item, index) => (
              <div key={`pastel-edu-${index}`} className="space-y-1">
                <p className="text-base font-semibold text-gray-900">
                  {item.degree}
                </p>
                <p className="text-sm font-medium text-emerald-700">
                  {item.institution}
                </p>
                <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600/60">
                  {joinMeta([item.start, item.end], " – ")}
                </span>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-5">
          <div className="space-y-3 rounded-2xl bg-white/70 p-6 shadow-inner">
            <h2 className="text-sm font-semibold uppercase tracking-[0.4em] text-emerald-600">
              Skills
            </h2>
            <ul className="grid grid-cols-1 gap-2 text-sm font-medium text-gray-700">
              {skills.map((skill, index) => (
                <li key={`pastel-skill-${index}`} className="rounded-lg bg-emerald-50 px-3 py-2">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3 rounded-2xl bg-white/70 p-6 shadow-inner">
            <h2 className="text-sm font-semibold uppercase tracking-[0.4em] text-emerald-600">
              Languages
            </h2>
            <ul className="space-y-2 text-sm font-medium text-gray-700">
              {languages.map((language, index) => (
                <li key={`pastel-language-${index}`} className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2">
                  <span>{language}</span>
                  <span className="text-xs font-semibold uppercase text-emerald-600/70">
                    Fluent
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>
    </TemplateWrapper>
  );
};

const TimelineResume = ({ resume }) => {
  const experience = ensureArray(resume.experience);
  const education = ensureArray(resume.education);
  const skills = [...ensureArray(resume.skills?.core), ...ensureArray(resume.skills?.soft)].slice(0, 10);

  return (
    <TemplateWrapper className="grid h-full grid-cols-[260px_1fr] bg-white p-10 text-sm">
      <aside className="flex h-full flex-col gap-6 pr-6">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-[0.3em] text-gray-900">
            {resume.contact?.name ?? "Candidate"}
          </h1>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.4em] text-gray-500">
            {resume.contact?.headline ?? "Title"}
          </p>
        </div>
        <div className="space-y-2 text-sm">
          {ensureArray([
            resume.contact?.email,
            resume.contact?.phone,
            resume.contact?.location,
            ...ensureArray(resume.contact?.links),
          ]).map((item, index) => (
            <p key={`timeline-contact-${index}`}>{item}</p>
          ))}
        </div>
        {resume.summary && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-gray-600">
              Profile
            </h2>
            <p className="text-sm leading-relaxed text-gray-700">{resume.summary}</p>
          </div>
        )}
        {skills.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-gray-600">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={`timeline-skill-${index}`}
                  className="rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>

      <main className="border-l border-gray-200 pl-10">
        <section className="space-y-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-gray-600">
            Experience
          </h2>
          <div className="space-y-6">
            {experience.map((role, index) => (
              <article key={`timeline-exp-${index}`} className="relative pl-8">
                <span className="absolute left-0 top-1 h-2 w-2 rounded-full bg-black" />
                <h3 className="text-base font-semibold text-gray-900">
                  {role.role}
                </h3>
                <p className="text-sm font-medium text-gray-700">{role.company}</p>
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  {joinMeta([role.start, role.end], " – ")} · {role.location}
                </p>
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  {ensureArray(role.bullets).map((bullet, bulletIdx) => (
                    <li key={`timeline-bullet-${index}-${bulletIdx}`} className="flex gap-2">
                      <span>•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {education.length > 0 && (
          <section className="mt-10 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-gray-600">
              Education
            </h2>
            {education.map((item, index) => (
              <div key={`timeline-edu-${index}`} className="relative pl-8">
                <span className="absolute left-0 top-1 h-2 w-2 rounded-full bg-black" />
                <h3 className="text-base font-semibold text-gray-900">
                  {item.degree}
                </h3>
                <p className="text-sm font-medium text-gray-700">{item.institution}</p>
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  {joinMeta([item.start, item.end], " – ")}
                </p>
              </div>
            ))}
          </section>
        )}
      </main>
    </TemplateWrapper>
  );
};

const renderDefaultPdf = (resume) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 48;
  let cursorY = 60;
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = doc.internal.pageSize.getWidth() - marginX * 2;

  const addText = (text, { fontSize = 11, fontStyle = "normal", marginTop = 14 } = {}) => {
    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line) => {
      if (cursorY > pageHeight - marginX) {
        doc.addPage();
        cursorY = marginX;
      }
      doc.text(line, marginX, cursorY);
      cursorY += fontSize + 4;
    });
    cursorY += marginTop;
  };

  const contact = resume.contact ?? {};
  addText(contact.name ?? "", { fontSize: 22, fontStyle: "bold", marginTop: 6 });
  addText(contact.headline ?? "", { fontSize: 12, marginTop: 0 });
  addText(joinMeta([contact.location, contact.email, contact.phone], " · "), {
    fontSize: 10,
    marginTop: 2,
  });
  if (ensureArray(contact.links).length) {
    addText(ensureArray(contact.links).join(" · "), { fontSize: 10 });
  }

  if (resume.summary) {
    addText("PROFILE", { fontSize: 12, fontStyle: "bold", marginTop: 8 });
    addText(resume.summary, { fontSize: 11, marginTop: 4 });
  }

  ensureArray(resume.experience).forEach((role, index) => {
    if (index === 0) {
      addText("EXPERIENCE", { fontSize: 12, fontStyle: "bold", marginTop: 8 });
    }
    addText(`${role.role ?? ""} · ${role.company ?? ""}`, {
      fontSize: 11,
      fontStyle: "bold",
      marginTop: 4,
    });
    addText(joinMeta([role.location, joinMeta([role.start, role.end], " – ")]), {
      fontSize: 10,
      marginTop: 2,
    });
    ensureArray(role.bullets).forEach((bullet) => {
      addText(`• ${bullet}`, { fontSize: 10, marginTop: 0 });
    });
  });

  ensureArray(resume.education).forEach((item, index) => {
    if (index === 0) {
      addText("EDUCATION", { fontSize: 12, fontStyle: "bold", marginTop: 8 });
    }
    addText(`${item.degree ?? ""} · ${item.institution ?? ""}`, {
      fontSize: 11,
      fontStyle: "bold",
      marginTop: 4,
    });
    addText(joinMeta([item.start, item.end], " – "), { fontSize: 10, marginTop: 2 });
    if (item.details) {
      addText(item.details, { fontSize: 10, marginTop: 2 });
    }
  });

  if (ensureArray(resume.skills?.core).length || ensureArray(resume.skills?.soft).length) {
    addText("SKILLS", { fontSize: 12, fontStyle: "bold", marginTop: 8 });
    if (ensureArray(resume.skills?.core).length) {
      addText(`Core: ${resume.skills.core.join(", ")}`, { fontSize: 11, marginTop: 4 });
    }
    if (ensureArray(resume.skills?.soft).length) {
      addText(`Soft: ${resume.skills.soft.join(", ")}`, { fontSize: 11, marginTop: 4 });
    }
  }

  if (ensureArray(resume.certifications).length) {
    addText("CERTIFICATIONS", { fontSize: 12, fontStyle: "bold", marginTop: 8 });
    ensureArray(resume.certifications).forEach((cert) => {
      addText(`• ${cert}`, { fontSize: 11, marginTop: 4 });
    });
  }

  if (ensureArray(resume.projects).length) {
    addText("PROJECTS", { fontSize: 12, fontStyle: "bold", marginTop: 8 });
    ensureArray(resume.projects).forEach((project) => {
      addText(`• ${project}`, { fontSize: 11, marginTop: 4 });
    });
  }

  return doc;
};

const renderCreativePdf = (resume) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(15, 60, 122);
  doc.rect(0, 0, 180, pageHeight, "F");

  const writeText = (text, x, y, options = {}) => {
    const { fontSize = 10, fontStyle = "normal", color = [255, 255, 255], maxWidth = 160 } = options;
    doc.setTextColor(...color);
    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach((line, lineIndex) => {
      doc.text(line, x, y + lineIndex * (fontSize + 3));
    });
    return y + lines.length * (fontSize + 3);
  };

  let y = 60;
  y = writeText("CONTACT", 40, y, { fontSize: 9, fontStyle: "bold" });
  y = writeText(resume.contact?.email ?? "", 40, y + 14);
  y = writeText(resume.contact?.phone ?? "", 40, y + 10);
  y = writeText(resume.contact?.location ?? "", 40, y + 10);
  y = writeText(ensureArray(resume.contact?.links).join("\n"), 40, y + 10);

  y += 20;
  y = writeText("HARD SKILLS", 40, y, { fontSize: 9, fontStyle: "bold" });
  ensureArray(resume.skills?.core).forEach((skill) => {
    y = writeText(skill, 40, y + 10);
  });

  const headerX = 200;
  doc.setTextColor(15, 60, 122);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(resume.contact?.headline ?? "", headerX, 70);
  doc.setFontSize(30);
  doc.setTextColor(11, 36, 88);
  doc.text(resume.contact?.name ?? "", headerX, 110);

  doc.setTextColor(60, 75, 105);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const summaryLines = doc.splitTextToSize(resume.summary ?? "", pageWidth - headerX - 40);
  doc.text(summaryLines, headerX, 140);

  let cursorY = 200;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 60, 122);
  doc.text("WORK EXPERIENCE", headerX, cursorY);
  cursorY += 20;
  doc.setTextColor(30, 40, 60);
  ensureArray(resume.experience).forEach((role) => {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(role.role ?? "", headerX, cursorY);
    cursorY += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(joinMeta([role.company, joinMeta([role.start, role.end], " – ")]), headerX, cursorY);
    cursorY += 12;
    ensureArray(role.bullets).forEach((bullet) => {
      const lines = doc.splitTextToSize(`• ${bullet}`, pageWidth - headerX - 40);
      doc.text(lines, headerX, cursorY);
      cursorY += lines.length * 14;
    });
    cursorY += 10;
  });

  if (ensureArray(resume.education).length) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 60, 122);
    doc.text("EDUCATION", headerX, cursorY);
    cursorY += 20;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 40, 60);
    ensureArray(resume.education).forEach((item) => {
      doc.setFontSize(11);
      doc.text(item.degree ?? "", headerX, cursorY);
      cursorY += 14;
      doc.setFontSize(10);
      doc.text(joinMeta([item.institution, joinMeta([item.start, item.end], " – ")]), headerX, cursorY);
      cursorY += 18;
    });
  }

  return doc;
};

const renderPastelPdf = (resume) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  const gradientRect = (x, y, w, h, startColor, endColor) => {
    const steps = 20;
    for (let i = 0; i < steps; i += 1) {
      const ratio = i / steps;
      const r = startColor[0] + ratio * (endColor[0] - startColor[0]);
      const g = startColor[1] + ratio * (endColor[1] - startColor[1]);
      const b = startColor[2] + ratio * (endColor[2] - startColor[2]);
      doc.setFillColor(r, g, b);
      doc.rect(x, y + (h / steps) * i, w, h / steps + 1, "F");
    }
  };

  gradientRect(0, 0, width, height, [235, 248, 242], [220, 240, 229]);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(70, 158, 129);
  doc.setFontSize(12);
  doc.text(resume.contact?.headline ?? "", width / 2, 60, { align: "center" });
  doc.setFontSize(28);
  doc.setTextColor(40, 60, 55);
  doc.text(resume.contact?.name ?? "", width / 2, 95, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(90, 110, 100);
  const contactLine = joinMeta([
    resume.contact?.email,
    resume.contact?.phone,
    resume.contact?.location,
    ensureArray(resume.contact?.links)[0],
  ], "  •  ");
  doc.text(contactLine, width / 2, 120, { align: "center" });

  let cursorY = 150;
  const marginX = 60;
  const columnGap = 40;
  const rightX = width / 2 + columnGap;
  const leftWidth = width / 2 - marginX - columnGap / 2;
  const rightWidth = width - rightX - marginX;

  const writeBlock = (x, y, text, options = {}) => {
    const { fontSize = 11, fontStyle = "normal", maxWidth = leftWidth, color = [70, 75, 70] } = options;
    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * (fontSize + 4);
  };

  if (resume.summary) {
    cursorY = writeBlock(marginX, cursorY, resume.summary, { maxWidth: width - marginX * 2, color: [80, 100, 90] });
    cursorY += 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setTextColor(70, 158, 129);
  doc.text("WORK HISTORY", marginX, cursorY);
  cursorY += 18;
  ensureArray(resume.experience).forEach((role) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(42, 60, 52);
    doc.text(role.role ?? "", marginX, cursorY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(role.company ?? "", marginX, cursorY + 14);
    doc.setTextColor(90, 120, 105);
    doc.text(joinMeta([role.start, role.end], " – "), marginX, cursorY + 28);
    cursorY += 42;
    doc.setTextColor(60, 80, 70);
    ensureArray(role.bullets).forEach((bullet) => {
      const lines = doc.splitTextToSize(`• ${bullet}`, leftWidth);
      doc.text(lines, marginX + 12, cursorY);
      cursorY += lines.length * 14;
    });
    cursorY += 14;
  });

  let rightY = 190;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(70, 158, 129);
  doc.text("SKILLS", rightX, rightY);
  rightY += 18;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 80, 70);
  ensureArray(resume.skills?.core).forEach((skill) => {
    const lines = doc.splitTextToSize(`• ${skill}`, rightWidth);
    doc.text(lines, rightX, rightY);
    rightY += lines.length * 14;
  });
  rightY += 20;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(70, 158, 129);
  doc.text("LANGUAGES", rightX, rightY);
  rightY += 18;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 80, 70);
  ensureArray(resume.languages).forEach((language) => {
    doc.text(`• ${language}`, rightX, rightY);
    rightY += 16;
  });

  rightY += 20;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(70, 158, 129);
  doc.text("EDUCATION", rightX, rightY);
  rightY += 18;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 80, 70);
  ensureArray(resume.education).forEach((item) => {
    doc.text(item.degree ?? "", rightX, rightY);
    rightY += 14;
    doc.setTextColor(90, 120, 105);
    doc.text(item.institution ?? "", rightX, rightY);
    rightY += 14;
    doc.setTextColor(60, 80, 70);
    doc.text(joinMeta([item.start, item.end], " – "), rightX, rightY);
    rightY += 20;
  });

  return doc;
};

const renderTimelinePdf = (resume) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 64;
  const columnWidth = 220;
  const mainWidth = doc.internal.pageSize.getWidth() - marginX * 2;
  const timelineX = marginX + columnWidth + 30;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(26);
  doc.text(resume.contact?.name ?? "Candidate", marginX, 80);
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(resume.contact?.headline ?? "", marginX, 105);

  let sidebarY = 140;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  ensureArray([resume.contact?.email, resume.contact?.phone, resume.contact?.location]).forEach((item) => {
    if (!item) return;
    doc.text(item, marginX, sidebarY);
    sidebarY += 16;
  });

  if (resume.summary) {
    sidebarY += 20;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text("PROFILE", marginX, sidebarY);
    sidebarY += 14;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    const profileLines = doc.splitTextToSize(resume.summary, columnWidth);
    doc.text(profileLines, marginX, sidebarY);
    sidebarY += profileLines.length * 14 + 14;
  }

  const skillTokens = [...ensureArray(resume.skills?.core), ...ensureArray(resume.skills?.soft)];
  if (skillTokens.length) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text("SKILLS", marginX, sidebarY);
    sidebarY += 12;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    skillTokens.forEach((skill) => {
      doc.text(`• ${skill}`, marginX, sidebarY + 14);
      sidebarY += 14;
    });
    sidebarY += 14;
  }

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(2);
  doc.line(timelineX, 120, timelineX, doc.internal.pageSize.getHeight() - 80);

  let cursorY = 140;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(80, 80, 80);
  doc.text("EXPERIENCE", timelineX, cursorY - 20);
  ensureArray(resume.experience).forEach((role) => {
    doc.setFillColor(0, 0, 0);
    doc.circle(timelineX, cursorY, 3, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text(role.role ?? "", timelineX + 14, cursorY + 4);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(70, 70, 70);
    doc.text(role.company ?? "", timelineX + 14, cursorY + 18);
    doc.setTextColor(120, 120, 120);
    doc.text(joinMeta([role.start, role.end], " – "), timelineX + 14, cursorY + 32);
    cursorY += 46;
    ensureArray(role.bullets).forEach((bullet) => {
      const lines = doc.splitTextToSize(`• ${bullet}`, mainWidth - columnWidth - 50);
      doc.text(lines, timelineX + 14, cursorY);
      cursorY += lines.length * 13;
    });
    cursorY += 16;
  });

  if (ensureArray(resume.education).length) {
    cursorY += 20;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(80, 80, 80);
    doc.text("EDUCATION", timelineX, cursorY);
    cursorY += 20;
    ensureArray(resume.education).forEach((item) => {
      doc.setFillColor(0, 0, 0);
      doc.circle(timelineX, cursorY - 5, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 30, 30);
      doc.text(item.degree ?? "", timelineX + 14, cursorY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(70, 70, 70);
      doc.text(item.institution ?? "", timelineX + 14, cursorY + 14);
      doc.setTextColor(120, 120, 120);
      doc.text(joinMeta([item.start, item.end], " – "), timelineX + 14, cursorY + 28);
      cursorY += 42;
    });
  }

  return doc;
};

const SAMPLE_DEFAULT = {
  contact: {
    name: "Avery Johnson",
    headline: "Product Strategy Lead",
    email: "avery.johnson@email.com",
    phone: "+1 555 321 4567",
    location: "Austin, TX",
    links: ["linkedin.com/in/averyjohnson"],
  },
  summary:
    "Strategic product leader with 8+ years of experience translating customer insights into lovable digital experiences. Excels at cross-functional collaboration and data-guided roadmaps.",
  experience: [
    {
      role: "Product Lead",
      company: "Brightwave",
      location: "Austin, TX",
      start: "2020",
      end: "Present",
      bullets: [
        "Scaled product discovery practice resulting in 3x more validated concepts per quarter.",
        "Led launch of onboarding revamp that reduced time-to-value by 46%.",
      ],
    },
    {
      role: "Senior Product Manager",
      company: "FlowPath",
      location: "Remote",
      start: "2016",
      end: "2020",
      bullets: [
        "Delivered analytics module generating $4.2M ARR in year one.",
        "Mentored 4 PMs and introduced OKR ritual improving focus across squads.",
      ],
    },
  ],
  education: [
    {
      degree: "MBA, Innovation Management",
      institution: "University of Texas",
      start: "2014",
      end: "2016",
      details: "Graduated with honors, VP of Product Club.",
    },
  ],
  skills: {
    core: ["Product Strategy", "Customer Discovery", "Roadmapping", "Analytics"],
    soft: ["Stakeholder Alignment", "Coaching", "Public Speaking"],
  },
  certifications: ["Pragmatic Certified Product Manager"],
  projects: ["Built internal experimentation playbook adopted by 9 teams."],
};

const SAMPLE_CREATIVE = {
  contact: {
    name: "Catherine Barnett",
    headline: "3D Character Animator",
    email: "cath@novoresume.com",
    phone: "123 444 5555",
    location: "Montreal, Canada",
    links: ["linkedin.com/in/c.barnett"],
  },
  summary:
    "Hard-working animator with 3+ years of professional experience in 3D modeling and animation. Looking for a place to thrive at Cool Story Game Studios. Deep knowledge of Blender, rigging, and cinematic pre-visualization.",
  experience: [
    {
      role: "3D Character Animator",
      company: "Iceberg Games Inc.",
      start: "04/2023",
      end: "Present",
      bullets: [
        "Delivered complex animation sequences contributing to 35% increase in player immersion.",
        "Collaborated with designers to match characters' personality to narrative arcs.",
        "Trained 3 junior animators and upheld 200+ hours of gameplay deadlines.",
      ],
    },
    {
      role: "Animator & Designer",
      company: "Laughtrack Studios",
      start: "01/2021",
      end: "03/2023",
      bullets: [
        "Designed characters & environments in coordination with storyboards.",
        "Optimized 3D art pipeline, finishing launches 3 weeks ahead of schedule.",
      ],
    },
  ],
  education: [
    {
      degree: "BFA in Animation",
      institution: "New York University",
      start: "2018",
      end: "2021",
    },
  ],
  skills: {
    core: ["Character-based VFX", "3D Modeling", "ZBrush", "Rigging", "Skeletal Animation", "Blender", "Adobe Creative Suite"],
    soft: ["Attention to Detail", "Collaboration", "Problem-solving"],
  },
  certifications: [
    "Kawaii Character Creation in 3D",
    "ZBrush Crash Course",
    "Introduction to 3D Animation",
  ],
  languages: ["English", "French", "Spanish"],
};

const SAMPLE_PASTEL = {
  contact: {
    name: "Christopher Panattoni",
    headline: "Bartender",
    email: "christopher.panattoni@contact.com",
    phone: "281-951-6550",
    location: "Houston, TX",
    linkedin: "linkedin.com/in/panattonichris",
    links: ["linkedin.com/in/panattonichris"],
  },
  summary:
    "Dedicated bartender with 5+ years of experience creating memorable experiences for patrons in high-paced establishments. Skilled at fostering positive atmospheres and exceeding sales targets.",
  experience: [
    {
      role: "Bartender",
      company: "Cheers & Chill Lounge",
      start: "2019",
      end: "Present",
      bullets: [
        "Managed nightly volume of 200 guests with consistent 5-star reviews.",
        "Introduced upsell program increasing beverage sales by 15%.",
      ],
    },
    {
      role: "Bartender",
      company: "Sip & Savor Bar",
      start: "2017",
      end: "2019",
      bullets: [
        "Maintained bar cleanliness meeting all health inspection standards.",
        "Grew repeat customer base through personalized recommendations.",
      ],
    },
  ],
  education: [
    {
      degree: "High School Diploma",
      institution: "Willowridge High School, Houston, TX",
      start: "2011",
      end: "2014",
    },
  ],
  skills: {
    core: ["Mixology", "Customer Service", "Order Management", "Inventory"],
  },
  languages: ["Spanish", "Italian"],
};

const SAMPLE_TIMELINE = {
  contact: {
    name: "Ahmdd Saah",
    headline: "Marketing Manager",
    email: "hello@ahmdd saaahh.com",
    phone: "+124-4236-7894",
    location: "Any City",
    links: ["www.ahmdd saaahh.com"],
  },
  summary:
    "Marketing leader who translates strategy into actionable campaigns. Experienced guiding teams through omni-channel initiatives that elevate brand positioning and drive measurable results.",
  experience: [
    {
      role: "Marketing Manager & Specialist",
      company: "Borcelle Studio",
      location: "Remote",
      start: "2030",
      end: "Present",
      bullets: [
        "Implemented cross-channel GTM playbook increasing pipeline velocity by 28%.",
        "Launched content automation workflow saving 240 work hours quarterly.",
      ],
    },
    {
      role: "Marketing Manager & Specialist",
      company: "Fauget Studio",
      start: "2025",
      end: "2029",
      bullets: [
        "Guided influencer partnerships boosting brand reach in APAC by 36%.",
        "Mentored 6 marketers across creative and analytics teams.",
      ],
    },
  ],
  education: [
    {
      degree: "Master of Business Management",
      institution: "Wardiere University",
      start: "2029",
      end: "2031",
    },
    {
      degree: "BSc, Economics",
      institution: "Columbus University",
      start: "2003",
      end: "2007",
    },
  ],
  skills: {
    core: ["Strategic Planning", "Problem Solving", "Data Analysis", "Brand Development", "Negotiation"],
    soft: ["Stakeholder Engagement", "Strategic Focus"],
  },
};

export const TEMPLATE_REGISTRY = {
  default: {
    id: "default",
    name: "Modern Classic",
    description: "Clean two-column layout with balanced typography.",
    Illustration: (props) => <DefaultResume {...props} />,
    sampleData: SAMPLE_DEFAULT,
    pdf: renderDefaultPdf,
  },
  creative: {
    id: "creative",
    name: "Creative Spotlight",
    description: "Bold sidebar for creatives and portfolios.",
    Illustration: (props) => <CreativeResume {...props} />, 
    sampleData: SAMPLE_CREATIVE,
    pdf: renderCreativePdf,
  },
  pastel: {
    id: "pastel",
    name: "Pastel Breeze",
    description: "Soft gradients ideal for hospitality and services.",
    Illustration: (props) => <PastelResume {...props} />, 
    sampleData: SAMPLE_PASTEL,
    pdf: renderPastelPdf,
  },
  timeline: {
    id: "timeline",
    name: "Timeline Pro",
    description: "Sophisticated timeline for consultants and managers.",
    Illustration: (props) => <TimelineResume {...props} />, 
    sampleData: SAMPLE_TIMELINE,
    pdf: renderTimelinePdf,
  },
};

export const TEMPLATE_LIST = Object.values(TEMPLATE_REGISTRY);
