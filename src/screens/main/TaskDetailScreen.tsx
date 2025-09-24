import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Chip,
  SegmentedButtons,
  DatePickerModal,
  TimePickerModal,
  Snackbar,
  IconButton,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {RootState, AppDispatch} from '../../store';
import {updateTask, deleteTask, clearError} from '../../store/slices/taskSlice';
import {Task} from '../../store/slices/taskSlice';
import {formatDate, getPriorityColor, getPriorityLabel} from '../../utils/helpers';

const TaskDetailScreen: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const route = useRoute();
  const {task: initialTask} = route.params as {task: Task};
  const {isLoading, error} = useSelector((state: RootState) => state.tasks);

  React.useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setPriority(initialTask.priority);
      setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate) : undefined);
    }
  }, [initialTask]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      const updatedTask = {
        id: initialTask.id,
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDate?.toISOString(),
        completed: initialTask.completed,
      };

      await dispatch(updateTask(updatedTask)).unwrap();
      setIsEditing(false);
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const handleCancel = () => {
    setTitle(initialTask.title);
    setDescription(initialTask.description);
    setPriority(initialTask.priority);
    setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate) : undefined);
    setIsEditing(false);
  };

  const handleToggleComplete = async () => {
    try {
      await dispatch(updateTask({
        id: initialTask.id,
        completed: !initialTask.completed,
      })).unwrap();
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTask(initialTask.id)).unwrap();
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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            {isEditing ? (
              <>
                <TextInput
                  label="Task Title *"
                  value={title}
                  onChangeText={setTitle}
                  style={styles.input}
                  mode="outlined"
                />

                <TextInput
                  label="Description"
                  value={description}
                  onChangeText={setDescription}
                  style={styles.input}
                  mode="outlined"
                  multiline
                  numberOfLines={4}
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

                <View style={styles.editButtons}>
                  <Button
                    mode="outlined"
                    onPress={handleCancel}
                    style={styles.cancelButton}>
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSave}
                    loading={isLoading}
                    disabled={isLoading || !title.trim()}
                    style={styles.saveButton}>
                    Save
                  </Button>
                </View>
              </>
            ) : (
              <>
                <View style={styles.taskHeader}>
                  <Text variant="headlineSmall" style={styles.taskTitle}>
                    {initialTask.title}
                  </Text>
                  <Chip
                    mode="outlined"
                    style={[styles.priorityChip, {borderColor: getPriorityColor(initialTask.priority)}]}
                    textStyle={{color: getPriorityColor(initialTask.priority)}}>
                    {getPriorityLabel(initialTask.priority)}
                  </Chip>
                </View>

                {initialTask.description && (
                  <Text variant="bodyLarge" style={styles.taskDescription}>
                    {initialTask.description}
                  </Text>
                )}

                <View style={styles.taskInfo}>
                  <View style={styles.infoRow}>
                    <Icon name="schedule" size={20} color="#666666" />
                    <Text variant="bodyMedium" style={styles.infoText}>
                      Created: {formatDate(initialTask.createdAt)}
                    </Text>
                  </View>

                  {initialTask.dueDate && (
                    <View style={styles.infoRow}>
                      <Icon name="event" size={20} color="#666666" />
                      <Text variant="bodyMedium" style={styles.infoText}>
                        Due: {formatDate(initialTask.dueDate)}
                      </Text>
                    </View>
                  )}

                  <View style={styles.infoRow}>
                    <Icon name="cloud" size={20} color={initialTask.synced ? "#4CAF50" : "#FF6B6B"} />
                    <Text variant="bodyMedium" style={styles.infoText}>
                      {initialTask.synced ? 'Synced' : 'Not synced'}
                    </Text>
                  </View>
                </View>

                <View style={styles.actionButtons}>
                  <Button
                    mode={initialTask.completed ? "outlined" : "contained"}
                    onPress={handleToggleComplete}
                    icon={initialTask.completed ? "undo" : "check"}
                    style={styles.toggleButton}>
                    {initialTask.completed ? 'Mark as Pending' : 'Mark as Complete'}
                  </Button>
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        {!isEditing && (
          <View style={styles.bottomActions}>
            <Button
              mode="outlined"
              onPress={handleEdit}
              icon="edit"
              style={styles.editButton}>
              Edit Task
            </Button>
            <Button
              mode="contained"
              onPress={() => setShowDeleteDialog(true)}
              icon="delete"
              buttonColor="#FF6B6B"
              style={styles.deleteButton}>
              Delete Task
            </Button>
          </View>
        )}
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
    </View>
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
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  taskTitle: {
    flex: 1,
    fontWeight: 'bold',
    marginRight: 8,
  },
  priorityChip: {
    marginLeft: 8,
  },
  taskDescription: {
    color: '#666666',
    marginBottom: 16,
    lineHeight: 24,
  },
  taskInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#666666',
  },
  actionButtons: {
    marginTop: 16,
  },
  toggleButton: {
    marginBottom: 8,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 8,
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
  editButtons: {
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

export default TaskDetailScreen;
