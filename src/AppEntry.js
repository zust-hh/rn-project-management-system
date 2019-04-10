import React from "react";
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { AuthLoadingRouter } from './router/AuthLoading';

const httpLink = createHttpLink({
    uri: 'http://192.168.1.151:4000'
})

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
})

export default () =>
    <ApolloProvider client={client}>
        <AuthLoadingRouter />
    </ApolloProvider>;