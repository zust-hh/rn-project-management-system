import React from "react";
import { Text } from "react-native";
import { NavigationBar, Title, DropDownMenu, ListView, ImageBackground, Tile, Subtitle, Divider, Screen, View, Button } from '@shoutem/ui';
import { Query, Mutation } from 'react-apollo';

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
      loginIn: false
    }
  }

  findInArray = (x, arr) => {
    let find = false
    if (arr.length > 0) {
      arr.map((item) => {
        if (x.id == item.id) find = true
      })
    }
    return find
  }

  // 收藏之后的更新
  _updateCacheAfterCollection = (store, projectId) => {
    const { attribution } = this.state;
    const data = store.readQuery({
      query: gql.PROJECTLIST_QUERY,
      variables: { attribution },
    })

    const favoritedProject = data.projectList.projects.find(project => project.id === projectId)
    data.projectList.myFavoriteProjects = [...data.projectList.myFavoriteProjects, {
      id: projectId,
      __typename: "Project"
    }]
    favoritedProject.showFavorite = false
    store.writeQuery({ query: gql.PROJECTLIST_QUERY, data })
  }

  _subscribeToUpdateProjects = subscribeToMore => {
    subscribeToMore({
      document: gql.UPDATE_PROJECTS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const UpdateProject = subscriptionData.data.updateProject
        prev.projectList.projects.map((project) => {
          if (project.id === UpdateProject.id) {
            project.showFavorite = false
          }
        })
        const updatedProjectList = Object.assign({}, prev, {
          projectList: {
            projects: [...prev.projectList.projects],
            count: prev.projectList.projects.length,
            myFavoriteProjects: [...prev.projectList.myFavoriteProjects, { id: UpdateProject.id, __typename: "Project" }],
            __typename: prev.projectList.__typename
          }
        })
        return updatedProjectList
      }
    })
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
            this._subscribeToUpdateProjects(subscribeToMore)
            if (data && data.projectList && data.projectList.projects.length > 0) {
              const { projects, myFavoriteProjects } = data.projectList;
              projects.map((project) => {
                project.showFavorite = !this.findInArray(project, myFavoriteProjects);
              })
            } else {
              data.projectList = {}
              data.projectList.projects = []
            }

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