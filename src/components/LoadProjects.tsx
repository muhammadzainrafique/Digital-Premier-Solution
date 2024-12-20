'use client';

import React, { useEffect, useState } from 'react';
import LoadProjectsYearly from '@/components/LoadProjectsYearly';
import axios from 'axios';
import { Response } from '@/types/responseTypes';
import { ProjectCompletionType } from '@/types/projectTypes';

export default function LoadProjects({ service }: { service: string }) {
  const currentYear = new Date().getFullYear();
  const [years, setYears] = useState<number[]>([currentYear]);
  const [projects, setProjects] = useState<ProjectCompletionType[][]>([]);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);

  // Fetch yearly projects
  const getYearlyProjects = async (year: number) => {
    try {
      const response = await axios.get<Response>(
        `/api/clients/yearly-projects`,
        {
          params: { year, service },
        }
      );

      setStatus(response.status);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error?.response?.data?.message || 'An error occurred.');
      }
      console.error('Error fetching yearly projects:', error);
      throw error;
    }
  };

  // Load initial year's projects on mount
  useEffect(() => {
    const loadInitialProjects = async () => {
      setLoading(true);
      try {
        const data = await getYearlyProjects(currentYear);
        if (data.success) {
          setProjects([data.message as ProjectCompletionType[]]);
        } else {
          setErrorMessage(data.message as string);
        }
      } catch (error) {
        console.error('Failed to fetch initial projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialProjects();
  }, [currentYear]);

  // Load more projects when triggered
  useEffect(() => {
    if (!loadMore) return;

    const loadMoreProjects = async () => {
      const nextYear = years[years.length - 1] - 1;
      setLoading(true);

      try {
        const data = await getYearlyProjects(nextYear);
        if (data.success && (data.message as ProjectCompletionType[]).length) {
          setYears((prevYears) => [...prevYears, nextYear]);
          setProjects((prevProjects) => [
            ...prevProjects,
            data.message as ProjectCompletionType[],
          ]);
        } else {
          setErrorMessage(data.message as string);
        }
      } catch (error) {
        console.error('Failed to load more projects:', error);
      } finally {
        setLoading(false);
        setLoadMore(false); // Reset loadMore trigger
      }
    };

    loadMoreProjects();
  }, [loadMore]);

  return (
    <div>
      <div className="title flex justify-between border-y-2 py-6">
        <h1 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[28px]">
          <span className="text-[#4B6066]">{service}</span> Projects
        </h1>
        <h1 className="text-[18px] sm:text-[20px] md:text-[22px] lg:text-[28px]">
          Total [{projects.flat().length}]
        </h1>
      </div>

      {projects.map((project, index) => (
        <LoadProjectsYearly
          key={years[index]} // Use year as a unique key
          year={years[index]}
          total={project.length}
          completedProjects={project}
        />
      ))}

      {errorMessage && status !== 404 && (
        <div className="text-red-500 mt-4">{errorMessage}</div>
      )}
      {status === 404 && <h1>Currently, no {service} Projects Found</h1>}
      {projects.length > 0 && (
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={() => setLoadMore(true)}
          disabled={loading || errorMessage === 'Not Found'}
        >
          {loading ? 'Loading...' : 'Load more'}
        </button>
      )}
    </div>
  );
}
