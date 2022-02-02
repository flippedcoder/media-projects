export const schema = gql`
  type Video {
    id: Int!
    url: String!
    srtFile: String!
  }

  type Query {
    videos: [Video!]! @requireAuth
    video(id: Int!): Video @requireAuth
  }

  input CreateVideoInput {
    url: String!
    srtFile: String!
  }

  input UpdateVideoInput {
    url: String
    srtFile: String
  }

  type Mutation {
    createVideo(input: CreateVideoInput!): Video! @requireAuth
    updateVideo(id: Int!, input: UpdateVideoInput!): Video! @requireAuth
    deleteVideo(id: Int!): Video! @requireAuth
  }
`
