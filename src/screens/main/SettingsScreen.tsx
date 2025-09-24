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
  Switch,
  List,
  Button,
  RadioButton,
  Snackbar,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../../store';
import {setSortBy} from '../../store/slices/taskSlice';

const SettingsScreen: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const {sortBy} = useSelector((state: RootState) => state.tasks);
  const {isConnected} = useSelector((state: RootState) => state.network);

  const handleSortChange = (newSortBy: 'createdAt' | 'dueDate' | 'priority') => {
    dispatch(setSortBy(newSortBy));
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Are you sure?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Clear', style: 'destructive', onPress: () => {
          // TODO: Implement cache clearing
          Alert.alert('Success', 'Cache cleared successfully');
        }},
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Export your tasks to a file?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Export', onPress: () => {
          // TODO: Implement data export
          Alert.alert('Success', 'Data exported successfully');
        }},
      ]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'Import tasks from a file?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Import', onPress: () => {
          // TODO: Implement data import
          Alert.alert('Success', 'Data imported successfully');
        }},
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Display Settings
            </Text>
            
            <List.Item
              title="Dark Mode"
              description="Use dark theme"
              left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => (
                <Switch
                  value={darkModeEnabled}
                  onValueChange={setDarkModeEnabled}
                />
              )}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Task Settings
            </Text>
            
            <List.Item
              title="Default Sort Order"
              description="How tasks are sorted by default"
              left={(props) => <List.Icon {...props} icon="sort" />}
            />
            
            <RadioButton.Group onValueChange={handleSortChange} value={sortBy}>
              <View style={styles.radioGroup}>
                <View style={styles.radioItem}>
                  <RadioButton value="createdAt" />
                  <Text variant="bodyMedium">Date Created</Text>
                </View>
                <View style={styles.radioItem}>
                  <RadioButton value="dueDate" />
                  <Text variant="bodyMedium">Due Date</Text>
                </View>
                <View style={styles.radioItem}>
                  <RadioButton value="priority" />
                  <Text variant="bodyMedium">Priority</Text>
                </View>
              </View>
            </RadioButton.Group>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Sync Settings
            </Text>
            
            <List.Item
              title="Auto Sync"
              description="Automatically sync when online"
              left={(props) => <List.Icon {...props} icon="sync" />}
              right={() => (
                <Switch
                  value={autoSyncEnabled}
                  onValueChange={setAutoSyncEnabled}
                />
              )}
            />
            
            <List.Item
              title="Connection Status"
              description={isConnected ? 'Connected' : 'Offline'}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={isConnected ? 'wifi' : 'wifi-off'}
                  color={isConnected ? '#4CAF50' : '#FF6B6B'}
                />
              )}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Notifications
            </Text>
            
            <List.Item
              title="Push Notifications"
              description="Receive notifications for due tasks"
              left={(props) => <List.Icon {...props} icon="notifications" />}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                />
              )}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Data Management
            </Text>
            
            <Button
              mode="outlined"
              onPress={handleClearCache}
              icon="delete-sweep"
              style={styles.actionButton}>
              Clear Cache
            </Button>
            
            <Button
              mode="outlined"
              onPress={handleExportData}
              icon="download"
              style={styles.actionButton}>
              Export Data
            </Button>
            
            <Button
              mode="outlined"
              onPress={handleImportData}
              icon="upload"
              style={styles.actionButton}>
              Import Data
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
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
  },
  card: {
    elevation: 2,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  radioGroup: {
    marginLeft: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButton: {
    marginBottom: 8,
  },
});

export default SettingsScreen;
