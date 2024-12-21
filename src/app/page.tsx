'use client';
import { useSession } from 'next-auth/react';

const Dashboard = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You must be logged in to view this page.</div>;
  }

  return (
    <div>
      <h1>Welcome {session.user.name}</h1>
      <p>Role: {session.user.role}</p>
    </div>
  );
};

export default Dashboard;
