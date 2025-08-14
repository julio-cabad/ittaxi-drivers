import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
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

const { width } = Dimensions.get('window');

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

  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      // El dateString ya viene en formato YYYY-MM-DD desde react-native-calendars
      // Solo validamos que sea una fecha válida
      const date = new Date(dateString + 'T00:00:00.000Z');
      
      if (isNaN(date.getTime())) {
        return dateString; // Si no es válida, mostrar el string original
      }
      
      // Retornar directamente el formato YYYY-MM-DD
      return dateString;
    } catch (error) {
      return dateString; // En caso de error, mostrar el string original
    }
  };
  


  const handleDateSelect = (day: DateData) => {
    // Verificar que la fecha no sea futura
    const selectedDate = new Date(day.dateString + 'T00:00:00.000Z');
    const todayDate = new Date(today + 'T00:00:00.000Z');
    
    if (selectedDate > todayDate) {
      return; // No permitir fechas futuras
    }
    
    // Llamar al callback y cerrar modal
    onDateSelect(day.dateString);
    setIsModalVisible(false);
  };

  const today = new Date().toISOString().split('T')[0];
  
  // Usar maxDate si se proporciona, sino usar hoy como máximo
  const effectiveMaxDate = maxDate || today;

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
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.inputText,
          !value && styles.placeholder,
        ]}>
          {value ? formatDisplayDate(value) : placeholder}
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
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color={itDarkGray} />
              </TouchableOpacity>
            </View>

            {/* Calendar */}
            <Calendar
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
             // maxDate={effectiveMaxDate}
             // minDate={minDate}
              theme={{
                backgroundColor: itWhite,
                calendarBackground: itWhite,
                textSectionTitleColor: '#1F2937', // Más oscuro
                selectedDayBackgroundColor: itPrimary,
                selectedDayTextColor: itWhite,
                todayTextColor: itPrimary,
                dayTextColor: '#374151', // Más oscuro para mejor contraste
                textDisabledColor: '#9CA3AF', // Más claro para disabled
                dotColor: itPrimary,
                selectedDotColor: itWhite,
                arrowColor: itPrimary,
                monthTextColor: '#1F2937', // Más oscuro
                indicatorColor: itPrimary,
                textDayFontFamily: 'System',
                textMonthFontFamily: 'System',
                textDayHeaderFontFamily: 'System',
                textDayFontWeight: '500', // Más bold
                textMonthFontWeight: '700', // Más bold
                textDayHeaderFontWeight: '600',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
              firstDay={1} // Lunes como primer día
              hideExtraDays={true}
              showWeekNumbers={false}
              disableMonthChange={false}
              hideDayNames={false}
              enableSwipeMonths={true}
              disableAllTouchEventsForDisabledDays={true}
            />

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
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
    maxHeight: '80%',
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
