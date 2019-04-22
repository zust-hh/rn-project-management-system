import React from "react";
import { Row, Icon, Divider, View, Text } from '@shoutem/ui';
import { Mutation } from 'react-apollo';
import gql from '../gql';

// 关注之后的更新
_updateCacheAfterFollow = (store, followUserId) => {
  const { searchText } = this.state;
  const data = store.readQuery({
    query: gql.SEARCHUSERLIST_QUERY,
    variables: { searchText },
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
    <View>
      {
        data.length !== 0 ?
          <Row styleName="small">
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
                  <Icon
                    styleName="disclosure"
                    name="left-arrow"
                    onPress={mutation} />
                )}
              </Mutation> : null
            }

          </Row> : null
      }
      <Divider styleName="line" />
    </View>
  );
}

export default UserCard;