import React from "react";
import { ImageBackground, Subtitle, Divider, View, Button, Text, Image, TouchableOpacity } from '@shoutem/ui';
import { Mutation } from 'react-apollo';
import gql from '../gql';

const guoImage = require('../static/guo.png');
const shenImage = require('../static/shen.png');
const xiaoImage = require('../static/xiao.png');
const favoriteImage = require('../static/favorite.png')
const favoriteonImage = require('../static/favoriteon.png')

const typeIcon = [guoImage, shenImage, xiaoImage];

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
  return (
    <View>
      <ImageBackground
        styleName="large-banner"
        source={{ uri: "https://shoutem.github.io/static/getting-started/restaurant-6.jpg" }}
      >
        {
          data.length !== 0 ? <View styleName="space-between vertical fill-parent" style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: 24 }}>
            <View styleName="horizontal space-between">
              <Image
                style={{ width: 24, height: 24 }}
                source={typeIcon[data.type - 1]}
              />
              <View>
                <Text style={{ color: 'white', fontSize: 18 }}>{data.addBy.name}</Text>
              </View>
            </View>
            <View styleName="horizontal space-between">
              <View styleName="vertical">
                <View styleName="horizontal">
                  <Text numberOfLines={2} style={{ color: 'white', width: 300, fontSize: 20, fontWeight: 'bold' }}>{data.name}</Text>
                </View>
                <Subtitle styleName="sm-gutter-horizontal" style={{ color: 'rgb(200,200,200)' }}>{data.description}</Subtitle>
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
                    <TouchableOpacity
                      onPress={mutation}
                    >
                      <Image
                        style={{ height: 30, width: 30 }}
                        source={favoriteImage}
                      />
                    </TouchableOpacity>
                  )}
                </Mutation> : <Image style={{ height: 30, width: 30 }} source={favoriteonImage} />
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