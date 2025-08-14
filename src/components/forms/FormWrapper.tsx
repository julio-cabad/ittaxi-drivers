import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Formik, FormikProps } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import tw from 'twrnc';

interface FormWrapperProps<T> {
  initialValues: T;
  validationSchema: any;
  onSubmit: (values: T) => void | Promise<void>;
  children: (formikProps: FormikProps<T>) => React.ReactNode;
  style?: ViewStyle;
  scrollEnabled?: boolean;
  enableReinitialize?: boolean;
}

function FormWrapper<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
  style,
  scrollEnabled = true,
  enableReinitialize = false,
}: FormWrapperProps<T>) {
  const handleSubmit = (values: T) => {
    console.log('🔵 FormWrapper: onSubmit llamado con values:', values);
    onSubmit(values);
  };

  const content = (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={enableReinitialize}
    >
      {(formikProps) => (
        <View style={[tw`flex-1`, style]}>
          {children(formikProps)}
        </View>
      )}
    </Formik>
  );

  if (scrollEnabled) {
    return (
      <KeyboardAwareScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`flex-grow`}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {content}
      </KeyboardAwareScrollView>
    );
  }

  return content;
}

export default FormWrapper;