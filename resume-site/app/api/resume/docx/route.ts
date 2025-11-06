import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { NextResponse } from "next/server";
import { resumeData } from "../../../../lib/resumeData";

export async function GET() {
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

  const paragraphs: Paragraph[] = [];

  paragraphs.push(
    new Paragraph({
      text: personal.name,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      text: personal.designation.toUpperCase(),
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
    }),
    new Paragraph({
      text: `${personal.location} | ${personal.phone} | ${personal.email} | ${personal.linkedin}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  paragraphs.push(
    new Paragraph({
      text: "Professional Summary",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 80 },
    }),
    new Paragraph({
      text: summary,
      spacing: { after: 160 },
    })
  );

  keyResponsibilities.forEach((responsibility) => {
    paragraphs.push(
      new Paragraph({
        text: responsibility.category,
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 120, after: 40 },
      })
    );
    responsibility.items.forEach((item) => {
      paragraphs.push(
        new Paragraph({
          text: item,
          bullet: { level: 0 },
          spacing: { after: 40 },
        })
      );
    });
  });

  paragraphs.push(
    new Paragraph({
      text: "Professional Experience",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 220, after: 80 },
    })
  );

  experience.forEach((role) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${role.title} | ${role.company}`,
            bold: true,
          }),
        ],
        spacing: { after: 20 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `${role.location} • ${role.period}`,
            italics: true,
          }),
        ],
        spacing: { after: 60 },
      })
    );

    role.highlights.forEach((highlight) => {
      paragraphs.push(
        new Paragraph({
          text: highlight,
          bullet: { level: 0 },
          spacing: { after: 40 },
        })
      );
    });

    paragraphs.push(new Paragraph({ text: "", spacing: { after: 60 } }));
  });

  paragraphs.push(
    new Paragraph({
      text: "Core Competencies",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 220, after: 80 },
    })
  );

  coreCompetencies.forEach((competency) => {
    paragraphs.push(
      new Paragraph({
        text: competency,
        bullet: { level: 0 },
        spacing: { after: 40 },
      })
    );
  });

  paragraphs.push(
    new Paragraph({
      text: "Technical Proficiencies",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 220, after: 80 },
    })
  );

  technicalProficiencies.forEach((group) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${group.category}: `, bold: true }),
          new TextRun(group.items.join(", ")),
        ],
        spacing: { after: 40 },
      })
    );
  });

  paragraphs.push(
    new Paragraph({
      text: "Education",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 220, after: 80 },
    })
  );

  education.forEach((item) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: item.qualification, bold: true }),
        ],
        spacing: { after: 20 },
      }),
      new Paragraph({
        text: `${item.institution} • ${item.period}`,
        spacing: { after: 40 },
      })
    );
    if (item.details) {
      paragraphs.push(
        new Paragraph({
          text: item.details,
          spacing: { after: 40 },
        })
      );
    }
  });

  paragraphs.push(
    new Paragraph({
      text: "Certifications",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 220, after: 80 },
    })
  );

  certifications.forEach((cert) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: cert.name, bold: true }),
          new TextRun({ text: ` — ${cert.issuer}, ${cert.year}`, break: 1 }),
        ],
        spacing: { after: 40 },
      })
    );
  });

  paragraphs.push(
    new Paragraph({
      text: "Achievements",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 220, after: 80 },
    })
  );

  achievements.forEach((achievement) => {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${achievement.title}: `, bold: true }),
          new TextRun(achievement.details),
        ],
        bullet: { level: 0 },
        spacing: { after: 40 },
      })
    );
  });

  paragraphs.push(
    new Paragraph({
      text: "Professional Interests",
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 220, after: 80 },
    })
  );

  interests.forEach((interest) => {
    paragraphs.push(
      new Paragraph({
        text: interest,
        bullet: { level: 0 },
        spacing: { after: 40 },
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;

  return new NextResponse(arrayBuffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition":
        'attachment; filename="Deepak-Chaudhari-Resume.docx"',
    },
  });
}
