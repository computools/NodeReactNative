/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
import React, { Component } from 'react';
import
{
  AppRegistry,
  TouchableOpacity,
  Navigator,
  Text,
  View,
  TouchableHighlight,
  ListView
} from 'react-native';
import DatePicker from 'react-native-datepicker';


class test2 extends React.Component{
  render(){
    return (
      <Navigator
        initialRoute={{id: 'first'}}
        renderScene={this.navigatorRenderScene}/>
    );
  }

  navigatorRenderScene(route, navigator) {
    _navigator = navigator;
    switch (route.id) {
      case 'first':
        return (<First navigator={navigator} title="first"/>);
      case 'second':
        return (<Second navigator={navigator} title="second" />);
    }
  }
}
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
var partners = [{title: 'President', name: 'chris'}, {title: 'Manager', name: 'Melissa'}, {title: 'CEO', name: 'Amanda'}]


var matches = [
{id:1,date:"01/06/16",time:'19:00',recievingTeamId:1,guestTeamId:2},
{id:2,date:"02/06/16",time:'20:00',recievingTeamId:1,guestTeamId:3},
{id:3,date:"03/06/16",time:'21:00',recievingTeamId:2,guestTeamId:3}
]


var httpRequest;

function apiRequest(link, callback){
	
		httpRequest = new XMLHttpRequest();
		function onLoad() {
			this.httpRequest = httpRequest;
			callback();
			
		};
		function onTimeout() {
			console.log('Timeout');
			console.log(httpRequest.responseText);
			
		};
		function onError() {
			console.log('General network error');
			console.log(httpRequest.responseText);
		};

		httpRequest.onload = onLoad;
		httpRequest.ontimeout = onTimeout;
		httpRequest.onerror = onError;
		httpRequest.open('GET', encodeURI('http://mokhnachev.info:3000/'+link));
		httpRequest.send();
}

class First extends React.Component{
   onPressFeed() {
        this.props.navigator.push({
            id: 'second',
            component: Second
        });
    }
  constructor(props){
    super(props)
   this.state = {
     dataSource: ds.cloneWithRows(matches),
  date: new Date()
    }
  }
  
  
    renderRow(rowData) {
   return <TouchableHighlight   onPress={()=> this.pressRow(rowData.id)} style={{ height:60, backgroundColor: '#efefef', borderBottomWidth:1, borderBottomColor: '#ddd', flexDirection:'row', justifyContent: 'center', alignItems: 'center' }}>
       <Text style={{ fontSize:18 }}>{rowData.time}</Text>
      </TouchableHighlight>
  }
	renderEmpty(rowData) {
		return	<Text style={{ fontSize:18 }}>No matches</Text>
	}
  
    pressRow(rowData) {
	  var dataSource = this.state.dataSource;
	  var that = this;
	  apiRequest('actions?query={getActionsByMatchId(matchId:' + rowData + '){id,matchId,actionTypeId,time,playerId}}', function(){
		  var actions = JSON.parse(httpRequest.responseText)['data']['getActionsByMatchId'];
		  that.setState({dataSource: ds.cloneWithRows(actions)});
	  })
  }
  onDateChange(data){
     this.setState( { date: date } );
  }
  render() {
    return (
      <View>
  <DatePicker
          style={{width: 200}}
          date={this.state.date}
          mode="date"
          format="DDMMYY"
          minDate="2016-06-01"
          maxDate="2016-08-01"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          onDateChange={(date) => {
			  
        this.setState({date: date});
			var that = this;
			apiRequest('matches?query={getMatchesByDate(date:"' + that.state.date + '"){id,date,time,receivingTeamId,guestTeamId}}', function(){
				console.log(httpRequest.status);
				console.log(httpRequest.responseText);
				console.log(httpRequest.responseText);
				//var matches = JSON.parse(request.responseText)['data']['getMatchesByDate'];
				//matches.each(function)
				var matches = JSON.parse(httpRequest.responseText)['data']['getMatchesByDate'];
				//if(!matches.length === 0){
					that.setState({
						dataSource : ds.cloneWithRows(matches)
					});
			//	}
			})
		  }}
  />
   
   <ListView
	dataSource={this.state.dataSource}
	enableEmptySections = {true}
	renderRow={this.state.dataSource.getRowCount() != 0 ? this.renderRow.bind(this) : this.renderEmpty.bind({})}
    
  />
      </View>
    );
  }
}

class Second extends React.Component{
   onPressFeed() {
    alert(1);
        this.props.navigator.push({
            id: 'first',
            component: First
        });
    }
  render() {
    return (
      <View>

      </View>
    );
  }
}
AppRegistry.registerComponent('test2', () => test2);