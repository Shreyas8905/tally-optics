import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import client from '../api/client';

const CreateOrderScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    cust_name: '',
    mobile: '',
    case_no: '',
    re_sph: '', re_cyl: '', re_axis: '',
    le_sph: '', le_cyl: '', le_axis: '',
    add_be: '',
    frame_cost: '',
    glass_cost: '',
    discount: '',
    advance: '',
    frame_id: 1,
    gt1_id: 1,
    gt2_id: 1,
  });

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.cust_name || !formData.mobile) {
      Alert.alert('Error', 'Customer Name and Mobile are required');
      return;
    }

    // Convert strings to numbers for API
    const payload = {
      ...formData,
      frame_cost: parseFloat(formData.frame_cost) || 0,
      glass_cost: parseFloat(formData.glass_cost) || 0,
      discount: parseFloat(formData.discount) || 0,
      advance: parseFloat(formData.advance) || 0,
    };

    try {
      await client.post('/orders/', payload);
      Alert.alert('Success', 'Order Created Successfully', [
        { 
          text: 'OK', 
          onPress: () => {
            // Reset form and navigate back
            setFormData({
                cust_name: '', mobile: '', case_no: '',
                re_sph: '', re_cyl: '', re_axis: '',
                le_sph: '', le_cyl: '', le_axis: '',
                add_be: '', frame_cost: '', glass_cost: '',
                discount: '', advance: '', frame_id: 1, gt1_id: 1, gt2_id: 1
            });
            navigation.navigate('Orders');
          } 
        }
      ]);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to create order. Check console.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>New Order</Text>

        {/* Customer Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <TextInput
            placeholder="Customer Name"
            style={styles.input}
            value={formData.cust_name}
            onChangeText={(t) => updateField('cust_name', t)}
          />
          <TextInput
            placeholder="Mobile Number"
            style={styles.input}
            keyboardType="phone-pad"
            value={formData.mobile}
            onChangeText={(t) => updateField('mobile', t)}
          />
          <TextInput
            placeholder="Case No"
            style={styles.input}
            value={formData.case_no}
            onChangeText={(t) => updateField('case_no', t)}
          />
        </View>

        {/* Prescription Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prescription (RE)</Text>
          <View style={styles.row}>
            <TextInput placeholder="SPH" style={[styles.input, styles.col]} value={formData.re_sph} onChangeText={(t) => updateField('re_sph', t)} />
            <TextInput placeholder="CYL" style={[styles.input, styles.col]} value={formData.re_cyl} onChangeText={(t) => updateField('re_cyl', t)} />
            <TextInput placeholder="AXIS" style={[styles.input, styles.col]} value={formData.re_axis} onChangeText={(t) => updateField('re_axis', t)} />
          </View>

          <Text style={styles.sectionTitle}>Prescription (LE)</Text>
          <View style={styles.row}>
            <TextInput placeholder="SPH" style={[styles.input, styles.col]} value={formData.le_sph} onChangeText={(t) => updateField('le_sph', t)} />
            <TextInput placeholder="CYL" style={[styles.input, styles.col]} value={formData.le_cyl} onChangeText={(t) => updateField('le_cyl', t)} />
            <TextInput placeholder="AXIS" style={[styles.input, styles.col]} value={formData.le_axis} onChangeText={(t) => updateField('le_axis', t)} />
          </View>

          <Text style={styles.sectionTitle}>Addition (BE)</Text>
          <TextInput placeholder="ADD" style={styles.input} value={formData.add_be} onChangeText={(t) => updateField('add_be', t)} />
        </View>

        {/* Pricing Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing</Text>
          <TextInput
            placeholder="Frame Cost"
            style={styles.input}
            keyboardType="numeric"
            value={formData.frame_cost}
            onChangeText={(t) => updateField('frame_cost', t)}
          />
          <TextInput
            placeholder="Glass Cost"
            style={styles.input}
            keyboardType="numeric"
            value={formData.glass_cost}
            onChangeText={(t) => updateField('glass_cost', t)}
          />
          <TextInput
            placeholder="Discount"
            style={styles.input}
            keyboardType="numeric"
            value={formData.discount}
            onChangeText={(t) => updateField('discount', t)}
          />
          <TextInput
            placeholder="Advance"
            style={styles.input}
            keyboardType="numeric"
            value={formData.advance}
            onChangeText={(t) => updateField('advance', t)}
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Create Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scroll: {
    padding: 20,
    paddingTop: 40
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    width: '30%',
  },
  submitBtn: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 40,
  },
  submitText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateOrderScreen;