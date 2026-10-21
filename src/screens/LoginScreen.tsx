import React, { useState } from 'react';
import { Alert, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { Button, Sparkle, heading } from '../components/ui';
import { BORDER, COLORS, FONTS } from '../theme';

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
    backgroundColor: COLORS.paper,
    ...BORDER,
    color: COLORS.ink,
    fontFamily: FONTS.semibold,
    fontSize: 18,
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
  } as const;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.pink }}>
      <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
        <Sparkle size={26} style={{ alignSelf: 'flex-end' }} />
        <Text style={[heading, { fontSize: 40, marginBottom: 4 }]}>Entrar</Text>
        <Text style={{ fontFamily: FONTS.semibold, fontSize: 17, color: COLORS.ink, marginBottom: 20 }}>
          Use o mesmo e-mail da sua assinatura.
        </Text>
        <TextInput
          style={input}
          placeholder="E-mail"
          placeholderTextColor="#888"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={input}
          placeholder="Senha"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button label="Entrar" disabled={busy} onPress={() => submit('in')} style={{ marginTop: 4 }} />
        <Button
          label="Criar conta"
          disabled={busy}
          onPress={() => submit('up')}
          color={COLORS.paper}
          textColor={COLORS.ink}
          style={{ marginTop: 12 }}
        />
        <TouchableOpacity onPress={onCancel} style={{ alignItems: 'center', padding: 16 }}>
          <Text style={{ fontFamily: FONTS.semibold, fontSize: 16, color: COLORS.ink }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
