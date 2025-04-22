import type { Icon, IconMode, Meta, node } from "../index.js";
import FigmaApiClient, { IconSize } from "../index.js";

export default class FigmaUtil {
  public async buildIconMap(document: node): Promise<Map<string, Icon>> {
    const client = new FigmaApiClient();
    const iconNodes = this.getIconNodes(document);
    const iconMap: Map<string, Icon> = new Map();

    while (iconNodes.length) {
      // Get svgs in 300 chunks max
      const chunk = iconNodes.splice(0, 300);
      const svgs = (await client.getImages(chunk.map((node) => node.id))).data;

      if (svgs.err) {
        console.error(svgs.err);
      }

      Object.keys(svgs.images).forEach((nodeId) => {
        const node = chunk.find((n) => n.id === nodeId);

        // @ts-expect-error - we know that node is defined
        iconMap.set(node.name, {
          // @ts-expect-error - we know that value is defined
          image: svgs.images[nodeId],
          nodeId: nodeId,
        });
      });
    }

    const nodeIds: string[] = Array.from(iconMap.values()).map(
      ({ nodeId }) => nodeId
    );

    const components: node[] = (await client.getNodeInfo(nodeIds)).data
      .components;
    Object.values(components).forEach((component: node) => {
      // @ts-expect-error - we know that value is defined
      iconMap.set(component.name, {
        ...iconMap.get(component.name),
        description: component.description,
      });
    });

    return iconMap;
  }

  public buildMeta(iconMap: Map<string, Icon>): Meta[] {
    const metas: Meta[] = [];
    const sizes = ["s", "xs", "xxs"];
    const modes = ["regular", "solid"];
    Array.from(iconMap.keys()).forEach((key) => {
      // @ts-expect-error - we know that key.split('/')[2] is defined
      const name: string = key.split("/")[2];
      // @ts-expect-error - we know that key.split('/')[1] is defined
      const mode: string = key.split("/")[1];
      let size: string = IconSize.DEFAULT;
      let basename: string = name;

      sizes.forEach((mySize) => {
        const suffix = `-${mySize}`;
        if (!name.endsWith(suffix)) {
          return;
        }

        basename = name.substring(0, name.length - suffix.length);
        size = mySize;
      });

      // Extract tags from the description
      const description: string =
        // @ts-expect-error -- we know that iconMap.get(key) is defined
        (iconMap.get(key).description.split("🔎")[1] || "")
          .split("\n")[0]
          .trim();
      let tags: string[] = [];
      if (description.startsWith("[") && description.endsWith("]")) {
        tags = description
          .substring(1, description.length - 1)
          .split(",")
          .map((tag) => tag.trim());
      }

      const mySizes: string[] = [];
      const myModes: string[] = [];

      if (iconMap.has(`icons/${mode}/${basename}`)) {
        mySizes.push("");
      }

      // Find all available sizes
      sizes.forEach((size) => {
        if (iconMap.has(`icons/${mode}/${basename}-${size}`)) {
          mySizes.push(size);
        }
      });

      // Find all available modes
      modes.forEach((mode) => {
        if (iconMap.has(`icons/${mode}/${name}`)) {
          myModes.push(mode);
        }
      });

      metas.push({
        name,
        basename,
        mode: mode as IconMode,
        size: size as IconSize,
        tags,
        sizes: mySizes,
        modes: myModes,
        related: [],
      });
    });

    // Find all related icons with matching tags
    metas.forEach((meta: Meta, key: number) => {
      meta.tags.forEach((tag: string) => {
        metas.forEach((secondMeta: Meta, secondKey: number) => {
          // @ts-expect-error - we know that metas[key].tags is defined
          if (metas[secondKey].tags.includes(tag)) {
            // @ts-expect-error - we know that metas[key].related is defined
            metas[key].related.push(secondMeta.name);
          }
        });
      });
      // Make unique items
      // @ts-expect-error - we know that related is defined
      metas[key].related = [...new Set(metas[key].related)];
    });

    return metas.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }

      if (a.name > b.name) {
        return 1;
      }

      return 0;
    });
  }

  private getIconNodes(document: node): node[] {
    if (!document?.children) {
      return [];
    }

    const icons: node[] = [];

    icons.push(
      ...document.children.filter((node) => node.name.startsWith("icons/"))
    );

    document.children.forEach((node) => {
      icons.push(...this.getIconNodes(node));
    });

    return icons;
  }
}
