'use strict';

import React from "react";
import { withNavigation } from 'react-navigation';
import { View, TouchableOpacity,ActivityIndicator,Animated,Dimensions,StyleSheet} from "react-native";
import css from '@styles/global'
import SmartIcon from '@smarticon';
var to = require('to-case')
import { Block, NavBar, theme, Input } from 'galio-framework';
import Icon from './../Icon';

const { height, width } = Dimensions.get('window');
const iPhoneX = () => Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);



class Navbar extends React.Component  {
  
  constructor(props) {
   
    super(props);
   
    this.state = {
      showSearch:this.props.showSearch
    }
  }

  handleLeftPress = () => {
    const { back, navigation } = this.props;
    return (back ? navigation.goBack() : navigation.openDrawer());
  }

  renderRight = () => {
    const { hasSearch, white, showRightButton} = this.props;

    var rightIcons=[];
    if(hasSearch){
      rightIcons.push(this.renderSearchButton())
    }
    if(showRightButton){
      rightIcons.push(this.renderRightButton())
    }
    return rightIcons;
  }

  renderSearch = () => {
    const { navigation,seachPlaceholder } = this.props;
    return (
      <Input
        right
        color="black"
        style={styles.search}
        placeholder={seachPlaceholder}
        onChangeText={this.props.searchCallback}
        onFocus={() => navigation.navigate('Pro')}
        iconContent={<Icon size={16} color={theme.COLORS.MUTED} name="magnifying-glass" family="entypo" />}
      />
    )
  }
   renderSearchButton=()=>{
    const { white } = this.props;
    return (
      <TouchableOpacity style={[styles.button]} onPress={()=>{this.setState({showSearch:!this.state.showSearch})}}>
      <Icon
        size={16}
        family="entypo"
        name="magnifying-glass"
        color={theme.COLORS[white ? 'WHITE' : 'ICON']}
      />
    </TouchableOpacity>
    )
  }

  renderRightButton=()=>{
    const { rightButton, rightAction,white } = this.props;
    return (
      <TouchableOpacity style={[styles.button]} onPress={rightAction}>
      <Icon
        size={16}
        family="feather"
        name={rightButton}
        color={theme.COLORS[white ? 'WHITE' : 'ICON']}
      />
    </TouchableOpacity>
    )
  }

  renderHeader = () => {

      return (
        <Block center>
          {this.state.showSearch ? this.renderSearch() : null}
        </Block>
      )
  
  }

  render() {
     
  
   const { back, title, white, transparent, navigation } = this.props;
   const { routeName } = navigation.state;
   const headerStyles = [transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,];

    return (
      <Block style={headerStyles}>
        <NavBar
          title={title}
          style={styles.navbar}
          right={this.renderRight()}
          back={back}
          onLeftPress={this.handleLeftPress}
          shadow
          transparent={transparent}
          titleStyle={[
            {color: theme.COLORS[white ? 'WHITE' : 'ICON']},
          ]}
          leftIconColor={white ? theme.COLORS.WHITE : theme.COLORS.ICON}
          leftIconName={back?"chevron-left":"menu"}
          leftIconFamily="feather"
          leftStyle={{shadowColor: 'black',shadowOpacity: 0.5,elevation: 1,}}
        />
       {this.renderHeader()}
       {this.props.children}
      </Block>
    )
  }
}
export default withNavigation(Navbar);

const styles = StyleSheet.create({
  button: {
    padding: 12,
    position: 'relative',
  },
  title: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navbar: {

    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX ? theme.SIZES.BASE * 4 : theme.SIZES.BASE,
    zIndex: 5,
    padding:0
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3,
  },
  notify: {
    //backgroundColor: materialTheme.COLORS.LABEL,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  tabs: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.50,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '300'
  },
})
