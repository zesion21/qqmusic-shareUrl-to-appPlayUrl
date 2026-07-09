export const read = (html: string) => {
  const regex = /__ssrFirstPageData__=\"\s*([\s\S]*?)(\"<\/script>)/;
  const match = html.match(regex);

  return match ? match[1].trim() : null;
};
