import React from 'react';
import { StyleSheet } from 'react-native';
import { Block, Text, theme } from "galio-framework";

import SmartIcon  from '@components/SmartIcons';
import  { Images, materialTheme } from  "./../constants/";


class DrawerItem extends React.Component {

  render() {
    const { focused, title, icon } = this.props;
    return (
      <Block flex row style={[styles.defaultStyle, focused ? [{
        backgroundColor: materialTheme.COLORS.ACTIVE,
        borderRadius: 4,
      }, styles.shadow] : null]}>
        <Block middle flex={0.1} style={{ marginRight: 28 }}>
          <SmartIcon name={icon} color={focused?"white":materialTheme.COLORS.MUTED} size={18}/>
        </Block>
        <Block row center flex={0.9}>
          <Text size={18} color={focused ? 'white' : false ? materialTheme.COLORS.MUTED : 'black'}>
            {title}
          </Text>
         
        </Block>
      </Block>
    )
   
  }
}

export default DrawerItem;

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  activeStyle: {
    backgroundColor: materialTheme.COLORS.ACTIVE,
    borderRadius: 4,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.2
  },
  pro: {
    backgroundColor: materialTheme.COLORS.LABEL,
    paddingHorizontal: 6,
    marginLeft: 8,
    borderRadius: 2,
    height: 16,
    width: 36,
  },
})