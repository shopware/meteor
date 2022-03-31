import type { node } from '../index';
import FigmaApiClient from '../index';

export default class FigmaUtil {
  public async buildIconMap(document: node): Promise<Map<string, string>> {
    const client = new FigmaApiClient();
    const iconNodes = this.getIconNodes(document);
    const iconMap: Map<string, string> = new Map();

    while(iconNodes.length) {
      // Get svgs in 300 chunks max
      const chunk = iconNodes.splice(0, 300);
      const svgs = (await client.getImages(chunk.map(node => node.id))).data;

      if (svgs.err) {
        console.error(svgs.err);
      }

      Object.keys(svgs.images).forEach((nodeId) => {
        const node = chunk.find(n => n.id === nodeId);

        iconMap.set(node.name, svgs.images[nodeId]);
      });
    }

    return iconMap;
  }

  private getIconNodes(document: node): node[] {
    if (!document?.children) {
      return [];
    }

    const icons: node[] = [];

    icons.push(...document.children.filter(node => node.name.startsWith('icons/')));

    document.children.forEach(node => {
      icons.push(...this.getIconNodes(node));
    });

    return icons;
  }
}
