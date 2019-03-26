import gql from 'graphql-tag';

const FEED_QUERY = gql`
  {
    feed {
      projects {
        id
        createdAt
        name
        description
      }
    }
  }
`

export default {
    FEED_QUERY
}