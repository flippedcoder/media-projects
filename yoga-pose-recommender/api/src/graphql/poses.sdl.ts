export const schema = gql`
  type Pose {
    id: Int!
    name: String!
    url: String!
    you_url: String!
    category: String!
  }

  type Query {
    poses: [Pose!]! @requireAuth
    pose(id: Int!): Pose @requireAuth
    getPosesByCategory(category: String!): [Pose!]! @requireAuth
  }

  input CreatePoseInput {
    name: String!
    url: String!
    you_url: String!
    category: String!
  }

  input UpdatePoseInput {
    name: String
    url: String
    you_url: String
    category: String
  }

  type Mutation {
    createPose(input: CreatePoseInput!): Pose! @requireAuth
    updatePose(id: Int!, input: UpdatePoseInput!): Pose! @requireAuth
    deletePose(id: Int!): Pose! @requireAuth
  }
`
