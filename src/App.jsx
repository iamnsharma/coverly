import { useCallback, useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";

import Header from "./components/Header.jsx";
import InputArea from "./components/InputArea.jsx";
import Loader from "./components/Loader.jsx";
import OptionSelector from "./components/OptionSelector.jsx";
import OutputBox from "./components/OutputBox.jsx";
import generateText from "./utils/generateText.js";
import {
  loadDecryptedKey,
  saveEncryptedKey,
  clearStoredKey,
} from "./utils/apiKeyStorage.js";
import geminiBadge from "./assets/gemini.webp";
import { TEMPLATE_LIST, TEMPLATE_REGISTRY } from "./templates/templates.jsx";

const createId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

const createExperience = () => ({
  id: createId(),
  role: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "Present",
  highlights: "",
});

const createEducation = () => ({
  id: createId(),
  institution: "",
  degree: "",
  startDate: "",
  endDate: "",
  details: "",
});

const createDefaultForm = () => ({
  name: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  portfolio: "",
  linkedin: "",
  github: "",
  targetRole: "",
  experienceYears: "",
  skills: "",
  softSkills: "",
  certifications: "",
  projects: "",
  details: "",
  experiences: [createExperience()],
  education: [createEducation()],
});

const createDevForm = () => {
  const form = createDefaultForm();
  form.name = "Avery Johnson";
  form.headline = "Product Strategy Lead";
  form.email = "avery.johnson@email.com";
  form.phone = "+1 555 321 4567";
  form.location = "Austin, TX";
  form.portfolio = "https://portfolio.averyjohnson.com";
  form.linkedin = "https://linkedin.com/in/averyjohnson";
  form.targetRole = "Director of Product";
  form.experienceYears = "8";
  form.skills = "Product Strategy, Customer Discovery, Roadmapping, Analytics";
  form.softSkills = "Stakeholder Alignment, Coaching, Public Speaking";
  form.certifications = "Pragmatic Certified Product Manager";
  form.projects = "Built experimentation playbook adopted by 9 teams.";
  form.details = "Passionate about shipping delightful experiences faster.";
  form.experiences = [
    {
      ...createExperience(),
      role: "Product Lead",
      company: "Brightwave",
      location: "Austin, TX",
      startDate: "2020",
      endDate: "Present",
      highlights: `Scaled product discovery practice, tripling validated ideas.
Launched onboarding revamp reducing time-to-value by 46%.`,
    },
    {
      ...createExperience(),
      role: "Senior Product Manager",
      company: "FlowPath",
      location: "Remote",
      startDate: "2016",
      endDate: "2020",
      highlights: `Delivered analytics module generating $4.2M ARR in year one.
Mentored 4 PMs and introduced OKR ritual improving focus.`,
    },
  ];
  form.education = [
    {
      ...createEducation(),
      degree: "MBA, Innovation Management",
      institution: "University of Texas",
      startDate: "2014",
      endDate: "2016",
      details: "Graduated with honors, VP of Product Club.",
    },
  ];
  return form;
};

const extractJson = (text) => {
  if (!text) return "";
  const cleaned = text.trim().replace(/```json|```/gi, "");
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) return cleaned;
  return cleaned.slice(firstBrace, lastBrace + 1);
};

