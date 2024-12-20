'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface ProjectsType {
  serviceTitle: string;
  serviceImg: string;
  serviceDescription: string;
  date: Date;
}

import { Response } from '@/types/responseTypes';

export default function LatestProjects() {
  // State for projects and content
  const [latestProjects, setLatestProjects] = useState<ProjectsType[] | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function getLatestProjects() {
      try {
        const response = await axios.get<Response>(
          'http://localhost:3000/api/clients/latest-projects'
        );

        if (response?.data?.success) {
          setLatestProjects(response.data.message as ProjectsType[]);
        } else {
          setErrorMessage(response.data.message as string);
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching projects.');
        console.error(error);
      }
    }

    getLatestProjects();
  }, []);

  // Render content based on state
  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  if (!latestProjects) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Latest Projects</h2>
      <ul>
        {latestProjects.map((project, index) => (
          <li key={index}>
            <h3>{project.serviceTitle}</h3>
            <img src={project.serviceImg} alt={project.serviceTitle} />
            <p>{project.serviceDescription}</p>
            <small>{new Date(project.date).toLocaleDateString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
