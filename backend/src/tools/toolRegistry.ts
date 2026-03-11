import { calculator } from "./calculator.js";
import { webSearch } from "./web_search.js";
import { summarizer } from "./summarizer.js";
import { pdfGenerator } from "./pdfGenerator.js";

export const tools = {
  calculator,
  web_search: webSearch,
  summarizer,
  pdf_generator: async (input: string) => {
    const url = await pdfGenerator(input);
    console.log("pdf", url);
    return `PDF generated successfully. [Download PDF](${url})`;
  },
};