const App = () => {
  const [selectedOption, setSelectedOption] = useState("Resume");
  const [formData, setFormData] = useState(createDefaultForm);
  const [output, setOutput] = useState("");
  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [hasCustomApiKey, setHasCustomApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showApiKeyPanel, setShowApiKeyPanel] = useState(false);
  const [hasGeneratedPdf, setHasGeneratedPdf] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("default");
  const [previewTemplateId, setPreviewTemplateId] = useState(null);

  const selectedTemplate = TEMPLATE_REGISTRY[selectedTemplateId] ?? TEMPLATE_REGISTRY.default;
  const previewTemplate = previewTemplateId
    ? TEMPLATE_REGISTRY[previewTemplateId]
    : null;

  useEffect(() => {
    const loadApiKey = async () => {
      const key = await loadDecryptedKey();
      setHasCustomApiKey(Boolean(key));
    };
    loadApiKey();
  }, []);

  const handleSaveApiKey = useCallback(async () => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      setError("Please paste a Gemini API key before saving.");
      return;
    }
    try {
      await saveEncryptedKey(trimmed);
      setHasCustomApiKey(true);
      setApiKeyInput("");
      setError("");
      setStatusMessage("Custom Gemini API key saved locally.");
      setShowApiKeyPanel(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to store the API key. Please try again."
      );
    }
  }, [apiKeyInput]);

  const handleRemoveApiKey = useCallback(async () => {
    clearStoredKey();
    setHasCustomApiKey(false);
    setApiKeyInput("");
    setError("");
    setStatusMessage("Custom Gemini API key removed.");
    setHasGeneratedPdf(false);
  }, []);

  const prompt = useMemo(() => {
    if (selectedOption === "Resume") {
      const {
        name,
        headline,
        email,
        phone,
        location,
        portfolio,
        linkedin,
        github,
        targetRole,
        experienceYears,
        skills,
        softSkills,
        certifications,
        projects,
        details,
        experiences,
        education,
      } = formData;

      const experienceBlock = experiences
        .map(
          (experience, index) => `
Experience ${index + 1}:
  Role: ${experience.role}
  Company: ${experience.company}
  Location: ${experience.location}
  Start: ${experience.startDate}
  End: ${experience.endDate}
  Highlights: ${experience.highlights}
`
        )
        .join("\n");

      const educationBlock = education
        .map(
          (program, index) => `
Education ${index + 1}:
  Institution: ${program.institution}
  Degree: ${program.degree}
  Start: ${program.startDate}
  End: ${program.endDate}
  Details: ${program.details}
`
        )
        .join("\n");

      return `
You are Coverly, an award-winning resume writer. Use the candidate data below to craft a polished, modern resume.

Respond with **only** valid JSON. The JSON must match this schema:
{
  "contact": {
    "name": "",
    "headline": "",
    "email": "",
    "phone": "",
    "location": "",
    "links": ["", ""]
  },
  "summary": "",
  "experience": [
    {
      "role": "",
      "company": "",
      "location": "",
      "start": "",
      "end": "",
      "bullets": ["", ""]
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "start": "",
      "end": "",
      "details": ""
    }
  ],
  "skills": {
    "core": [],
    "soft": []
  },
  "certifications": [],
  "projects": []
}

Guidelines:
- Preserve factual data exactly as provided.
- Enhance bullets with strong verbs and measurable impact.
- Keep bullet points concise (max 24 words each).
- Mention notable achievements, technologies, and leadership.

Candidate Information:
Name: ${name}
Headline: ${headline || targetRole}
Email: ${email}
Phone: ${phone}
Location: ${location}
Portfolio: ${portfolio}
LinkedIn: ${linkedin}
GitHub: ${github}
Target Role: ${targetRole}
Experience Years: ${experienceYears}
Core Skills: ${skills}
Soft Skills: ${softSkills}
Certifications: ${certifications}
Projects: ${projects}
Additional Notes: ${details}

${experienceBlock}

${educationBlock}
`.trim();
    }

    const { name, targetRole, experienceYears, skills, details } = formData;
    const yearsText = experienceYears ? `${experienceYears}` : "several";
    const nameContext = name ? `The candidate's name is ${name}. ` : "";

    const enthusiasmTarget = details || "the opportunity";
    const basePrompt = `Write a professional cover letter for a ${targetRole} with ${yearsText} years of experience. Include enthusiasm for ${enthusiasmTarget} and highlight skills like ${skills}. Keep it polite, confident, and job-relevant.`;
    const detailPrompt =
      details && details !== enthusiasmTarget
        ? `Additional context: ${details}.`
        : "";
    return `${nameContext}${basePrompt} ${detailPrompt}`.trim();
  }, [formData, selectedOption]);

  const handleFieldChange = useCallback((field, value) => {
    setHasGeneratedPdf(false);
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }, []);

  const handleExperienceChange = useCallback((id, field, value) => {
    setHasGeneratedPdf(false);
    setFormData((current) => ({
      ...current,
      experiences: current.experiences.map((experience) =>
        experience.id === id ? { ...experience, [field]: value } : experience
      ),
    }));
  }, []);

  const handleAddExperience = useCallback(() => {
    setHasGeneratedPdf(false);
    setFormData((current) => ({
      ...current,
      experiences: [...current.experiences, createExperience()],
    }));
  }, []);

  const handleRemoveExperience = useCallback((id) => {
    setHasGeneratedPdf(false);
    setFormData((current) => {
      if (current.experiences.length === 1) return current;
      return {
        ...current,
        experiences: current.experiences.filter(
          (experience) => experience.id !== id
        ),
      };
    });
  }, []);

  const handleEducationChange = useCallback((id, field, value) => {
    setHasGeneratedPdf(false);
    setFormData((current) => ({
      ...current,
      education: current.education.map((program) =>
        program.id === id ? { ...program, [field]: value } : program
      ),
    }));
  }, []);

  const handleAddEducation = useCallback(() => {
    setHasGeneratedPdf(false);
    setFormData((current) => ({
      ...current,
      education: [...current.education, createEducation()],
    }));
  }, []);

  const handleRemoveEducation = useCallback((id) => {
    setHasGeneratedPdf(false);
    setFormData((current) => {
      if (current.education.length === 1) return current;
      return {
        ...current,
        education: current.education.filter((program) => program.id !== id),
      };
    });
  }, []);

  const handleLoadDevData = useCallback(() => {
    setSelectedOption("Resume");
    setFormData(createDevForm());
    setOutput("");
    setResumeData(null);
    setStatusMessage("Loaded sample data for quick testing.");
    setError("");
    setHasGeneratedPdf(false);
  }, []);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setStatusMessage("");
    setHasGeneratedPdf(false);

    try {
      const aiText = await generateText(prompt);
      if (selectedOption === "Resume") {
        const jsonString = extractJson(aiText);
        try {
          const parsed = JSON.parse(jsonString);
          setResumeData(parsed);
          setOutput("");
          setStatusMessage("All set! Your resume draft is ready.");
          setError("");
        } catch {
          setResumeData(null);
          setOutput("");
          setError(
            "The AI response could not be parsed. Please adjust your inputs and try again."
          );
        }
      } else {
        setResumeData(null);
        setOutput(aiText);
        setStatusMessage("All set! Your draft is ready.");
      }
    } catch (apiError) {
      setError(
        apiError instanceof Error
          ? apiError.message
          : "Something went wrong while generating. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [prompt, selectedOption]);

  const formatResumeText = useCallback((data) => {
    if (!data) return "";
    const sections = [];
    sections.push(
      `${data.contact?.name ?? ""} — ${data.contact?.headline ?? ""}`,
      `${data.contact?.location ?? ""} · ${data.contact?.email ?? ""} · ${
        data.contact?.phone ?? ""
      }`,
      data.contact?.links?.filter(Boolean).join(" · ") ?? ""
    );
    if (data.summary) {
      sections.push("\nPROFILE", data.summary);
    }
    if (Array.isArray(data.experience) && data.experience.length > 0) {
      const experienceLines = data.experience.map((item) => {
        const header = `${item.role ?? ""} · ${item.company ?? ""} (${item.start ?? ""} – ${item.end ?? ""})`;
        const bullets = Array.isArray(item.bullets)
          ? item.bullets.map((bullet) => `• ${bullet}`).join("\n")
          : "";
        return `${header}\n${bullets}`;
      });
      sections.push("\nEXPERIENCE", experienceLines.join("\n\n"));
    }
    if (Array.isArray(data.education) && data.education.length > 0) {
      const educationLines = data.education.map((item) => {
        const header = `${item.degree ?? ""} · ${item.institution ?? ""} (${item.start ?? ""} – ${item.end ?? ""})`;
        return item.details ? `${header}\n${item.details}` : header;
      });
      sections.push("\nEDUCATION", educationLines.join("\n\n"));
    }
    if (data.skills) {
      const skillsLines = [
        data.skills.core?.length
          ? `Core: ${data.skills.core.join(", ")}`
          : "",
        data.skills.soft?.length
          ? `Soft: ${data.skills.soft.join(", ")}`
          : "",
      ]
        .filter(Boolean)
        .join("\n");
      if (skillsLines) {
        sections.push("\nSKILLS", skillsLines);
      }
    }
    if (Array.isArray(data.certifications) && data.certifications.length > 0) {
      sections.push("\nCERTIFICATIONS", data.certifications.join("\n"));
    }
    if (Array.isArray(data.projects) && data.projects.length > 0) {
      sections.push("\nPROJECTS", data.projects.join("\n"));
    }
    return sections.filter(Boolean).join("\n");
  }, []);

  const handleCopy = useCallback(async () => {
    const textToCopy =
      selectedOption === "Resume" ? formatResumeText(resumeData) : output;

    if (!textToCopy.trim()) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setStatusMessage("Copied to clipboard.");
    } catch (copyError) {
      setError(
        copyError instanceof Error
          ? copyError.message
          : "Unable to copy to clipboard."
      );
    }
  }, [formatResumeText, output, resumeData, selectedOption]);

  const handleClear = useCallback(() => {
    setOutput("");
    setResumeData(null);
    setStatusMessage("Cleared the output.");
    setHasGeneratedPdf(false);
  }, []);

  const handleDownload = useCallback(() => {
    if (selectedOption === "Resume") {
      if (!resumeData) return;

      const doc = selectedTemplate.pdf(resumeData);
      const fileName = `coverly-${selectedTemplate.id}.pdf`;
      doc.save(fileName);
      setStatusMessage("Resume PDF downloaded.");
      setHasGeneratedPdf(false);
      setResumeData(null);
      setOutput("");
      setFormData(createDefaultForm());
      setError("");
      return;
    }

    if (!output.trim()) return;

    const doc = new jsPDF({
      unit: "pt",
      format: "a4",
    });

    const margin = 48;
    const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(18);
    doc.text("Coverly AI Draft", margin, margin);

    doc.setFontSize(12);
    const lines = doc.splitTextToSize(output, maxWidth);
    let cursorY = margin + 28;

    lines.forEach((line) => {
      if (cursorY > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        cursorY = margin;
      }
      doc.text(line, margin, cursorY);
      cursorY += 18;
    });

    const sanitizedOption = selectedOption.toLowerCase().replace(/\s+/g, "-");
    doc.save(`coverly-${sanitizedOption}.pdf`);
    setStatusMessage("PDF downloaded.");
    setHasGeneratedPdf(false);
    setOutput("");
    setResumeData(null);
    setFormData(createDefaultForm());
    setError("");
  }, [output, resumeData, selectedOption, selectedTemplate]);

  return (
    <div className="relative min-h-screen w-full px-4 py-12 md:px-8">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur">
          <Loader />
        </div>
      )}
      <main className="mx-auto flex max-w-6xl flex-col gap-10">
        <Header />

        <section className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-[240px]">
                <OptionSelector
                  selectedOption={selectedOption}
                  onSelect={setSelectedOption}
                />
              </div>
              {/* <button
                type="button"
                onClick={handleLoadDevData}
                className="rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors duration-200 hover:border-primary hover:bg-primary/20"
              >
                Dev mode: Prefill sample data
              </button> */}
            </div>

            <section className="space-y-4 rounded-3xl border border-gray-100 bg-white/80 p-5 shadow-lg shadow-gray-200/40 backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Resume style</h3>
                  <p className="text-sm text-gray-500">
                    Choose the template you want Coverly to populate.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {TEMPLATE_LIST.map((template) => {
                  const isActive = template.id === selectedTemplateId;
                  return (
                    <div
                      key={template.id}
                      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                        isActive
                          ? "border-primary shadow-lg shadow-primary/20"
                          : "border-gray-200 hover:border-primary/40 hover:shadow"
                      }`}
                    >
                      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                        <div
                          className="pointer-events-none origin-top-left scale-[0.32]"
                          style={{ width: "620px" }}
                        >
                          <template.Illustration resume={template.sampleData} />
                        </div>
                        <div className="pointer-events-none absolute inset-0 rounded-2xl border border-black/5 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                      </div>
                      <div className="flex items-center justify-between gap-2 px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {template.name}
                          </p>
                          <p className="text-xs text-gray-500">{template.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTemplateId(template.id);
                              setHasGeneratedPdf(false);
                            }}
                            className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                              isActive
                                ? "bg-primary text-white"
                                : "border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                            }`}
                          >
                            {isActive ? "Selected" : "Use"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewTemplateId(template.id)}
                            className="text-xs font-semibold text-primary/80 underline-offset-4 transition-colors hover:text-primary hover:underline"
                          >
                            Preview
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <InputArea
              formData={formData}
              onFieldChange={handleFieldChange}
              onExperienceChange={handleExperienceChange}
              onAddExperience={handleAddExperience}
              onRemoveExperience={handleRemoveExperience}
              onEducationChange={handleEducationChange}
              onAddEducation={handleAddEducation}
              onRemoveEducation={handleRemoveEducation}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              disableGenerate={hasGeneratedPdf}
              selectedOption={selectedOption}
            />

            {isLoading && <Loader />}

            {(error || statusMessage) && (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                  error
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-primary/20 bg-primary/10 text-primary"
                }`}
              >
                {error || statusMessage}
              </div>
            )}
      </div>

          <OutputBox
            output={output}
            resumeData={resumeData}
            selectedOption={selectedOption}
            selectedTemplate={selectedTemplate}
            onCopy={handleCopy}
            onClear={handleClear}
            onDownload={handleDownload}
          />
        </section>
      </main>

      {previewTemplate && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setPreviewTemplateId(null)}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/40 bg-white/95 p-6 shadow-2xl shadow-primary/30 backdrop-blur"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {previewTemplate.name}
                </h3>
                <p className="text-sm text-gray-500">{previewTemplate.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewTemplateId(null)}
                aria-label="Close template preview"
                className="rounded-full border border-gray-200 p-2 text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[auto_220px]">
              <div className="max-h-[70vh] overflow-auto rounded-2xl border border-gray-200 bg-gray-50 p-6">
                <div className="mx-auto w-[620px]">
                  <previewTemplate.Illustration resume={previewTemplate.sampleData} />
                </div>
              </div>
              <div className="flex flex-col justify-between gap-4">
                <div className="rounded-2xl bg-white/90 p-4 shadow">
                  <p className="text-sm text-gray-600">
                    This preview uses sample content. When you generate with Coverly, we’ll
                    pour your details into this layout automatically.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTemplateId(previewTemplate.id);
                    setHasGeneratedPdf(false);
                    setPreviewTemplateId(null);
                  }}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-emerald-500"
                >
                  Use this template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-16 text-center text-sm text-gray-500">
        Made with ❤️ by Aman Sharma.
      </footer>

      {/* Gemini key launcher */}
      <button
        type="button"
        onClick={() => setShowApiKeyPanel((prev) => !prev)}
        className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full border border-primary/40 bg-white/80 shadow-xl shadow-primary/20 backdrop-blur hover:-translate-y-1 hover:border-primary hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        aria-label="Manage Gemini API key"
      >
        <img
          src={geminiBadge}
          alt="Gemini badge"
          className="h-10 w-10 animate-pulse"
        />
        </button>

      {showApiKeyPanel && (
        <div
          className="fixed inset-0 z-30 flex items-end justify-end bg-black/20 p-4 sm:items-center sm:p-6"
          onClick={() => setShowApiKeyPanel(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-gray-100 bg-white/95 p-6 shadow-2xl shadow-primary/20 backdrop-blur"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Gemini API Key
                </h3>
                <p className="text-sm text-gray-500">
                  Paste your own key to avoid shared rate limits. Keys are encrypted and stay on this device.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowApiKeyPanel(false)}
                aria-label="Close Gemini key panel"
                className="rounded-full border border-gray-200 p-2 text-gray-500 transition-colors duration-200 hover:border-gray-300 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(event) => setApiKeyInput(event.target.value)}
                placeholder={
                  hasCustomApiKey
                    ? "Paste a new Gemini key to replace the current one"
                    : "Paste your Gemini API key (AI... )"
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  disabled={!apiKeyInput.trim()}
                  className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors duration-200 hover:border-primary hover:bg-primary/20 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Save Key
                </button>
                {hasCustomApiKey && (
                  <button
                    type="button"
                    onClick={handleRemoveApiKey}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-500 transition-colors duration-200 hover:border-red-300 hover:text-red-500"
                  >
                    Remove Key
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setApiKeyInput("");
                    setError("");
                    setStatusMessage("");
                  }}
                  className="ml-auto text-xs font-semibold text-gray-400 transition-colors duration-200 hover:text-gray-600"
                >
                  Clear field
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span>Need a key?</span>
                <a
                  href="https://aistudio.google.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-semibold text-primary transition-colors duration-200 hover:border-primary hover:bg-primary/10"
                >
                  Generate at Google AI Studio ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
  );
};

export default App;
