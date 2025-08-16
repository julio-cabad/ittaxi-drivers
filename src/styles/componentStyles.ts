import tw from 'twrnc';
import { itRed, itPrimary } from '../utils/colors';

/**
 * Centralized Component Styles using twrnc.
 */

// Input Component Styles - Modernized
export const inputStyles = {
  // The main container for the entire component (label + input field)
  container: tw`mb-6`,
  
  // Style for the label text above the input
  label: tw`text-sm font-semibold text-gray-700 mb-2`,
  
  // The wrapper for the input field and icons. Handles borders, height, and layout.
  base: tw`flex-row items-center border-2 border-gray-200 rounded-xl h-14 px-4 bg-white shadow-sm`,
  
  // Style applied to the wrapper when the input is focused
  focused: tw`border-2 border-[#667eea] shadow-lg`,
  
  // Style applied to the wrapper when there is a validation error
  error: tw`border-2 border-[${itRed}] shadow-lg`,

  // The actual <TextInput> element styling. No height here.
  textInput: tw`flex-1 text-base text-gray-900 font-medium`,
  
  // Style for the error message text below the input
  errorMessage: tw`text-[${itRed}] text-sm mt-1 font-medium`,
};
