import styles from "./page.module.css";
import { resumeData } from "../lib/resumeData";

export default function Home() {
  const {
    personal,
    summary,
    coreCompetencies,
    technicalProficiencies,
    experience,
    education,
    certifications,
    achievements,
    interests,
    keyResponsibilities,
  } = resumeData;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.identity}>
            <div className={styles.designation}>{personal.designation}</div>
            <h1 className={styles.name}>{personal.name}</h1>
          </div>
          <div className={styles.meta}>
            <span>{personal.location}</span>
            <a href={`tel:${personal.phone.replace(/\s+/g, "")}`}>
              {personal.phone}
            </a>
            <a href={`mailto:${personal.email}`}>{personal.email}</a>
            <a
              href={`https://${personal.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {personal.linkedin}
            </a>
          </div>
          <div className={styles.actions}>
            <a
              className={`${styles.actionLink} ${styles.actionLinkPrimary}`}
              href="/api/resume/pdf"
            >
              Download PDF
            </a>
            <a className={styles.actionLink} href="/api/resume/docx">
              Download Word
            </a>
          </div>
        </header>

        <main className={styles.grid}>
          <section className={styles.column}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Professional Summary</h2>
              <div className={styles.sectionBody}>{summary}</div>
            </div>

            {keyResponsibilities.map((responsibility) => (
              <div className={styles.section} key={responsibility.category}>
                <h2 className={styles.sectionTitle}>{responsibility.category}</h2>
                <ul className={styles.list}>
                  {responsibility.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Professional Experience</h2>
              <div className={styles.sectionBody}>
                {experience.map((role) => (
                  <article className={styles.experienceCard} key={role.title}>
                    <div className={styles.experienceHeader}>
                      <span className={styles.experienceRole}>{role.title}</span>
                      <span className={styles.experienceMeta}>
                        {role.company} • {role.location}
                      </span>
                      <span className={styles.mutedText}>{role.period}</span>
                    </div>
                    <ul className={styles.list}>
                      {role.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Achievements</h2>
              <div className={styles.sectionBody}>
                {achievements.map((achievement) => (
                  <div key={achievement.title}>
                    <strong>{achievement.title}:</strong> {achievement.details}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className={styles.column}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Core Competencies</h2>
              <div className={`${styles.sectionBody} ${styles.twoColumnList}`}>
                {coreCompetencies.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Technical Proficiencies</h2>
              <div className={styles.sectionBody}>
                {technicalProficiencies.map((group) => (
                  <div key={group.category}>
                    <strong>{group.category}:</strong>{" "}
                    <span className={styles.mutedText}>
                      {group.items.join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Education</h2>
              <div className={styles.sectionBody}>
                {education.map((item) => (
                  <div key={item.qualification}>
                    <strong>{item.qualification}</strong>
                    <div className={styles.mutedText}>{item.institution}</div>
                    <div className={styles.mutedText}>{item.period}</div>
                    {item.details && <p>{item.details}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Certifications</h2>
              <div className={styles.sectionBody}>
                {certifications.map((certification) => (
                  <div key={certification.name}>
                    <strong>{certification.name}</strong>
                    <div className={styles.mutedText}>
                      {certification.issuer} • {certification.year}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Professional Interests</h2>
              <div className={styles.sectionBody}>
                <ul className={styles.list}>
                  {interests.map((interest) => (
                    <li key={interest}>{interest}</li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
