import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
} from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';

// Configurar idioma español
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  monthNamesShort: [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
    'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
  ],
  dayNames: [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { itPrimary, itSecondary, itGray, itDarkGray } from '../../utils/colors';

// Colores adicionales
const itWhite = '#FFFFFF';

interface DatePickerProps {
  label: string;
  value?: string;
  onDateSelect: (date: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  maxDate?: string;
  minDate?: string;
}

const { width, height } = Dimensions.get('window');

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onDateSelect,
  placeholder = 'Seleccionar fecha',
  error,
  required = false,
  maxDate,
  minDate,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(value || new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'day' | 'month' | 'year'>('day');

  const handleDateSelect = (day: DateData) => {
    onDateSelect(day.dateString);
    setIsModalVisible(false);
    setViewMode('day'); // Reset view mode on selection
  };

  const today = new Date().toISOString().split('T')[0];
  const effectiveMaxDate = maxDate || today;

  const years = useMemo(() => {
    const min = minDate ? new Date(minDate).getFullYear() : new Date().getFullYear() - 100;
    const max = maxDate ? new Date(maxDate).getFullYear() : new Date().getFullYear();
    return Array.from({ length: max - min + 1 }, (_, i) => max - i);
  }, [minDate, maxDate]);

  const renderHeader = (date: any) => {
    const month = LocaleConfig.locales['es'].monthNames[date.getMonth()];
    const year = date.getFullYear();

    return (
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={() => setViewMode('month')}>
          <Text style={styles.calendarHeaderText}>{`${month}`}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setViewMode('year')}>
          <Text style={styles.calendarHeaderText}>{`${year}`}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderYearPicker = () => (
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
          <Text style={styles.pickerItemText}>{item}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.toString()}
      showsVerticalScrollIndicator={false}
      initialScrollIndex={years.indexOf(new Date(currentDate).getFullYear())}
      getItemLayout={(data, index) => (
        { length: 50, offset: 50 * index, index }
      )}
    />
  );

  const renderMonthPicker = () => (
    <View style={styles.monthPickerContainer}>
      {LocaleConfig.locales['es'].monthNames.map((month: boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | React.Key | null | undefined, index: number) => (
        <TouchableOpacity
          key={month}
          style={styles.monthItem}
          onPress={() => {
            const newDate = new Date(currentDate);
            newDate.setMonth(index);
            setCurrentDate(newDate.toISOString().split('T')[0]);
            setViewMode('day');
          }}
        >
          <Text style={styles.pickerItemText}>{month}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

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
            markedDates={{
              [value || '']: {
                selected: true,
                selectedColor: itPrimary,
                selectedTextColor: itWhite,
              },
              [today]: {
                marked: true,
                dotColor: itPrimary,
              },
            }}
            maxDate={effectiveMaxDate}
            minDate={minDate}
            renderHeader={renderHeader}
            theme={{
              backgroundColor: itWhite,
              calendarBackground: itWhite,
              textSectionTitleColor: '#1F2937',
              selectedDayBackgroundColor: itPrimary,
              selectedDayTextColor: itWhite,
              todayTextColor: itPrimary,
              dayTextColor: '#374151',
              textDisabledColor: '#9CA3AF',
              dotColor: itPrimary,
              selectedDotColor: itWhite,
              arrowColor: itPrimary,
              monthTextColor: '#1F2937',
              indicatorColor: itPrimary,
              textDayFontFamily: 'System',
              textMonthFontFamily: 'System',
              textDayHeaderFontFamily: 'System',
              textDayFontWeight: '500',
              textMonthFontWeight: '700',
              textDayHeaderFontWeight: '600',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            firstDay={1}
            hideExtraDays={true}
            showWeekNumbers={false}
            enableSwipeMonths={true}
            disableAllTouchEventsForDisabledDays={true}
          />
        );
    }
  };

  return (
    <View style={styles.container}> 
      {/* Label */}
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      {/* Input Trigger */}
      <TouchableOpacity
        style={[
          styles.inputContainer,
          error && styles.inputError,
        ]}
        onPress={() => {
          setIsModalVisible(true);
          // Reset to the selected date or today when opening
          setCurrentDate(value || new Date().toISOString().split('T')[0]);
          setViewMode('day');
        }}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.inputText,
          !value && styles.placeholder,
        ]}>
          {value ? value : placeholder}
        </Text>
        <Icon 
          name="calendar-today" 
          size={24} 
          color={itSecondary} 
        />
      </TouchableOpacity>

      {/* Error Message */}
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {/* Calendar Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                  setViewMode('day'); // Reset view on close
                }}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={itDarkGray} />
              </TouchableOpacity>
            </View>

            {/* Dynamic Content */}
            <View style={styles.calendarContainer}>
              {renderContent()}
            </View>

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsModalVisible(false);
                  setViewMode('day'); // Reset view on cancel
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: itDarkGray,
    marginBottom: 8,
  },
  required: {
    color: '#FF6B6B',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: itWhite,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: itPrimary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 1,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: itDarkGray,
  },
  placeholder: {
    color: '#9CA3AF', // Color más claro pero visible
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    marginTop: 4,
    marginLeft: 4,
  },
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
    maxHeight: '90%', // Allow more height
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  calendarContainer: {
    height: height * 0.45, // Fixed height for content area
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
