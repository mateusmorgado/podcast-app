import React, { useState } from 'react';
import { Alert, SafeAreaView, Text, TextInput, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import { CONFIG } from '../config';

export default function LoginScreen({ onCancel }: { onCancel: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (mode: 'in' | 'up') => {
    setBusy(true);
    const { error } =
      mode === 'in'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (error) Alert.alert('Erro', error.message);
    else if (mode === 'up') Alert.alert('Conta criada', 'Confira seu e-mail para confirmar, se necessário.');
  };

  const input = {
    backgroundColor: '#1c1c1f',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  } as const;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0b0b0c', padding: 24, justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 24 }}>Entrar</Text>
      <TextInput
        style={input}
        placeholder="E-mail"
        placeholderTextColor="#777"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={input}
        placeholder="Senha"
        placeholderTextColor="#777"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        disabled={busy}
        onPress={() => submit('in')}
        style={{ backgroundColor: CONFIG.accentColor, padding: 14, borderRadius: 10, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '600' }}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity disabled={busy} onPress={() => submit('up')} style={{ padding: 14, alignItems: 'center' }}>
        <Text style={{ color: '#ccc' }}>Criar conta</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onCancel} style={{ alignItems: 'center' }}>
        <Text style={{ color: '#888' }}>Voltar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
