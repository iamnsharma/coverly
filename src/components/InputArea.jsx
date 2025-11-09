const Label = ({ htmlFor, children }) => (
  <label
    htmlFor={htmlFor}
    className="text-sm font-medium text-gray-600 transition-colors duration-200 peer-focus:text-primary"
  >
    {children}
  </label>
);

const InputWrapper = ({ children }) => (
  <div className="flex flex-col gap-2">{children}</div>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-lg font-semibold text-gray-900">{children}</h3>
);

const InputArea = ({
  formData,
  onFieldChange,
  onExperienceChange,
  onAddExperience,
  onRemoveExperience,
  onEducationChange,
  onAddEducation,
  onRemoveEducation,
  onGenerate,
  isLoading,
  selectedOption,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    onGenerate();
  };

  const hasValidExperience = formData.experiences.every(
    (experience) =>
      experience.role.trim() &&
      experience.company.trim() &&
      experience.startDate.trim() &&
      experience.highlights.trim()
  );

  const hasValidEducation = formData.education.every(
    (education) =>
      education.institution.trim() &&
      education.degree.trim() &&
      education.startDate.trim()
  );

  const isDisabled =
    !formData.name.trim() ||
    !formData.headline.trim() ||
    !formData.email.trim() ||
    !formData.phone.trim() ||
    !formData.location.trim() ||
    !formData.targetRole.trim() ||
    !formData.experienceYears.trim() ||
    !formData.skills.trim() ||
    !formData.softSkills.trim() ||
    !hasValidExperience ||
    !hasValidEducation ||
    isLoading;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-3xl border border-gray-100 bg-white/80 p-6 shadow-lg shadow-gray-200/30 backdrop-blur-md md:p-8"
    >
      <div className="space-y-4">
        <SectionTitle>Contact Information</SectionTitle>
        <div className="grid gap-5 md:grid-cols-2">
          <InputWrapper>
            <Label htmlFor="name">Full Name</Label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(event) => onFieldChange("name", event.target.value)}
              placeholder="Full Name"
              className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="headline">Professional Headline</Label>
            <input
              id="headline"
              type="text"
              value={formData.headline}
              onChange={(event) => onFieldChange("headline", event.target.value)}
              placeholder="Product-Focused Software Engineer"
              className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="email">Email</Label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(event) => onFieldChange("email", event.target.value)}
              placeholder="example@email.com"
              className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="phone">Phone</Label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(event) => onFieldChange("phone", event.target.value)}
              placeholder="+1 555 123 4567"
              className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="location">Location</Label>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(event) => onFieldChange("location", event.target.value)}
              placeholder="City, Country"
              className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="portfolio">Portfolio</Label>
            <input
              id="portfolio"
              type="url"
              value={formData.portfolio}
              onChange={(event) => onFieldChange("portfolio", event.target.value)}
              placeholder="https://portfolio.example.com"
              className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <input
              id="linkedin"
              type="url"
              value={formData.linkedin}
              onChange={(event) => onFieldChange("linkedin", event.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="github">GitHub</Label>
            <input
              id="github"
              type="url"
              value={formData.github}
              onChange={(event) => onFieldChange("github", event.target.value)}
              placeholder="https://github.com/username"
              className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
            />
          </InputWrapper>
        </div>
      </div>

      <div className="space-y-4">
        <SectionTitle>Career Focus</SectionTitle>
        <div className="grid gap-5 md:grid-cols-2">
          <InputWrapper>
            <Label htmlFor="targetRole">Target Role</Label>
            <input
              id="targetRole"
              type="text"
              value={formData.targetRole}
              onChange={(event) => onFieldChange("targetRole", event.target.value)}
              placeholder="Senior Software Engineer"
              required
              className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="experienceYears">Years of Experience</Label>
            <input
              id="experienceYears"
              type="number"
              min="0"
              value={formData.experienceYears}
              onChange={(event) =>
                onFieldChange("experienceYears", event.target.value)
              }
              placeholder="5"
              required
              className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="skills">Core Skills & Tools</Label>
            <input
              id="skills"
              type="text"
              value={formData.skills}
              onChange={(event) => onFieldChange("skills", event.target.value)}
              placeholder="React.js, TypeScript, Node.js, AWS, GraphQL"
              required
              className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="softSkills">Soft Skills</Label>
            <input
              id="softSkills"
              type="text"
              value={formData.softSkills}
              onChange={(event) =>
                onFieldChange("softSkills", event.target.value)
              }
              placeholder="Team leadership, stakeholder management, mentoring, communication"
              required
              className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
            />
          </InputWrapper>
        </div>
      </div>

      <div className="space-y-4">
        <SectionTitle>Experience</SectionTitle>
        <p className="text-sm text-gray-500">
          Add up to three recent roles. Include impact metrics or major launches.
        </p>
        <div className="space-y-6">
          {formData.experiences.map((experience, index) => (
            <div
              key={experience.id}
              className="space-y-4 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold text-gray-800">
                  Role {index + 1}
                </h4>
                {formData.experiences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveExperience(experience.id)}
                    className="text-sm font-semibold text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <InputWrapper>
                  <Label htmlFor={`role-${experience.id}`}>Role</Label>
                  <input
                    id={`role-${experience.id}`}
                    type="text"
                    value={experience.role}
                    onChange={(event) =>
                      onExperienceChange(experience.id, "role", event.target.value)
                    }
                    placeholder="Senior Software Engineer"
                    className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
                  />
                </InputWrapper>
                <InputWrapper>
                  <Label htmlFor={`company-${experience.id}`}>Company</Label>
                  <input
                    id={`company-${experience.id}`}
                    type="text"
                    value={experience.company}
                    onChange={(event) =>
                      onExperienceChange(
                        experience.id,
                        "company",
                        event.target.value
                      )
                    }
                    placeholder="Company Name"
                    className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
                  />
                </InputWrapper>
                <InputWrapper>
                  <Label htmlFor={`location-${experience.id}`}>Location</Label>
                  <input
                    id={`location-${experience.id}`}
                    type="text"
                    value={experience.location}
                    onChange={(event) =>
                      onExperienceChange(
                        experience.id,
                        "location",
                        event.target.value
                      )
                    }
                    placeholder="City, Country (Remote)"
                    className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
                  />
                </InputWrapper>
                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper>
                    <Label htmlFor={`start-${experience.id}`}>Start</Label>
                    <input
                      id={`start-${experience.id}`}
                      type="text"
                      value={experience.startDate}
                      onChange={(event) =>
                        onExperienceChange(
                          experience.id,
                          "startDate",
                          event.target.value
                        )
                      }
                      placeholder="Jan 2022"
                      className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
                    />
                  </InputWrapper>
                  <InputWrapper>
                    <Label htmlFor={`end-${experience.id}`}>End</Label>
                    <input
                      id={`end-${experience.id}`}
                      type="text"
                      value={experience.endDate}
                      onChange={(event) =>
                        onExperienceChange(
                          experience.id,
                          "endDate",
                          event.target.value
                        )
                      }
                      placeholder="Present"
                      className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
                    />
                  </InputWrapper>
                </div>
              </div>
              <InputWrapper>
                <Label htmlFor={`highlights-${experience.id}`}>
                  Achievements & Highlights
                </Label>
                <textarea
                  id={`highlights-${experience.id}`}
                  value={experience.highlights}
                  onChange={(event) =>
                    onExperienceChange(
                      experience.id,
                      "highlights",
                      event.target.value
                    )
                  }
                  placeholder="Led modernization of core platform, boosting performance by 30% and launching AI onboarding that increased activation by 25%."
                  rows={4}
                  className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
                />
              </InputWrapper>
            </div>
          ))}
        </div>
        {formData.experiences.length < 3 && (
          <button
            type="button"
            onClick={onAddExperience}
            className="text-sm font-semibold text-primary hover:text-emerald-600"
          >
            + Add another role
          </button>
        )}
      </div>

      <div className="space-y-4">
        <SectionTitle>Education</SectionTitle>
        <div className="space-y-6">
          {formData.education.map((education, index) => (
            <div
              key={education.id}
              className="space-y-4 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold text-gray-800">
                  Program {index + 1}
                </h4>
                {formData.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveEducation(education.id)}
                    className="text-sm font-semibold text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <InputWrapper>
                  <Label htmlFor={`institution-${education.id}`}>
                    Institution
                  </Label>
                  <input
                    id={`institution-${education.id}`}
                    type="text"
                    value={education.institution}
                    onChange={(event) =>
                      onEducationChange(
                        education.id,
                        "institution",
                        event.target.value
                      )
                    }
                    placeholder="University Name"
                    className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
                  />
                </InputWrapper>
                <InputWrapper>
                  <Label htmlFor={`degree-${education.id}`}>Degree</Label>
                  <input
                    id={`degree-${education.id}`}
                    type="text"
                    value={education.degree}
                    onChange={(event) =>
                      onEducationChange(
                        education.id,
                        "degree",
                        event.target.value
                      )
                    }
                    placeholder="B.Sc. in Computer Science"
                    className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
                  />
                </InputWrapper>
                <div className="grid grid-cols-2 gap-4">
                  <InputWrapper>
                    <Label htmlFor={`edu-start-${education.id}`}>Start</Label>
                    <input
                      id={`edu-start-${education.id}`}
                      type="text"
                      value={education.startDate}
                      onChange={(event) =>
                        onEducationChange(
                          education.id,
                          "startDate",
                          event.target.value
                        )
                      }
                      placeholder="2018"
                      className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
                    />
                  </InputWrapper>
                  <InputWrapper>
                    <Label htmlFor={`edu-end-${education.id}`}>End</Label>
                    <input
                      id={`edu-end-${education.id}`}
                      type="text"
                      value={education.endDate}
                      onChange={(event) =>
                        onEducationChange(
                          education.id,
                          "endDate",
                          event.target.value
                        )
                      }
                      placeholder="2020"
                      className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
                    />
                  </InputWrapper>
                </div>
              </div>
              <InputWrapper>
                <Label htmlFor={`education-details-${education.id}`}>
                  Highlights / Coursework
                </Label>
                <textarea
                  id={`education-details-${education.id}`}
                  value={education.details}
                  onChange={(event) =>
                    onEducationChange(
                      education.id,
                      "details",
                      event.target.value
                    )
                  }
                  placeholder="Dean's List 2019, Led capstone AI project for predictive analytics."
                  rows={3}
                  className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
                />
              </InputWrapper>
            </div>
          ))}
        </div>
        {formData.education.length < 3 && (
          <button
            type="button"
            onClick={onAddEducation}
            className="text-sm font-semibold text-primary hover:text-emerald-600"
          >
            + Add another program
          </button>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <InputWrapper>
          <Label htmlFor="certifications">Certifications</Label>
          <textarea
            id="certifications"
            value={formData.certifications}
            onChange={(event) =>
              onFieldChange("certifications", event.target.value)
            }
            placeholder="My Cerificates"
            rows={3}
            className="peer h-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
          />
        </InputWrapper>
        <InputWrapper>
          <Label htmlFor="projects">Projects / Highlights</Label>
          <textarea
            id="projects"
            value={formData.projects}
            onChange={(event) => onFieldChange("projects", event.target.value)}
            placeholder="My Projects"
            rows={3}
            className="peer h-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
          />
        </InputWrapper>
      </div>

      <InputWrapper>
        <Label htmlFor="details">Additional Notes</Label>
        <textarea
          id="details"
          value={formData.details}
          onChange={(event) => onFieldChange("details", event.target.value)}
          placeholder={
            selectedOption === "Cover Letter"
              ? "Why you're excited about the opportunity, recent accomplishments, or cultural fit."
              : "Anything else you'd like highlighted (awards, volunteer work, availability)."
          }
          rows={4}
          className="peer rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-all duration-200 focus:border-primary focus:shadow-soft focus:outline-none"
        />
      </InputWrapper>

      <button
        type="submit"
        disabled={isDisabled}
        className="w-full rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-primary/50"
      >
        {isLoading ? "Generating..." : "Generate with AI"}
      </button>
    </form>
  );
};

export default InputArea;