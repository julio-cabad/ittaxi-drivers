import tw from 'twrnc';
import { itRed, itPrimary } from '../utils/colors';

/**
 * Centralized Component Styles using twrnc.
 */

// Input Component Styles - Modernized
export const inputStyles = {
  // The main container for the entire component (label + input field)
  container: tw`mb-6`,
  
  // Floating label styles
  floatingLabel: tw`absolute left-5 top-4 text-sm font-medium text-gray-600 bg-white px-1 z-10`,
  floatingLabelFocused: tw`absolute left-5 -top-2 text-xs font-semibold text-[#667eea] bg-white px-1 z-10`,
  floatingLabelError: tw`absolute left-5 -top-2 text-xs font-semibold text-[${itRed}] bg-white px-1 z-10`,
  
  // Style for the label text above the input
  label: tw`text-sm font-semibold text-gray-700 mb-2`,
  
  // The wrapper for the input field and icons. Handles borders, height, and layout.
  base: tw`flex-row items-center border-2 border-gray-200 rounded-xl h-16 px-5 bg-white shadow-sm`,
  
  // Style applied to the wrapper when the input is focused
  focused: tw`border-2 border-[#667eea] shadow-lg`,
  
  // Style applied to the wrapper when there is a validation error
  error: tw`border-2 border-[${itRed}] shadow-lg`,

  // The actual <TextInput> element styling. No height here.
  textInput: tw`flex-1 text-base text-gray-900 font-medium`,
  
  // Style for the error message text below the input
  errorMessage: tw`text-[${itRed}] text-sm mt-1 font-medium`,
};
