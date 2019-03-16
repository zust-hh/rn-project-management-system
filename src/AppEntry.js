import React from "react";
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { Router } from "./router";

const httpLink = createHttpLink({
    uri: 'http://30.11.220.73:4000'
})

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
})

export default () =>
    <ApolloProvider client={client}>
        <Router />
    </ApolloProvider>;