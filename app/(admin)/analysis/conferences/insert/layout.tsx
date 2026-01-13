interface ConferenceInsertLayoutProps {
  children: React.ReactNode;
}

export const dynamic = 'force-dynamic';

const ConferenceInsertLayout = ({ children }: ConferenceInsertLayoutProps) => (
  <div className='mx-auto flex max-w-5xl flex-col gap-6 py-10'>{children}</div>
);

export default ConferenceInsertLayout;
