import { StyleSheet } from 'react-native';
import { itPrimary, itDarkGray } from '../../utils/colors';

export const commonStyles = StyleSheet.create({
  // Text Colors - Only keeping what's actually used
  primaryText: {
    color: itPrimary,
  },
  grayText: {
    color: itDarkGray,
  },
});
