import { StyleSheet } from 'react-native';
import { itPrimary, itSecondary, itDarkGray, itRed, itGray } from '../utils/colors';

export const commonStyles = StyleSheet.create({
  // Text Colors
  primaryText: {
    color: itPrimary,
  },
  secondaryText: {
    color: itSecondary,
  },
  grayText: {
    color: itDarkGray,
  },
  errorText: {
    color: itRed,
  },
  
  // Backgrounds
  primaryBackground: {
    backgroundColor: itPrimary,
  },
  secondaryBackground: {
    backgroundColor: itSecondary,
  },
  grayBackground: {
    backgroundColor: itGray,
  },
  
  // Borders
  primaryBorder: {
    borderColor: itPrimary,
  },
  secondaryBorder: {
    borderColor: itSecondary,
  },
  errorBorder: {
    borderColor: itRed,
  },
});