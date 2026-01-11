import { cookies } from 'next/headers';
import { ImageResponse } from 'next/og';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import type { TalkResponse } from '@/app/api/talks/[id]/route';

import { COOKIES } from '@/app/(constants)';
import { api } from '@/app/api/instance';

export const alt = 'Conference Talk Analysis';
export const size = {
  width: 1200,
  height: 630
};
export const contentType = 'image/png';

const loadFont = (fontPath: string): ArrayBuffer => {
  const fullPath = path.join(process.cwd(), 'public', fontPath);
  const fontBuffer = fs.readFileSync(fullPath);
  return fontBuffer.buffer;
};

const colors = {
  light: {
    background: '#ffffff',
    text: '#000000',
    textSecondary: '#666666',
    badgeBackground: '#d0d0d0',
    badgeBorder: 'transparent',
    starBackground: '#F1B700',
    starBorder: '#ffffff',
    starIcon: '#ffffff'
  },
  dark: {
    background: '#0a0a0a',
    text: '#ffffff',
    textSecondary: '#999999',
    badgeBackground: '#1a1a1a',
    badgeBorder: '#333333',
    starBackground: '#F1B700',
    starBorder: '#0a0a0a',
    starIcon: '#ffffff'
  }
} as const;

interface AnalysisImageParams {
  id: string;
}

interface AnalysisImageProps {
  params: Promise<AnalysisImageParams>;
}

const AnalysisImage = async ({ params }: AnalysisImageProps) => {
  const { id } = await params;

  const cookiesStore = await cookies();
  const theme = (cookiesStore.get(COOKIES.THEME)?.value || 'light') as Theme;

  const talkResponse = await api.get<TalkResponse>(`/talks/${id}`);

  if (!talkResponse.data) {
    return new Response('Talk not found', { status: 404 });
  }

  const { talk } = talkResponse.data;

  const [firstSpeaker, ...otherSpeakers] = talk.speakers;

  const themeColors = colors[theme];

  return new ImageResponse(
    <div
      style={{
        fontFamily: 'Geist',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: '60px 100px 20px',
        height: '100%',
        backgroundColor: themeColors.background,
        color: themeColors.text
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 25,
          height: '100%',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ position: 'relative', display: 'flex' }}>
              <img
                alt='first speaker avatar'
                src={firstSpeaker.avatar!}
                style={{ height: 80, borderRadius: 100 }}
              />

              {talk.recommended && (
                <div
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    top: -1,
                    right: -1,
                    borderRadius: 100,
                    backgroundColor: '#F1B700',
                    border: '2px solid white',
                    padding: 2
                  }}
                >
                  <svg
                    fill='currentColor'
                    height='20'
                    style={{ color: 'white' }}
                    width='20'
                    xmlns='http://www.w3.org/2000/svg'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                  >
                    <path d='M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z' />
                  </svg>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: '30px' }}>{firstSpeaker.name}</span>
              <span style={{ fontSize: '20px', color: themeColors.textSecondary }}>
                {firstSpeaker.company}
              </span>
            </div>
          </div>

          {!!otherSpeakers.length && (
            <div style={{ display: 'flex', gap: 10, width: '100%', flexWrap: 'wrap' }}>
              {otherSpeakers.map((speaker) => (
                <div key={speaker.name} style={{ display: 'flex', gap: 10 }}>
                  <img
                    alt={speaker.name}
                    src={speaker.avatar!}
                    style={{ height: 30, borderRadius: 100 }}
                  />
                  <span style={{ fontSize: 23, color: themeColors.textSecondary }}>
                    {speaker.name}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              fontSize: '80px',
              fontWeight: 'bold',
              lineHeight: '1'
            }}
          >
            {talk.title}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
          <div
            style={{
              display: 'flex',
              gap: 15
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 10,
                alignItems: 'center',
                padding: '15px 25px',
                borderRadius: 100,
                backgroundColor: themeColors.badgeBackground,
                border: `1px solid ${themeColors.badgeBorder}`
              }}
            >
              <img alt='conference logo' src={talk.logo!} style={{ height: 40 }} />
            </div>

            {!!talk.likes && (
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  padding: '15px 20px',
                  borderRadius: 100,
                  backgroundColor: themeColors.badgeBackground,
                  border: `1px solid ${themeColors.badgeBorder}`
                }}
              >
                <svg
                  fill='none'
                  height='35'
                  width='35'
                  xmlns='http://www.w3.org/2000/svg'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                >
                  <path d='M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5' />
                </svg>
                <span style={{ fontSize: '30px' }}>{talk.likes}</span>
              </div>
            )}
            {!!talk.wantsToWatch && (
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  alignItems: 'center',
                  padding: '15px 20px',
                  borderRadius: 100,
                  backgroundColor: themeColors.badgeBackground,
                  border: `1px solid ${themeColors.badgeBorder}`
                }}
              >
                <svg
                  fill='none'
                  height='35'
                  width='35'
                  xmlns='http://www.w3.org/2000/svg'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  viewBox='0 0 24 24'
                >
                  <path d='M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0' />
                  <circle cx='12' cy='12' r='3' />
                </svg>
                <span style={{ fontSize: '25px' }}>{talk.wantsToWatch}</span>
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              gap: 5
            }}
          >
            <svg
              fill='none'
              height='16'
              width='16'
              xmlns='http://www.w3.org/2000/svg'
              stroke='#666'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              viewBox='0 0 24 24'
            >
              <path d='M12 2v4' />
              <path d='m16.2 7.8 2.9-2.9' />
              <path d='M18 12h4' />
              <path d='m16.2 16.2 2.9 2.9' />
              <path d='M12 18v4' />
              <path d='m4.9 19.1 2.9-2.9' />
              <path d='M2 12h4' />
              <path d='m4.9 4.9 2.9 2.9' />
            </svg>
            <span style={{ fontSize: '25px', color: '#666' }}>confreviewer x siberiacancode</span>
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: 'Geist',
          data: loadFont('fonts/Geist-Regular.ttf'),
          style: 'normal',
          weight: 400
        },
        {
          name: 'Geist',
          data: loadFont('fonts/Geist-SemiBold.ttf'),
          style: 'normal',
          weight: 600
        }
      ]
    }
  );
};

export default AnalysisImage;
