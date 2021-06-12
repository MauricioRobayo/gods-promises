declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}

type Color = {
  brand: string;
  text1: string;
  text2: string;
  surface1: string;
  surface2: string;
  surfaceShadow: string;
};

type ThemeType = {
  color: Color;
} & typeof sharedStyles;

const brandColor = {
  hue: 200,
  saturation: 100,
  lightness: 50,
} as const;
const size = {
  medium: "768px",
  small: "320px",
} as const;
const font = {
  primary: "Lato, serif",
  secondary: "Cardo, serif",
} as const;
const device = {
  medium: `(min-width: ${size.medium})`,
  small: `(min-width: ${size.small})`,
} as const;

export const sharedStyles = {
  size,
  font,
  device,
} as const;

export const theme: { light: ThemeType; dark: ThemeType } = {
  light: {
    ...sharedStyles,
    color: {
      brand: `hsl(${brandColor.hue} ${brandColor.saturation}% ${brandColor.lightness}%)`,
      text1: `hsl(${brandColor.hue} ${brandColor.saturation}% 10%)`,
      text2: `hsl(${brandColor.hue} 30% 30%)`,
      surface1: `hsl(${brandColor.hue} 20% 99%)`,
      surface2: `hsl(${brandColor.hue} 20% 85%)`,
      surfaceShadow: `hsl(${brandColor.hue} 10% 20%)`,
    },
  },
  dark: {
    ...sharedStyles,
    color: {
      brand: `hsl(${brandColor.hue} ${brandColor.saturation / 2}% ${
        brandColor.lightness / 1.5
      }%)`,
      text1: `hsl(${brandColor.hue} 15% 85%)`,
      text2: `hsl(${brandColor.hue} 5% 65%)`,
      surface1: `hsl(${brandColor.hue} 5% 20%)`,
      surface2: `hsl(${brandColor.hue} 5% 25%)`,
      surfaceShadow: `hsl(${brandColor.hue} 50% 3%)`,
    },
  },
};
