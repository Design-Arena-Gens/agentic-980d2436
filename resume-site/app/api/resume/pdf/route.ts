import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
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

  const pdfDoc = await PDFDocument.create();
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const margin = 56;
  let page = pdfDoc.addPage();
  let { width, height } = page.getSize();
  let cursorY = height - margin;

  const addPage = () => {
    page = pdfDoc.addPage();
    ({ width, height } = page.getSize());
    cursorY = height - margin;
  };

  const ensureSpace = (space: number) => {
    if (cursorY - space < margin) {
      addPage();
    }
  };

  const wrapText = (text: string, fontSize: number, font = regularFont) => {
    const maxWidth = width - margin * 2;
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const lineWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (lineWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  const drawLines = (
    lines: string[],
    fontSize: number,
    font = regularFont,
    color = rgb(0, 0, 0),
    indent = 0
  ) => {
    const lineHeight = fontSize + 4;
    ensureSpace(lines.length * lineHeight);
    lines.forEach((line) => {
      page.drawText(line, {
        x: margin + indent,
        y: cursorY,
        size: fontSize,
        font,
        color,
      });
      cursorY -= lineHeight;
    });
  };

  const drawHeading = (text: string, fontSize: number) => {
    const lines = wrapText(text, fontSize, boldFont);
    drawLines(lines, fontSize, boldFont, rgb(0.09, 0.13, 0.27));
    cursorY -= 8;
  };

  const drawSubheading = (text: string) => {
    const lines = wrapText(text, 13, boldFont);
    drawLines(lines, 13, boldFont, rgb(0.11, 0.3, 0.84));
    cursorY -= 4;
  };

  const drawParagraph = (text: string) => {
    const lines = wrapText(text, 11);
    drawLines(lines, 11, regularFont, rgb(0.2, 0.26, 0.33));
    cursorY -= 6;
  };

  const drawBulletList = (items: string[]) => {
    items.forEach((item) => {
      const lines = wrapText(item, 11);
      ensureSpace(lines.length * (11 + 4));
      page.drawText("•", {
        x: margin,
        y: cursorY,
        size: 11,
        font: boldFont,
        color: rgb(0.15, 0.27, 0.78),
      });
      drawLines(lines, 11, regularFont, rgb(0.2, 0.26, 0.33), 14);
      cursorY -= 2;
    });
    cursorY -= 4;
  };

  // Header
  drawHeading(personal.name, 20);
  const designationLines = wrapText(
    personal.designation.toUpperCase(),
    11,
    boldFont
  );
  drawLines(designationLines, 11, boldFont, rgb(0.15, 0.27, 0.78));

  const contactLine = `${personal.location} • ${personal.phone} • ${personal.email} • ${personal.linkedin}`;
  drawLines(wrapText(contactLine, 10), 10, regularFont, rgb(0.4, 0.45, 0.52));
  cursorY -= 6;

  // Summary
  drawSubheading("Professional Summary");
  drawParagraph(summary);

  // Responsibilities
  keyResponsibilities.forEach((group) => {
    drawSubheading(group.category);
    drawBulletList(group.items);
  });

  // Experience
  drawSubheading("Professional Experience");
  experience.forEach((role) => {
    const titleLine = `${role.title} | ${role.company}`;
    drawLines(wrapText(titleLine, 12, boldFont), 12, boldFont);
    drawLines(
      wrapText(`${role.location} • ${role.period}`, 10),
      10,
      regularFont,
      rgb(0.4, 0.45, 0.52)
    );
    cursorY -= 4;
    drawBulletList(role.highlights);
  });

  // Core competencies
  drawSubheading("Core Competencies");
  coreCompetencies.forEach((competency) => {
    drawLines(wrapText(competency, 11), 11, regularFont);
  });
  cursorY -= 4;

  // Technical proficiencies
  drawSubheading("Technical Proficiencies");
  technicalProficiencies.forEach((group) => {
    const text = `${group.category}: ${group.items.join(", ")}`;
    drawParagraph(text);
  });

  // Education
  drawSubheading("Education");
  education.forEach((item) => {
    drawLines(wrapText(item.qualification, 12, boldFont), 12, boldFont);
    drawLines(
      wrapText(`${item.institution} • ${item.period}`, 10),
      10,
      regularFont,
      rgb(0.4, 0.45, 0.52)
    );
    if (item.details) {
      drawParagraph(item.details);
    }
  });

  // Certifications
  drawSubheading("Certifications");
  certifications.forEach((cert) => {
    const text = `${cert.name} — ${cert.issuer}, ${cert.year}`;
    drawParagraph(text);
  });

  // Achievements
  drawSubheading("Achievements");
  achievements.forEach((achievement) => {
    const text = `${achievement.title}: ${achievement.details}`;
    drawParagraph(text);
  });

  // Interests
  drawSubheading("Professional Interests");
  interests.forEach((interest) => {
    drawParagraph(interest);
  });

  const pdfBytes = await pdfDoc.save();
  const pdfArrayBuffer = pdfBytes.buffer.slice(
    pdfBytes.byteOffset,
    pdfBytes.byteOffset + pdfBytes.byteLength
  ) as ArrayBuffer;

  return new NextResponse(pdfArrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Deepak-Chaudhari-Resume.pdf"',
    },
  });
}
