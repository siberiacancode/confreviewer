import { JSDOM } from "jsdom";

export const parseOntiko = async (url: string, html: string) => {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const titleElement = doc.querySelector("h2");
  const descriptionElement = doc.querySelector(
    ".thesis__article .thesis__text"
  );
  const speakerElement = doc.querySelector(".thesis__author-name");
  const companyElement = doc.querySelector(".thesis__author-company");
  const avatarElement = doc.querySelector(".thesis__author-img");

  const title = titleElement!.textContent!.trim();
  const description = descriptionElement!.innerHTML.trim();
  const speaker = speakerElement!.textContent!.trim();
  const company = companyElement!.textContent!.trim();

  let speakerAvatar;
  if (avatarElement) {
    const style = avatarElement.getAttribute("style");
    const bgImageMatch = style?.match(
      /background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/
    );
    speakerAvatar = bgImageMatch
      ? `${new URL(url).origin}${bgImageMatch[1]}`
      : undefined;
  }

  let logo;
  const logoContainerElement = doc.querySelector(
    '[class*="header__logo"], [class*="nav__logo"]'
  );

  if (logoContainerElement) {
    const logoElement = logoContainerElement.firstElementChild;

    if (logoElement && logoElement.tagName === "svg") {
      logo =
        "data:image/svg+xml;utf8," + encodeURIComponent(logoElement.outerHTML);
    }

    if (logoElement && logoElement.tagName === "IMG") {
      logo = `${new URL(url).origin}${logoElement.getAttribute("src")}`;
    }
  }

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
