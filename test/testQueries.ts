export const usersQuery = `query {
    users {
      id
      role
    }
  }`

export const registerCustomerMutation = `
mutation {
  register(registerInput: {email: "test@test.test", password: "Qwerty#123", role: "CUSTOMER"}) {
    id
    ok
  }
}`
