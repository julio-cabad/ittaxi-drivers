import { StyleSheet } from 'react-native';
import { itPurple } from '../../../utils/colors';

export const styles = StyleSheet.create({
  submitButton: {
    marginTop: 28,
    backgroundColor: itPurple,
    borderRadius: 16,
    height: 56,
    shadowColor: itPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 1,
  },
});
