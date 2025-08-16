import tw from 'twrnc';
import { itRed, itPrimary } from '../utils/colors';

/**
 * Centralized Component Styles using twrnc.
 */

// Input Component Styles
export const inputStyles = {
  // The main container for the entire component (label + input field)
  container: tw`mb-4`,
  
  // Style for the label text above the input
  label: tw`text-sm font-medium text-gray-700 mb-1`,
  
  // The wrapper for the input field and icons. Handles borders, height, and layout.
  base: tw`flex-row items-center border border-gray-300 rounded-lg h-14 px-3 bg-white`,
  
  // Style applied to the wrapper when the input is focused
  focused: tw`border-2 border-[${itPrimary}]`,
  
  // Style applied to the wrapper when there is a validation error
  error: tw`border-2 border-[${itRed}]`,

  // The actual <TextInput> element styling. No height here.
  textInput: tw`flex-1 text-base text-gray-900`,
  
  // Style for the error message text below the input
  errorMessage: tw`text-[${itRed}] text-sm`,
};
