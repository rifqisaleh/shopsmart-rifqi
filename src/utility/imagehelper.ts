const allowedDomains = ["i.imgur.com", "content.r9cdn.net", "picsum.photos"];

export const getSafeImage = (src: string, placeholder: string = "/placeholder.png") => {
  if (!src) return placeholder;

  try {
    const url = new URL(src);
    return allowedDomains.includes(url.hostname) ? src : placeholder;
  } catch (error) {
    return placeholder;
  }
};

export const parseImageUrl = (images: string[] | string | undefined): string[] => {
  if (!images) return ["/placeholder.png"];

  try {
    let extractedUrls: string[] = [];

    if (typeof images === "string") {
      if (images.startsWith("[")) {
        try {
          const parsed = JSON.parse(images);
          extractedUrls = Array.isArray(parsed) ? parsed.filter((url) => typeof url === "string") : [];
        } catch {
          extractedUrls = images.match(/https?:\/\/[^"\s,\]]+/g) || [];
        }
      } else {
        extractedUrls = [images];
      }
    } else if (Array.isArray(images)) {
      extractedUrls = images
        .map((img) => (typeof img === "string" ? img.replace(/[\[\]"]/g, "").trim() : null))
        .filter((url): url is string => !!url && url.startsWith("http"));
    }

    // **Ensure all extracted URLs are safe**
    return extractedUrls.length > 0
      ? extractedUrls.map((url) => getSafeImage(url))
      : ["/placeholder.png"];
  } catch (error) {
    console.error("Error parsing image URL:", error);
    return ["/placeholder.png"];
  }
};
