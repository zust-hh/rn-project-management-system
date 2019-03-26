import React from "react";
import { View, Text } from "react-native";
import { NavigationBar, Title, DropDownMenu, ListView, ImageBackground, Tile, Subtitle, Divider, Screen } from '@shoutem/ui';
import { Query } from 'react-apollo';

import gql from '../gql';
export default class ProjectList extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
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
            data.length !== 0 ? <Tile>
              <Title styleName="md-gutter-bottom">{data.name}</Title>
              <Subtitle styleName="sm-gutter-horizontal">{data.description}</Subtitle>
            </Tile> : null
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
        <Query query={gql.FEED_QUERY}>
          {({ loading, error, data }) => {
            return (
              <ListView
                loading={loading}
                data={loading ? [] : data.feed.projects}
                renderRow={this.renderRow}
              />
            )
          }}
        </Query>
      </Screen>
    );
  }
}