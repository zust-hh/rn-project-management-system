import React from "react";
import { Text } from "react-native";
import { NavigationBar, Title, DropDownMenu, ListView, ImageBackground, Tile, Subtitle, Divider, Screen, View, Button } from '@shoutem/ui';
import { Query, Mutation } from 'react-apollo';
import ProjectCard from '../components/ProjectCard';
import { findInArray, _subscribeToUpdateProjects } from './utils'

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
      attribution: 0,
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
                  <Text style={{ color: 'white' }}>{data.addBy.name}</Text>
                </View>
              </View>
              <View styleName="horizontal space-between">
                <View styleName="vertical">
                  <View styleName="horizontal">
                    <Text numberOfLines={2} style={{ color: 'white', width: 300 }}>{data.name}</Text>
                    <Text style={{ color: 'white' }}>{data.tutor.name}</Text>
                  </View>
                  <Subtitle styleName="sm-gutter-horizontal" style={{ color: 'white' }}>{data.description}</Subtitle>
                </View>
                {
                  data.showFavorite ? <Mutation
                    mutation={gql.FAVORITE_MUTATION}
                    variables={{ projectId: data.id }}
                    update={(store) =>
                      this._updateCacheAfterCollection(store, data.id)
                    }
                  >
                    {mutation => (
                      <Button
                        onPress={mutation}
                      >
                        <Text>收藏</Text>
                      </Button>
                    )}
                  </Mutation> : null
                }
              </View>
            </View> : null
          }
        </ImageBackground>
        <Divider styleName="line" />
      </View>
    );
  }

  render() {
    const { attribution } = this.state;
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
              onOptionSelected={(filter) => {
                const attribution = this.state.selectedFilter && this.state.selectedFilter.name === '我的' ? 0 : 1;
                this.setState({
                  selectedFilter: filter,
                  attribution,
                })
              }}
              titleProperty="name"
              valueProperty="value"
            />
          }
          styleName="inline"
        />
        <Query
          query={gql.PROJECTLIST_QUERY}
          variables={{ attribution }}
        >
          {({ loading, error, data, subscribeToMore }) => {
            _subscribeToUpdateProjects(subscribeToMore)
            if (data && data.projectList && data.projectList.projects.length > 0) {
              const { projects, myFavoriteProjects } = data.projectList;
              projects.map((project) => {
                project.showFavorite = !findInArray(project, myFavoriteProjects);
              })
            } else {
              data.projectList = {}
              data.projectList.projects = []
            }

            return (
              <ListView
                loading={loading}
                data={loading ? [] : data.projectList.projects}
                renderRow={ProjectCard}
              />
            )
          }}
        </Query>
      </Screen>
    );
  }
}