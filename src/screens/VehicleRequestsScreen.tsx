import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useVehicleStore } from '../store/vehicleStore';
import { RootStackParamList } from '../../App';
import { Vehicle } from '../types/Vehicle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';

type VehicleRequestsScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'VehicleRequests'>;
};

export default function VehicleRequestsScreen({
  navigation,
}: VehicleRequestsScreenProps) {
  const vehicles = useVehicleStore(s => s.vehicles);

  const statusColors: Record<string, string> = {
    Pending: '#f5a623',
    'In Progress': '#4f78c5',
    Completed: '#4cd964',
  };

  const renderItem = ({ item }: { item: Vehicle }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('VehicleDetails', { number: item.number })
      }
      style={styles.card}
      activeOpacity={0.82}
    >
      <View style={styles.cardLeft}>
        <View style={styles.iconCircle}>
          <MCI name="car" size={26} color="#4f7bc5" />
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.regNumber}>{item.number}</Text>
        <Text style={styles.complaintText} numberOfLines={2}>
          {item.complaint}
        </Text>
        <Text style={styles.modelText}>{item.model}</Text>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.dateText}>{formatDate(item.created)}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColors[item.status] },
          ]}
        >
          <Text style={styles.statusBadgeText}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screenContainer}>
      <FlatList
        data={vehicles}
        renderItem={renderItem}
        keyExtractor={item => item.number}
        contentContainerStyle={{ paddingBottom: 110 }}
        ListEmptyComponent={
          <Text style={{ margin: 24, color: '#64748b', fontSize: 16 }}>
            No complaints found.
          </Text>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddVehicle')}
        activeOpacity={0.8}
      >
        <Icon name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#f6f7fa' },
  appBar: {
    backgroundColor: '#4f7bc5',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  appBarTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 19,
    letterSpacing: 0.1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 14,
    marginTop: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    elevation: 0.5,
    shadowColor: '#cfd8dc',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  cardLeft: { marginRight: 10 },
  iconCircle: {
    backgroundColor: '#e7effb',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  cardBody: { flex: 1, marginRight: 6 },
  regNumber: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
    color: '#171e2b',
  },
  complaintText: { color: '#4a6274', fontSize: 13.5, lineHeight: 18 },
  modelText: { color: '#6c7a86', marginTop: 3, fontSize: 13 },
  dateText: {
    minWidth: 80,
    color: '#8ca1c4',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'right',
    alignSelf: 'flex-start',
  },
  fab: {
    position: 'absolute',
    bottom: 34,
    right: 32,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#276ef1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#0e3682',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  cardRight: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    minWidth: 80,
  },
  statusBadge: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#fff',
  },
});
