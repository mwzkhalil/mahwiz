export type HubType = 'model' | 'dataset' | 'space' | 'writing' | 'publication';

export type HubItem = {
  id: string;
  name: string;
  repoType: string;
  url: string;
  description?: string | null;
  pipelineTag?: string | null;
  tags?: string[];
  languages?: string[];
  lastModified?: string | null;
  createdAt?: string | null;
  downloads?: number | null;
  likes?: number | null;
  license?: string | null;
  evaluation?: Record<string, unknown> | null;
  runtime?: Record<string, unknown> | null;
  linkedArtifacts?: Record<string, unknown> | null;
}

export type ResearchItem = HubItem & {
  type: HubType;
  theme: string;
  featured: boolean;
  status?: string;
  figure?: string;
};

export type PortfolioRecord = {
  section: string;
  type?: string;
  title: string;
  organization?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  year?: string;
  description?: string;
  url?: string;
  authors?: string;
  venue?: string;
  amount?: string;
  status?: string;
  featured?: boolean;
  order?: number;
  tags?: string[];
};
