import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Menu({ navigation }) {
  return (
    <View style={styles.menu}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.menuItem}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Explorar')}>
        <Text style={styles.menuItem}>Explorar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Contactos')}>
        <Text style={styles.menuItem}>Chat</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Favoritos')}>
        <Text style={styles.menuItem}>Likes</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
        <Text style={styles.menuItem}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    height: 60,
    backgroundColor: '#e9d8fd',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  menuItem: {
    color: '#2d2d2d',
    fontWeight: '600',
    fontSize: 14,
  },
});
