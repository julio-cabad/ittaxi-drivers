import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '../../navigation/AuthNavigator';
import { ScreenWrapper } from '../../components/layout';
import { Button } from '../../components/commons';

import tw from 'twrnc';

const ForgotPassword = () => {
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <ScreenWrapper>
      <View style={tw`flex-1 justify-center items-center px-6`}>
        <Text style={tw`text-3xl mb-8 text-itPrimary font-bold`}>
          Forgot Password
        </Text>
        <Text style={tw`text-base mb-8 text-itDarkGray text-center`}>
          Enter your email to reset your password
        </Text>

        <View style={tw`w-full max-w-sm`}>
          <Button
            variant="outline"
            size="large"
            onPress={() => navigation.goBack()}
          >
            Back to Login
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ForgotPassword;
