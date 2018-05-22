import React,{Component} from 'react'
import {View,Modal,Image,StyleSheet,TouchableHighlight,Dimensions } from 'react-native'

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default class StImageViewer extends Component{

	constructor(props){
		super(props);
		this.state={
			modalVisible:false,
			height:null,
			width:null,
		}
	}

	componentDidMount(){
		Image.getSize(this.props.url,
			(width, height) => {
				let heightToWidth = height/width;
				if(heightToWidth * screenWidth > screenHeight){
					height = screenHeight;
					width = height/heightToWidth;
				}else{
					width = screenWidth;
					height = heightToWidth * width;
				}
				this.setState({width, height});
			},
			() => {}
		);
	}

	showModal = () => {
		const {height,width} = this.state;
		if(height&&width){
			this.setState({modalVisible:true})
		}
	};

	hideModal = () => {
		this.setState({modalVisible:false})
	};

	render(){
		return(
			<TouchableHighlight onPress={this.showModal} underlayColor='#fff'>
				<View>
					<Image
						style={styles.img}
						source={{uri: this.props.url}}
						resizeMode='contain'
					/>
					<Modal
						animationType={"slide"}
						transparent={true}
						visible={this.state.modalVisible}
						onRequestClose={this.hideModal}>
						<View style={{flex:1,backgroundColor:'#000',justifyContent:'center',alignItems:'center'}}>
							<View style={{backgroundColor:'#fff'}}>
								<Image
									style={{height:this.state.height,width:this.state.width}}
									source={{uri: this.props.url}}
								/>
							</View>

						</View>
					</Modal>
				</View>

			</TouchableHighlight>
		)
	}
}

const styles = StyleSheet.create({
	img:{
		height:230,
		width:230,
	}
});