import { JSDOM } from 'jsdom';

import { htmlToMarkdown } from '../../(actions)';

export const parseJugru = async (url: string, html: string) => {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const titleElement = doc.querySelector('[class*="talkContent__heading"]');
  const descriptionElement = doc.querySelector('[class*="talkContent__description"]');

  const speakerElements = doc.querySelectorAll('[class*="personList__card"]');
  const speakers = Array.from(speakerElements).map((speakerElement) => {
    const nameElement = speakerElement.querySelector('[class*="personCard__name"]');
    const companyElement = speakerElement.querySelector('[class*="personCard__company"]');
    const avatarElement = speakerElement.querySelector('img[class*="avatar__image"]');
    return {
      name: nameElement!.textContent!.trim(),
      company: companyElement!.textContent!.trim(),
      avatar: avatarElement!.getAttribute('src')
    };
  });

  const logoElement = doc.querySelector('img[class*="footer__logo"]');
  const conferenceDescriptionElement = doc.querySelector('[class*="footer__description"]');

  const title = titleElement!.textContent!.trim();
  const description = await htmlToMarkdown(descriptionElement!.innerHTML);

  const logo = logoElement!.getAttribute('src');
  const conferenceName = logoElement!.getAttribute('alt');
  const conferenceId = conferenceName!.replaceAll(' ', '_').toLowerCase();
  const conferenceDescription = conferenceDescriptionElement!.textContent!;

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
