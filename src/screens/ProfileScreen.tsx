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
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    image: user?.image || 'https://via.placeholder.com/150',
    specialty: (user as any)?.specialty || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      // Validar os dados
      if (!formData.name.trim()) {
        Alert.alert('Erro', 'O nome é obrigatório');
        return;
      }
      
      if (!formData.email.trim() || !formData.email.includes('@')) {
        Alert.alert('Erro', 'Email inválido');
        return;
      }
      
      await updateUserProfile({
        ...user,
        name: formData.name,
        email: formData.email,
        image: formData.image,
        specialty: user?.role === 'doctor' ? formData.specialty : undefined,
      } as any);
      
      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
      console.error(error);
    }
  };
  
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

  return (
    <Container>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title>Meu Perfil</Title>

        <ProfileCard>
          {isEditing ? (
            // Modo de edição
            <>
              <Avatar source={{ uri: formData.image }} />
              <Input
                label="URL da Imagem"
                value={formData.image}
                onChangeText={(value) => handleInputChange('image', value)}
              />
              <Input
                label="Nome"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
              />
              <Input
                label="Email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
              />
              {user?.role === 'doctor' && (
                <Input
                  label="Especialidade"
                  value={formData.specialty}
                  onChangeText={(value) => handleInputChange('specialty', value)}
                />
              )}
              <RoleBadge role={user?.role || ''}>
                <RoleText>{getRoleText(user?.role || '')}</RoleText>
              </RoleBadge>
            </>
          ) : (
            // Modo de visualização
            <>
              <Avatar source={{ uri: user?.image || 'https://via.placeholder.com/150' }} />
              <Name>{user?.name}</Name>
              <Email>{user?.email}</Email>
              <RoleBadge role={user?.role || ''}>
                <RoleText>{getRoleText(user?.role || '')}</RoleText>
              </RoleBadge>
              
              {user?.role === 'doctor' && (
                <SpecialtyText>Especialidade: {(user as any)?.specialty}</SpecialtyText>
              )}
            </>
          )}
        </ProfileCard>

        {isEditing ? (
          // Botões para o modo de edição
          <>
            <Button
              title="Salvar Alterações"
              onPress={handleSaveChanges}
              containerStyle={styles.button as ViewStyle}
              buttonStyle={styles.saveButton}
              icon={<Icon name="check" type="material" color="white" size={20} style={{ marginRight: 10 }} />}
            />
            <Button
              title="Cancelar"
              onPress={() => {
                setIsEditing(false);
                setFormData({
                  name: user?.name || '',
                  email: user?.email || '',
                  image: user?.image || 'https://via.placeholder.com/150',
                  specialty: (user as any)?.specialty || '',
                });
              }}
              containerStyle={styles.button as ViewStyle}
              buttonStyle={styles.cancelButton}
              icon={<Icon name="close" type="material" color="white" size={20} style={{ marginRight: 10 }} />}
            />
          </>
        ) : (
          // Botões para o modo de visualização
          <>
            <Button
              title="Editar Perfil"
              onPress={() => setIsEditing(true)}
              containerStyle={styles.button as ViewStyle}
              buttonStyle={styles.editButton}
              icon={<Icon name="edit" type="material" color="white" size={20} style={{ marginRight: 10 }} />}
            />
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
              icon={<Icon name="logout" type="material" color="white" size={20} style={{ marginRight: 10 }} />}
            />
          </>
        )}
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
  editButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  saveButton: {
    backgroundColor: theme.colors.success,
    paddingVertical: 12,
  },
  cancelButton: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: 12,
  },
  inputContainer: {
    marginBottom: 10,
    width: '100%',
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