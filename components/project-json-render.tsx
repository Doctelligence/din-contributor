"use client";

import { useGetProjectData } from '@/hooks/getProjectData';

export const ProjectJsonRender = () => {
  const projects = useGetProjectData();
  // console.log('PROJECTS', projects);
  return <div>{JSON.stringify(projects, null, 2)}</div>;
}
