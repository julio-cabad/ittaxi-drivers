import { StyleSheet } from 'react-native';
import { itRed } from '../../../utils/colors';

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    position: 'absolute',
    left: 20,
    top: 18,
    zIndex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 6,
    fontSize: 15,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 4,
    elevation: 1,
  },
  textInput: {
    flex: 1,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  successIcon: {
    marginLeft: 8,
  },
  passwordToggle: {
    marginLeft: 8,
    padding: 4,
  },
  errorMessage: {
    color: itRed,
    fontSize: 14,
    marginTop: 4,
    marginLeft: 20,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: '#f3f4f6',
  },
});

export default styles;
