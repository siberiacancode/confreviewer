'use server';

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';

const contentDir = join(process.cwd(), 'app/analysis/(conference)/content');

export const getAllConferences = async () => {
  const files = await readdir(contentDir);
  const jsonFiles = files.filter((file) => file.endsWith('.json'));

  return await Promise.all(
    jsonFiles.map(async (file) => {
      const filePath = join(contentDir, file);
      const fileContents = await readFile(filePath, 'utf8');
      const conference = JSON.parse(fileContents);
      const id = file.replace('.json', '');

      return { ...conference, id };
    })
  );
};

export const getConferenceById = async (id: string) => {
  const filePath = join(contentDir, `${id}.json`);
  const fileContents = await readFile(filePath, 'utf8');
  const conference = JSON.parse(fileContents);

  return { ...conference, id };
};
