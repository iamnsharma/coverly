import { useCallback, useMemo, useState } from "react";
import { jsPDF } from "jspdf";

import Header from "./components/Header.jsx";
import InputArea from "./components/InputArea.jsx";
import Loader from "./components/Loader.jsx";
import OptionSelector from "./components/OptionSelector.jsx";
import OutputBox from "./components/OutputBox.jsx";
import generateText from "./utils/generateText.js";

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

const DEFAULT_FORM = {
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
};

const App = () => {
  const [selectedOption, setSelectedOption] = useState("Resume");
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [output, setOutput] = useState("");
  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

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
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }, []);

  const handleExperienceChange = useCallback((id, field, value) => {
    setFormData((current) => ({
      ...current,
      experiences: current.experiences.map((experience) =>
        experience.id === id ? { ...experience, [field]: value } : experience
      ),
    }));
  }, []);

  const handleAddExperience = useCallback(() => {
    setFormData((current) => ({
      ...current,
      experiences: [...current.experiences, createExperience()],
    }));
  }, []);

  const handleRemoveExperience = useCallback((id) => {
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
    setFormData((current) => ({
      ...current,
      education: current.education.map((program) =>
        program.id === id ? { ...program, [field]: value } : program
      ),
    }));
  }, []);

  const handleAddEducation = useCallback(() => {
    setFormData((current) => ({
      ...current,
      education: [...current.education, createEducation()],
    }));
  }, []);

  const handleRemoveEducation = useCallback((id) => {
    setFormData((current) => {
      if (current.education.length === 1) return current;
      return {
        ...current,
        education: current.education.filter((program) => program.id !== id),
      };
    });
  }, []);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setStatusMessage("");

    try {
      const aiText = await generateText(prompt);
      if (selectedOption === "Resume") {
        const jsonString = aiText.trim().replace(/```json|```/gi, "");
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
  }, []);

  const handleDownload = useCallback(() => {
    if (selectedOption === "Resume") {
      if (!resumeData) return;

      const doc = new jsPDF({
        unit: "pt",
        format: "a4",
      });

      const marginX = 48;
      let cursorY = 60;
      const pageHeight = doc.internal.pageSize.getHeight();
      const maxWidth = doc.internal.pageSize.getWidth() - marginX * 2;

      const addTextBlock = (text, options = {}) => {
        const { fontSize = 11, fontStyle = "normal", marginTop = 14 } = options;
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

      const { contact, summary, experience, education, skills, certifications, projects } =
        resumeData;

      addTextBlock(
        `${contact?.name ?? ""}`,
        { fontSize: 20, fontStyle: "bold", marginTop: 6 }
      );
      addTextBlock(`${contact?.headline ?? ""}`, { fontSize: 12, marginTop: 2 });

      const contactLine = [
        contact?.location,
        contact?.email,
        contact?.phone,
      ]
        .filter(Boolean)
        .join(" · ");
      if (contactLine) {
        addTextBlock(contactLine, { fontSize: 10, marginTop: 2 });
      }
      if (Array.isArray(contact?.links) && contact.links.length > 0) {
        addTextBlock(contact.links.join(" · "), { fontSize: 10, marginTop: 2 });
      }

      if (summary) {
        addTextBlock("PROFILE", { fontSize: 12, fontStyle: "bold", marginTop: 8 });
        addTextBlock(summary, { fontSize: 11, marginTop: 4 });
      }

      if (Array.isArray(experience) && experience.length > 0) {
        addTextBlock("EXPERIENCE", {
          fontSize: 12,
          fontStyle: "bold",
          marginTop: 8,
        });
        experience.forEach((item) => {
          const header = `${item.role ?? ""} · ${item.company ?? ""}`;
          addTextBlock(header, { fontSize: 11, fontStyle: "bold", marginTop: 4 });
          const meta = [item.location, `${item.start ?? ""} – ${item.end ?? ""}`]
            .filter(Boolean)
            .join(" · ");
          if (meta) {
            addTextBlock(meta, { fontSize: 10, marginTop: 2 });
          }
          if (Array.isArray(item.bullets)) {
            item.bullets.forEach((bullet) => {
              addTextBlock(`• ${bullet}`, { fontSize: 11, marginTop: 2 });
            });
          }
          cursorY += 6;
        });
      }

      if (Array.isArray(education) && education.length > 0) {
        addTextBlock("EDUCATION", {
          fontSize: 12,
          fontStyle: "bold",
          marginTop: 8,
        });
        education.forEach((item) => {
          addTextBlock(
            `${item.degree ?? ""} · ${item.institution ?? ""}`,
            { fontSize: 11, fontStyle: "bold", marginTop: 4 }
          );
          const meta = [item.start, item.end].filter(Boolean).join(" – ");
          if (meta) {
            addTextBlock(meta, { fontSize: 10, marginTop: 2 });
          }
          if (item.details) {
            addTextBlock(item.details, { fontSize: 11, marginTop: 2 });
          }
          cursorY += 6;
        });
      }

      if (skills) {
        addTextBlock("SKILLS", {
          fontSize: 12,
          fontStyle: "bold",
          marginTop: 8,
        });
        if (skills.core?.length) {
          addTextBlock(`Core: ${skills.core.join(", ")}`, {
            fontSize: 11,
            marginTop: 2,
          });
        }
        if (skills.soft?.length) {
          addTextBlock(`Soft: ${skills.soft.join(", ")}`, {
            fontSize: 11,
            marginTop: 2,
          });
        }
      }

      if (Array.isArray(certifications) && certifications.length > 0) {
        addTextBlock("CERTIFICATIONS", {
          fontSize: 12,
          fontStyle: "bold",
          marginTop: 8,
        });
        certifications.forEach((cert) => {
          addTextBlock(`• ${cert}`, { fontSize: 11, marginTop: 2 });
        });
      }

      if (Array.isArray(projects) && projects.length > 0) {
        addTextBlock("PROJECTS", {
          fontSize: 12,
          fontStyle: "bold",
          marginTop: 8,
        });
        projects.forEach((project) => {
          addTextBlock(`• ${project}`, { fontSize: 11, marginTop: 2 });
        });
      }

      doc.save("coverly-resume.pdf");
      setStatusMessage("Resume PDF downloaded.");
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
  }, [output, resumeData, selectedOption]);

  return (
    <div className="min-h-screen w-full px-4 py-12 md:px-8">
      <main className="mx-auto flex max-w-6xl flex-col gap-10">
        <Header />

        <section className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-8">
            <OptionSelector
              selectedOption={selectedOption}
              onSelect={setSelectedOption}
            />

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
            onCopy={handleCopy}
            onClear={handleClear}
            onDownload={handleDownload}
          />
        </section>
      </main>

      <footer className="mt-16 text-center text-sm text-gray-500">
        Made with ❤️ by Aman Sharma.
      </footer>
      </div>
  );
};

export default App;
