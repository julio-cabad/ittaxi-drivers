import { StyleSheet, Dimensions } from 'react-native';
import { itPrimary, itSecondary, itGray, itDarkGray, itRed } from '../../../utils/colors';

const { width, height } = Dimensions.get('window');
const itWhite = '#FFFFFF';

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    position: 'absolute',
    left: 20,
    top: 18,
    zIndex: 1,
    backgroundColor: itWhite,
    paddingHorizontal: 6,
    fontSize: 15,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: itWhite,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  inputText: {
    flex: 1,
    fontSize: 17,
    color: itDarkGray,
  },
  placeholder: {
    color: '#9ca3af',
    fontStyle: 'italic',
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: itWhite,
    borderRadius: 16,
    margin: 20,
    width: width - 40,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: itGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: itDarkGray,
  },
  closeButton: {
    padding: 4,
  },
  calendarContainer: {
    height: height * 0.45,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  calendarHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: itPrimary,
    marginHorizontal: 10,
  },
  pickerItem: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  pickerItemText: {
    fontSize: 18,
    color: itDarkGray,
  },
  monthPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  monthItem: {
    width: '33%',
    paddingVertical: 20,
    alignItems: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: itGray,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: itSecondary,
    fontWeight: '500',
  },
});

export default styles;