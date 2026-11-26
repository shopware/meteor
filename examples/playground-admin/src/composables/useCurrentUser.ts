/** The signed-in user. A real app would load it from the Admin API. */
export function useCurrentUser() {
  return {
    firstName: "Mila",
    lastName: "Hoffmann",
    email: "mila.hoffmann@example.com",
  };
}
