import tw from 'twrnc';
import { itRed } from '../../utils/colors';

/**
 * Centralized Component Styles using twrnc.
 */

// Input Component Styles - Legacy (only keeping what's used)
export const inputStyles = {
  container: tw`mb-6`,
  label: tw`text-sm font-semibold text-gray-700 mb-2`,
  base: tw`flex-row items-center border-2 border-gray-200 rounded-xl h-16 px-5 bg-white shadow-sm`,
  focused: tw`border-2 border-[#667eea] shadow-lg`,
  error: tw`border-2 border-[${itRed}] shadow-lg`,
  textInput: tw`flex-1 text-base text-gray-900 font-medium`,
  errorMessage: tw`text-[${itRed}] text-sm mt-1 font-medium`,
};
