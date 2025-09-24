import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  FAB,
  Searchbar,
  Menu,
  Button,
  Snackbar,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {RootState, AppDispatch} from '../../store';
import {
  loadTasksFromLocal,
  setFilter,
  setSortBy,
  clearError,
} from '../../store/slices/taskSlice';
import {syncAllData} from '../../store/slices/syncSlice';
import {Task} from '../../store/slices/taskSlice';
import {formatDate, getPriorityColor, getPriorityLabel, sortTasks, filterTasks} from '../../utils/helpers';

const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const {user} = useSelector((state: RootState) => state.auth);
  const {tasks, isLoading, error, filter, sortBy} = useSelector((state: RootState) => state.tasks);
  const {isConnected} = useSelector((state: RootState) => state.network);
  const {isSyncing} = useSelector((state: RootState) => state.sync);

  useEffect(() => {
    if (user?.uid) {
      dispatch(loadTasksFromLocal(user.uid));
    }
  }, [dispatch, user?.uid]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (user?.uid) {
      await dispatch(loadTasksFromLocal(user.uid));
      if (isConnected) {
        await dispatch(syncAllData());
      }
    }
    setRefreshing(false);
  };

  const handleSync = async () => {
    if (isConnected) {
      await dispatch(syncAllData());
    }
  };

  const handleFilterChange = (newFilter: 'all' | 'pending' | 'completed') => {
    dispatch(setFilter(newFilter));
    setShowFilterMenu(false);
  };

  const handleSortChange = (newSortBy: 'createdAt' | 'dueDate' | 'priority') => {
    dispatch(setSortBy(newSortBy));
    setShowSortMenu(false);
  };

  const handleTaskPress = (task: Task) => {
    navigation.navigate('TaskDetail' as never, {task} as never);
  };

  const handleAddTask = () => {
    navigation.navigate('AddTask' as never);
  };

  const handleDismissError = () => {
    dispatch(clearError());
  };

  const filteredTasks = filterTasks(tasks, filter);
  const sortedTasks = sortTasks(filteredTasks, sortBy);
  const searchFilteredTasks = sortedTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTask = ({item}: {item: Task}) => (
    <TouchableOpacity onPress={() => handleTaskPress(item)}>
      <Card style={styles.taskCard}>
        <Card.Content>
          <View style={styles.taskHeader}>
            <Text variant="titleMedium" style={styles.taskTitle}>
              {item.title}
            </Text>
            <Chip
              mode="outlined"
              style={[styles.priorityChip, {borderColor: getPriorityColor(item.priority)}]}
              textStyle={{color: getPriorityColor(item.priority)}}>
              {getPriorityLabel(item.priority)}
            </Chip>
          </View>
          
          {item.description && (
            <Text variant="bodyMedium" style={styles.taskDescription}>
              {item.description}
            </Text>
          )}
          
          <View style={styles.taskFooter}>
            {item.dueDate && (
              <Text variant="bodySmall" style={styles.dueDate}>
                Due: {formatDate(item.dueDate)}
              </Text>
            )}
            <View style={styles.taskStatus}>
              <Chip
                mode={item.completed ? 'flat' : 'outlined'}
                style={[
                  styles.statusChip,
                  item.completed ? styles.completedChip : styles.pendingChip,
                ]}>
                {item.completed ? 'Completed' : 'Pending'}
              </Chip>
              {!item.synced && (
                <Icon name="cloud-off" size={16} color="#FF6B6B" />
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="assignment" size={64} color="#CCCCCC" />
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No tasks found
      </Text>
      <Text variant="bodyMedium" style={styles.emptySubtitle}>
        {filter === 'all' 
          ? 'Create your first task to get started'
          : `No ${filter} tasks found`
        }
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search tasks..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        
        <View style={styles.filterRow}>
          <Menu
            visible={showFilterMenu}
            onDismiss={() => setShowFilterMenu(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setShowFilterMenu(true)}
                icon="filter-list">
                {filter === 'all' ? 'All' : filter === 'pending' ? 'Pending' : 'Completed'}
              </Button>
            }>
            <Menu.Item onPress={() => handleFilterChange('all')} title="All Tasks" />
            <Menu.Item onPress={() => handleFilterChange('pending')} title="Pending" />
            <Menu.Item onPress={() => handleFilterChange('completed')} title="Completed" />
          </Menu>

          <Menu
            visible={showSortMenu}
            onDismiss={() => setShowSortMenu(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setShowSortMenu(true)}
                icon="sort">
                Sort
              </Button>
            }>
            <Menu.Item onPress={() => handleSortChange('createdAt')} title="Date Created" />
            <Menu.Item onPress={() => handleSortChange('dueDate')} title="Due Date" />
            <Menu.Item onPress={() => handleSortChange('priority')} title="Priority" />
          </Menu>

          {isConnected && (
            <Button
              mode="contained"
              onPress={handleSync}
              loading={isSyncing}
              disabled={isSyncing}
              icon="sync"
              compact>
              Sync
            </Button>
          )}
        </View>
      </View>

      <FlatList
        data={searchFilteredTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddTask}
        label="Add Task"
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
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  searchbar: {
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  taskCard: {
    marginBottom: 12,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  priorityChip: {
    marginLeft: 8,
  },
  taskDescription: {
    color: '#666666',
    marginBottom: 12,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dueDate: {
    color: '#666666',
  },
  taskStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusChip: {
    marginRight: 8,
  },
  completedChip: {
    backgroundColor: '#E8F5E8',
  },
  pendingChip: {
    backgroundColor: '#FFF3E0',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    marginTop: 16,
    color: '#666666',
  },
  emptySubtitle: {
    marginTop: 8,
    color: '#999999',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen;
