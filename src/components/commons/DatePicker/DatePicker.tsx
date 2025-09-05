import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Animated,
} from 'react-native';
import { useField } from 'formik';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { itPrimary, itDarkGray } from '../../../utils/colors';
import styles from './DatePicker.styles';
import { DatePickerProps, ViewMode } from './DatePicker.types';

// Configurar idioma español
LocaleConfig.locales.es = {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  monthNamesShort: [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ],
  dayNames: [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy',
};
LocaleConfig.defaultLocale = 'es';

const DatePicker: React.FC<DatePickerProps> = ({
  name,
  label,
  placeholder = 'Seleccionar fecha',
  size = 'medium',
  disabled = false,
  required = false,
  maxDate,
  minDate,
  leftIcon,
  rightIcon,
  showSuccessIndicator = true,
  containerStyle,
  inputStyle,
  labelStyle,
  testID,
  onFocus,
  onBlur,
}) => {
  const [field, meta, helpers] = useField(name);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    field.value || new Date().toISOString().split('T')[0],
  );
  const [viewMode, setViewMode] = useState<ViewMode>('day');

  const labelAnimation = useRef(
    new Animated.Value(field.value ? 1 : 0),
  ).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const hasError = meta.touched && meta.error;
  const hasValue = field.value && field.value.length > 0;
  const isValid = meta.touched && !meta.error && hasValue;

  // Efecto para manejar cambios en el valor del campo
  useEffect(() => {
    if (hasValue) {
      Animated.timing(labelAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (!hasValue && !isFocused) {
      Animated.timing(labelAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [hasValue, isFocused, labelAnimation]);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(labelAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    Animated.spring(scaleAnimation, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!hasValue) {
      Animated.timing(labelAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    Animated.spring(scaleAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
    helpers.setTouched(true);
    onBlur?.();
  };

  const handleDateSelect = (day: DateData) => {
    helpers.setValue(day.dateString);
    setIsModalVisible(false);
    setViewMode('day');

    setIsFocused(false);
    helpers.setTouched(true);

    Animated.timing(labelAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    Animated.spring(scaleAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    onBlur?.();
  };

  const handleModalOpen = () => {
    setIsModalVisible(true);
    setCurrentDate(field.value || new Date().toISOString().split('T')[0]);
    setViewMode('day');
    // Solo manejar el estado visual, no llamar onFocus para evitar interferir con el teclado
    setIsFocused(true);
    Animated.timing(labelAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setViewMode('day');
    handleBlur();
  };

  const today = new Date().toISOString().split('T')[0];
  const effectiveMaxDate = maxDate || today;

  // Helper functions for dynamic styles
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.inputSmall;
      case 'large':
        return styles.inputLarge;
      default:
        return styles.inputMedium;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.textSmall;
      case 'large':
        return styles.textLarge;
      default:
        return styles.textMedium;
    }
  };

  const getInputStateStyle = () => {
    if (hasError) return styles.inputError;
    if (isFocused) return styles.inputFocused;
    return styles.inputDefault;
  };

  const years = useMemo(() => {
    const min = minDate
      ? new Date(minDate).getFullYear()
      : new Date().getFullYear() - 100;
    const max = maxDate
      ? new Date(maxDate).getFullYear()
      : new Date().getFullYear();
    return Array.from({ length: max - min + 1 }, (_, i) => max - i);
  }, [minDate, maxDate]);

  const calendarTheme = {
    backgroundColor: '#FFFFFF',
    calendarBackground: '#FFFFFF',
    textSectionTitleColor: '#1F2937',
    selectedDayBackgroundColor: itPrimary,
    selectedDayTextColor: '#FFFFFF',
    todayTextColor: itPrimary,
    dayTextColor: '#374151',
    textDisabledColor: '#9CA3AF',
    dotColor: itPrimary,
    selectedDotColor: '#FFFFFF',
    arrowColor: itPrimary,
    monthTextColor: '#1F2937',
    indicatorColor: itPrimary,
    textDayFontFamily: 'System',
    textMonthFontFamily: 'System',
    textDayHeaderFontFamily: 'System',
    textDayFontWeight: '500' as const,
    textMonthFontWeight: '700' as const,
    textDayHeaderFontWeight: '600' as const,
    textDayFontSize: 16,
    textMonthFontSize: 18,
    textDayHeaderFontSize: 14,
  };

  const renderHeader = (date: any) => {
    const month = LocaleConfig.locales.es.monthNames[date.getMonth()];
    const year = date.getFullYear();

    return (
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={() => setViewMode('month')}>
          <Text style={styles.calendarHeaderText}>{String(month)}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setViewMode('year')}>
          <Text style={styles.calendarHeaderText}>{String(year)}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderYearPicker = () => {
    const currentYear = new Date(currentDate).getFullYear();
    const yearIndex = years.indexOf(currentYear);
    const safeInitialIndex = yearIndex >= 0 ? yearIndex : 0;

    return (
      <FlatList
        data={years}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.pickerItem}
            onPress={() => {
              const newDate = new Date(currentDate);
              newDate.setFullYear(item);
              setCurrentDate(newDate.toISOString().split('T')[0]);
              setViewMode('month');
            }}
          >
            <Text style={styles.pickerItemText}>{String(item)}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => String(item)}
        showsVerticalScrollIndicator={false}
        initialScrollIndex={safeInitialIndex}
        getItemLayout={(_, index) => ({
          length: 50,
          offset: 50 * index,
          index,
        })}
      />
    );
  };

  const renderMonthPicker = () => (
    <View style={styles.monthPickerContainer}>
      {LocaleConfig.locales.es.monthNames.map((month: any, index: any) => (
        <TouchableOpacity
          key={index}
          style={styles.monthItem}
          onPress={() => {
            const newDate = new Date(currentDate);
            newDate.setMonth(index);
            setCurrentDate(newDate.toISOString().split('T')[0]);
            setViewMode('day');
          }}
        >
          <Text style={styles.pickerItemText}>{String(month)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    if (field.value && typeof field.value === 'string') {
      marks[field.value] = {
        selected: true,
        selectedColor: itPrimary,
        selectedTextColor: '#FFFFFF',
      };
    }

    if (today && field.value !== today) {
      marks[today] = {
        marked: true,
        dotColor: itPrimary,
      };
    }

    return marks;
  }, [field.value, today]);

  const renderContent = () => {
    switch (viewMode) {
      case 'year':
        return renderYearPicker();
      case 'month':
        return renderMonthPicker();
      case 'day':
      default:
        return (
          <Calendar
            current={currentDate}
            onDayPress={handleDateSelect}
            markedDates={markedDates}
            maxDate={effectiveMaxDate}
            minDate={minDate}
            renderHeader={renderHeader}
            theme={calendarTheme}
            firstDay={1}
            hideExtraDays={true}
            showWeekNumbers={false}
            enableSwipeMonths={true}
            disableAllTouchEventsForDisabledDays={true}
          />
        );
    }
  };

  const animatedLabelStyle = {
    transform: [
      {
        translateY: labelAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -24],
        }),
      },
      {
        scale: labelAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.85],
        }),
      },
    ],
    color: hasError ? '#FF6B6B' : isFocused ? itPrimary : '#6b7280',
  };

  const animatedContainerStyle = {
    transform: [{ scale: scaleAnimation }],
  };

  return (
    <Animated.View
      style={[styles.container, containerStyle, animatedContainerStyle]}
    >
      {label && (
        <Animated.Text style={[styles.label, labelStyle, animatedLabelStyle]}>
          {label}
          {required && <Text style={{ color: '#FF6B6B' }}> </Text>}
        </Animated.Text>
      )}

      <TouchableOpacity
        style={[
          styles.inputContainer,
          getSizeStyle(),
          getInputStateStyle(),
          disabled && styles.disabled,
          inputStyle,
        ]}
        onPress={handleModalOpen}
        activeOpacity={0.7}
        disabled={disabled}
        testID={testID}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <Text
          style={[
            styles.inputText,
            getTextSizeStyle(),
            disabled ? styles.textDisabled : styles.textEnabled,
            !hasValue && styles.placeholder,
          ]}
        >
          {hasValue ? field.value : placeholder}
        </Text>

        {isValid && showSuccessIndicator && (
          <View style={styles.successIcon}>
            <Icon name="check-circle" size={20} color="#10b981" />
          </View>
        )}

        {!rightIcon && !isValid && (
          <Icon
            name="calendar-today"
            size={24}
            color={disabled ? '#9ca3af' : '#6b7280'}
          />
        )}

        {rightIcon && !isValid && (
          <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </TouchableOpacity>

      {hasError && (
        <Text style={styles.errorMessage} testID={`${testID}-error`}>
          {typeof meta.error === 'string' ? meta.error : 'Error de validación'}
        </Text>
      )}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {label || 'Seleccionar fecha'}
              </Text>
              <TouchableOpacity
                onPress={handleModalClose}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={itDarkGray} />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarContainer}>{renderContent()}</View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleModalClose}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

export default DatePicker;
