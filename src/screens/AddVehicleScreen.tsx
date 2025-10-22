import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useVehicleStore } from '../store/vehicleStore';
import { RootStackParamList } from '../../App';

type AddVehicleScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'AddVehicle'>;
};

export default function AddVehicleScreen({
  navigation,
}: AddVehicleScreenProps) {
  const addVehicle = useVehicleStore(s => s.addVehicle);
  const [number, setNumber] = useState('');
  const [model, setModel] = useState('');
  const [complaint, setComplaint] = useState('');

  const isDisabled = !number || !model || !complaint;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Vehicle Number</Text>
      <View style={styles.inputWrapper}>
        <Icon name="ticket-outline" size={22} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Enter registration number"
          value={number}
          onChangeText={setNumber}
          autoCapitalize="characters"
        />
      </View>

      {/* Vehicle Model */}
      <Text style={styles.label}>Vehicle Model</Text>
      <View style={styles.inputWrapper}>
        <Icon name="car" size={22} style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="e.g., Toyota Camry 2022"
          value={model}
          onChangeText={setModel}
        />
      </View>

      <Text style={styles.label}>Describe your complaint</Text>
      <View
        style={[styles.inputWrapper, { alignItems: 'flex-start', height: 110 }]}
      >
        <TextInput
          style={[styles.input, { height: 110, textAlignVertical: 'top' }]}
          placeholder="Please provide as much detail as possible..."
          multiline
          value={complaint}
          onChangeText={setComplaint}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isDisabled && styles.buttonDisabled]}
        onPress={() => {
          addVehicle({ number, model, complaint });
          navigation.goBack();
        }}
        disabled={isDisabled}
      >
        <Text style={styles.buttonText}>Submit Complaint</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9fb',
    padding: 16,
    borderRadius: 16,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
  },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 12 },
  label: { fontSize: 15, fontWeight: '500', color: '#333', marginTop: 10 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#ececec',
  },
  inputIcon: { marginRight: 6, color: '#bdbdbd' },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 8,
    paddingHorizontal: 2,
  },
  button: {
    backgroundColor: '#276ef1',
    borderRadius: 12,
    marginTop: 26,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#b1cdf7',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
});
