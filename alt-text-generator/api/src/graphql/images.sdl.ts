export const schema = gql`
  type Image {
    id: Int!
    name: String!
    description: String!
    url: String!
  }

  type Query {
    images: [Image!]! @requireAuth
    image(id: Int!): Image @requireAuth
  }

  input CreateImageInput {
    name: String!
    description: String!
    url: String!
  }

  input UpdateImageInput {
    name: String
    description: String
    url: String
  }

  type Mutation {
    createImage(input: CreateImageInput!): Image! @requireAuth
    updateImage(id: Int!, input: UpdateImageInput!): Image! @requireAuth
    deleteImage(id: Int!): Image! @requireAuth
  }
`
