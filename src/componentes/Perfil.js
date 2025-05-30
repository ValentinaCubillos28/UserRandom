import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { auth, db } from '../../firebase/firebaseConfig';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function Perfil() {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    fecha_nacimiento: '',
    telefono: '',
    rol: '',
  });
  const [imagenes, setImagenes] = useState([]);
  const [nuevaUrl, setNuevaUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchUsuario = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'usuario', user.uid));
        if (userDoc.exists()) {
          setForm(userDoc.data());
          fetchImagenes(user.uid);
        }
      }
    } catch (error) {
      console.log('Error al obtener usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImagenes = async (usuarioid) => {
    try {
      const q = query(collection(db, 'multimedia'), where('usuarioid', '==', usuarioid));
      const querySnapshot = await getDocs(q);
      const imgs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setImagenes(imgs);
    } catch (error) {
      console.log('Error al obtener imágenes:', error);
    }
  };

  useEffect(() => {
    fetchUsuario();
  }, []);

  const handleUpdate = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'usuario', user.uid), form);
        Alert.alert('Éxito', 'Datos actualizados');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar');
    }
  };

  const handleAgregarUrl = async () => {
    if (!nuevaUrl.trim()) return;
    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, 'multimedia'), {
          url: nuevaUrl,
          usuarioid: user.uid,
        });
        setNuevaUrl('');
        fetchImagenes(user.uid);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar la imagen');
    }
  };

  const handleEliminarImagen = async (id) => {
    try {
      await deleteDoc(doc(db, 'multimedia', id));
      setImagenes(imagenes.filter((img) => img.id !== id));
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar la imagen');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Login'); // Ajusta esto a tu ruta de Login
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar sesión');
    }
  };

  if (loading) {
    return <Text style={styles.loading}>Cargando...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Perfil de Usuario</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={form.nombre}
        onChangeText={(text) => setForm({ ...form, nombre: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={form.correo}
        onChangeText={(text) => setForm({ ...form, correo: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Fecha de nacimiento (YYYY-MM-DD)"
        value={form.fecha_nacimiento}
        onChangeText={(text) => setForm({ ...form, fecha_nacimiento: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={form.telefono}
        onChangeText={(text) => setForm({ ...form, telefono: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Rol"
        value={form.rol}
        onChangeText={(text) => setForm({ ...form, rol: text })}
      />

      <Button title="Guardar cambios" onPress={handleUpdate} color="#a955e4" />

      <View style={styles.divider} />

      <Text style={styles.subtitle}>Agregar imagen</Text>
      <TextInput
        style={styles.input}
        placeholder="URL de la imagen"
        value={nuevaUrl}
        onChangeText={setNuevaUrl}
      />
      <Button title="Agregar" onPress={handleAgregarUrl} color="#a955e4" />

      <Text style={styles.subtitle}>Imágenes guardadas</Text>
      <FlatList
        data={imagenes}
        keyExtractor={(item) => item.id}
        horizontal
        renderItem={({ item }) => (
          <View style={styles.imageCard}>
            <Image source={{ uri: item.url }} style={styles.image} />
            <TouchableOpacity onPress={() => handleEliminarImagen(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.divider} />
      <Button title="Cerrar sesión" onPress={handleLogout} color="#a955e4" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#a955e4',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#a955e4',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    width: '100%',
    marginVertical: 20,
  },
  imageCard: {
    backgroundColor: '#f7f5ff',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  deleteButton: {
    marginTop: 8,
    backgroundColor: '#a955e4',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
  loading: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});
