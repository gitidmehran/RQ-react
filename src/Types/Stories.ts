export type Ayats = {
  key: React.Key;
  id: number;
  arabic: string;
  reference: string;
  sequence: number | undefined;
  sectionTitle: string;
};

export type SectionsType = {
  sectionTitle: string;
  ayats: Ayats[];
};

export type StoryType = {
  id: number;
  title: string;
  status: string;
  description: string;
  scholar: string;
  totalCounts: number;
};

export type getAllStoriesResponse = {
  success: boolean;
  message: string;
  list: StoryType[];
};

export type createStoryType = {
  title: string;
  description: string;
  sections: SectionsType[];
};

export type updateStoryType = {
  id: number;
  title: string;
  description: string;
  sections: SectionsType[];
};

export type singleStoryResponse = {
  id: number;
  title: string;
  description: string;
  scholar: string;
  sections: SectionsType[];
};

export type createOrUpdateStoryResponse = {
  success: boolean;
  message: string;
  row: singleStoryResponse;
};

export type updateStoryStatusResponse = {
  success: boolean;
  message: string;
  row: StoryType;
};
