import { JSDOM } from 'jsdom';

import { htmlToMarkdown } from '../../(actions)';

export const parseOntiko = async (url: string, html: string) => {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const titleElement = doc.querySelector('h1');
  const descriptionElement = doc.querySelector('.thesis__article .thesis__text');

  const speakerElements = doc.querySelectorAll('.thesis__item-main');
  const speakers = Array.from(speakerElements).map((speakerElement) => {
    const nameElement = speakerElement.querySelector('.thesis__author-name');
    const companyElement = speakerElement.querySelector('.thesis__author-company');
    const avatarElement = speakerElement.querySelector('.thesis__author-img');

    let speakerAvatar;
    if (avatarElement) {
      const style = avatarElement.getAttribute('style');
      const bgImageMatch = style?.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
      speakerAvatar = bgImageMatch ? `${new URL(url).origin}${bgImageMatch[1]}` : undefined;
    }

    return {
      name: nameElement!.textContent!.trim(),
      company: companyElement!.textContent!.trim(),
      avatar: speakerAvatar
    };
  });

  const title = titleElement!.textContent!.trim();
  const description = await htmlToMarkdown(descriptionElement!.innerHTML);

  let logo;
  const logoContainerElement = doc.querySelector('[class*="header__logo"], [class*="nav__logo"]');

  if (logoContainerElement) {
    const logoElement = logoContainerElement.firstElementChild;

    if (logoElement && logoElement.tagName === 'svg') {
      logo = `data:image/svg+xml;utf8,${encodeURIComponent(logoElement.outerHTML)}`;
    }

    if (logoElement && logoElement.tagName === 'IMG') {
      logo = `${new URL(url).origin}${logoElement.getAttribute('src')}`;
    }
  }

  const [conferenceName, conferenceDescription] = doc.title.split(' - ');
  const conferenceId = conferenceName.replaceAll(' ', '_').toLowerCase();

  return {
    speakers,
    talk: {
      title,
      description,
      url
    },
    conference: {
      id: conferenceId,
      name: conferenceName,
      description: conferenceDescription,
      logo
    }
  };
};
