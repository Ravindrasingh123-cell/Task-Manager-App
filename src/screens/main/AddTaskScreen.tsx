import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  SegmentedButtons,
  DatePickerModal,
  TimePickerModal,
  Snackbar,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {RootState, AppDispatch} from '../../store';
import {addTask, clearError} from '../../store/slices/taskSlice';
import {Task} from '../../store/slices/taskSlice';

const AddTaskScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const {user} = useSelector((state: RootState) => state.auth);
  const {isLoading, error} = useSelector((state: RootState) => state.tasks);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    if (!user?.uid) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate?.toISOString(),
        completed: false,
        userId: user.uid,
      };

      await dispatch(addTask(taskData)).unwrap();
      navigation.goBack();
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const handleDateConfirm = (params: {date: Date}) => {
    setDueDate(params.date);
    setShowDatePicker(false);
    setShowTimePicker(true);
  };

  const handleTimeConfirm = (params: {hours: number; minutes: number}) => {
    if (dueDate) {
      const newDate = new Date(dueDate);
      newDate.setHours(params.hours, params.minutes);
      setDueDate(newDate);
    }
    setShowTimePicker(false);
  };

  const handleRemoveDueDate = () => {
    setDueDate(undefined);
  };

  const handleDismissError = () => {
    dispatch(clearError());
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Task Title *"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
              mode="outlined"
              placeholder="Enter task title"
            />

            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={4}
              placeholder="Enter task description (optional)"
            />

            <Text variant="titleMedium" style={styles.sectionTitle}>
              Priority
            </Text>
            <SegmentedButtons
              value={priority}
              onValueChange={(value) => setPriority(value as 'low' | 'medium' | 'high')}
              buttons={[
                {value: 'low', label: 'Low'},
                {value: 'medium', label: 'Medium'},
                {value: 'high', label: 'High'},
              ]}
              style={styles.segmentedButtons}
            />

            <Text variant="titleMedium" style={styles.sectionTitle}>
              Due Date (Optional)
            </Text>
            
            {dueDate ? (
              <View style={styles.dueDateContainer}>
                <Text variant="bodyLarge" style={styles.dueDateText}>
                  {formatDateTime(dueDate)}
                </Text>
                <Button
                  mode="outlined"
                  onPress={handleRemoveDueDate}
                  icon="close"
                  compact>
                  Remove
                </Button>
              </View>
            ) : (
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                icon="calendar"
                style={styles.dateButton}>
                Set Due Date
              </Button>
            )}
          </Card.Content>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}>
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            loading={isLoading}
            disabled={isLoading || !title.trim()}
            style={styles.saveButton}>
            Save Task
          </Button>
        </View>
      </ScrollView>

      <DatePickerModal
        locale="en"
        mode="single"
        visible={showDatePicker}
        onDismiss={() => setShowDatePicker(false)}
        date={dueDate || new Date()}
        onConfirm={handleDateConfirm}
      />

      <TimePickerModal
        visible={showTimePicker}
        onDismiss={() => setShowTimePicker(false)}
        onConfirm={handleTimeConfirm}
        hours={dueDate?.getHours() || 12}
        minutes={dueDate?.getMinutes() || 0}
      />

      <Snackbar
        visible={!!error}
        onDismiss={handleDismissError}
        duration={4000}
        action={{
          label: 'Dismiss',
          onPress: handleDismissError,
        }}>
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    elevation: 2,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  dueDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    marginBottom: 16,
  },
  dueDateText: {
    flex: 1,
    color: '#1976D2',
  },
  dateButton: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default AddTaskScreen;
