import { ImageResponse } from "@vercel/og";
import path from "path";
import fs from "fs";

export interface OpengraphData {
  title: string;
  speaker: string;
  company?: string;
  speakerAvatar?: string;
}

// Функция для определения оптимального размера шрифта
export const getOptimalFontSize = (text: string): number => {
  const baseSize = 120; // Еще больше увеличено для лучшей читаемости

  if (text.length <= 30) return baseSize;
  if (text.length <= 50) return Math.max(baseSize - 24, 80);
  if (text.length <= 80) return Math.max(baseSize - 36, 70);
  return Math.max(baseSize - 48, 60);
};

export const generateOpengraphImage = async (
  data: OpengraphData
): Promise<Buffer> => {
  try {
    // Загружаем background изображение
    const templatePath = path.join(process.cwd(), "public", "template.png");
    let backgroundImageSrc = "";

    if (fs.existsSync(templatePath)) {
      // Конвертируем в base64 для использования в @vercel/og
      const imageBuffer = fs.readFileSync(templatePath);
      backgroundImageSrc = `data:image/png;base64,${imageBuffer.toString(
        "base64"
      )}`;
    }

    const fontSize = getOptimalFontSize(data.title);

    // Принудительно разбиваем заголовок на 3 строки
    const words = data.title.split(" ");
    const lines: string[] = [];

    if (words.length <= 3) {
      // Если слов мало, каждое слово на отдельной строке
      lines.push(...words);
    } else {
      // Разбиваем на 3 примерно равные части
      const wordsPerLine = Math.floor(words.length / 3);
      const remainder = words.length % 3;

      let startIndex = 0;

      // Первая строка
      let firstLineWords = wordsPerLine + (remainder > 0 ? 1 : 0);
      lines.push(
        words.slice(startIndex, startIndex + firstLineWords).join(" ")
      );
      startIndex += firstLineWords;

      // Вторая строка
      let secondLineWords = wordsPerLine + (remainder > 1 ? 1 : 0);
      lines.push(
        words.slice(startIndex, startIndex + secondLineWords).join(" ")
      );
      startIndex += secondLineWords;

      // Третья строка (все оставшиеся слова)
      if (startIndex < words.length) {
        lines.push(words.slice(startIndex).join(" "));
      }
    }

    // Убираем пустые строки и используем только непустые
    const filteredLines = lines.filter((line) => line.trim().length > 0);

    const response = new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundImage: `url(${backgroundImageSrc})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            fontFamily:
              "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
            position: "relative",
          }}
        >
          {/* Title */}
          <div
            style={{
              position: "absolute",
              top: "180px", // Смещено ближе к центру квадрата
              left: "200px", // Смещено в квадратную область
              right: "200px", // Ограничиваем ширину для квадрата
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start", // Выравнивание по левому краю
              textAlign: "left", // Текст по левому краю
            }}
          >
            {filteredLines.map((line, index) => (
              <div
                key={index}
                style={{
                  fontSize: `${fontSize}px`,
                  fontWeight: "bold",
                  color: "white",
                  lineHeight: 1.2,
                  marginBottom: index < filteredLines.length - 1 ? "16px" : "0", // Больше расстояние между строками
                }}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Speaker Section */}
          <div
            style={{
              position: "absolute",
              bottom: "150px", // Перемещено в квадратную область
              left: "200px", // Совпадает с левым отступом заголовка
              display: "flex",
              alignItems: "center",
              gap: "32px", // Увеличено пропорционально
            }}
          >
            {/* Avatar */}
            {data.speakerAvatar ? (
              <img
                src={data.speakerAvatar}
                width="128" // Увеличено пропорционально
                height="128" // Увеличено пропорционально
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "5px solid white", // Увеличено
                }}
                alt="Speaker avatar"
              />
            ) : (
              <div
                style={{
                  width: "128px", // Увеличено пропорционально
                  height: "128px", // Увеличено пропорционально
                  borderRadius: "50%",
                  backgroundColor: "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "5px solid white", // Увеличено
                  fontSize: "50px", // Увеличено пропорционально
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                {data.speaker.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Speaker Info */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px", // Увеличено
                justifyContent: "center", // Выравнивание по центру относительно аватара
              }}
            >
              <div
                style={{
                  fontSize: "52px", // Увеличено пропорционально
                  fontWeight: "bold",
                  color: "white",
                  lineHeight: 1.1,
                }}
              >
                {data.speaker}
              </div>
              {data.company && (
                <div
                  style={{
                    fontSize: "38px", // Увеличено пропорционально
                    color: "#9ca3af",
                    lineHeight: 1.1,
                  }}
                >
                  {data.company}
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      {
        width: 1920,
        height: 1061,
      }
    );

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error("Error generating opengraph image:", error);
    throw error;
  }
};
