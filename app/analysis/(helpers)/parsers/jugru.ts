import { JSDOM } from "jsdom";

export const parseJugru = async (url: string, html: string) => {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const titleElement = doc.querySelector('[class*="talkContent__heading"]');
  const descriptionElement = doc.querySelector(
    '[class*="talkContent__description"]'
  );
  const speakerElement = doc.querySelector('[class*="personCard__name"]');
  const companyElement = doc.querySelector('[class*="personCard__company"]');
  const avatarElement = doc.querySelector('img[class*="avatar__image"]');
  const logoElement = doc.querySelector('img[class*="footer__logo"]');

  const title = titleElement?.textContent?.trim();
  const description = descriptionElement?.innerHTML;
  const speaker = speakerElement?.textContent?.trim();
  const company = companyElement?.textContent?.trim();
  const speakerAvatar = avatarElement?.getAttribute("src");
  const logo = logoElement?.getAttribute("src");

  return {
    title,
    speaker,
    speakerAvatar,
    company,
    description,
    logo,
    url,
  };
};
