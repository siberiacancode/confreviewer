import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import {
  getConferenceType,
  parseConferenceData,
} from "@/app/analysis/(helpers)";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const loadGoogleFont = async (font: string, text: string) => {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(
    text
  )}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
};

// Функция для разбивки текста на строки
const splitTextIntoLines = (text: string, maxLines: number = 3): string[] => {
  const words = text.split(" ");
  const lines: string[] = [];

  if (words.length <= maxLines) {
    return words.map((word) => word);
  }

  const wordsPerLine = Math.ceil(words.length / maxLines);

  for (let i = 0; i < maxLines; i++) {
    const start = i * wordsPerLine;
    const end = Math.min(start + wordsPerLine, words.length);
    const line = words.slice(start, end).join(" ");
    if (line) lines.push(line);
  }

  return lines;
};

const getFontSize = (lines: string[]): number => {
  if (lines.length === 1) return 2;
  if (lines.length === 2) return 60;
  return 48;
};

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new Response("URL parameter is required", { status: 400 });
  }

  const conferenceData = await fetch(decodeURIComponent(url));
  const conferenceType = getConferenceType(url);

  const result = await parseConferenceData(
    conferenceType,
    await conferenceData.text(),
    url
  );

  const titleLines = splitTextIntoLines(result.title);
  const fontSize = getFontSize(titleLines);

  const templatePath = path.join(process.cwd(), "public", "template.png");

  const imageBuffer = fs.readFileSync(templatePath);
  const backgroundImage = `url(data:image/png;base64,${imageBuffer.toString(
    "base64"
  )})`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          position: "relative",
          backgroundImage,
          backgroundSize: "cover",
          backgroundPosition: "center",
          fontFamily: "Geist",
        }}
      >
        {result.logo && (
          <img
            src={result.logo}
            alt="Conference logo"
            style={{
              height: "32px",
              maxWidth: "120px",
              objectFit: "contain",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {titleLines.map((line, index) => (
            <div
              key={index}
              style={{
                fontSize: fontSize,
                fontWeight: "700",
                color: "white",
                lineHeight: 1.2,
                textShadow: "0 4px 12px rgba(0,0,0,0.5)",
                marginBottom: index < titleLines.length - 1 ? "16px" : "0px",
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "30px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "16px 20px",
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          }}
        >
          {result.speakerAvatar && (
            <img
              src={result.speakerAvatar}
              alt="Speaker"
              width={60}
              height={60}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <div
              style={{
                fontSize: 24,
                fontWeight: "600",
                color: "#1f2937",
                lineHeight: 1.2,
              }}
            >
              {result.speaker}
            </div>
            {result.company && (
              <div
                style={{
                  fontSize: 18,
                  color: "#6b7280",
                  lineHeight: 1.2,
                }}
              >
                {result.company}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Geist",
          data: await loadGoogleFont(
            "Geist",
            result.title + result.speaker + result.company
          ),
          style: "normal",
        },
      ],
    }
  );
};
