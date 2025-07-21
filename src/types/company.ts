export type Company = {
  id: string;
  name: string;
  website?: string;
  size: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
};
