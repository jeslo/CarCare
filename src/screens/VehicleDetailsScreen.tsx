import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  ScrollView,
} from 'react-native';
import { RouteProp } from '@react-navigation/stack';
import { useVehicleStore } from '../store/vehicleStore';
import { RootStackParamList } from '../../App';
import { Vehicle } from '../types/Vehicle';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TimeAgo from '../components/TimeAgo';

type VehicleDetailsScreenProps = {
  route: RouteProp<RootStackParamList, 'VehicleDetails'>;
};

const STATUS_OPTIONS: Vehicle['status'][] = [
  'Pending',
  'In Progress',
  'Completed',
];
const statusColors: Record<string, string> = {
  Pending: '#f5a623',
  'In Progress': '#e8da7a',
  Completed: '#4cd964',
};

export default function VehicleDetailsScreen({
  route,
}: VehicleDetailsScreenProps) {
  const { number } = route.params;
  const vehicle = useVehicleStore(s =>
    s.vehicles.find(v => v.number === number),
  );
  const updateVehicleStatus = useVehicleStore(s => s.updateVehicleStatus);
  const addComment = useVehicleStore(s => s.addComment);
  const editComment = useVehicleStore(s => s.editComment);
  const deleteComment = useVehicleStore(s => s.deleteComment);

  const [selectedStatus, setSelectedStatus] = useState<Vehicle['status']>(
    vehicle?.status ?? 'Pending',
  );
  const [technicianComment, setTechnicianComment] = useState<string>('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>('');

  if (!vehicle) return <Text>Request not found.</Text>;
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Vehicle Number</Text>
        <Text style={styles.vehicleNumber}>{vehicle.number}</Text>
        <Text style={styles.label}>Model</Text>
        <Text style={styles.model}>{vehicle.model}</Text>
        <View style={styles.divider} />
        <Text style={styles.label}>Complaint Description</Text>
        <Text style={styles.description}>{vehicle.complaint}</Text>
        <View style={styles.statusRow}>
          <Text style={styles.label}>Status:</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColors[vehicle.status] || '#edeff2' },
            ]}
          >
            <Text style={styles.statusBadgeText}>{vehicle.status}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Update Status</Text>

      <View style={styles.statusSelectorRow}>
        {STATUS_OPTIONS.map(status => (
          <TouchableOpacity
            key={status}
            onPress={() => {
              setSelectedStatus(status);
              updateVehicleStatus(vehicle.number, status); // status updates instantly
            }}
            style={[
              styles.statusSelector,
              selectedStatus === status && {
                borderColor: statusColors[status],
                backgroundColor: '#f7f8fa',
              },
            ]}
          >
            <Text
              style={{
                fontWeight: selectedStatus === status ? 'bold' : 'normal',
                color: selectedStatus === status ? '#181c25' : '#7d8da1',
              }}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Technician Comments</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.commentInputRow}>
          <TextInput
            style={styles.commentInputFlex}
            placeholder="Add your comment..."
            multiline
            value={technicianComment}
            onChangeText={setTechnicianComment}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.sendButton,
            !technicianComment.trim() && { opacity: 0.4 },
          ]}
          onPress={() => {
            if (!technicianComment.trim()) return;
            addComment(vehicle.number, {
              text: technicianComment,
              author: 'Jayan (Technician)',
              time: new Date().toISOString(),
            });
            setTechnicianComment('');
          }}
        >
          <Icon name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionLabel}>Comment History</Text>
      <FlatList
        data={vehicle.comments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentRow}>
            <View style={styles.commentPipe} />
            <View style={styles.commentMain}>
              {editingCommentId === item.id ? (
                <>
                  <TextInput
                    style={styles.commentInput}
                    value={editCommentText}
                    onChangeText={setEditCommentText}
                    multiline
                  />
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                    <TouchableOpacity
                      onPress={() => {
                        editComment(vehicle.number, item.id, editCommentText);
                        setEditingCommentId(null);
                      }}
                    >
                      <Text style={{ color: '#276ef1', fontWeight: 'bold' }}>
                        Save
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setEditingCommentId(null)}>
                      <Text style={{ color: '#7d8da1' }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.commentText}>{item.text}</Text>
                  <Text style={styles.commentMeta}>
                    {item.author} · <TimeAgo time={item.time} />
                  </Text>

                  <View style={{ flexDirection: 'row', gap: 9, marginTop: 4 }}>
                    <TouchableOpacity
                      onPress={() => {
                        setEditingCommentId(item.id);
                        setEditCommentText(item.text);
                      }}
                    >
                      <Text style={{ color: '#276ef1' }}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteComment(vehicle.number, item.id)}
                    >
                      <Text style={{ color: '#e74c3c' }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        )}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f7f8fa' },
  container: { padding: 12, paddingBottom: 40 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
    marginRight: 28,
    color: '#181c25',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderColor: '#bdd2f2',
    borderWidth: 1,
    shadowColor: '#dae6f7',
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1,
  },
  label: { color: '#7d8da1', fontWeight: '500', marginTop: 7 },
  vehicleNumber: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: '#181c25',
  },
  model: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 6,
    color: '#222c39',
  },
  description: {
    color: '#181c25',
    fontSize: 15,
    marginBottom: 6,
    marginTop: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#e7eaed',
    marginVertical: 8,
    alignSelf: 'stretch',
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  statusBadge: {
    paddingHorizontal: 11,
    paddingVertical: 3,
    borderRadius: 6,
    marginLeft: 6,
    backgroundColor: '#edeff2',
  },
  statusBadgeText: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#181c25',
  },
  sectionLabel: {
    marginTop: 12,
    fontWeight: 'bold',
    fontSize: 15,
    color: '#262d40',
  },
  statusSelectorRow: {
    flexDirection: 'row',
    marginVertical: 10,
    gap: 10,
  },
  statusSelector: {
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e1e6ec',
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginRight: 9,
    backgroundColor: '#fff',
  },
  commentInput: {
    backgroundColor: '#fff',
    borderColor: '#dde3eb',
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 56,
    padding: 11,
    fontSize: 15,
    color: '#262d40',
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#276ef1',
    borderRadius: 10,
    paddingVertical: 13,
    marginTop: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16.2,
    letterSpacing: 0.5,
  },
  commentRow: {
    flexDirection: 'row',
    marginBottom: 14,
    marginHorizontal: 8,
  },
  commentPipe: {
    width: 3,
    backgroundColor: '#bdd2f2',
    borderRadius: 2,
    marginRight: 8,
    marginTop: 6,
    marginBottom: 0,
  },
  commentMain: { flex: 1 },
  commentText: { color: '#181c25', fontSize: 15 },
  commentMeta: { color: '#7d8da1', fontSize: 13, marginTop: 5 },
  commentInputRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dde3eb',
    paddingHorizontal: 10,
    marginTop: 8,
    marginBottom: 16,
    width: '88%',
  },

  commentInputFlex: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    fontSize: 15,
    color: '#262d40',
    paddingVertical: 8,
    textAlignVertical: 'top',
  },

  sendButton: {
    backgroundColor: '#276ef1',
    borderRadius: 30,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginBottom: 4,
  },
});
