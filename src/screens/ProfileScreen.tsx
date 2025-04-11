import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Input, Button, ListItem, Icon } from 'react-native-elements';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { ViewStyle, Alert } from 'react-native';
import theme from '../styles/theme';
import Header from '../components/Header';

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Profile'>;
};

const ProfileScreen: React.FC = () => {
  const { user, signOut, updateUserProfile } = useAuth();
  const navigation = useNavigation<ProfileScreenProps['navigation']>();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'doctor':
        return 'Médico';
      case 'patient':
        return 'Paciente';
      default:
        return role;
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome não pode estar vazio');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Erro', 'O email não pode estar vazio');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'Por favor, insira um email válido');
      return;
    }

    // Validação de senha
    if (newPassword) {
      if (!currentPassword) {
        Alert.alert('Erro', 'Por favor, insira sua senha atual');
        return;
      }

      if (newPassword.length < 6) {
        Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres');
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert('Erro', 'As senhas não coincidem');
        return;
      }
    }

    try {
      setLoading(true);
      
      // Aqui você implementaria a lógica real para atualizar o perfil
      // Simulando uma atualização bem-sucedida:
      await updateUserProfile({
        name,
        email,
        currentPassword,
        newPassword
      });
      
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      setIsEditing(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    // Restaurar valores originais
    setName(user?.name || '');
    setEmail(user?.email || '');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsEditing(false);
  };

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Meu Perfil</Title>

        <ProfileCard>
          <Avatar source={{ uri: user?.image || 'https://via.placeholder.com/150' }} />
          
          {isEditing ? (
            <>
              <Input
                label="Nome"
                value={name}
                onChangeText={setName}
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
              />
              
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
              />
              
              <Input
                label="Senha Atual"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
                placeholder="Necessária para alterar a senha"
              />
              
              <Input
                label="Nova Senha"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
                placeholder="Deixe em branco para manter a atual"
              />
              
              <Input
                label="Confirmar Nova Senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
              />
            </>
          ) : (
            <>
              <Name>{user?.name}</Name>
              <Email>{user?.email}</Email>
              <RoleBadge role={user?.role || ''}>
                <RoleText>{getRoleText(user?.role || '')}</RoleText>
              </RoleBadge>
              
              {user?.role === 'doctor' && (
                <SpecialtyText>Especialidade: {user?.specialty}</SpecialtyText>
              )}
            </>
          )}
        </ProfileCard>

        {isEditing ? (
          <ButtonContainer>
            <Button
              title="Salvar"
              onPress={handleSaveProfile}
              containerStyle={[styles.editButton, { marginRight: 5 }]}
              buttonStyle={styles.saveButton}
              loading={loading}
            />
            <Button
              title="Cancelar"
              onPress={handleCancelEdit}
              containerStyle={[styles.editButton, { marginLeft: 5 }]}
              buttonStyle={styles.cancelButton}
            />
          </ButtonContainer>
        ) : (
          <Button
            title="Editar Perfil"
            onPress={() => setIsEditing(true)}
            containerStyle={styles.button as ViewStyle}
            buttonStyle={styles.editProfileButton}
            icon={
              <Icon
                name="edit"
                type="material"
                color="white"
                size={20}
                style={{ marginRight: 10 }}
              />
            }
          />
        )}

        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.buttonStyle}
        />

        <Button
          title="Sair"
          onPress={signOut}
          containerStyle={styles.button as ViewStyle}
          buttonStyle={styles.logoutButton}
        />
      </ScrollView>
    </Container>
  );
};

const styles = {
  scrollContent: {
    padding: 20,
  },
  button: {
    marginBottom: 20,
    width: '100%',
  },
  buttonStyle: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 12,
  },
  editProfileButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
  editButton: {
    marginBottom: 20,
    flex: 1,
  },
  saveButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: 12,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 12,
  },
  inputContainer: {
    width: 100,  //100%
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
  },
};

const Container = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const ScrollView = styled.ScrollView`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 20px;
  text-align: center;
`;

const ProfileCard = styled.View`
  background-color: ${theme.colors.background};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  align-items: center;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const Avatar = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: 16px;
`;

const Name = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

const Email = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

const RoleBadge = styled.View<{ role: string }>`
  background-color: ${(props: any) => {
    switch (props.role) {
      case 'admin':
        return theme.colors.primary + '20';
      case 'doctor':
        return theme.colors.success + '20';
      default:
        return theme.colors.secondary + '20';
    }
  }};
  padding: 4px 12px;
  border-radius: 4px;
  margin-bottom: 8px;
`;

const RoleText = styled.Text`
  color: ${theme.colors.text};
  font-size: 14px;
  font-weight: 500;
`;

const SpecialtyText = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-top: 8px;
`;

export default ProfileScreen;