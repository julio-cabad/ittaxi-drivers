import { StyleSheet } from 'react-native';
import tw from 'twrnc';
import { itPurple } from '../../../utils/colors';

export const loginStyles = {
  progressLoadingContainer: tw`flex-1 justify-center items-center bg-gray-100`,
  progressLoadingText: tw`mt-4 text-lg font-semibold text-gray-700`,
  gradientBackground: tw`flex-1`,
  headerSection: tw`pt-5 pb-20 px-6`,
  welcomeTextContainer: tw` mb-4`,
  formCard: tw`flex-1 bg-white rounded-t-3xl p-6`,
  forgotPasswordButton: tw`self-center mt-4`,
  footerLinks: tw`flex-row justify-center items-center`,
  loginContainer: tw`flex-row items-center`,
  alreadyAccountText: tw`text-sm text-gray-700`,
};

export const complexLoginStyles = StyleSheet.create({
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  formCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: -85,
    marginBottom: 25,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    elevation: 10,
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  forgotPasswordText: {
    color: itPurple,
    fontSize: 14,
    fontWeight: '600',
  },
  loginText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: itPurple,
    marginLeft: 4,
  },
});