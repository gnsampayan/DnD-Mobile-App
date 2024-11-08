// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';

type IconFamily = 'Ionicons' | 'MaterialCommunityIcons' | 'MaterialIcons';

type TabBarIconProps =
  | ({
    family?: 'Ionicons';
    name: ComponentProps<typeof Ionicons>['name'];
  } & Omit<IconProps<string>, 'name'>)
  | ({
    family: 'MaterialCommunityIcons';
    name: ComponentProps<typeof MaterialCommunityIcons>['name'];
  } & Omit<IconProps<string>, 'name'>)
  | ({
    family: 'MaterialIcons';
    name: ComponentProps<typeof MaterialIcons>['name'];
  } & Omit<IconProps<string>, 'name'>);

export function TabBarIcon({ style, family = 'Ionicons', name, ...rest }: TabBarIconProps) {
  switch (family) {
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={name as ComponentProps<typeof MaterialCommunityIcons>['name']} size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
    case 'MaterialIcons':
      return <MaterialIcons name={name as ComponentProps<typeof MaterialIcons>['name']} size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
    default:
      return <Ionicons name={name as ComponentProps<typeof Ionicons>['name']} size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
  }
}
