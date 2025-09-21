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
  if (lines.length === 1) return 130;
  if (lines.length === 2) return 100;
  return 70;
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
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "150px",
            padding: "0 130px",
            width: "100%",
            display: "flex",
          }}
        >
          <div
            style={{
              fontSize,
              fontWeight: "700",
              color: "white",
              lineHeight: 1.2,
            }}
          >
            {result.title}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            padding: "0 130px",
            display: "flex",
            bottom: "80px",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {result.speakerAvatar && (
              <img
                src={result.speakerAvatar}
                alt="Speaker"
                style={{
                  height: "90px",
                  width: "90px",
                  border: "2px solid white",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontSize: 40,
                  fontWeight: "600",
                  color: "white",
                }}
              >
                {result.speaker}
              </div>
              {result.company && (
                <div
                  style={{
                    fontSize: 30,
                    color: "white",
                    opacity: 0.8,
                  }}
                >
                  {result.company ?? "unknown"}
                </div>
              )}
            </div>
          </div>

          {result.logo && (
            <img
              src={result.logo}
              alt="Conference logo"
              style={{
                height: "90px",
                objectFit: "contain",
              }}
            />
          )}
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
