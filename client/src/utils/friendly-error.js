const MESSAGES = {
  "Unable to load URLs":
    "We couldn't load your links right now. Check your connection and try again.",
  "Unable to load Stats":
    "We couldn't load analytics for this link. Please refresh the page.",
  "Short Url not found":
    "This short link doesn't exist or you don't have access to it.",
  "Error creating short URL":
    "We couldn't create your link. Please check your details and try again.",
  "Unable to delete Url":
    "We couldn't delete this link. Please try again in a moment.",
};

export function getFriendlyErrorMessage(message) {
  if (!message) return "Something went wrong. Please try again.";
  return MESSAGES[message] ?? "Something went wrong. Please try again.";
}
