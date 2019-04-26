import React, { Component } from 'react';
import { Text, StyleSheet, View, Button } from 'react-native';
import { connect } from 'react-redux';
import actions from '../actions';

class FavoritePage extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.home}> FavoritePage </Text>
				<Button
					title={'改变主题颜色'}
					onPress={() => {
						this.props.onThemeChange('yellow');
					}}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF'
	},
	home: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10
	}
});

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
	onThemeChange: (theme) => dispatch(actions.onThemeChange(theme))
});

export default connect(mapStateToProps, mapDispatchToProps)(FavoritePage);
