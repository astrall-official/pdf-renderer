import React from "react";
import { Path, Svg, Text, G } from "@react-pdf/renderer";

// Map React SVG elements to React-PDF components
const componentMap = {
  // svg: Svg,
  path: Path,
  text: Text,
  g: G
  // Add more mappings as needed
};

/**
 * Maps React SVG elements to React-PDF components recursively
 * @param element - The React element to map
 * @returns The mapped React-PDF element or the original element if not mappable
 */
const mapElement = (element: React.ReactElement | React.ReactNode): React.ReactElement | React.ReactNode => {
  // Handle non-elements (strings, numbers, null, etc)
  if (!React.isValidElement(element)) {
    return element;
  }

  const { type, props } = element;

  // Handle HTML/SVG elements
  if (typeof type === "string") {
    const PdfComponent = componentMap[type.toLowerCase() as keyof typeof componentMap];

    if (PdfComponent) {
      // Map children recursively
      // @ts-ignore
      const children = React.Children.map(props.children, mapElement);

      // Return the PDF component with same props and mapped children
      // @ts-ignore
      return <PdfComponent {...props}>{children}</PdfComponent>;
    }
  }

  // For custom components, handle their children
  // @ts-ignore
  const children = React.Children.map(props.children, mapElement);
  // @ts-ignore
  return React.cloneElement(element, props, children);
};

/**
 * Component that converts React SVG elements to React-PDF compatible components
 */
const SvgToPdfMapper = ({ children }: { children: React.ReactNode }) => {
  return mapElement(children);
};

/**
 * HOC to wrap a React component containing SVG elements
 */
export const withSvgToPdf = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    const svgContent = <Component {...props} />;
    return mapElement(svgContent);
  };
};

export default SvgToPdfMapper;
