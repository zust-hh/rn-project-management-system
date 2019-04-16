import React from "react";
import { NavigationBar, Title, DropDownMenu, ListView, ImageBackground, Tile, Subtitle, Divider, Screen, View, Button, Text } from '@shoutem/ui';
import { Query, Mutation } from 'react-apollo';
import gql from '../gql';

// 收藏之后的更新
_updateCacheAfterCollection = (store, projectId) => {
  const data = store.readQuery({
      query: gql.PROJECTLIST_QUERY,
      variables: { attribution: 0 },
  })

  const favoritedProject = data.projectList.projects.find(project => project.id === projectId)
  data.projectList.myFavoriteProjects = [...data.projectList.myFavoriteProjects, {
      id: projectId,
      __typename: "Project"
  }]
  favoritedProject.showFavorite = false
  store.writeQuery({ query: gql.PROJECTLIST_QUERY, data })
}

const ProjectCard = (data) => {
  console.log(data);
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
                    _updateCacheAfterCollection(store, data.id)
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

export default ProjectCard;