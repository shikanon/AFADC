

export interface Project {
  id: string;
  name: string;
  type: 'static' | 'dynamic';
  status: 'draft' | 'progress' | 'completed';
  description: string;
  createTime: string;
  duration: string;
  thumbnail: string;
}

export interface Workspace {
  id: string;
  name: string;
  projects: number;
  members: number;
}

