import React from "react";
import { View, Text } from "react-native";
import { NavigationBar, Title, DropDownMenu, ListView, ImageBackground, Tile, Subtitle, Divider, Screen } from '@shoutem/ui';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`

export default class Home extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      filters: [
        { name: 'Filter', value: 'Filter' },
        { name: 'Sport', value: 'Sport' },
        { name: 'Food', value: 'Food' },
      ],
      restaurants: [
        {
          "name": "Gaspar Brasserie",
          "address": "185 Sutter St, San Francisco, CA 94109",
          "image": { "url": "https://shoutem.github.io/static/getting-started/restaurant-1.jpg" },
        },
        {
          "name": "Chalk Point Kitchen",
          "address": "527 Broome St, New York, NY 10013",
          "image": { "url": "https://shoutem.github.io/static/getting-started/restaurant-2.jpg" },
        },
        {
          "name": "Kyoto Amber Upper East",
          "address": "225 Mulberry St, New York, NY 10012",
          "image": { "url": "https://shoutem.github.io/static/getting-started/restaurant-3.jpg" },
        },
        {
          "name": "Sushi Academy",
          "address": "1900 Warner Ave. Unit A Santa Ana, CA",
          "image": { "url": "https://shoutem.github.io/static/getting-started/restaurant-4.jpg" },
        },
        {
          "name": "Sushibo",
          "address": "35 Sipes Key, New York, NY 10012",
          "image": { "url": "https://shoutem.github.io/static/getting-started/restaurant-5.jpg" },
        },
        {
          "name": "Mastergrill",
          "address": "550 Upton Rue, San Francisco, CA 94109",
          "image": { "url": "https://shoutem.github.io/static/getting-started/restaurant-6.jpg" },
        }
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
              <Title styleName="md-gutter-bottom">{data.url}</Title>
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
        <Query query={FEED_QUERY}>
          {({ loading, error, data }) => {
            return (
              <ListView
                loading={loading}
                data={loading ? [] : data.feed.links}
                renderRow={this.renderRow}
              />
            )
          }}
        </Query>

      </Screen>
    );
  }
}