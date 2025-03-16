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
 */
const mapElement = element => {
  // Handle non-elements (strings, numbers, null, etc)
  if (!React.isValidElement(element)) {
    return element;
  }

  const { type, props } = element;

  // Handle HTML/SVG elements
  if (typeof type === "string") {
    const PdfComponent = componentMap[type.toLowerCase()];

    if (PdfComponent) {
      // Map children recursively
      const children = React.Children.map(props.children, mapElement);

      // Return the PDF component with same props and mapped children
      return <PdfComponent {...props}>{children}</PdfComponent>;
    }
  }

  // For custom components, handle their children
  const children = React.Children.map(props.children, mapElement);
  return React.cloneElement(element, props, children);
};

/**
 * Component that converts React SVG elements to React-PDF compatible components
 */
const SvgToPdfMapper = ({ children }) => {
  return mapElement(children);
};

/**
 * HOC to wrap a React component containing SVG elements
 */
export const withSvgToPdf = Component => {
  return props => {
    const svgContent = <Component {...props} />;
    return mapElement(svgContent);
  };
};

export default SvgToPdfMapper;
