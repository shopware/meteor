/** The signed-in user. A real app would load it from the Admin API. */
export function useCurrentUser() {
  return {
    firstName: "Arnold",
    lastName: "Stoba",
    email: "arnold.stoba@example.com",
  };
}
