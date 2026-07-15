import React from "react";
import {
  Text,
  TextProps,
  StyleSheet,
  StyleProp,
  TextStyle,
} from "react-native";

type Variant = "h1" | "h2" | "h3" | "p";

interface TypographyProps extends TextProps {
  variant?: Variant;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

const Typography = ({
  variant = "p",
  children,
  style,
  ...props
}: TypographyProps) => {
  return (
    <Text {...props} style={[styles.base, styles[variant], style]}>
      {children}
    </Text>
  );
};

interface HeadingProps extends TextProps {
  children: React.ReactNode;
}

export const H1 = ({ children, ...props }: HeadingProps) => (
  <Typography variant="h1" {...props}>
    {children}
  </Typography>
);

export const H2 = ({ children, ...props }: HeadingProps) => (
  <Typography variant="h2" {...props}>
    {children}
  </Typography>
);

export const H3 = ({ children, ...props }: HeadingProps) => (
  <Typography variant="h3" {...props}>
    {children}
  </Typography>
);

export const Paragraph = ({ children, ...props }: HeadingProps) => (
  <Typography variant="p" {...props}>
    {children}
  </Typography>
);

const styles = StyleSheet.create({
  base: {
    color: "#000",
  },

  h1: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
  },

  h2: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 36,
  },

  h3: {
    fontSize: 22,
    fontWeight: "600",
    lineHeight: 30,
  },

  p: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
});

export default Typography;



// import Typography, {
//   H1,
//   H2,
//   H3,
//   Paragraph,
// } from "@/components/Typography";

// <H1>Heading 1</H1>

// <H2 style={{ color: "blue" }}>Heading 2</H2>

// <H3 numberOfLines={1}>Heading 3</H3>

// <Paragraph>
//   This is a paragraph.
// </Paragraph>

// <Typography variant="h2">
//   Dynamic Heading
// </Typography>