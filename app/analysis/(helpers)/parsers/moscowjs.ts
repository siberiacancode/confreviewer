import { JSDOM } from 'jsdom';

import { htmlToMarkdown } from '../../(actions)';

export const parseMoscowjs = async (url: string, html: string) => {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const titleElement = doc.querySelector('[class*="item__ItemHeader"]');
  const speakerElement = doc.querySelector('[class*="speakerPhoto"] a');
  const companyElement = doc.querySelector('[class*="speakerPhoto"] em');
  const descriptionElement = doc.querySelectorAll('[class*="item__ItemContent"] p');

  let description;
  if (descriptionElement.length) {
    const html = Array.from(descriptionElement)
      .slice(0, -1)
      .map((p) => `<p>${p.innerHTML}</p>`)
      .join('\n');
    description = await htmlToMarkdown(html);
  }

  const avatarElement = doc.querySelector('[class*="item__ImageContainer"] source');

  const title = titleElement?.textContent?.trim() || '';
  const speaker = speakerElement?.textContent?.trim() || '';
  const company = companyElement?.textContent?.trim() || '';
  const srcset = avatarElement?.getAttribute('srcset');

  let speakerAvatar;
  if (srcset) {
    const urls = srcset.split(',').map((s) => s.trim());
    const parsed = urls.map((item) => {
      const [url, size] = item.split(' ');
      return { url, size: Number.parseInt(size) };
    });
    speakerAvatar = `${new URL(url).origin}${
      parsed.reduce((a, b) => (a.size > b.size ? a : b)).url
    }`;
  }

  const logoElement = doc.querySelector('[class*="header__HeaderTitle"]');
  let logo;
  if (logoElement) {
    logo = `${new URL(url).origin}${dom.window
      .getComputedStyle(logoElement)
      .backgroundImage.replace(/^url\(["']?/, '')
      .replace(/["']?\)$/, '')}`;
  }

  return {
    title,
    description,
    speaker,
    speakerAvatar,
    company,
    logo,
    url
  };
};
