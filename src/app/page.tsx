/**
 * Root page component - redirects to /home
 * This ensures clean URL structure while maintaining /home as the main dashboard
 */

import { redirect } from 'next/navigation';

const RootPage = () => {
  redirect('/home');
};

export default RootPage;
