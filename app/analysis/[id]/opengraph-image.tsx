import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export const alt = "Conference Talk Analysis";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

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

export default async function Image({ params }: { params: { id: string } }) {
  const talk = await prisma.talk.findUnique({
    where: { id: params.id },
  });

  if (!talk) {
    return new Response("Talk not found", { status: 404 });
  }

  const titleLines = splitTextIntoLines(talk.title);
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
            filter: "none",
          }}
        />

        {/* {talk.logo && (
          <div
            style={{
              display: "flex",
              position: "absolute",
              padding: "0 130px",
              top: "30px",
              objectFit: "contain",
              width: "100%",
              justifyContent: "flex-end",
            }}
          >
            <img
              src={talk.logo}
              alt="Conference logo"
              style={{
                height: "100px",
                maxWidth: "150px",
                objectFit: "contain",
              }}
            />
          </div>
        )} */}

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
              color: "white",
              lineHeight: 1.2,
            }}
          >
            {talk.title}
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
              src={talk.speakerAvatar!}
              alt="Speaker"
              style={{
                height: "100px",
                width: "100px",
                border: "3px solid white",
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
                  color: "white",
                }}
              >
                {talk.speaker}
              </div>
              {talk.company && (
                <div
                  style={{
                    fontSize: 35,
                    color: "white",
                    opacity: 0.8,
                  }}
                >
                  {talk.company}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: await loadGoogleFont(
            "Geist",
            talk.title + talk.speaker + (talk.company || "")
          ),
          style: "normal",
        },
      ],
    }
  );
}
