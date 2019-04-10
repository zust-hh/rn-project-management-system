import React from "react";
import { Text } from "react-native";
import { NavigationBar, Title, DropDownMenu, ListView, ImageBackground, Tile, Subtitle, Divider, Screen, View, Button } from '@shoutem/ui';
import { Query } from 'react-apollo';

import gql from '../gql';
export default class ProjectList extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      filters: [
        { name: '全部', value: '全部' },
        { name: '我的', value: '我的' },
      ],
    }
  }

  renderRow = (data) => {
    return (
      <View>
        <ImageBackground
          styleName="large-banner"
          source={{ uri: "https://shoutem.github.io/static/getting-started/restaurant-6.jpg" }}
        >
          {
            data.length !== 0 ? <View styleName="space-between vertical fill-parent" style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: 24 }}>
              <View styleName="horizontal space-between">
                <Text>{data.type}</Text>
                <View>
                  <Text style={{ color: 'white' }}>hh</Text>
                </View>
              </View>
              <View styleName="horizontal space-between">
                <View styleName="vertical">
                  <View styleName="horizontal">
                    <Text numberOfLines={2} style={{ color: 'white', width: 300 }}>{data.name}</Text>
                    <Text style={{ color: 'white' }}>cg</Text>
                  </View>
                  <Subtitle styleName="sm-gutter-horizontal" style={{ color: 'white' }}>{data.description}</Subtitle>
                </View>
                <Button>
                  <Text>收藏</Text>
                </Button>
              </View>
            </View> : null
          }
        </ImageBackground>
        <Divider styleName="line" />
      </View>
    );
  }

  render() {
    return (
      <Screen style={{ marginTop: 32 }} >
        <NavigationBar
          centerComponent={
            <Title>
              {this.state.selectedFilter
                ? this.state.selectedFilter.value
                : this.state.filters[0].value}
            </Title>
          }
          rightComponent={
            <DropDownMenu
              options={this.state.filters}
              selectedOption={this.state.selectedFilter ? this.state.selectedFilter : this.state.filters[0]}
              onOptionSelected={(filter) => this.setState({ selectedFilter: filter })}
              titleProperty="name"
              valueProperty="value"
            />
          }
          styleName="inline"
        />
        <Query query={gql.PROJECTLIST_QUERY}>
          {({ loading, error, data }) => {
            console.log(data);
            return (
              <ListView
                loading={loading}
                data={loading ? [] : data.projectList.projects}
                renderRow={this.renderRow}
              />
            )
          }}
        </Query>
      </Screen>
    );
  }
}