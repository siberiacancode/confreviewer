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
  const theme = searchParams.get("theme") ?? "dark";

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
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            backgroundImage,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: theme === "dark" ? "none" : "invert(1)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "170px",
            padding: "0 130px",
            width: "100%",
            display: "flex",
          }}
        >
          <div
            style={{
              fontSize,
              fontWeight: "700",
              color: theme === "dark" ? "white" : "black",
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
            bottom: "40px",
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
            <img
              src={result.speakerAvatar}
              alt="Speaker"
              style={{
                height: "100px",
                width: "100px",
                border: `3px solid ${theme === "dark" ? "white" : "black"}`,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  fontSize: 45,
                  fontWeight: "600",
                  color: theme === "dark" ? "white" : "black",
                }}
              >
                {result.speaker}
              </div>
              {result.company && (
                <div
                  style={{
                    fontSize: 35,
                    color: theme === "dark" ? "white" : "black",
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
                height: "100px",
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
