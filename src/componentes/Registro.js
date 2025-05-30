import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function Registro() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    password: '',
    fechaNacimiento: '',
    telefono: '',
  });
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const handleChange = (name, value) => {
    setFormulario({ ...formulario, [name]: value });
  };

  const handleRegistro = async () => {
    setError(null);
    try {
      // Registrar usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formulario.correo,
        formulario.password
      );
      const user = userCredential.user;

      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, 'usuarios', user.uid), {
        id: user.uid,
        nombre: formulario.nombre,
        correo: formulario.correo,
        fecha_nacimiento: formulario.fechaNacimiento,
        telefono: formulario.telefono,
        rol: 'usuario',
      });

      Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      console.log('Error en registro:', error);
      setError(error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Registro</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={formulario.nombre}
          onChangeText={(value) => handleChange('nombre', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo"
          value={formulario.correo}
          onChangeText={(value) => handleChange('correo', value)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={formulario.password}
          onChangeText={(value) => handleChange('password', value)}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Fecha de Nacimiento (YYYY-MM-DD)"
          value={formulario.fechaNacimiento}
          onChangeText={(value) => handleChange('fechaNacimiento', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={formulario.telefono}
          onChangeText={(value) => handleChange('telefono', value)}
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.button} onPress={handleRegistro}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        {error && <Text style={styles.error}>{error}</Text>}

        <Text style={styles.text}>¿Ya tienes una cuenta?</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Tus estilos siguen igual...


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#202020',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#a955e4',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: '#a955e4',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  text: {
    marginTop: 15,
    fontSize: 14,
    color: '#606060',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: 10,
    textAlign: 'center',
  },
});
