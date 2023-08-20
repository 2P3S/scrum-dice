import CreateRoom from '@/components/templates/CreateRoom';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Create = () => {
  return <CreateRoom />;
};

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'createroom'])),
  },
});

export default Create;
