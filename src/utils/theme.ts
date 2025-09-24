import {MD3LightTheme, MD3DarkTheme} from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200EE',
    primaryContainer: '#E1BEE7',
    secondary: '#03DAC6',
    secondaryContainer: '#A7F3D0',
    tertiary: '#FF6B6B',
    tertiaryContainer: '#FFE0E0',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',
    background: '#FAFAFA',
    error: '#B00020',
    errorContainer: '#FFEBEE',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onSurface: '#1C1B1F',
    onBackground: '#1C1B1F',
    onError: '#FFFFFF',
    outline: '#79747E',
    outlineVariant: '#CAC4D0',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#BB86FC',
    primaryContainer: '#3700B3',
    secondary: '#03DAC6',
    secondaryContainer: '#018786',
    tertiary: '#FF6B6B',
    tertiaryContainer: '#B71C1C',
    surface: '#121212',
    surfaceVariant: '#1E1E1E',
    background: '#000000',
    error: '#CF6679',
    errorContainer: '#B00020',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onSurface: '#E1E1E1',
    onBackground: '#E1E1E1',
    onError: '#000000',
    outline: '#938F99',
    outlineVariant: '#49454F',
  },
};

export const theme = lightTheme;
