import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Drawer } from './Drawer'
import { DrawerToggle } from './DrawerToggle'
import { useDrawer } from '../../contexts/DrawerContext'
import { RootStackParamList } from '../../navigation/types'

type GlobalDrawerNavigationProp = NativeStackNavigationProp<RootStackParamList>

interface GlobalDrawerProps {
  children: React.ReactNode
}

export const GlobalDrawer: React.FC<GlobalDrawerProps> = ({ children }) => {
  const { isDrawerOpen, closeDrawer, toggleDrawer } = useDrawer()
  const navigation = useNavigation<GlobalDrawerNavigationProp>()

  const handleNavigate = (screenName: keyof RootStackParamList) => {
    navigation.navigate(screenName as any)
  }

  return (
    <View style={styles.container}>
      {children}
      
      <DrawerToggle 
        onPress={toggleDrawer} 
        isOpen={isDrawerOpen}
      />
      
      <Drawer 
        isVisible={isDrawerOpen} 
        onClose={closeDrawer}
        onNavigate={handleNavigate}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
