import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal, StyleSheet,Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import createStyles from './styles';
import { useTheme } from '../../../Theme';
const CustomDropdown = ({ data, placeholder, selectedValue, onValueChange }) => {
    const { Tcolor, primary, secondary, background, theme, logo, toggleTheme } = useTheme();
    const styles = createStyles({ primary, secondary, background, theme, logo, toggleTheme, Tcolor });
  const [visible, setVisible] = useState(false);

  const handleSelect = (item) => {
    onValueChange(item); // Pass selected item to parent component
    setVisible(false); // Close dropdown
  };

  return (
    <View style={styles.container}>
      {/* Dropdown Button */}
      <TouchableOpacity activeOpacity={0.6} style={styles.dropdownButton} onPress={() => setVisible(!visible)}>
        <Text style={styles.selectedText}>{selectedValue || placeholder}</Text>
        <Ionicons name={visible ? 'chevron-up' : 'chevron-down'} size={18} color="gray" />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal transparent visible={visible} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setVisible(false)} />
        <View style={styles.dropdown}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default CustomDropdown;