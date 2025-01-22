import { CosmosClient } from "@azure/cosmos";

const endpoint = String(process.env.COSMOS_ENDPOINT);
const key = String(process.env.COSMOS_KEY);

export const cosmosClient = new CosmosClient({ endpoint, key });
export const cosmosContainer = cosmosClient
  .database(String(process.env.COSMOS_DATABASE))
  .container(String(process.env.COSMOS_CONTAINER));
