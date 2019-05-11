import React from "react";
import {
  Dimensions
} from 'react-native';
import { Row, Icon, Divider, View, Text, TouchableOpacity, Image } from '@shoutem/ui';
import { Mutation } from 'react-apollo';
import gql from '../gql';
const windowWidth = Dimensions.get("window").width;

const followImage = require('../static/follow.png')
const followonImage = require('../static/followon.png')

// 关注之后的更新
_updateCacheAfterFollow = (store, followUserId) => {
  const data = store.readQuery({
    query: gql.SEARCHUSERLIST_QUERY,
    variables: { searchText: '' },
  })

  const followUser = data.userList.users.find(user => user.id === followUserId)
  data.userList.myFollowUsers = [...data.userList.myFollowUsers, {
    id: followUserId,
    __typename: "Project"
  }]
  followUser.showFollow = false
  store.writeQuery({ query: gql.SEARCHUSERLIST_QUERY, data })
}

const UserCard = (data) => {
  return (
    data.name !== 'Admin' ?
    <View>
      {
        data.length !== 0 ?
          <View styleName="horizontal v-center space-between" style={{ height: 50, width: windowWidth, backgroundColor: 'white', paddingLeft: 12, paddingRight: 12 }} >
            <Text style={{ color: 'black' }}>{data.name}</Text>
            <Text style={{ color: 'black' }}>{data.class}</Text>
            {
              data.showFollow ? <Mutation
                mutation={gql.FOLLOW_MUTATION}
                variables={{ followUserId: data.id }}
                update={(store) =>
                  _updateCacheAfterFollow(store, data.id)
                }
              >
                {mutation => (
                  <TouchableOpacity
                    onPress={mutation}
                  >
                    <Image
                      style={{ height: 30, width: 30 }}
                      source={followImage}
                    />
                  </TouchableOpacity>
                )}
              </Mutation> : <Image
                      style={{ height: 30, width: 30 }}
                      source={followonImage}
                    />
            }
          </View> : null
      }
      <Divider styleName="line" />
    </View> : null
  );
}

export default UserCard;