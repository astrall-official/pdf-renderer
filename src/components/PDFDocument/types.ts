import { JSX } from 'react';
import { ThemeComponentProps } from './helpers/validators';

export interface PDFTheme {
  // Base styles
  styles: {
    p: object;
    strong: object;
    em: object;
    link: object;
    code: object;
    // Add other style types as needed
  };
  
  // Custom component renderers
  strongTitle?: (props: ThemeComponentProps) => JSX.Element;
  tagList?: (props: ThemeComponentProps) => JSX.Element;
  // Add additional component renderers here as needed
}
