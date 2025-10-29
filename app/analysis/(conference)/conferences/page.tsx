import { getAllConferences } from '../helpers/getConferences';
import { ConferencesFilters } from './(components)';

interface ConferencesPageSearchParams {
  search?: string;
}

const filterConferences = (conferences: any[], searchParams: ConferencesPageSearchParams) => {
  const { search } = searchParams;

  let results = [...conferences];
  if (search) {
    const query = search.trim().toLocaleLowerCase();

    results = results.filter((conference) => {
      return (
        conference.name.toLowerCase().includes(query) ||
        (conference.description && conference.description.toLowerCase().includes(query))
      );
    });
  }

  return results;
};

export interface ConferencesPageProps {
  searchParams?: ConferencesPageSearchParams;
}

const ConferencesPage = async ({ searchParams }: ConferencesPageProps) => {
  const conferences = await getAllConferences();

  const filteredConferences = filterConferences(conferences, (await searchParams) ?? {});

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-medium'>Conferences</h1>
        <p className='text-muted-foreground mt-2 text-sm'>
          Browse available conferences and their talks
        </p>
      </div>

      <ConferencesFilters />

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {filteredConferences.map((conference) => (
          <a href={`/analysis/conferences/${conference.id}`} key={conference.id}>
            <div className='bg-card flex cursor-pointer flex-col gap-4 rounded-lg border p-4 transition-all hover:shadow-md'>
              {conference.logo && (
                <div className='flex h-18 items-center justify-center overflow-hidden rounded-lg p-4'>
                  <img
                    alt={conference.name}
                    className='max-h-full max-w-full object-contain'
                    src={conference.logo}
                  />
                </div>
              )}

              <div className='flex flex-col gap-2'>
                <h2 className='text-xl font-semibold'>{conference.name}</h2>
                {conference.description && (
                  <p className='text-muted-foreground line-clamp-2 text-sm'>
                    {conference.description}
                  </p>
                )}
                <p className='text-muted-foreground text-xs font-extralight'>
                  {conference.talks.length} talks
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ConferencesPage;
