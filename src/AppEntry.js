import React from "react";
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import AsyncStorage from '@react-native-community/async-storage';
import { setContext } from 'apollo-link-context'

import { AuthLoadingRouter } from './router/AuthLoading';

const ip = '192.168.43.220'

const httpLink = createHttpLink({
  uri: `http://${ip}:4000`
})

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('auth-token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const wsLink = new WebSocketLink({
  uri: `ws://${ip}:4000`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: AsyncStorage.getItem('auth-token'),
    }
  }
})

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink)
)



const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

export default () =>
  <ApolloProvider client={client}>
    <AuthLoadingRouter />
  </ApolloProvider>;