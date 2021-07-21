import Color from "color";

declare module "styled-components" {
  export interface DefaultTheme extends ThemeType {}
}

type ColorType = {
  brand: string;
  text1: string;
  text2: string;
  surface1: string;
  surface2: string;
  surface3: string;
  surface4: string;
  surfaceShadow1: string;
  surfaceShadow2: string;
};

export type ThemeType = {
  color: ColorType;
} & typeof sharedStyles;

const brandColor = Color({
  h: 200,
  s: 100,
  l: 50,
});

const size = {
  medium: "768px",
  small: "320px",
} as const;
const font = {
  family: {
    primary: "Lato, serif",
    secondary: "Cardo, serif",
  },
  size: {
    small: "0.85rem",
    medium: "1rem",
    large: "1.5rem",
    extraLarge: "2rem",
  },
} as const;
const device = {
  medium: `(min-width: ${size.medium})`,
  small: `(min-width: ${size.small})`,
} as const;
const space = {
  side: {
    small: "1em",
    medium: "1.25em",
  },
};

export const sharedStyles = {
  size,
  font,
  device,
  space,
} as const;

export const theme: { light: ThemeType; dark: ThemeType } = {
  light: {
    ...sharedStyles,
    color: {
      brand: brandColor.string(),
      text1: brandColor.lightness(10).string(),
      text2: brandColor.saturationl(30).lightness(30).string(),
      surface1: brandColor.saturationl(25).lightness(90).string(),
      surface2: brandColor.saturationl(20).lightness(99).string(),
      surface3: brandColor.saturationl(20).lightness(92).string(),
      surface4: brandColor.saturationl(20).lightness(85).string(),
      surfaceShadow1: brandColor.saturationl(10).lightness(40).string(),
      surfaceShadow2: brandColor.saturationl(10).lightness(70).string(),
    },
  },
  dark: {
    ...sharedStyles,
    color: {
      brand: brandColor.saturationl(82).lightness(70).string(),
      text1: brandColor.saturationl(15).lightness(75).string(),
      text2: brandColor.saturationl(10).lightness(61).string(),
      surface1: brandColor.saturationl(10).lightness(20).string(),
      surface2: brandColor.saturationl(10).lightness(25).string(),
      surface3: brandColor.saturationl(5).lightness(30).string(),
      surface4: brandColor.saturationl(5).lightness(35).string(),
      surfaceShadow1: brandColor.saturationl(30).lightness(3).string(),
      surfaceShadow2: brandColor.saturationl(30).lightness(13).string(),
    },
  },
};

export const lightTheme = theme.light;
