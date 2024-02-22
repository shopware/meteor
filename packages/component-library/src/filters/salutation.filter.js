export default function (entity, fallbackSnippet = "") {
  const defaultSalutationId = "ed643807c9f84cc8b50132ea3ccb1c3b";

  if (!entity) {
    return fallbackSnippet;
  }

  let hideSalutation = true;

  if (entity.salutation && entity.salutation.id !== defaultSalutationId) {
    hideSalutation = ["not_specified"].some((item) => item === entity.salutation.salutationKey);
  }

  const params = {
    salutation: !hideSalutation ? entity.salutation.displayName : "",
    title: entity.title || "",
    firstName: entity.firstName || "",
    lastName: entity.lastName || "",
  };

  const fullname = Object.values(params).join(" ").replace(/\s+/g, " ").trim();

  if (fullname === "") {
    return fallbackSnippet;
  }

  return fullname;
}
