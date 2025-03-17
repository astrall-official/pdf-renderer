import { isStrongTitle } from './strongTitleValidator';
import { isTagList } from './tagListValidator';

// Component validator registry - add new validators here
export const componentValidators = {
  strongTitle: isStrongTitle,
  tagList: isTagList,
};

export type ComponentType = keyof typeof componentValidators;

// Helper type for theme components
export type ThemeComponentProps = {
  key?: string;
  children: string;
  index: number;
};
